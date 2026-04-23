import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import RatingStars from "../components/RatingStars.jsx";
import Icon from "../components/Icons.jsx";
import { formatPrice } from "../lib/formatting.js";

export default function HomePage() {
  const { data, storefrontState } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  if (!data) {
    return (
      <section className="page-section">
        <div className="loading-card">Loading storefront content...</div>
      </section>
    );
  }

  const settings = data.settings;
  const selectedCategoryData = data.categories.find((category) => category.slug === selectedCategory);
  const filteredProducts = selectedCategory
    ? data.products.filter((product) => product.category?.slug === selectedCategory)
    : data.products;

  const featuredProducts = filteredProducts.filter((product) => product.isFeaturedHome);
  const featuredVisible = featuredProducts.length
    ? featuredProducts
    : filteredProducts.slice(0, 4);
  const additionalProducts = filteredProducts.filter(
    (product) => !featuredVisible.find((featured) => featured.slug === product.slug)
  );
  const heroPrimary = featuredVisible[0] || data.products[0];
  const heroSecondary = featuredVisible[1] || data.products[1] || heroPrimary;
  const stickyProduct = heroPrimary;
  const updateCategory = (nextCategory) => {
    const target = nextCategory
      ? `/?category=${encodeURIComponent(nextCategory)}#featured`
      : "/#featured";

    navigate(target);
  };

  return (
    <>
      <section className="hero-section manuscript-hero">
        <div className="hero-copy">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}</h1>
          <p className="section-lead">{settings.heroDescription}</p>
          <p className="hero-manifesto">
            A slow-crafted edit presented like an heirloom lookbook, with warm materials, soft layering, and tactile
            photography at the center.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={settings.heroPrimaryCtaHref}>
              {settings.heroPrimaryCtaLabel}
            </Link>
            <Link className="button button-secondary" to="/customize">
              {settings.heroSecondaryCtaLabel}
            </Link>
          </div>
          <div className="hero-stats" aria-label="Store highlights">
            {settings.heroStats.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual manuscript-visual">
          <article className="hero-bleed-card">
            <img alt={heroPrimary.name} loading="eager" src={heroPrimary.primaryImage} />
            <div className="hero-bleed-copy">
              <span>Soft form, heirloom detail</span>
              <strong>{heroPrimary.name}</strong>
            </div>
          </article>
          <article className="hero-card is-secondary" key={heroSecondary.slug}>
            <img alt={heroSecondary.name} loading="lazy" src={heroSecondary.primaryImage} />
            <div className="hero-card-copy">
              <strong>{heroSecondary.name}</strong>
              <span>{heroSecondary.tagline}</span>
            </div>
          </article>
          <div className="hero-note">
            <p className="eyebrow">Editorial note</p>
            <strong>Texture over template</strong>
            <p>Every section is arranged to feel collected, layered, and intentionally handmade.</p>
          </div>
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
        </div>
      </section>

      <section className="page-section section-tonal section-curve">
        <div className="section-heading editorial-heading">
          <p className="eyebrow">Shop by vibe</p>
          <h2>Product Categories</h2>
          <p className="section-lead">
            Explore the collection by personal style, gifting moment, and everyday wear.
          </p>
        </div>
        <div className="category-rail" role="tablist" aria-label="Product categories">
          {data.categories.map((category) => {
            const selected = selectedCategory === category.slug;

            return (
              <button
                className={`category-pill ${selected ? "is-selected" : ""}`}
                key={category.slug}
                onClick={() => {
                  const nextCategory = selected ? "" : category.slug;
                  updateCategory(nextCategory);
                }}
                style={{
                  "--category-accent": category.accentColor,
                  "--category-tint": category.tintColor
                }}
                type="button"
              >
                <span className="category-pill-icon">{category.shortLabel}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-section editorial-featured-section" id="featured">
        <div className="section-heading editorial-heading">
          <p className="eyebrow">New arrivals</p>
          <h2>Featured Product Collections</h2>
          <p className="section-lead">
            A curated edit of handmade favorites with clear pricing, warm reviews, and easy discovery.
          </p>
        </div>

        <div className="collection-context-card" aria-live="polite">
          <div>
            <span>{selectedCategoryData ? "Filtered collection" : "All handmade drops"}</span>
            <strong>
              {selectedCategoryData
                ? `${selectedCategoryData.name} products`
                : "Showing every available category"}
            </strong>
            <p>
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} ready to browse.
            </p>
          </div>
          {selectedCategoryData ? (
            <button className="button button-secondary" onClick={() => updateCategory("")} type="button">
              Clear filter
            </button>
          ) : (
            <Link className="button button-secondary" to="/#featured">
              Browse products
            </Link>
          )}
        </div>

        <div className="product-grid editorial-grid">
          {featuredVisible.length ? (
            featuredVisible.map((product, index) => (
              <ProductCard index={index} key={product.slug} product={product} />
            ))
          ) : (
            <p className="empty-state empty-span">This category is ready for the next handmade drop.</p>
          )}
        </div>
      </section>

      <section className="page-section page-section-muted editorial-proof-section">
        <div className="section-heading editorial-heading">
          <p className="eyebrow">Social proof</p>
          <h2>Reviews + Trust</h2>
        </div>
        <div className="proof-layout">
          <div className="review-grid">
            {data.homepageReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <RatingStars rating={review.rating} />
                <h3>{review.headline}</h3>
                <p>{review.body}</p>
                <strong>{review.reviewerName}</strong>
              </article>
            ))}
          </div>
          <div className="trust-grid">
            {data.trustBadges.map((badge) => (
              <article className="trust-card" key={badge.id}>
                <span className="trust-icon">
                  <Icon name={badge.iconName} />
                </span>
                <div>
                  <h3>{badge.title}</h3>
                  <p>{badge.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section showcase-section editorial-showcase-section">
        <div className="section-heading left-aligned editorial-heading">
          <p className="eyebrow">{settings.showcaseEyebrow}</p>
          <h2>{settings.showcaseTitle}</h2>
          <p className="section-lead">{settings.showcaseDescription}</p>
        </div>

        <div className="showcase-frame">
          {settings.showcaseVideoUrl ? (
            <video
              autoPlay
              className="showcase-video"
              loop
              muted
              playsInline
              poster={settings.showcasePosterUrl || undefined}
              preload="metadata"
              src={settings.showcaseVideoUrl}
            />
          ) : (
            <div className="showcase-fallback">
              {data.products.slice(0, 3).map((product) => (
                <article className="showcase-mini-card" key={product.slug}>
                  <img alt={product.name} loading="lazy" src={product.primaryImage} />
                  <span>{product.name}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-section section-tonal">
        <div className="section-heading editorial-heading">
          <p className="eyebrow">More to explore</p>
          <h2>Additional Product Grid</h2>
          <p className="section-lead">
            Explore more handmade pieces across gifting, styling, and everyday favorites.
          </p>
        </div>

        <div className="product-grid editorial-grid is-secondary-grid">
          {additionalProducts.length ? (
            additionalProducts.map((product, index) => (
              <ProductCard badge="Handpicked" index={index} key={product.slug} product={product} />
            ))
          ) : (
            <p className="empty-state empty-span">More handmade pieces in this category are coming soon.</p>
          )}
        </div>
      </section>

      {stickyProduct ? (
        <div className="shop-look-bar">
          <img alt={stickyProduct.name} loading="lazy" src={stickyProduct.primaryImage} />
          <div className="shop-look-copy">
            <strong>{stickyProduct.name}</strong>
            <span>{formatPrice(stickyProduct.priceInr)}</span>
          </div>
          <Link className="button button-primary" to={`/products/${stickyProduct.slug}`}>
            Shop the Look
          </Link>
        </div>
      ) : null}

      {storefrontState.status === "loading" ? (
        <div className="floating-status">Refreshing live storefront data...</div>
      ) : null}
    </>
  );
}
