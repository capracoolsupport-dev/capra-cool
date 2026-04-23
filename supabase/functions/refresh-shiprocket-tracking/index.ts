import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  getShiprocketToken,
  getShiprocketTrackingByAwb,
  getShiprocketTrackingByOrderId,
  normalizeShiprocketTracking,
  normalizeText
} from "../_shared/shiprocket.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const shiprocketEmail = Deno.env.get("SHIPROCKET_API_EMAIL") || Deno.env.get("SHIPROCKET_EMAIL");
  const shiprocketPassword = Deno.env.get("SHIPROCKET_API_PASSWORD") || Deno.env.get("SHIPROCKET_PASSWORD");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, message: "Missing Supabase service credentials." }, 500);
  }

  if (!shiprocketEmail || !shiprocketPassword) {
    return jsonResponse({ ok: false, message: "Missing Shiprocket API credentials." }, 500);
  }

  const body = await request.json().catch(() => null);
  const localOrderId = normalizeText(body?.localOrderId);

  if (!localOrderId) {
    return jsonResponse({ ok: false, message: "Order id is required." }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const { data: order, error } = await supabase.from("customer_orders").select("*").eq("id", localOrderId).maybeSingle();

  if (error || !order) {
    return jsonResponse({ ok: false, message: "Order record not found." }, 404);
  }

  if (!order.shiprocket_awb_code && !order.shiprocket_channel_order_id) {
    return jsonResponse(
      {
        ok: false,
        message: "Add a Shiprocket AWB or order reference before refreshing tracking."
      },
      400
    );
  }

  try {
    const token = await getShiprocketToken(shiprocketEmail, shiprocketPassword);
    const trackingPayload = order.shiprocket_awb_code
      ? await getShiprocketTrackingByAwb(order.shiprocket_awb_code, token)
      : await getShiprocketTrackingByOrderId(order.shiprocket_channel_order_id || order.order_number, token);

    const normalized = normalizeShiprocketTracking(trackingPayload);

    if (!normalized.ok) {
      return jsonResponse({ ok: false, message: normalized.message }, 400);
    }

    const tracking = normalized.tracking;
    const { data: updatedOrder, error: updateError } = await supabase
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

    if (updateError || !updatedOrder) {
      return jsonResponse(
        {
          ok: false,
          message: updateError?.message || "Tracking was fetched, but the order record could not be updated."
        },
        500
      );
    }

    return jsonResponse({
      ok: true,
      message: "Shiprocket tracking refreshed.",
      order: updatedOrder
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Shiprocket tracking refresh failed."
      },
      500
    );
  }
});
