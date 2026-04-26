import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";

export default function Header({ brandName, cartCount, onOpenCart, onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="header-shell">
        <button
          aria-label="Open menu"
          className="header-icon-btn"
          onClick={onOpenMenu}
          type="button"
        >
          <Icon name="menu" />
        </button>

        <Link className="brand-lockup" to="/">
          <span className="brand-name">{brandName}</span>
          <span className="brand-tagline">HANDMADE WITH LOVE</span>
        </Link>

        <div className="header-actions">
          <button aria-label="Search" className="header-icon-btn" type="button">
            <Icon name="search" />
          </button>
          <button aria-label="Wishlist" className="header-icon-btn" type="button">
            <Icon name="heart" />
          </button>
          <button
            aria-label={`Cart (${cartCount} items)`}
            className="header-icon-btn cart-button"
            onClick={onOpenCart}
            type="button"
          >
            <Icon name="cart" />
            {cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}
