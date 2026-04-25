import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import { AdminDashboardSkeleton } from "../components/Skeletons.jsx";
import { deleteProductWithMedia, loadAdminDashboard } from "../lib/adminApi.js";
import { signOutAdmin } from "../lib/adminAuth.js";
import { formatPrice } from "../lib/formatting.js";
import { hasSupabaseConfig, supabase } from "../lib/supabase.js";

function createInitialState() {
  return {
    status: "loading",
    data: null,
    error: ""
  };
}

function toPreviewMedia(productMedia = []) {
  return productMedia.reduce((accumulator, item) => {
    const current = accumulator[item.product_id];

    if (!current || item.is_primary || current.sort_order > item.sort_order) {
      accumulator[item.product_id] = item;
    }

    return accumulator;
  }, {});
}

function resolveProductImage(mediaItem) {
  if (!mediaItem || !supabase) {
    return "";
  }

  if (mediaItem.public_url) {
    return mediaItem.public_url;
  }

  if (mediaItem.bucket_name && mediaItem.storage_path) {
    const { data } = supabase.storage.from(mediaItem.bucket_name).getPublicUrl(mediaItem.storage_path);
    return data.publicUrl;
  }

  return "";
}

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useOutletContext();
  const [dashboardState, setDashboardState] = useState(createInitialState);
  const [busyProductId, setBusyProductId] = useState("");
  const [status, setStatus] = useState(() =>
    location.state?.notice
      ? {
          tone: "success",
          message: location.state.notice
        }
      : {
          tone: "",
          message: ""
        }
  );

  useEffect(() => {
    if (location.state?.notice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    document.title = "Admin Dashboard | Trendy Spice Store";
  }, []);

  const refreshDashboard = async () => {
    setDashboardState((current) => ({
      ...current,
      status: "loading",
      error: ""
    }));

    const result = await loadAdminDashboard();

    if (!result.ok || !result.data) {
      setDashboardState({
        status: "error",
        data: null,
        error: result.message
      });
      return;
    }

    setDashboardState({
      status: "ready",
      data: result.data,
      error: ""
    });
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const dashboard = dashboardState.data;
  const metricsLoading = dashboardState.status === "loading";
  const categoriesById = useMemo(
    () =>
      (dashboard?.categories || []).reduce((accumulator, category) => {
        accumulator[category.id] = category;
        return accumulator;
      }, {}),
    [dashboard?.categories]
  );
  const primaryMediaByProduct = useMemo(
    () => toPreviewMedia(dashboard?.productMedia || []),
    [dashboard?.productMedia]
  );

  const products = dashboard?.products || [];
  const totalProducts = products.length;
  const lowStockAlerts = products.filter(
    (product) =>
      typeof product.stock_quantity === "number" &&
      product.stock_quantity >= 0 &&
      product.stock_quantity <= 3
  ).length;
  const activeCategories = (dashboard?.categories || []).filter((category) => category.is_active !== false).length;

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setBusyProductId(product.id);
    setStatus({
      tone: "",
      message: ""
    });

    const result = await deleteProductWithMedia(product, dashboard?.productMedia || []);

    setBusyProductId("");
    setStatus({
      tone: result.ok ? "success" : "error",
      message: result.message
    });

    if (result.ok) {
      refreshDashboard();
    }
  };

  const handleSignOut = async () => {
    const result = await signOutAdmin();

    if (!result.ok) {
      setStatus({
        tone: "error",
        message: result.message
      });
      return;
    }

    navigate("/admin/login", { replace: true });
  };

  if (!hasSupabaseConfig) {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Admin dashboard</p>
              <h2>Connect Supabase before opening the admin workspace.</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="admin-shell">
        <div className="admin-page">
          <section className="admin-hero">
            <div className="admin-hero-copy">
              <p className="eyebrow">Admin workspace</p>
              <h1>Manage the storefront from one focused dashboard.</h1>
              <p className="section-lead">
                Review product health, watch stock pressure, and move straight into the upload form without the old
                multi-tab clutter.
              </p>
              <p className="admin-session-note">Signed in as {session?.user?.email || "admin user"}.</p>
              <div className="admin-toolbar">
                <Button to="/admin/products/new">Add Product</Button>
                <Button onClick={refreshDashboard} type="button" variant="secondary">
                  Refresh
                </Button>
                <Button onClick={handleSignOut} type="button" variant="secondary">
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="admin-kpi-grid">
              <article className="admin-kpi-card">
                <span>Total Products</span>
                <strong>{metricsLoading ? "..." : totalProducts}</strong>
              </article>
              <article className="admin-kpi-card">
                <span>Low Stock Alerts</span>
                <strong>{metricsLoading ? "..." : lowStockAlerts}</strong>
              </article>
              <article className="admin-kpi-card">
                <span>Active Categories</span>
                <strong>{metricsLoading ? "..." : activeCategories}</strong>
              </article>
            </div>
          </section>

          {status.message ? (
            <div className={`admin-banner ${status.tone === "error" ? "admin-banner-error" : ""}`}>
              {status.message}
            </div>
          ) : null}

          <section className="admin-panel admin-table-card">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">Products</p>
                <h2>Catalog overview</h2>
                <p className="section-lead">Edit essentials quickly or remove outdated products from the storefront.</p>
                <p className="admin-table-meta">
                  {dashboardState.status === "loading"
                    ? "Loading the live catalog..."
                    : `${totalProducts} products currently available in the admin catalog.`}
                </p>
              </div>
              <Button to="/admin/products/new" variant="secondary">
                New Product
              </Button>
            </div>

            {dashboardState.status === "loading" ? (
              <AdminDashboardSkeleton />
            ) : dashboardState.error ? (
              <div className="admin-banner admin-banner-error">{dashboardState.error}</div>
            ) : products.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const category = categoriesById[product.category_id];
                      const media = primaryMediaByProduct[product.id];
                      const productImage = resolveProductImage(media);
                      const stockValue =
                        typeof product.stock_quantity === "number" ? product.stock_quantity : null;

                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="admin-table-product">
                              {productImage ? <img alt={product.name} src={productImage} /> : <div className="admin-table-placeholder" />}
                              <div>
                                <strong>{product.name}</strong>
                                <span>{product.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td>{category?.name || "Unassigned"}</td>
                          <td>{formatPrice(product.price_inr)}</td>
                          <td>{stockValue === null ? "Not set" : stockValue}</td>
                          <td>
                            {product.is_active === false
                              ? "Hidden"
                              : stockValue === 0
                                ? "Out of stock"
                                : stockValue !== null && stockValue <= 3
                                  ? "Low stock"
                                  : "Live"}
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <Link
                                aria-label={`Edit ${product.name}`}
                                className="icon-button"
                                to={`/admin/products/new?edit=${product.id}`}
                              >
                                <Icon name="edit" />
                              </Link>
                              <button
                                aria-label={`Delete ${product.name}`}
                                className="icon-button"
                                disabled={busyProductId === product.id}
                                onClick={() => handleDeleteProduct(product)}
                                type="button"
                              >
                                <Icon name="trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty">No products yet. Add the first product to start the catalog.</div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
