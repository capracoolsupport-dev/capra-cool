import { supabase } from "./supabase";

function fail(message) {
  return {
    ok: false,
    message
  };
}

function succeed(message, data = null) {
  return {
    ok: true,
    message,
    data
  };
}

function normalizeError(error, fallback) {
  if (!error) {
    return fallback;
  }

  return error.message || fallback;
}

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

export async function loadAdminDashboard() {
  if (!supabase) {
    return {
      ok: false,
      message: "Add your Supabase URL and anon key to load the admin dashboard.",
      data: null
    };
  }

  const [
    settingsResult,
    announcementsResult,
    categoriesResult,
    trustBadgesResult,
    productsResult,
    productMediaResult,
    reviewsResult,
    ordersResult,
    contactResult,
    customOrdersResult
  ] = await Promise.all([
    supabase.from("store_settings").select("*").limit(1).maybeSingle(),
    supabase.from("announcements").select("*").order("display_order"),
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("trust_badges").select("*").order("display_order"),
    supabase.from("products").select("*").order("display_order"),
    supabase.from("product_media").select("*").order("sort_order"),
    supabase.from("reviews").select("*").order("display_order"),
    supabase.from("customer_orders").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase
      .from("custom_order_requests")
      .select("*")
      .order("created_at", { ascending: false })
  ]);

  const error =
    settingsResult.error ||
    announcementsResult.error ||
    categoriesResult.error ||
    trustBadgesResult.error ||
    productsResult.error ||
    productMediaResult.error ||
    reviewsResult.error ||
    ordersResult.error ||
    contactResult.error ||
    customOrdersResult.error;

  if (error) {
    return {
      ok: false,
      message: normalizeError(
        error,
        "The admin dashboard could not load. Check your development RLS policies."
      ),
      data: null
    };
  }

  return {
    ok: true,
    message: "Admin dashboard loaded.",
    data: {
      settings: settingsResult.data || null,
      announcements: announcementsResult.data || [],
      categories: categoriesResult.data || [],
      trustBadges: trustBadgesResult.data || [],
      products: productsResult.data || [],
      productMedia: productMediaResult.data || [],
      reviews: reviewsResult.data || [],
      customerOrders: ordersResult.data || [],
      contactMessages: contactResult.data || [],
      customOrderRequests: customOrdersResult.data || []
    }
  };
}

export async function saveAdminRecord(table, payload, options = {}) {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  const clean = cleanPayload(payload);
  const idField = options.idField || "id";
  const recordId = clean[idField];

  let query;
  if (recordId) {
    const { [idField]: _ignored, ...updatePayload } = clean;
    query = supabase.from(table).update(updatePayload).eq(idField, recordId);
  } else {
    query = supabase.from(table).insert(clean);
  }

  const { data, error } = await query.select().maybeSingle();

  if (error) {
    return fail(normalizeError(error, `We could not save ${table}.`));
  }

  return succeed(recordId ? "Changes saved." : "New record created.", data || null);
}

export async function deleteAdminRecord(table, record, options = {}) {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  if (options.storageCleanup?.bucket && options.storageCleanup?.pathField) {
    const storagePath = record[options.storageCleanup.pathField];

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from(options.storageCleanup.bucket)
        .remove([storagePath]);

      if (storageError) {
        return fail(
          normalizeError(
            storageError,
            "The record was not deleted because the linked storage file could not be removed."
          )
        );
      }
    }
  }

  const idField = options.idField || "id";
  const { error } = await supabase.from(table).delete().eq(idField, record[idField]);

  if (error) {
    return fail(normalizeError(error, `We could not delete ${table}.`));
  }

  return succeed("Record deleted.");
}
