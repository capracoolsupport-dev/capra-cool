import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePositiveInteger(value: unknown) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function buildOrderNumber() {
  const timePart = Date.now().toString().slice(-8);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TSS-${timePart}${randomPart}`;
}

function buildReceipt() {
  return `tss-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function sanitizeRequestedItems(items: unknown) {
  if (!Array.isArray(items)) {
    return [];
  }

  const quantitiesBySlug = new Map<string, number>();

  for (const item of items) {
    const slug = normalizeText(item?.slug);
    const quantity = normalizePositiveInteger(item?.quantity);

    if (!slug || quantity <= 0) {
      continue;
    }

    quantitiesBySlug.set(slug, (quantitiesBySlug.get(slug) || 0) + quantity);
  }

  return Array.from(quantitiesBySlug.entries()).map(([slug, quantity]) => ({
    slug,
    quantity
  }));
}

function sanitizeCustomer(customer: unknown) {
  const record =
    typeof customer === "object" && customer !== null
      ? (customer as Record<string, unknown>)
      : {};

  return {
    name: normalizeText(record.name),
    email: normalizeText(record.email).toLowerCase(),
    phone: normalizeText(record.phone),
    notes: normalizeText(record.notes) || null,
    addressLine1: normalizeText(record.addressLine1),
    addressLine2: normalizeText(record.addressLine2) || null,
    city: normalizeText(record.city),
    state: normalizeText(record.state),
    postalCode: normalizeText(record.postalCode),
    country: normalizeText(record.country) || "India"
  };
}

async function loadValidatedItems(
  supabase: ReturnType<typeof createClient>,
  requestedItems: Array<{ slug: string; quantity: number }>
) {
  const slugs = requestedItems.map((item) => item.slug);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, price_inr, stock_quantity, is_active")
    .in("slug", slugs);

  if (error) {
    throw new Error(error.message || "We could not load the selected products.");
  }

  const productsBySlug = new Map(
    (products || []).map((product) => [product.slug, product])
  );

  return requestedItems.map((item) => {
    const product = productsBySlug.get(item.slug);

    if (!product || product.is_active === false) {
      throw new Error("One or more items are no longer available.");
    }

    if (product.stock_quantity < item.quantity) {
      throw new Error(`Only ${product.stock_quantity} item(s) left for ${product.name}.`);
    }

    return {
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      priceInr: Number(product.price_inr ?? 0),
      quantity: item.quantity
    };
  });
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
  const requestedItems = sanitizeRequestedItems(body?.items);
  const customer = sanitizeCustomer(body?.customer);

  if (!requestedItems.length) {
    return jsonResponse({ ok: false, message: "Your cart is empty." }, 400);
  }

  if (
    !customer.name ||
    !customer.email ||
    !customer.phone ||
    !customer.addressLine1 ||
    !customer.city ||
    !customer.state ||
    !customer.postalCode ||
    !customer.country
  ) {
    return jsonResponse(
      {
        ok: false,
        message: "Full name, email, phone, and shipping address are required."
      },
      400
    );
  }

  let validatedItems;

  try {
    validatedItems = await loadValidatedItems(supabase, requestedItems);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : "We could not validate the cart."
      },
      409
    );
  }

  const amountSubunits = toAmountSubunits(validatedItems);

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
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address_line_1: customer.addressLine1,
      shipping_address_line_2: customer.addressLine2,
      shipping_city: customer.city,
      shipping_state: customer.state,
      shipping_postal_code: customer.postalCode,
      shipping_country: customer.country,
      customer_notes: customer.notes,
      currency: "INR",
      amount_inr: Number((amountSubunits / 100).toFixed(2)),
      amount_subunits: amountSubunits,
      status: "draft",
      line_items: validatedItems
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
          customer_email: customer.email
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
