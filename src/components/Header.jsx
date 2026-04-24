import { Link } from "react-router-dom";
import Icon from "./Icons.jsx";

export default function Header({ brandName, cartCount, onOpenCart, onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="header-shell">
        <button
          aria-label="Open menu"
          className="icon-button"
          onClick={onOpenMenu}
          type="button"
        >
          <Icon name="menu" />
        </button>

        <Link className="brand-wordmark" to="/">
          {brandName}
        </Link>

        <button
          aria-label="Open cart"
          className="icon-button cart-button"
          onClick={onOpenCart}
          type="button"
        >
          <Icon name="cart" />
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
