import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { HomePageSkeleton } from "../components/Skeletons.jsx";
import StorefrontErrorState from "../components/StorefrontErrorState.jsx";

function HeroSlider({ products, settings }) {
  const slides = products.slice(0, 4);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setCurrent((index + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 4000);
    return () => clearInterval(timerRef.current);
  }, [current, goTo]);

  if (!slides.length) return null;

  return (
    <div className="hero-slider">
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((product) => (
          <div className="hero-slide" key={product.slug}>
            <img src={product.primaryImage} alt={product.name} loading="eager" />
            <div className="hero-slide-overlay">
              <h2>{settings?.heroTitle || "Handmade With Love ♡"}</h2>
              <p>{settings?.heroDescription || "Beautifully crafted crochet pieces for every moment."}</p>
              <Link className="button" to="/#featured">SHOP ALL</Link>
            </div>
          </div>
        ))}
      </div>
      <button
        className="hero-nav-btn prev"
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
        type="button"
      >
        <Icon name="chevron-left" />
      </button>
      <button
        className="hero-nav-btn next"
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
        type="button"
      >
        <Icon name="chevron-right" />
      </button>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            className={`hero-dot ${i === current ? "is-active" : ""}`}
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, storefrontState } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  if (!data) {
    if (storefrontState.status === "error") {
      return (
        <StorefrontErrorState
          message="We could not load the live catalog right now. Please try again shortly."
          title="The catalog is temporarily unavailable."
        />
      );
    }

    return <HomePageSkeleton />;
  }

  const settings = data.settings;
  const selectedCategoryData = data.categories.find((category) => category.slug === selectedCategory);
  const filteredProducts = selectedCategory
    ? data.products.filter((product) => product.category?.slug === selectedCategory)
    : data.products;

  const featuredProducts = data.products.filter((product) => product.isFeaturedHome);
  const featuredVisible = featuredProducts.length ? featuredProducts : data.products.slice(0, 6);
  const heroProducts = featuredVisible.length >= 2 ? featuredVisible : data.products.slice(0, 4);

  const updateCategory = (nextCategory) => {
    const target = nextCategory
      ? `/?category=${encodeURIComponent(nextCategory)}#featured`
      : "/#featured";

    navigate(target);
  };

  return (
    <>
      <HeroSlider products={heroProducts} settings={settings} />

      <section className="category-section">
        <div className="section-heading">
          <h2>Shop by Categories</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Explore our most loved collections</p>
        </div>
        <div aria-label="Product categories" className="category-rail" role="list">
          {data.categories.map((category) => {
            const selected = selectedCategory === category.slug;

            return (
              <button
                aria-pressed={selected}
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
                <span className={`category-pill-icon ${category.imageUrl ? "has-image" : ""}`}>
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} loading="lazy" />
                  ) : (
                    category.shortLabel
                  )}
                </span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {!selectedCategory && featuredVisible.length > 0 ? (
        <section className="page-section" id="featured-picks">
          <div className="featured-header">
            <h2>Featured Products</h2>
            <Link className="view-all-link" to="/#featured">
              View All Products <Icon name="arrow-right" />
            </Link>
          </div>
          <div className="product-grid">
            {featuredVisible.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                badge={product.isFeaturedHome ? "Bestseller" : undefined}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="page-section" id="featured">
        <div className="section-heading">
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

        <div className="product-grid">
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
