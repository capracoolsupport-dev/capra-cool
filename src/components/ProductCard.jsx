import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import { formatPrice } from "../lib/formatting";

export default function ProductCard({ product, badge }) {
  const detailHref = `/products/${product.slug}`;
  const supportingText =
    product.tagline || product.reviewSnippet || "Handmade crochet with a soft, gift-ready finish.";

  return (
    <article className="product-card">
      <div className="product-card-shell">
        <Link
          className="product-card-media"
          style={{ "--card-tint": product.category?.tintColor || "#f3ddd3" }}
          to={detailHref}
        >
          <img src={product.primaryImage} alt={product.name} loading="lazy" />
          <span className="product-badge">{badge || product.badgeText}</span>
        </Link>
        <div className="product-card-body">
          <span className="product-card-category">{product.category?.name || "Handmade Collection"}</span>
          <div className="product-card-title-row">
            <div className="product-card-copy">
              <h3>
                <Link to={detailHref}>{product.name}</Link>
              </h3>
              <p className="product-card-snippet">{supportingText}</p>
            </div>
            <Button
              ariaLabel={`View ${product.name}`}
              className="product-card-icon"
              icon="arrow-right"
              iconOnly
              to={detailHref}
              variant="secondary"
            >
              View details
            </Button>
          </div>
          <div className="product-card-meta">
            <strong>{formatPrice(product.priceInr)}</strong>
            <span>{product.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </article>
  );
}
