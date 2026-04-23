import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { normalizeText } from "../_shared/shiprocket.ts";

function parseShiprocketDate(value: unknown) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const parsed = Date.parse(text.replace(/\//g, "-"));
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405);
  }

  const webhookSecret = Deno.env.get("SHIPROCKET_WEBHOOK_SECRET");
  const incomingSecret = request.headers.get("x-api-key");

  if (webhookSecret && incomingSecret !== webhookSecret) {
    return jsonResponse({ ok: false, message: "Invalid webhook token." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, message: "Missing Supabase service credentials." }, 500);
  }

  const payload = await request.json().catch(() => null);

  if (!payload) {
    return jsonResponse({ ok: false, message: "Invalid webhook payload." }, 400);
  }

  const awbCode = normalizeText(payload?.awb);
  const sourceOrderId = normalizeText(payload?.order_id);
  const shiprocketOrderId = payload?.sr_order_id ? String(payload.sr_order_id) : "";

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  let query = supabase.from("customer_orders").select("*");

  if (awbCode) {
    query = query.eq("shiprocket_awb_code", awbCode);
  } else if (shiprocketOrderId) {
    query = query.eq("shiprocket_order_id", shiprocketOrderId);
  } else if (sourceOrderId) {
    query = query.or(`shiprocket_channel_order_id.eq.${sourceOrderId},order_number.eq.${sourceOrderId}`);
  } else {
    return jsonResponse({ ok: true, message: "No matching identifier in webhook payload." });
  }

  const { data: order } = await query.maybeSingle();

  if (!order) {
    return jsonResponse({ ok: true, message: "No local order matched the webhook payload." });
  }

  const scans = Array.isArray(payload?.scans) ? payload.scans : [];
  const latestScan = scans.length ? scans[scans.length - 1] : null;
  const shipmentStatus = normalizeText(payload?.shipment_status) || normalizeText(payload?.current_status) || null;

  await supabase
    .from("customer_orders")
    .update({
      shipping_status: shipmentStatus || order.shipping_status,
      shiprocket_order_id: shiprocketOrderId || order.shiprocket_order_id,
      shiprocket_awb_code: awbCode || order.shiprocket_awb_code,
      shiprocket_courier_name: normalizeText(payload?.courier_name) || order.shiprocket_courier_name,
      shiprocket_last_event:
        normalizeText(latestScan?.activity) ||
        normalizeText(payload?.current_status) ||
        order.shiprocket_last_event,
      shiprocket_last_scan_at:
        parseShiprocketDate(payload?.current_timestamp) ||
        parseShiprocketDate(latestScan?.date) ||
        order.shiprocket_last_scan_at,
      shiprocket_tracking_payload: payload,
      shiprocket_synced_at: new Date().toISOString(),
      delivered_at:
        shipmentStatus?.toLowerCase() === "delivered"
          ? parseShiprocketDate(payload?.current_timestamp) || order.delivered_at
          : order.delivered_at
    })
    .eq("id", order.id);

  return jsonResponse({ ok: true, message: "Webhook accepted." });
});
