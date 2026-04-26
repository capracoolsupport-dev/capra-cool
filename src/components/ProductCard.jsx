import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";
import { formatPrice } from "../lib/formatting";

export default function ProductCard({ product, badge }) {
  const detailHref = `/products/${product.slug}`;
  const displayBadge = badge || product.badgeText;
  const isBestseller = displayBadge?.toLowerCase().includes("best");
  const isNew = displayBadge?.toLowerCase().includes("new") || displayBadge?.toLowerCase().includes("drop");

  return (
    <article className="product-card">
      <Link aria-label={`View ${product.name}`} className="product-card-link" to={detailHref}>
        <div className="product-card-media">
          <img src={product.primaryImage} alt={product.name} loading="lazy" />
          {displayBadge ? (
            <span
              className={`product-badge ${isBestseller ? "badge-bestseller" : ""} ${isNew ? "badge-new" : ""}`}
            >
              {displayBadge}
            </span>
          ) : null}
          <button
            aria-label={`Add ${product.name} to wishlist`}
            className="product-wishlist-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            type="button"
          >
            <Icon name="heart" />
          </button>
        </div>
        <div className="product-card-body">
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-rating">
            <div className="rating-stars-compact">
              {new Array(5).fill(null).map((_, index) => (
                <span className="rating-star-sm" key={`${product.slug}-star-${index}`}>
                  <Icon name={index < Math.round(product.rating) ? "star-filled" : "star"} />
                </span>
              ))}
            </div>
            <span className="rating-count">{Number(product.rating).toFixed(1)} ({product.reviewCount})</span>
          </div>
          <strong className="product-card-price">
            {product.discountPriceInr ? (
              <>
                <span style={{ textDecoration: "line-through", color: "var(--text-soft)", fontSize: "0.85em", marginRight: "0.5rem", fontWeight: 400 }}>
                  {formatPrice(product.priceInr)}
                </span>
                <span style={{ color: "var(--primary)" }}>{formatPrice(product.discountPriceInr)}</span>
              </>
            ) : (
              formatPrice(product.priceInr)
            )}
          </strong>
        </div>
      </Link>
    </article>
  );
}
