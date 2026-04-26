import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import Header from "./Header.jsx";
import { formatPrice } from "../lib/formatting";
import Icon from "./Icons.jsx";
import MobileMenu from "./MobileMenu.jsx";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/#featured", label: "Shop All" },
  { to: "/#just-dropped", label: "Just Dropped", badge: "NEW" },
  { to: "/customize", label: "Custom Order" },
  { to: "/track-order", label: "Track Order" },
  { to: "/blog", label: "Our Blogs" },
  { to: "/about", label: "Our Story", icon: "heart" },
  { to: "/contact", label: "Get in Touch", icon: "heart" }
];

const footerQuickLinks = [
  { to: "/shipping-policy", label: "Shipping Policy" },
  { to: "/return-policy", label: "Return Policy" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/faq", label: "FAQ" }
];

const footerHelpLinks = [
  { to: "/track-order", label: "Track Order" },
  { to: "/customize", label: "Custom Order" },
  { to: "/contact", label: "Contact Us" }
];

function AnnouncementBar({ announcements }) {
  const items = announcements?.length
    ? announcements.map((a) => a.message)
    : [
        "🚚 Free shipping above ₹599",
        "📦 Delivery charges ₹70",
        "🏷️ Get 10% discount using code WELCOME10"
      ];

  const tripled = [...items, ...items, ...items];

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {tripled.map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </div>
    </div>
  );
}

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
  const mobileMenuPanelRef = useRef(null);
  const cartPanelRef = useRef(null);

  const data = storefrontState.data;
  const settings = data?.settings;
  const brandName = settings?.brandName || "Trendy Spice Store";
  const businessLocation =
    settings?.businessLocation || "MOG lines, Mahu naka, Indore Madhya Pradesh, 452002";
  const supportEmail = settings?.supportEmail || "trendyspicestore@gmail.com";
  const supportPhone = settings?.supportPhone || "7067491668";
  const supportWindow = settings?.supportWindow || "Monday to Saturday, 10 AM to 7 PM";
  const instagramUrl =
    settings?.instagramUrl || "https://www.instagram.com/muskan_crochet_?igsh=MWk1eWdvYTR6NDR5";
  const facebookUrl = settings?.facebookUrl || "https://www.facebook.com/share/1CDKXCNsFq/";
  const categories = data?.categories || [];
  const announcements = data?.announcements || [];
  const overlayOpen = mobileMenuOpen || cartOpen;
  const isCheckoutRoute = location.pathname === "/checkout";

  useEffect(() => {
    document.body.classList.toggle("overlay-open", overlayOpen);

    return () => {
      document.body.classList.remove("overlay-open");
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (import.meta.env.DEV && storefrontState.error) {
      console.warn("Storefront failed to load live data.", storefrontState.error);
    }
  }, [storefrontState.error]);

  useEffect(() => {
    if (!overlayOpen) {
      return;
    }

    const activePanel = mobileMenuOpen ? mobileMenuPanelRef.current : cartPanelRef.current;
    const closeOverlay = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      } else {
        setCartOpen(false);
      }
    };
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusPanelFrame = window.requestAnimationFrame(() => {
      activePanel?.focus();
    });

    const getFocusableElements = () => {
      if (!activePanel) {
        return [];
      }

      return Array.from(
        activePanel.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        activePanel?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusPanelFrame);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [cartOpen, mobileMenuOpen, overlayOpen]);

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

      <AnnouncementBar announcements={announcements} />

      <Header
        brandName={brandName}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {mobileMenuOpen ? (
        <MobileMenu
          brandName={brandName}
          businessLocation={businessLocation}
          categories={categories}
          facebookUrl={facebookUrl}
          instagramHandle="@muskan_crochet_"
          instagramUrl={instagramUrl}
          navLinks={navLinks}
          onClose={() => setMobileMenuOpen(false)}
          ref={mobileMenuPanelRef}
          supportEmail={supportEmail}
          supportPhone={supportPhone}
        />
      ) : null}

      {cartOpen ? (
        <div className="overlay-shell">
          <div className="overlay-backdrop" onClick={() => setCartOpen(false)} role="presentation" />
          <aside
            aria-labelledby="cart-dialog-title"
            aria-modal="true"
            className="drawer-panel"
            ref={cartPanelRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="overlay-head">
              <div>
                <p className="eyebrow">Your Cart</p>
                <h2 id="cart-dialog-title">{cartCount} {cartCount === 1 ? "item" : "items"}</h2>
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
                          −
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
                <p className="empty-state">Your cart is empty. Browse our handmade collection!</p>
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
          <div className="footer-section">
            <h4>About Us</h4>
            <p style={{ fontSize: "0.85rem" }}>
              {brandName} brings you premium handmade crochet products crafted with love.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              {footerQuickLinks.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4>Help</h4>
            <div className="footer-links">
              {footerHelpLinks.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <Icon name="phone" />
              <a href={`tel:${supportPhone}`}>{supportPhone}</a>
            </div>
            <div className="footer-contact-item">
              <Icon name="mail" />
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </div>
            <div className="footer-contact-item">
              <Icon name="map-pin" />
              <span>{businessLocation}</span>
            </div>

            <h4 style={{ marginTop: "0.75rem" }}>Follow Us</h4>
            <div className="social-row">
              <a className="social-link" href={instagramUrl} rel="noreferrer" target="_blank">
                <Icon name="instagram" />
                <span>@muskan_crochet_</span>
              </a>
              <a className="social-link" href={facebookUrl} rel="noreferrer" target="_blank">
                <Icon name="facebook" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
