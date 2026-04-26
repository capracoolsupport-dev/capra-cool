import { useEffect, useState } from "react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import ProductCard from "../components/ProductCard.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { ProductPageSkeleton } from "../components/Skeletons.jsx";
import StorefrontErrorState from "../components/StorefrontErrorState.jsx";
import { formatPrice, getRelatedProducts } from "../lib/formatting";

function QuantitySelector({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="quantity-selector">
      <button onClick={onDecrease} type="button" aria-label="Decrease quantity">−</button>
      <span>{quantity}</span>
      <button onClick={onIncrease} type="button" aria-label="Increase quantity">+</button>
    </div>
  );
}

function ProductSpecs({ product }) {
  const specs = [
    { label: "Material", value: "Premium Crochet Yarn" },
    { label: "Type", value: product.category?.name || "Handmade" },
    { label: "Size", value: product.highlights?.[0] || "Standard" },
    { label: "Color", value: product.highlights?.[1] || "As shown" }
  ];

  return (
    <div>
      <h3 style={{ marginBottom: "0.5rem" }}>Product Specifications</h3>
      <table className="specs-table">
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label}>
              <td>{spec.label}</td>
              <td>{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    if (pincode.length >= 5) {
      setResult("Delivery in 3 – 7 days");
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: "0.5rem" }}>Check Delivery</h3>
      <div className="delivery-check">
        <input
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode"
          type="text"
          value={pincode}
        />
        <button onClick={handleCheck} type="button">Check</button>
      </div>
      {result ? (
        <div className="delivery-estimate">
          <Icon name="truck" />
          <span>{result}</span>
        </div>
      ) : null}
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="trust-row">
      <div className="trust-badge-card">
        <Icon name="shield" />
        <span>Secure Payment</span>
      </div>
      <div className="trust-badge-card">
        <Icon name="refresh-cw" />
        <span>Easy Returns</span>
      </div>
      <div className="trust-badge-card">
        <Icon name="yarn" />
        <span>Handmade Quality</span>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data, storefrontState, addToCart } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const [touchStart, setTouchStart] = useState(0);
  const product = data?.products.find((item) => item.slug === slug);

  useEffect(() => {
    if (product && data?.settings?.brandName) {
      document.title = `${product.name} | ${data.settings.brandName}`;
    }
  }, [data?.settings?.brandName, product]);

  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
    setStatusMessage("");
  }, [slug]);

  if (!data) {
    if (storefrontState.status === "error") {
      return <StorefrontErrorState title="This product is temporarily unavailable." />;
    }

    return <ProductPageSkeleton />;
  }

  if (!product) {
    return <Navigate replace to="/" />;
  }

  const gallery = product.media.length ? product.media : [{ url: product.primaryImage, altText: product.name }];
  const related = getRelatedProducts(data.products, product.slug);
  const hasGalleryControls = gallery.length > 1;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setStatusMessage(`${quantity} ${product.name} added to cart.`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <>
      <section className="page-section product-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#featured">Collections</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="gallery-panel">
            <div
              className="gallery-stage"
              onTouchEnd={(event) => {
                if (!hasGalleryControls) return;
                const delta = event.changedTouches[0].screenX - touchStart;
                if (Math.abs(delta) < 25) return;
                setActiveIndex((current) =>
                  delta < 0
                    ? (current + 1) % gallery.length
                    : (current - 1 + gallery.length) % gallery.length
                );
              }}
              onTouchStart={(event) => setTouchStart(event.changedTouches[0].screenX)}
            >
              {hasGalleryControls ? (
                <button
                  aria-label="Previous image"
                  className="gallery-nav prev"
                  onClick={() =>
                    setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length)
                  }
                  type="button"
                >
                  <Icon name="chevron-left" />
                </button>
              ) : null}
              <img
                alt={gallery[activeIndex].altText || product.name}
                src={gallery[activeIndex].url}
              />
              {hasGalleryControls ? (
                <button
                  aria-label="Next image"
                  className="gallery-nav next"
                  onClick={() => setActiveIndex((current) => (current + 1) % gallery.length)}
                  type="button"
                >
                  <Icon name="chevron-right" />
                </button>
              ) : null}
            </div>

            {hasGalleryControls ? (
              <div className="gallery-thumbnails" aria-label="Product images">
                {gallery.map((item, index) => (
                  <button
                    aria-label={`Show image ${index + 1}`}
                    className={`gallery-thumb ${index === activeIndex ? "is-active" : ""}`}
                    key={item.id || `${product.slug}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    <img alt="" src={item.url} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-info-panel">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <h1>{product.name}</h1>
            <div className="product-price-row">
              {product.discountPriceInr ? (
                <>
                  <strong className="price-large">{formatPrice(product.discountPriceInr)}</strong>
                  <span style={{ textDecoration: "line-through", color: "var(--text-soft)", fontSize: "1.25rem", fontWeight: 400 }}>
                    {formatPrice(product.priceInr)}
                  </span>
                </>
              ) : (
                <strong className="price-large">{formatPrice(product.priceInr)}</strong>
              )}
            </div>
            <p>{product.description}</p>

            <ProductSpecs product={product} />

            {product.highlights.length > 0 ? (
              <div>
                <h3 style={{ marginBottom: "0.5rem" }}>Features</h3>
                <ul className="features-list">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <span className="quantity-label">Quantity</span>
              <div style={{ marginTop: "0.4rem" }}>
                <QuantitySelector
                  onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                  onIncrease={() => setQuantity((current) => Math.min(product.stockQuantity, current + 1))}
                  quantity={quantity}
                />
              </div>
            </div>

            <div className="purchase-actions">
              <button className="btn-add-cart" onClick={handleAddToCart} type="button">
                Add to Cart
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow} type="button">
                Buy Now
              </button>
            </div>

            <div className="action-btns-row">
              <button className="action-btn-outline" type="button">
                <Icon name="heart" /> Wishlist
              </button>
              <button className="action-btn-outline" type="button">
                <Icon name="share" /> Share
              </button>
            </div>

            {statusMessage ? (
              <div className="add-to-cart-status" role="status">
                <Icon name="check-circle" />
                <p>{statusMessage}</p>
              </div>
            ) : null}

            <DeliveryCheck />
            <TrustBadges />
          </div>
        </div>

        <div className="product-sticky-bar">
          <div className="product-sticky-summary">
            <span>{formatPrice(product.priceInr)}</span>
            <strong>{product.name}</strong>
          </div>
          <div className="product-sticky-actions">
            <QuantitySelector
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
              quantity={quantity}
            />
            <Button onClick={handleAddToCart} type="button">
              Add to Cart
            </Button>
          </div>
          {statusMessage ? <p className="product-sticky-status">{statusMessage}</p> : null}
        </div>
      </section>

      <section className="page-section page-section-muted">
        <div className="section-heading">
          <p className="eyebrow">Customer love</p>
          <h2>Customer Reviews</h2>
        </div>
        <div className="review-grid">
          {product.reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <RatingStars rating={review.rating} />
              <h3>{review.headline}</h3>
              <p>{review.body}</p>
              <strong>{review.reviewerName}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">You may also like</p>
          <h2>Related Handmade Picks</h2>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}
