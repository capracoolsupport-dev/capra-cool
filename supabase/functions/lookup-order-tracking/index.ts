import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  getShiprocketToken,
  getShiprocketTrackingByAwb,
  getShiprocketTrackingByOrderId,
  normalizeShiprocketTracking,
  normalizeText
} from "../_shared/shiprocket.ts";

function toCustomerEmail(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function buildResponseOrder(order: any) {
  return {
    orderNumber: order.order_number,
    paymentStatus: order.status,
    shippingStatus: order.shipping_status,
    courierName: order.shiprocket_courier_name,
    awbCode: order.shiprocket_awb_code,
    trackingUrl: order.shiprocket_tracking_url,
    latestEvent: order.shiprocket_last_event,
    lastScanAt: order.shiprocket_last_scan_at,
    deliveredAt: order.delivered_at,
    paymentVerifiedAt: order.payment_verified_at,
    createdAt: order.created_at
  };
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

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, message: "Missing Supabase service credentials." }, 500);
  }

  const body = await request.json().catch(() => null);
  const orderNumber = normalizeText(body?.orderNumber).toUpperCase();
  const customerEmail = toCustomerEmail(body?.email);

  if (!orderNumber || !customerEmail) {
    return jsonResponse({ ok: false, message: "Order number and email are required." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const { data: order, error } = await supabase
    .from("customer_orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("customer_email", customerEmail)
    .maybeSingle();

  if (error || !order) {
    return jsonResponse(
      {
        ok: false,
        message: "No order matched those details."
      },
      404
    );
  }

  const shiprocketEmail = Deno.env.get("SHIPROCKET_API_EMAIL") || Deno.env.get("SHIPROCKET_EMAIL");
  const shiprocketPassword = Deno.env.get("SHIPROCKET_API_PASSWORD") || Deno.env.get("SHIPROCKET_PASSWORD");

  if (
    !shiprocketEmail ||
    !shiprocketPassword ||
    (!order.shiprocket_awb_code && !order.shiprocket_channel_order_id)
  ) {
    return jsonResponse({
      ok: true,
      order: buildResponseOrder(order)
    });
  }

  try {
    const token = await getShiprocketToken(shiprocketEmail, shiprocketPassword);
    const trackingPayload = order.shiprocket_awb_code
      ? await getShiprocketTrackingByAwb(order.shiprocket_awb_code, token)
      : await getShiprocketTrackingByOrderId(order.shiprocket_channel_order_id || order.order_number, token);

    const normalized = normalizeShiprocketTracking(trackingPayload);

    if (!normalized.ok) {
      return jsonResponse({
        ok: true,
        order: buildResponseOrder(order)
      });
    }

    const tracking = normalized.tracking;
    const { data: updatedOrder } = await supabase
      .from("customer_orders")
      .update({
        shipping_status: tracking.shipmentStatus || order.shipping_status,
        shiprocket_order_id: tracking.shiprocketOrderId || order.shiprocket_order_id,
        shiprocket_shipment_id: tracking.shiprocketShipmentId || order.shiprocket_shipment_id,
        shiprocket_awb_code: tracking.awbCode || order.shiprocket_awb_code,
        shiprocket_courier_name: tracking.courierName || order.shiprocket_courier_name,
        shiprocket_tracking_url: tracking.trackingUrl || order.shiprocket_tracking_url,
        shiprocket_last_event: tracking.latestEvent || order.shiprocket_last_event,
        shiprocket_last_scan_at: tracking.currentTimestamp || order.shiprocket_last_scan_at,
        shiprocket_tracking_payload: tracking.raw,
        shiprocket_synced_at: new Date().toISOString(),
        delivered_at: tracking.deliveredAt || order.delivered_at,
        failure_message: null
      })
      .eq("id", order.id)
      .select("*")
      .maybeSingle();

    return jsonResponse({
      ok: true,
      order: buildResponseOrder(updatedOrder || order)
    });
  } catch {
    return jsonResponse({
      ok: true,
      order: buildResponseOrder(order)
    });
  }
});
