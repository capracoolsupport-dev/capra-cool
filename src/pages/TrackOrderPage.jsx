import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { lookupOrderTracking } from "../lib/shippingApi.js";

function createInitialState(searchParams) {
  return {
    orderNumber: searchParams.get("order") || "",
    email: searchParams.get("email") || ""
  };
}

function formatDateTime(value) {
  if (!value) {
    return "Not available yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => createInitialState(searchParams));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setForm(createInitialState(searchParams));
  }, [searchParams]);

  useEffect(() => {
    document.title = "Track Order | Trendy Spice Store";
  }, []);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    const result = await lookupOrderTracking(form.orderNumber.trim(), form.email.trim().toLowerCase());
    setBusy(false);

    if (!result.ok) {
      setOrder(null);
      setStatus(result.message);
      return;
    }

    setOrder(result.order);
    setStatus("");
  };

  return (
    <section className="page-section">
      <div className="tracking-page">
        <div className="checkout-copy">
          <p className="eyebrow">Order tracking</p>
          <h1>Check your delivery progress.</h1>
          <p className="section-lead">
            Enter the order number and email used at checkout to view payment status, shipping progress, and the latest
            courier update.
          </p>
        </div>

        <div className="tracking-layout">
          <form className="checkout-form-card" onSubmit={handleSubmit}>
            <div className="checkout-card-head">
              <div>
                <p className="eyebrow">Find your order</p>
                <h2>Track with order details</h2>
              </div>
            </div>

            <div className="admin-form-grid">
              <label className="field">
                <span>Order Number</span>
                <input
                  onChange={(event) => updateField("orderNumber", event.target.value.toUpperCase())}
                  placeholder="TSS-1234ABCD"
                  required
                  type="text"
                  value={form.orderNumber}
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </label>
            </div>

            <button className="button button-primary button-wide" disabled={busy} type="submit">
              {busy ? "Checking..." : "Track Order"}
            </button>

            <p className={`form-status ${status ? "is-error" : ""}`}>{status}</p>
          </form>

          <div className="tracking-result-card">
            {order ? (
              <div className="tracking-result-stack">
                <div className="checkout-card-head">
                  <div>
                    <p className="eyebrow">Latest status</p>
                    <h2>{order.orderNumber}</h2>
                  </div>
                </div>

                <div className="tracking-grid">
                  <div>
                    <span>Payment</span>
                    <strong>{order.paymentStatus || "Pending"}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{order.shippingStatus || "Awaiting shipment"}</strong>
                  </div>
                  <div>
                    <span>Courier</span>
                    <strong>{order.courierName || "Not assigned yet"}</strong>
                  </div>
                  <div>
                    <span>AWB</span>
                    <strong>{order.awbCode || "Not assigned yet"}</strong>
                  </div>
                </div>

                <div className="tracking-note">
                  <strong>Latest event</strong>
                  <p>{order.latestEvent || "No tracking scan has been recorded yet."}</p>
                </div>

                <div className="tracking-meta">
                  <p>
                    <strong>Last scan:</strong> {formatDateTime(order.lastScanAt)}
                  </p>
                  <p>
                    <strong>Delivered:</strong> {formatDateTime(order.deliveredAt)}
                  </p>
                </div>

                <div className="hero-actions">
                  {order.trackingUrl ? (
                    <a className="button button-primary" href={order.trackingUrl} rel="noreferrer" target="_blank">
                      Open Courier Tracking
                    </a>
                  ) : null}
                  <Link className="button button-secondary" to="/contact">
                    Need Help
                  </Link>
                </div>
              </div>
            ) : (
              <div className="tracking-empty">
                <p className="eyebrow">No result yet</p>
                <h2>Tracking details will appear here.</h2>
                <p>
                  Once your shipment is assigned an AWB or Shiprocket update is available, this panel will show the
                  latest delivery progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
