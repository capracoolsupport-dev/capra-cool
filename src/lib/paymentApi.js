import { normalizeFunctionError } from "./functionErrors.js";
import { supabase } from "./supabase.js";

const razorpayScriptId = "razorpay-checkout-script";
const razorpayScriptUrl = "https://checkout.razorpay.com/v1/checkout.js";

function fail(message) {
  return {
    ok: false,
    message
  };
}

function injectScript(src, scriptId) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(scriptId);

    if (existing) {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      existing.addEventListener("load", () => resolve(window.Razorpay), { once: true });
      existing.addEventListener("error", () => reject(new Error("Razorpay checkout failed to load.")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(payload) {
  if (!supabase) {
    return fail("Payments are not available until Supabase is connected.");
  }

  const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
    body: payload
  });

  if (error) {
    return fail(await normalizeFunctionError(error, "We could not create the payment order."));
  }

  return data?.ok ? data : fail(data?.message || "We could not create the payment order.");
}

export async function verifyRazorpayPayment(payload) {
  if (!supabase) {
    return fail("Payments are not available until Supabase is connected.");
  }

  const { data, error } = await supabase.functions.invoke("verify-razorpay-payment", {
    body: payload
  });

  if (error) {
    return fail(await normalizeFunctionError(error, "We could not verify the payment."));
  }

  return data?.ok ? data : fail(data?.message || "We could not verify the payment.");
}

export async function launchRazorpayCheckout({
  amountLabel,
  brandName,
  cartItems,
  customer,
  onDismiss
}) {
  const orderResult = await createRazorpayOrder({
    items: cartItems,
    customer
  });

  if (!orderResult.ok) {
    return orderResult;
  }

  let RazorpayConstructor;

  try {
    RazorpayConstructor = await injectScript(razorpayScriptUrl, razorpayScriptId);
  } catch (error) {
    return fail(await normalizeFunctionError(error, "We could not open Razorpay checkout."));
  }

  if (!RazorpayConstructor) {
    return fail("Razorpay checkout is unavailable right now.");
  }

  return new Promise((resolve) => {
    let settled = false;

    const settle = (result) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const checkout = new RazorpayConstructor({
      key: orderResult.keyId,
      amount: orderResult.order.amountSubunits,
      currency: orderResult.order.currency,
      name: brandName,
      description: amountLabel,
      order_id: orderResult.order.razorpayOrderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone || ""
      },
      notes: {
        local_order_id: orderResult.order.localOrderId,
        order_number: orderResult.order.orderNumber
      },
      theme: {
        color: "#C74B16"
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          settle({
            ok: false,
            message: "Payment window closed before completion."
          });
        }
      },
      handler: async (response) => {
        const verificationResult = await verifyRazorpayPayment({
          localOrderId: orderResult.order.localOrderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });

        settle(verificationResult);
      }
    });

    checkout.on("payment.failed", (event) => {
      settle({
        ok: false,
        message: event?.error?.description || "Payment failed. Please try again."
      });
    });

    checkout.open();
  });
}
