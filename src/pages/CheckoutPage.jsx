import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { launchRazorpayCheckout } from "../lib/paymentApi.js";
import { formatPrice } from "../lib/formatting.js";

function createInitialCustomer() {
  return {
    name: "",
    email: "",
    phone: "",
    notes: ""
  };
}

const checkoutAssurances = [
  "Secure Razorpay payment",
  "Order support before dispatch",
  "Gift notes accepted"
];

export default function CheckoutPage() {
  const { data, cartItems, clearCart, removeFromCart, updateCartQuantity } = useOutletContext();
  const [customer, setCustomer] = useState(createInitialCustomer);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({
    tone: "",
    message: ""
  });
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    if (data?.settings?.brandName) {
      document.title = `Checkout | ${data.settings.brandName}`;
    }
  }, [data?.settings?.brandName]);

  useEffect(() => {
    if (successOrder) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [successOrder]);

  if (!data) {
    return (
      <section className="page-section">
        <div className="loading-card">Loading checkout...</div>
      </section>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateCustomer = (name, value) => {
    setCustomer((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handlePayNow = async (event) => {
    event.preventDefault();

    if (!cartItems.length) {
      setStatus({
        tone: "error",
        message: "Add at least one item to continue."
      });
      return;
    }

    if (!customer.name.trim() || !customer.email.trim()) {
      setStatus({
        tone: "error",
        message: "Name and email are required before checkout."
      });
      return;
    }

    setBusy(true);
    setStatus({
      tone: "",
      message: ""
    });

    const result = await launchRazorpayCheckout({
      amountLabel: `Order total ${formatPrice(total)}`,
      brandName: data.settings.brandName,
      cartItems: cartItems.map((item) => ({
        slug: item.slug,
        name: item.name,
        priceInr: item.priceInr,
        quantity: item.quantity
      })),
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        notes: customer.notes.trim()
      },
      onDismiss: () => {
        setStatus({
          tone: "error",
          message: "Payment window closed before completion."
        });
      }
    });

    setBusy(false);

    if (result.ok) {
      setSuccessOrder(result.order);
      clearCart();
      setStatus({
        tone: "success",
        message: result.message
      });
      return;
    }

    setStatus({
      tone: "error",
      message: result.message
    });
  };

  if (!cartItems.length && !successOrder) {
    return (
      <section className="page-section">
        <div className="checkout-empty-card">
          <p className="eyebrow">Checkout</p>
          <h1>Your cart is empty.</h1>
          <p>Add a handmade piece first, then come back here to pay securely with Razorpay.</p>
          <Link className="button button-primary" to="/">
            Explore Collection
          </Link>
        </div>
      </section>
    );
  }

  if (successOrder) {
    return (
      <section className="page-section">
        <div className="checkout-success-card">
          <p className="eyebrow">Payment confirmed</p>
          <h1>Your handmade order is confirmed.</h1>
          <p>
            Order <strong>{successOrder.orderNumber}</strong> is saved. Keep this number for tracking and support.
          </p>
          <div className="checkout-success-grid">
            <div>
              <span>Order number</span>
              <strong>{successOrder.orderNumber}</strong>
            </div>
            <div>
              <span>Payment status</span>
              <strong>{successOrder.status}</strong>
            </div>
            <div>
              <span>Razorpay payment</span>
              <strong>{successOrder.razorpayPaymentId}</strong>
            </div>
          </div>
            <div className="hero-actions">
              <Link className="button button-primary" to="/">
                Continue Shopping
              </Link>
              <Link
                className="button button-secondary"
                to={`/track-order?order=${encodeURIComponent(successOrder.orderNumber)}&email=${encodeURIComponent(
                  customer.email.trim().toLowerCase()
                )}`}
              >
                Track This Order
              </Link>
              <button className="button button-secondary" onClick={() => setSuccessOrder(null)} type="button">
                Start Another Order
              </button>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="checkout-page">
        <div className="checkout-copy">
          <p className="eyebrow">Secure checkout</p>
          <h1>Pay for your handmade picks with Razorpay.</h1>
          <p className="section-lead">
            Review your order, add customer details, and complete the payment in the Razorpay checkout window.
          </p>
          <div className="checkout-assurance-row" aria-label="Checkout assurances">
            {checkoutAssurances.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-summary-card">
            <div className="checkout-card-head">
              <div>
                <p className="eyebrow">Order summary</p>
                <h2>{totalItems} item{totalItems === 1 ? "" : "s"}</h2>
              </div>
              <strong>{formatPrice(total)}</strong>
            </div>

            <div className="checkout-line-items">
              {cartItems.map((item) => (
                <article className="checkout-line-item" key={item.slug}>
                  <img alt={item.name} loading="lazy" src={item.image} />
                  <div className="checkout-line-copy">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.priceInr)}</span>
                    <div className="cart-item-actions">
                      <button
                        onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                        type="button"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                      <button onClick={() => removeFromCart(item.slug)} type="button">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="checkout-total-box">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <div className="cart-total-row">
                <span>Shipping</span>
                <strong>Confirmed before dispatch</strong>
              </div>
              <p>Razorpay will open in a secure popup. We will use your email for order updates and tracking.</p>
            </div>
          </div>

          <form className="checkout-form-card" onSubmit={handlePayNow}>
            <div className="checkout-card-head">
              <div>
                <p className="eyebrow">Customer details</p>
                <h2>Ready for payment</h2>
              </div>
            </div>

            <div className="admin-form-grid">
              <label className="field field-full">
                <span>Full Name *</span>
                <input
                  autoComplete="name"
                  onChange={(event) => updateCustomer("name", event.target.value)}
                  placeholder="Your full name"
                  required
                  type="text"
                  value={customer.name}
                />
              </label>

              <label className="field">
                <span>Email *</span>
                <input
                  autoComplete="email"
                  onChange={(event) => updateCustomer("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={customer.email}
                />
              </label>

              <label className="field">
                <span>Phone (optional)</span>
                <input
                  autoComplete="tel"
                  inputMode="tel"
                  onChange={(event) => updateCustomer("phone", event.target.value)}
                  placeholder="Optional phone number"
                  type="tel"
                  value={customer.phone}
                />
                <small>Helpful if courier support needs a quick delivery clarification.</small>
              </label>

              <label className="field field-full">
                <span>Order Notes (optional)</span>
                <textarea
                  onChange={(event) => updateCustomer("notes", event.target.value)}
                  placeholder="Color preference, gifting note, or delivery help"
                  rows="4"
                  value={customer.notes}
                />
              </label>
            </div>

            <button className="button button-primary button-wide" disabled={busy} type="submit">
              {busy ? "Preparing Razorpay..." : `Pay ${formatPrice(total)}`}
            </button>
            <p className="checkout-form-note">No account is required. You can track the order with your order number and email.</p>

            <p className={`form-status ${status.tone === "error" ? "is-error" : ""}`}>{status.message}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
