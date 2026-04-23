import { supabase } from "./supabase.js";

function fail(message) {
  return {
    ok: false,
    message
  };
}

function normalizeError(error, fallback) {
  if (!error) {
    return fallback;
  }

  return error.message || fallback;
}

export async function lookupOrderTracking(orderNumber, email) {
  if (!supabase) {
    return fail("Order tracking is not available until Supabase is connected.");
  }

  const { data, error } = await supabase.functions.invoke("lookup-order-tracking", {
    body: {
      orderNumber,
      email
    }
  });

  if (error) {
    return fail(normalizeError(error, "We could not look up that order right now."));
  }

  return data?.ok ? data : fail(data?.message || "We could not look up that order right now.");
}

export async function refreshShiprocketTracking(localOrderId) {
  if (!supabase) {
    return fail("Tracking refresh is not available until Supabase is connected.");
  }

  const { data, error } = await supabase.functions.invoke("refresh-tracking", {
    body: {
      localOrderId
    }
  });

  if (error) {
    return fail(normalizeError(error, "We could not refresh Shiprocket tracking."));
  }

  return data?.ok ? data : fail(data?.message || "We could not refresh Shiprocket tracking.");
}
