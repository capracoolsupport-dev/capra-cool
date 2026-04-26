import { forwardRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "./Icons.jsx";

const MobileMenu = forwardRef(function MobileMenu(
  {
    brandName,
    categories,
    facebookUrl,
    instagramHandle,
    instagramUrl,
    navLinks,
    onClose,
    supportEmail,
    supportPhone,
    businessLocation
  },
  ref
) {
  return (
    <div className="overlay-shell">
      <div className="overlay-backdrop" onClick={onClose} role="presentation" />
      <aside
        aria-labelledby="mobile-menu-title"
        aria-modal="true"
        className="mobile-menu-panel"
        ref={ref}
        role="dialog"
        tabIndex={-1}
      >
        <div className="mobile-menu-header">
          <Link className="mobile-menu-brand" onClick={onClose} to="/">
            <span className="mobile-brand-name" id="mobile-menu-title">
              {brandName}
            </span>
            <span className="mobile-brand-tagline">HANDMADE WITH LOVE</span>
          </Link>
          <button
            aria-label="Close menu"
            className="mobile-close-btn"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink
              className="mobile-nav-item"
              end={link.end}
              key={link.label}
              onClick={onClose}
              to={link.to}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {link.icon ? <Icon name={link.icon} /> : null}
                <span>{link.label}</span>
              </div>
              {link.badge ? <span className="nav-badge">{link.badge}</span> : null}
              <Icon name="chevron-right" />
            </NavLink>
          ))}
        </nav>

        <div className="mobile-support-section">
          <p className="mobile-section-title">Customer Support</p>
          <a className="mobile-support-item" href={`tel:${supportPhone}`}>
            <Icon name="phone" />
            <span>{supportPhone}</span>
          </a>
          <a className="mobile-support-item" href={`mailto:${supportEmail}`}>
            <Icon name="mail" />
            <span>{supportEmail}</span>
          </a>
          {businessLocation ? (
            <div className="mobile-support-item">
              <Icon name="map-pin" />
              <span>{businessLocation}</span>
            </div>
          ) : null}
        </div>

        <div className="mobile-support-section">
          <p className="mobile-section-title">Follow Us</p>
          <a className="mobile-support-item" href={instagramUrl} rel="noreferrer" target="_blank">
            <Icon name="instagram" />
            <span>{instagramHandle}</span>
          </a>
          <a className="mobile-support-item" href={facebookUrl} rel="noreferrer" target="_blank">
            <Icon name="facebook" />
            <span>Facebook</span>
          </a>
        </div>
      </aside>
    </div>
  );
});

export default MobileMenu;
