import { Link } from "react-router-dom";
import { formatPrice } from "../lib/formatting";
import RatingStars from "./RatingStars.jsx";

export default function ProductCard({ product, badge }) {
  const previewHighlights = product.highlights?.slice(0, 2) || [];

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
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} compact />
          <p>{product.reviewSnippet}</p>
          <div className="product-card-facts" aria-label={`${product.name} quick facts`}>
            <span>Dispatch 2-4 days</span>
            <span>Gift-ready</span>
          </div>
          {previewHighlights.length ? (
            <ul className="product-card-highlights">
              {previewHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          ) : null}
          <span className="product-card-cta">View details</span>
        </div>
      </Link>
    </article>
  );
}
