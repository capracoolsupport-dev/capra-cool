import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { HomePageSkeleton } from "../components/Skeletons.jsx";

export default function HomePage() {
  const { data, storefrontState } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  if (!data) {
    return <HomePageSkeleton />;
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
  const updateCategory = (nextCategory) => {
    const target = nextCategory
      ? `/?category=${encodeURIComponent(nextCategory)}#featured`
      : "/#featured";

    navigate(target);
  };

  return (
    <>
      <section className="hero-section minimal-home-hero">
        <div className="hero-copy">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}</h1>
          <p className="section-lead">{settings.heroDescription}</p>
          <div className="hero-actions">
            <Button to={settings.heroPrimaryCtaHref}>
              {settings.heroPrimaryCtaLabel}
            </Button>
          </div>
        </div>

        <div className="minimal-hero-visual">
          <article className="minimal-hero-frame">
            <img alt={heroPrimary.name} loading="eager" src={heroPrimary.primaryImage} />
          </article>
          <div className="minimal-hero-note">
            <span>{heroPrimary.category?.name || "Handmade collection"}</span>
            <strong>{heroPrimary.name}</strong>
            <p>{heroPrimary.tagline || heroPrimary.reviewSnippet}</p>
          </div>
        </div>
      </section>

      <section className="page-section section-tonal section-curve">
        <div className="section-heading editorial-heading">
          <p className="eyebrow">Browse by category</p>
          <h2>Product Categories</h2>
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

        <div className="filtered-product-row" aria-live="polite">
          <p>
            <strong>{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? "" : "s"} ready to
            browse
            {selectedCategoryData ? ` in ${selectedCategoryData.name}` : ""}.
          </p>
          {selectedCategoryData ? (
            <Button onClick={() => updateCategory("")} type="button" variant="secondary">
              Show all
            </Button>
          ) : null}
        </div>

        <div className="product-grid editorial-grid">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
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
