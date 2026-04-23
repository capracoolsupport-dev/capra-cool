import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildOrderNumber() {
  const timePart = Date.now().toString().slice(-8);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TSS-${timePart}${randomPart}`;
}

function buildReceipt() {
  return `ll-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function sanitizeItems(items: unknown) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      slug: normalizeText(item?.slug),
      name: normalizeText(item?.name),
      priceInr: Number(item?.priceInr ?? 0),
      quantity: Number(item?.quantity ?? 0)
    }))
    .filter((item) => item.name && item.quantity > 0 && item.priceInr > 0);
}

function toAmountSubunits(items: Array<{ priceInr: number; quantity: number }>) {
  return items.reduce((sum, item) => sum + Math.round(item.priceInr * 100) * item.quantity, 0);
}

async function createRazorpayOrder({
  amount,
  currency,
  receipt,
  keyId,
  keySecret,
  notes
}: {
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
  keySecret: string;
  notes: Record<string, string>;
}) {
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.description || "Razorpay could not create the order.");
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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const body = await request.json().catch(() => null);
  const items = sanitizeItems(body?.items);
  const customerName = normalizeText(body?.customer?.name);
  const customerEmail = normalizeText(body?.customer?.email).toLowerCase();
  const customerPhone = normalizeText(body?.customer?.phone) || null;
  const customerNotes = normalizeText(body?.customer?.notes) || null;

  if (!items.length) {
    return jsonResponse({ ok: false, message: "Your cart is empty." }, 400);
  }

  if (!customerName || !customerEmail) {
    return jsonResponse({ ok: false, message: "Customer name and email are required." }, 400);
  }

  const amountSubunits = toAmountSubunits(items);

  if (amountSubunits <= 0) {
    return jsonResponse({ ok: false, message: "Invalid order amount." }, 400);
  }

  const orderNumber = buildOrderNumber();
  const receipt = buildReceipt();

  const { data: localOrder, error: localOrderError } = await supabase
    .from("customer_orders")
    .insert({
      order_number: orderNumber,
      receipt,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_notes: customerNotes,
      currency: "INR",
      amount_inr: Number((amountSubunits / 100).toFixed(2)),
      amount_subunits: amountSubunits,
      status: "draft",
      line_items: items
    })
    .select("id, order_number, amount_inr, amount_subunits, currency")
    .maybeSingle();

  if (localOrderError || !localOrder) {
    return jsonResponse(
      {
        ok: false,
        message: localOrderError?.message || "We could not create the order record."
      },
      500
    );
  }

  try {
    const razorpayOrder = await createRazorpayOrder({
      amount: amountSubunits,
      currency: "INR",
      receipt,
      keyId: razorpayKeyId,
      keySecret: razorpayKeySecret,
      notes: {
        order_number: orderNumber,
        customer_email: customerEmail
      }
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from("customer_orders")
      .update({
        status: "created",
        razorpay_order_id: razorpayOrder.id,
        gateway_order_payload: razorpayOrder,
        failure_message: null
      })
      .eq("id", localOrder.id)
      .select("id, order_number, amount_inr, amount_subunits, currency, razorpay_order_id, status")
      .maybeSingle();

    if (updateError || !updatedOrder) {
      return jsonResponse(
        {
          ok: false,
          message: updateError?.message || "Razorpay order was created, but the local order could not be updated."
        },
        500
      );
    }

    return jsonResponse({
      ok: true,
      keyId: razorpayKeyId,
      order: {
        localOrderId: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        amountInr: updatedOrder.amount_inr,
        amountSubunits: updatedOrder.amount_subunits,
        currency: updatedOrder.currency,
        razorpayOrderId: updatedOrder.razorpay_order_id,
        status: updatedOrder.status
      }
    });
  } catch (error) {
    await supabase
      .from("customer_orders")
      .update({
        status: "failed",
        failure_message: error instanceof Error ? error.message : "Razorpay order creation failed."
      })
      .eq("id", localOrder.id);

    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Razorpay order creation failed."
      },
      500
    );
  }
});
