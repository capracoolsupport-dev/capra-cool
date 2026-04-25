import { Link } from "react-router-dom";

export default function StorefrontErrorState({
  title = "The storefront is temporarily unavailable.",
  message = "We could not load the latest catalog data right now. Please try again in a moment."
}) {
  return (
    <section className="page-section">
      <div className="checkout-empty-card">
        <p className="eyebrow">Storefront status</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/contact">
            Contact Support
          </Link>
          <Link className="button button-secondary" to="/track-order">
            Track an Order
          </Link>
        </div>
      </div>
    </section>
  );
}
