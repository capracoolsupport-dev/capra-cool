import { Link } from "react-router-dom";
import { formatPrice } from "../lib/formatting";
import RatingStars from "./RatingStars.jsx";

export default function ProductCard({ product, badge }) {
  return (
    <article className="product-card">
      <Link className="product-card-link" to={`/products/${product.slug}`}>
        <div
          className="product-card-media"
          style={{ "--card-tint": product.category?.tintColor || "#f1e4da" }}
        >
          <img src={product.primaryImage} alt={product.name} loading="lazy" />
          <span className="product-badge">{badge || product.badgeText}</span>
        </div>
        <div className="product-card-body">
          <span className="product-card-category">{product.category?.name || "Handmade Collection"}</span>
          <div className="product-card-head">
            <h3>{product.name}</h3>
            <strong>{formatPrice(product.priceInr)}</strong>
          </div>
          <RatingStars rating={product.rating} compact />
          <p>{product.reviewSnippet}</p>
          <span className="product-card-cta">View details</span>
        </div>
      </Link>
    </article>
  );
}
