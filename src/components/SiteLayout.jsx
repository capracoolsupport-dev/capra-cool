import { useDeferredValue, useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { formatPrice } from "../lib/formatting";
import { submitNewsletterSignup } from "../lib/storefrontApi";
import Icon from "./Icons.jsx";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/#featured", label: "New Arrivals" },
  { to: "/track-order", label: "Track Order" },
  { to: "/customize", label: "Customize" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" }
];

function getBrandMark(brandName) {
  const words = String(brandName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  const compact = String(brandName || "").replace(/[^a-zA-Z]/g, "");
  return (compact.slice(0, 2) || "TS").toUpperCase();
}

export default function SiteLayout({
  storefrontState,
  cartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [newsletterValue, setNewsletterValue] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const deferredSearchValue = useDeferredValue(searchValue);

  const data = storefrontState.data;
  const settings = data?.settings;
  const brandName = settings?.brandName || "Trendy Spice Store";
  const brandSubline = settings?.brandSubline || "trendyspicestore.com";
  const brandMark = getBrandMark(brandName);
  const products = data?.products || [];
  const announcements = data?.announcements || [];
  const overlayOpen = mobileMenuOpen || searchOpen || cartOpen;

  useEffect(() => {
    document.body.classList.toggle("overlay-open", overlayOpen);

    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    if (storefrontState.error) {
      console.warn("Storefront data fallback in use.", storefrontState.error);
      return;
    }

    if (storefrontState.source === "mock") {
      console.info("Storefront is using preview data.");
    }
  }, [storefrontState.error, storefrontState.source]);

  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? products.filter((product) => {
        return [
          product.name,
          product.tagline,
          product.category?.name
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      })
    : products.slice(0, 6);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.priceInr * item.quantity,
    0
  );

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    if (!newsletterValue.trim()) {
      setNewsletterStatus("Please enter an email address.");
      return;
    }

    setNewsletterBusy(true);
    const result = await submitNewsletterSignup(newsletterValue.trim());
    setNewsletterStatus(result.message);
    setNewsletterBusy(false);

    if (result.ok) {
      setNewsletterValue("");
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="announcement-bar" aria-label="Promotions">
        <div className="announcement-track">
          {[...announcements, ...announcements, ...announcements].map((item, index) => (
            <span key={`${item.id}-${index}`}>
              {item.message}
            </span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="header-shell">
          <Link className="brand-lockup" to="/">
            <span className="brand-mark">{brandMark}</span>
            <span className="brand-copy">
              <strong>{brandName}</strong>
              <small>{brandSubline}</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                className={({ isActive }) => (isActive ? "is-active" : "")}
                key={link.label}
                to={link.to}
                end={link.end}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button
              aria-label="Open search"
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              type="button"
            >
              <Icon name="search" />
            </button>
            <button
              aria-label="Open cart"
              className="icon-button cart-button"
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <Icon name="cart" />
              <span className="cart-count">{cartCount}</span>
            </button>
            <button
              aria-label="Open menu"
              className="icon-button mobile-only"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="overlay-shell">
          <div className="overlay-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <aside className="mobile-menu-panel">
            <div className="overlay-head">
              <strong>Browse</strong>
              <button
                aria-label="Close menu"
                className="icon-button"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  onClick={() => setMobileMenuOpen(false)}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="overlay-shell">
          <div className="overlay-backdrop" onClick={() => setSearchOpen(false)} />
          <aside className="drawer-panel">
            <div className="overlay-head">
              <div>
                <p className="eyebrow">Search</p>
                <h2>Find handmade crochet pieces quickly</h2>
              </div>
              <button
                aria-label="Close search"
                className="icon-button"
                onClick={() => setSearchOpen(false)}
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>

            <label className="search-field">
              <span className="sr-only">Search products</span>
              <input
                autoFocus
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search scrunchies, gifting, flowers..."
                type="search"
                value={searchValue}
              />
            </label>

            <div className="search-results">
              {searchResults.length ? (
                searchResults.map((product) => (
                  <Link
                    className="search-result-card"
                    key={product.slug}
                    onClick={() => setSearchOpen(false)}
                    to={`/products/${product.slug}`}
                  >
                    <img alt={product.name} loading="lazy" src={product.primaryImage} />
                    <div>
                      <p className="search-result-category">{product.category?.name}</p>
                      <strong>{product.name}</strong>
                      <span>{formatPrice(product.priceInr)}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="empty-state">No products matched that search.</p>
              )}
            </div>
          </aside>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="overlay-shell">
          <div className="overlay-backdrop" onClick={() => setCartOpen(false)} />
          <aside className="drawer-panel">
            <div className="overlay-head">
              <div>
                <p className="eyebrow">Your cart</p>
                <h2>Handmade picks saved</h2>
              </div>
              <button
                aria-label="Close cart"
                className="icon-button"
                onClick={() => setCartOpen(false)}
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <article className="cart-item" key={item.slug}>
                    <img alt={item.name} loading="lazy" src={item.image} />
                    <div className="cart-item-copy">
                      <strong>{item.name}</strong>
                      <span>{formatPrice(item.priceInr)}</span>
                      <div className="cart-item-actions">
                        <button
                          onClick={() => updateCartQuantity(item.slug, item.quantity - 1)}
                          type="button"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.slug, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                        <button onClick={() => removeFromCart(item.slug)} type="button">
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-state">Your cart is empty. Add a handmade favorite to get started.</p>
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <Link className="button button-primary button-wide" onClick={() => setCartOpen(false)} to="/checkout">
                Proceed to Checkout
              </Link>
            </div>
          </aside>
        </div>
      ) : null}

      <main
        id="main-content"
        className="page-shell"
        data-storefront-source={storefrontState.source}
        data-storefront-status={storefrontState.status}
      >
        <Outlet
          context={{
            storefrontState,
            data,
            addToCart,
            cartItems,
            updateCartQuantity,
            removeFromCart,
            clearCart
          }}
        />
      </main>

      <footer className="site-footer">
        <div className="footer-stack">
          <div>
            <p className="eyebrow">{brandName}</p>
            <h2>Handmade crochet with a calm, polished shopping experience from first glance to checkout.</h2>
          </div>

          <div className="footer-links">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label className="field">
              <span>Contact Email Form</span>
              <div className="newsletter-row">
                <input
                  onChange={(event) => setNewsletterValue(event.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  value={newsletterValue}
                />
                <button className="button button-secondary" disabled={newsletterBusy} type="submit">
                  {newsletterBusy ? "Joining..." : "Join"}
                </button>
              </div>
            </label>
            <p className="form-status">{newsletterStatus}</p>
          </form>

          <div className="footer-meta">
            <p>
              <strong>Business Location:</strong> {settings?.businessLocation}
            </p>
            <p>
              <strong>Email:</strong> {settings?.supportEmail}
            </p>
            <p>
              <strong>Support:</strong> {settings?.supportWindow}
            </p>
          </div>

          <div className="social-row">
            <a className="social-link" href={settings?.instagramUrl} rel="noreferrer" target="_blank">
              <Icon name="instagram" />
              <span>Instagram</span>
            </a>
            <a className="social-link" href={settings?.facebookUrl} rel="noreferrer" target="_blank">
              <Icon name="facebook" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
