import { useEffect, useState } from "react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { formatPrice, getRelatedProducts } from "../lib/formatting";

export default function ProductPage() {
  const { slug } = useParams();
  const { data, addToCart } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState("");
  const [touchStart, setTouchStart] = useState(0);

  if (!data) {
    return (
      <section className="page-section">
        <div className="loading-card">Loading product details...</div>
      </section>
    );
  }

  const product = data.products.find((item) => item.slug === slug);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${data.settings.brandName}`;
    }
  }, [data.settings.brandName, product]);

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
                if (!hasGalleryControls) {
                  return;
                }

                const delta = event.changedTouches[0].screenX - touchStart;
                if (Math.abs(delta) < 25) {
                  return;
                }
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
                  &lt;
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
                  &gt;
                </button>
              ) : null}
            </div>

            {hasGalleryControls ? (
              <div className="gallery-dots">
                {gallery.map((item, index) => (
                  <button
                    aria-label={`Show image ${index + 1}`}
                    className={`gallery-dot ${index === activeIndex ? "is-active" : ""}`}
                    key={item.id || `${product.slug}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-info-panel">
            <p className="eyebrow">Handmade {product.category?.name}</p>
            <h1>{product.name}</h1>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <div className="product-price-row">
              <strong className="price-large">{formatPrice(product.priceInr)}</strong>
              <span className="meta-text">{product.reviewCount} happy customer reviews</span>
            </div>
            <p className="product-tagline">{product.tagline}</p>
            <p>{product.description}</p>

            <div className="highlight-list">
              {product.highlights.map((highlight) => (
                <div className="highlight-card" key={highlight}>
                  <strong>{highlight}</strong>
                </div>
              ))}
            </div>

            <div className="quantity-card">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-selector">
                <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button">
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((current) => current + 1)} type="button">
                  +
                </button>
              </div>
            </div>

            <button className="button button-primary button-wide" onClick={handleAddToCart} type="button">
              Add to Cart
            </button>
            <p className="form-status">{statusMessage}</p>
          </div>
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
            <ProductCard badge="Related" key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}
