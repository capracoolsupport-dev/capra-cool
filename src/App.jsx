import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollManager from "./components/ScrollManager.jsx";
import ProtectedAdminLayout from "./components/ProtectedAdminLayout.jsx";
import SiteLayout from "./components/SiteLayout.jsx";
import { useStorefrontData } from "./hooks/useStorefrontData.js";
import AboutPage from "./pages/AboutPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminProductEditorPage from "./pages/AdminProductEditorPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CustomizePage from "./pages/CustomizePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";

const activeCartStorageKey = "trendy-spice-store-cart";
const legacyCartStorageKey = "loop-and-love-cart";

function readCart() {
  try {
    const raw =
      localStorage.getItem(activeCartStorageKey) ||
      localStorage.getItem(legacyCartStorageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export default function App() {
  const storefrontState = useStorefrontData();
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(activeCartStorageKey, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.slug === product.slug);

      if (existing) {
        return current.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          slug: product.slug,
          name: product.name,
          priceInr: product.priceInr,
          image: product.primaryImage,
          quantity
        }
      ];
    });
  };

  const updateCartQuantity = (slug, nextQuantity) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.max(1, nextQuantity) }
            : item
        )
        .filter(Boolean)
    );
  };

  const removeFromCart = (slug) => {
    setCartItems((current) => current.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products/new" element={<AdminProductEditorPage />} />
        </Route>
        <Route
          element={
            <SiteLayout
              storefrontState={storefrontState}
              cartItems={cartItems}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
