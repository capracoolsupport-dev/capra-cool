import { Link, NavLink } from "react-router-dom";
import Icon from "./Icons.jsx";

export default function MobileMenu({ brandName, categories, navLinks, onClose }) {
  return (
    <div className="overlay-shell">
      <div className="overlay-backdrop" onClick={onClose} />
      <aside className="mobile-menu-panel">
        <div className="overlay-head">
          <div>
            <p className="eyebrow">Menu</p>
            <strong className="mobile-menu-brand">{brandName}</strong>
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
      </aside>
    </div>
  );
}
