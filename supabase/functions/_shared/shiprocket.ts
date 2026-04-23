export function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseShiprocketDate(value: unknown) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const normalized = text.replace(/\//g, "-");
  const parsed = Date.parse(normalized);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed).toISOString();
}

export async function getShiprocketToken(email: string, password: string) {
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Shiprocket authentication failed.");
  }

  const token = payload?.token || payload?.data?.token;

  if (!token) {
    throw new Error("Shiprocket did not return an auth token.");
  }

  return token;
}

async function fetchShiprocketJson(path: string, token: string) {
  const response = await fetch(`https://apiv2.shiprocket.in${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Shiprocket request failed.");
  }

  return payload;
}

export async function getShiprocketTrackingByAwb(awbCode: string, token: string) {
  return fetchShiprocketJson(`/v1/external/courier/track/awb/${encodeURIComponent(awbCode)}`, token);
}

export async function getShiprocketTrackingByOrderId(orderId: string, token: string, channelId?: string | null) {
  const query = new URLSearchParams({
    order_id: orderId
  });

  if (channelId) {
    query.set("channel_id", channelId);
  }

  return fetchShiprocketJson(`/v1/external/courier/track?${query.toString()}`, token);
}

export function normalizeShiprocketTracking(payload: any) {
  const trackingData = payload?.tracking_data || payload?.data?.[0] || null;

  if (!trackingData) {
    return {
      ok: false,
      message: "Shiprocket returned an empty tracking response."
    };
  }

  const scans =
    trackingData?.shipment_track_activities ||
    trackingData?.tracking_activities ||
    trackingData?.scans ||
    trackingData?.activities ||
    [];

  const latestScan = Array.isArray(scans) && scans.length ? scans[scans.length - 1] : null;
  const shipmentTrack = Array.isArray(trackingData?.shipment_track) ? trackingData.shipment_track[0] : null;
  const shipments = Array.isArray(trackingData?.shipments) ? trackingData.shipments[0] : null;
  const awbCode =
    normalizeText(trackingData?.awb_code) ||
    normalizeText(trackingData?.awb) ||
    normalizeText(shipmentTrack?.awb_code) ||
    normalizeText(shipments?.awb);

  const trackingUrl =
    normalizeText(trackingData?.track_url) ||
    normalizeText(trackingData?.tracking_url) ||
    normalizeText(shipmentTrack?.track_url) ||
    normalizeText(shipmentTrack?.tracking_url);

  const courierName =
    normalizeText(trackingData?.courier_name) ||
    normalizeText(shipmentTrack?.courier_name) ||
    normalizeText(shipments?.courier);

  const shipmentStatus =
    normalizeText(trackingData?.shipment_status) ||
    normalizeText(trackingData?.current_status) ||
    normalizeText(trackingData?.status) ||
    normalizeText(shipmentTrack?.current_status);

  const shipmentStatusCode =
    trackingData?.shipment_status_id ??
    trackingData?.current_status_id ??
    shipmentTrack?.current_status_id ??
    null;

  const trackStatus = trackingData?.track_status ?? null;
  const srOrderId =
    trackingData?.sr_order_id ??
    trackingData?.order_id ??
    trackingData?.id ??
    null;
  const shipmentId =
    trackingData?.shipment_id ??
    shipmentTrack?.shipment_id ??
    shipments?.id ??
    null;
  const deliveredAt =
    parseShiprocketDate(trackingData?.delivered_date) ||
    parseShiprocketDate(shipments?.delivered_date) ||
    (shipmentStatus.toLowerCase() === "delivered"
      ? parseShiprocketDate(latestScan?.date || trackingData?.current_timestamp)
      : null);
  const currentTimestamp = parseShiprocketDate(trackingData?.current_timestamp) || parseShiprocketDate(latestScan?.date);
  const latestEvent =
    normalizeText(latestScan?.activity) ||
    normalizeText(latestScan?.["sr-status-label"]) ||
    normalizeText(trackingData?.etd);

  return {
    ok: true,
    tracking: {
      awbCode: awbCode || null,
      courierName: courierName || null,
      trackingUrl: trackingUrl || null,
      shipmentStatus: shipmentStatus || null,
      shipmentStatusCode,
      trackStatus,
      shiprocketOrderId: srOrderId ? String(srOrderId) : null,
      shiprocketShipmentId: shipmentId ? String(shipmentId) : null,
      currentTimestamp,
      deliveredAt,
      latestEvent: latestEvent || null,
      scans: Array.isArray(scans) ? scans : [],
      raw: payload
    }
  };
}
