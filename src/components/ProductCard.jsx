import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";
import { formatPrice } from "../lib/formatting";

export default function ProductCard({ product, badge }) {
  const detailHref = `/products/${product.slug}`;
  const supportingText =
    product.tagline || product.reviewSnippet || "Handmade crochet with a soft, gift-ready finish.";

  return (
    <article className="product-card">
      <Link aria-label={`View ${product.name}`} className="product-card-shell product-card-link" to={detailHref}>
        <div
          className="product-card-media"
          style={{ "--card-tint": product.category?.tintColor || "#f3ddd3" }}
        >
          <img src={product.primaryImage} alt={product.name} loading="lazy" />
          <span className="product-badge">{badge || product.badgeText}</span>
        </div>
        <div className="product-card-body">
          <span className="product-card-category">{product.category?.name || "Handmade Collection"}</span>
          <div className="product-card-title-row">
            <div className="product-card-copy">
              <h3>{product.name}</h3>
              <p className="product-card-snippet">{supportingText}</p>
            </div>
            <span aria-hidden="true" className="button button-secondary button-icon product-card-icon">
              <span className="button-icon-slot">
                <Icon name="arrow-right" />
              </span>
            </span>
          </div>
          <div className="product-card-meta">
            <strong>{formatPrice(product.priceInr)}</strong>
            <span>{product.reviewCount} reviews</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
