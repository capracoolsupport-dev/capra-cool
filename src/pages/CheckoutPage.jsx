import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Input from "../components/Input.jsx";
import { CheckoutPageSkeleton } from "../components/Skeletons.jsx";
import StorefrontErrorState from "../components/StorefrontErrorState.jsx";
import { launchRazorpayCheckout } from "../lib/paymentApi.js";
import { formatPrice } from "../lib/formatting.js";

const DELIVERY_CHARGE = 70;
const FREE_SHIPPING_THRESHOLD = 599;
const VALID_COUPONS = {
  WELCOME10: { percent: 10, label: "WELCOME10" }
};

function createInitialCustomer() {
  return {
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  };
}

export default function CheckoutPage() {
  const { data, storefrontState, cartItems, clearCart, removeFromCart, updateCartQuantity } = useOutletContext();
  const [customer, setCustomer] = useState(createInitialCustomer);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({
    tone: "",
    message: ""
  });
  const [successOrder, setSuccessOrder] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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
    if (storefrontState.status === "error") {
      return <StorefrontErrorState title="Checkout is temporarily unavailable." />;
    }

    return <CheckoutPageSkeleton />;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.percent / 100) : 0;
  const total = subtotal - discount + deliveryCharge;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(VALID_COUPONS[code]);
    } else {
      setAppliedCoupon(null);
      setStatus({ tone: "error", message: "Invalid coupon code." });
    }
  };

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

    if (
      !customer.name.trim() ||
      !customer.email.trim() ||
      !customer.phone.trim() ||
      !customer.addressLine1.trim() ||
      !customer.city.trim() ||
      !customer.state.trim() ||
      !customer.postalCode.trim() ||
      !customer.country.trim()
    ) {
      setStatus({
        tone: "error",
        message: "Complete your phone number and shipping address before checkout."
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
        notes: "",
        addressLine1: customer.addressLine1.trim(),
        addressLine2: customer.addressLine2.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        postalCode: customer.postalCode.trim(),
        country: customer.country.trim()
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
            <Link
              className="button button-primary"
              to={`/track-order?order=${encodeURIComponent(successOrder.orderNumber)}&email=${encodeURIComponent(
                customer.email.trim().toLowerCase()
              )}`}
            >
              Track This Order
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="checkout-page">
        <div className="checkout-copy">
          <h1>Checkout</h1>
          <div className="checkout-stepper">
            <span className="stepper-step is-active"><Icon name="map-pin" /> Address</span>
            <span className="stepper-line" />
            <span className="stepper-step"><Icon name="truck" /> Delivery</span>
            <span className="stepper-line" />
            <span className="stepper-step"><Icon name="shield" /> Payment</span>
          </div>
        </div>
        <div className="checkout-assurance-row">
          <span>🔒 Secure Payments</span>
          <span>🚚 Fast Delivery</span>
          <span>✋ Handmade Quality</span>
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

            <div style={{ marginTop: '0.75rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.4rem' }}>Apply Coupon</p>
              <div className="coupon-row">
                <input
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  type="text"
                  value={couponCode}
                />
                <button onClick={handleApplyCoupon} type="button">Apply</button>
              </div>
              {appliedCoupon ? (
                <div className="coupon-success">
                  <Icon name="check-circle" />
                  <span>{appliedCoupon.label} applied! You saved {formatPrice(discount)}</span>
                </div>
              ) : null}
            </div>

            <div className="checkout-total-box">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 ? (
                <div className="total-row" style={{ color: 'var(--success)' }}>
                  <span>Discount ({appliedCoupon?.label})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              ) : null}
              <div className="total-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 ? (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>
                  Free above {formatPrice(FREE_SHIPPING_THRESHOLD)} for prepaid
                </p>
              ) : null}
              <div className="total-row final">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
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
              <Input
                autoComplete="name"
                fullWidth
                label="Full Name *"
                onChange={(event) => updateCustomer("name", event.target.value)}
                required
                type="text"
                value={customer.name}
              />

              <Input
                autoComplete="email"
                label="Email *"
                onChange={(event) => updateCustomer("email", event.target.value)}
                required
                type="email"
                value={customer.email}
              />

              <Input
                autoComplete="tel"
                label="Phone *"
                onChange={(event) => updateCustomer("phone", event.target.value)}
                required
                type="tel"
                value={customer.phone}
              />

              <Input
                autoComplete="address-line1"
                fullWidth
                label="Address Line 1 *"
                onChange={(event) => updateCustomer("addressLine1", event.target.value)}
                required
                type="text"
                value={customer.addressLine1}
              />

              <Input
                autoComplete="address-line2"
                fullWidth
                label="Address Line 2"
                onChange={(event) => updateCustomer("addressLine2", event.target.value)}
                type="text"
                value={customer.addressLine2}
              />

              <Input
                autoComplete="address-level2"
                label="City *"
                onChange={(event) => updateCustomer("city", event.target.value)}
                required
                type="text"
                value={customer.city}
              />

              <Input
                autoComplete="address-level1"
                label="State *"
                onChange={(event) => updateCustomer("state", event.target.value)}
                required
                type="text"
                value={customer.state}
              />

              <Input
                autoComplete="postal-code"
                label="Postal Code *"
                onChange={(event) => updateCustomer("postalCode", event.target.value)}
                required
                type="text"
                value={customer.postalCode}
              />

              <Input
                autoComplete="country-name"
                label="Country *"
                onChange={(event) => updateCustomer("country", event.target.value)}
                required
                type="text"
                value={customer.country}
              />
            </div>

            <Button disabled={busy} type="submit" wide>
              {busy ? "Preparing Razorpay..." : `Proceed to Pay ${formatPrice(total)}`}
            </Button>

            <p className="checkout-form-note">We use these details to deliver the order and share courier updates.</p>
            <p className={`form-status ${status.tone === "error" ? "is-error" : ""}`}>{status.message}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
