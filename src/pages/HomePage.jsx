import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

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
  const heroPrimary = featuredVisible[0] || data.products[0];
  const heroSecondary = featuredVisible[1] || data.products[1] || heroPrimary;
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
          <div className="hero-actions">
            <Link className="button button-primary" to={settings.heroPrimaryCtaHref}>
              {settings.heroPrimaryCtaLabel}
            </Link>
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
          <p className="eyebrow">Products</p>
          <h2>{selectedCategoryData ? selectedCategoryData.name : "All Products"}</h2>
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
          {filteredProducts.length ? (
            filteredProducts.map((product, index) => (
              <ProductCard index={index} key={product.slug} product={product} />
            ))
          ) : (
            <p className="empty-state empty-span">This category is ready for the next handmade drop.</p>
          )}
        </div>
      </section>

      {storefrontState.status === "loading" ? (
        <div className="floating-status">Refreshing live storefront data...</div>
      ) : null}
    </>
  );
}
