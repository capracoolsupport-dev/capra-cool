import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import Header from "./Header.jsx";
import { formatPrice } from "../lib/formatting";
import Icon from "./Icons.jsx";
import MobileMenu from "./MobileMenu.jsx";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/#featured", label: "Products" },
  { to: "/track-order", label: "Track Order" },
  { to: "/customize", label: "Custom Orders" },
  { to: "/contact", label: "Contact" }
];

export default function SiteLayout({
  storefrontState,
  cartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const data = storefrontState.data;
  const settings = data?.settings;
  const brandName = settings?.brandName || "Trendy Spice Store";
  const categories = data?.categories || [];
  const overlayOpen = mobileMenuOpen || cartOpen;
  const isCheckoutRoute = location.pathname === "/checkout";

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

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.priceInr * item.quantity,
    0
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Header
        brandName={brandName}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {mobileMenuOpen ? (
        <MobileMenu
          brandName={brandName}
          categories={categories}
          navLinks={navLinks}
          onClose={() => setMobileMenuOpen(false)}
        />
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
              <Button onClick={() => setCartOpen(false)} to="/checkout" wide>
                Proceed to Checkout
              </Button>
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

      <footer className={`site-footer ${isCheckoutRoute ? "checkout-footer" : ""}`}>
        <div className="footer-stack">
          <div>
            <p className="eyebrow">{brandName}</p>
            <h2>Simple handmade shopping.</h2>
          </div>

          <div className="footer-links">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>

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
