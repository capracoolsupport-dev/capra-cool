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
    supportPhone
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
        <div className="overlay-head">
          <div>
            <p className="eyebrow">Menu</p>
            <strong className="mobile-menu-brand" id="mobile-menu-title">
              {brandName}
            </strong>
          </div>
          <button
            aria-label="Close menu"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <NavLink
              end={link.end}
              key={link.label}
              onClick={onClose}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {categories.length ? (
          <div className="mobile-category-block">
            <p className="eyebrow">Categories</p>
            <div className="mobile-category-grid">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  onClick={onClose}
                  to={`/?category=${encodeURIComponent(category.slug)}#featured`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mobile-support-block">
          <p className="eyebrow">Support</p>
          <a href={`tel:${supportPhone}`}>{supportPhone}</a>
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </div>

        <div className="mobile-support-block">
          <p className="eyebrow">Follow Us</p>
          <a href={instagramUrl} rel="noreferrer" target="_blank">
            {instagramHandle}
          </a>
          <a href={facebookUrl} rel="noreferrer" target="_blank">
            Facebook
          </a>
        </div>
      </aside>
    </div>
  );
});

export default MobileMenu;
