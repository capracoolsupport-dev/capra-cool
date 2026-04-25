import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function hmacSha256Hex(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchRazorpayJson(path: string, keyId: string, keySecret: string) {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.description || "Razorpay verification request failed.");
  }

  return payload;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
  const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!supabaseUrl || !serviceRoleKey || !razorpayKeyId || !razorpayKeySecret) {
    return jsonResponse(
      {
        ok: false,
        message: "Missing Supabase or Razorpay secrets. Add the correct keys before using checkout."
      },
      500
    );
  }

  const body = await request.json().catch(() => null);
  const localOrderId = normalizeText(body?.localOrderId);
  const razorpayOrderId = normalizeText(body?.razorpayOrderId);
  const razorpayPaymentId = normalizeText(body?.razorpayPaymentId);
  const razorpaySignature = normalizeText(body?.razorpaySignature);

  if (!localOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return jsonResponse({ ok: false, message: "Incomplete payment verification payload." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const { data: localOrder, error: localOrderError } = await supabase
    .from("customer_orders")
    .select("id, order_number, razorpay_order_id")
    .eq("id", localOrderId)
    .maybeSingle();

  if (localOrderError || !localOrder) {
    return jsonResponse(
      {
        ok: false,
        message: localOrderError?.message || "Order record not found."
      },
      404
    );
  }

  if (localOrder.razorpay_order_id !== razorpayOrderId) {
    await supabase
      .from("customer_orders")
      .update({
        status: "verification_failed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        failure_message: "Razorpay order mismatch during verification."
      })
      .eq("id", localOrder.id);

    return jsonResponse(
      {
        ok: false,
        message: "Order verification failed because the order ids do not match."
      },
      400
    );
  }

  const expectedSignature = await hmacSha256Hex(
    `${localOrder.razorpay_order_id}|${razorpayPaymentId}`,
    razorpayKeySecret
  );

  if (expectedSignature !== razorpaySignature) {
    await supabase
      .from("customer_orders")
      .update({
        status: "verification_failed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        failure_message: "Razorpay signature verification failed."
      })
      .eq("id", localOrder.id);

    return jsonResponse(
      {
        ok: false,
        message: "Payment signature verification failed."
      },
      400
    );
  }

  try {
    const paymentPayload = await fetchRazorpayJson(`/payments/${razorpayPaymentId}`, razorpayKeyId, razorpayKeySecret);
    const orderPayload = await fetchRazorpayJson(`/orders/${razorpayOrderId}`, razorpayKeyId, razorpayKeySecret);

    const paymentStatus =
      paymentPayload?.status === "captured" || orderPayload?.status === "paid" ? "paid" : "authorized";

    const { data: updatedOrder, error: updateError } = await supabase.rpc("finalize_paid_order", {
      p_order_id: localOrder.id,
      p_status: paymentStatus,
      p_razorpay_payment_id: razorpayPaymentId,
      p_razorpay_signature: razorpaySignature,
      p_gateway_payment_payload: paymentPayload,
      p_gateway_order_payload: orderPayload,
      p_payment_verified_at: new Date().toISOString()
    });

    const finalizedOrder = Array.isArray(updatedOrder) ? updatedOrder[0] : updatedOrder;

    if (updateError || !finalizedOrder) {
      return jsonResponse(
        {
          ok: false,
          message: updateError?.message || "Payment was verified, but the order record could not be updated."
        },
        500
      );
    }

    const successMessage =
      paymentStatus === "paid"
        ? "Payment verified successfully."
        : "Payment verified. Capture is still pending in Razorpay.";

    return jsonResponse({
      ok: true,
      message: successMessage,
      order: {
        localOrderId: finalizedOrder.id,
        orderNumber: finalizedOrder.order_number,
        status: finalizedOrder.status,
        razorpayPaymentId: finalizedOrder.razorpay_payment_id
      }
    });
  } catch (error) {
    await supabase
      .from("customer_orders")
      .update({
        status: "verification_failed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        failure_message: error instanceof Error ? error.message : "Payment verification failed."
      })
      .eq("id", localOrder.id);

    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Payment verification failed."
      },
      500
    );
  }
});
