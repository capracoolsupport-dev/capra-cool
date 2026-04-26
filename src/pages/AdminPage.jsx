import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import { AdminDashboardSkeleton } from "../components/Skeletons.jsx";
import { deleteProductWithMedia, loadAdminDashboard, updateOrderStatus } from "../lib/adminApi.js";
import { signOutAdmin } from "../lib/adminAuth.js";
import { formatPrice } from "../lib/formatting.js";
import { hasSupabaseConfig, supabase } from "../lib/supabase.js";

const ORDER_TABS = ["All", "Pending", "Accepted", "Packed", "Shipped", "Delivered", "Cancelled"];

function statusColor(status) {
  const map = {
    pending: "#FF9800",
    accepted: "#2196F3",
    packed: "#9C27B0",
    shipped: "#00BCD4",
    delivered: "#4CAF50",
    cancelled: "#F44336"
  };
  return map[(status || "").toLowerCase()] || "#7A7A7A";
}

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

function KPICard({ label, value, icon, color }) {
  return (
    <article className="admin-kpi-card" style={{ borderLeft: `3px solid ${color || "var(--primary)"}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ color, opacity: 0.7 }}>
          <Icon name={icon || "package"} />
        </span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}

function OrderCard({ order, onClick }) {
  const color = statusColor(order.order_status);
  const date = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className="admin-record-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="admin-record-copy">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <strong>{order.order_number || `#${order.id?.slice(0, 8)}`}</strong>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.15rem 0.55rem",
              borderRadius: "999px",
              background: `${color}18`,
              color: color,
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}
          >
            {order.order_status || "Pending"}
          </span>
        </div>
        <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>
          {order.customer_name || "Customer"} • {date}
        </span>
        <strong style={{ color: "var(--primary)" }}>{formatPrice(order.total_amount_inr || 0)}</strong>
      </div>
      {onClick ? <Icon name="chevron-right" /> : null}
    </div>
  );
}

function OrderDetailsView({ order, onBack, onStatusChange, primaryMediaByProduct }) {
  const steps = ["pending", "accepted", "packed", "shipped", "delivered"];
  const currentIdx = steps.indexOf((order.order_status || "pending").toLowerCase());
  const isCancelled = (order.order_status || "").toLowerCase() === "cancelled";
  
  const handleUpdate = async (status) => {
    onStatusChange(order.id, status);
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <button className="icon-button" onClick={onBack} type="button" style={{ marginBottom: "0.5rem" }}>
            <Icon name="arrow-left" /> Back to Orders
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2>{order.order_number || `#${order.id?.slice(0, 8)}`}</h2>
            <span style={{
              fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px",
              background: `${statusColor(order.order_status)}18`, color: statusColor(order.order_status), textTransform: "uppercase"
            }}>
              {order.order_status || "Pending"}
            </span>
          </div>
          <p className="admin-table-meta">
            Placed on {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        <div className="admin-record-card" style={{ display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-soft)" }}>Payment Status</span>
            <strong style={{ color: order.status === "paid" ? "#4CAF50" : "#F44336" }}>
              {order.status?.toUpperCase() || "PENDING"}
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-soft)" }}>Payment Method</span>
            <strong>{order.payment_method?.toUpperCase() || "PREPAID"}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-soft)" }}>Total Amount</span>
            <strong>{formatPrice(order.amount_inr || 0)}</strong>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Order Progress</h3>
          {isCancelled ? (
            <p style={{ color: "#F44336", fontWeight: "bold" }}>This order was cancelled.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentIdx;
                return (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: isCompleted ? 1 : 0.4 }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: isCompleted ? "var(--primary)" : "var(--border)", color: "white", display: "grid", placeItems: "center" }}>
                      {isCompleted ? <Icon name="check" /> : <div style={{width: 8, height: 8, borderRadius: "50%", background: "var(--surface)"}} />}
                    </div>
                    <span style={{ textTransform: "capitalize", fontWeight: isCompleted ? 600 : 400 }}>{step}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {!isCancelled && currentIdx < 1 && <Button onClick={() => handleUpdate("accepted")} variant="primary">Accept Order</Button>}
          {!isCancelled && currentIdx === 1 && <Button onClick={() => handleUpdate("packed")} variant="primary" style={{ background: "#9C27B0" }}>Mark as Packed</Button>}
          {!isCancelled && currentIdx === 2 && <Button onClick={() => handleUpdate("shipped")} variant="primary" style={{ background: "#00BCD4" }}>Mark as Shipped</Button>}
          {!isCancelled && currentIdx === 3 && <Button onClick={() => handleUpdate("delivered")} variant="primary" style={{ background: "#4CAF50" }}>Mark as Delivered</Button>}
          {!isCancelled && currentIdx < 4 && <Button onClick={() => handleUpdate("cancelled")} variant="secondary" style={{ color: "#F44336" }}>Cancel Order</Button>}
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Order Items ({order.line_items?.length || 0})</h3>
          <div className="admin-record-list">
            {(order.line_items || []).map((item, idx) => {
              const imgUrl = item.image || (primaryMediaByProduct[item.product_id] ? resolveProductImage(primaryMediaByProduct[item.product_id]) : "");
              return (
                <div key={idx} className="admin-record-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {imgUrl ? <img src={imgUrl} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: "var(--surface-soft)" }} />}
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Qty: {item.quantity}</div>
                  </div>
                  <strong>{formatPrice(item.priceInr * item.quantity)}</strong>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Customer Info</h3>
          <div className="admin-record-card" style={{ display: "block" }}>
            <p><strong>{order.customer_name}</strong></p>
            <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{order.customer_email}</p>
            <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{order.customer_phone}</p>
            <hr style={{ margin: "1rem 0", borderColor: "var(--border)" }} />
            <p style={{ fontSize: "0.85rem" }}>
              {order.shipping_address_line_1}<br/>
              {order.shipping_address_line_2 ? <>{order.shipping_address_line_2}<br/></> : null}
              {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useOutletContext();
  const [dashboardState, setDashboardState] = useState(createInitialState);
  const [busyProductId, setBusyProductId] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [adminView, setAdminView] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
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
  const orders = dashboard?.customerOrders || [];
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.order_status !== "cancelled")
    .reduce((sum, o) => sum + (o.total_amount_inr || 0), 0);
  const lowStockAlerts = products.filter(
    (product) =>
      typeof product.stock_quantity === "number" &&
      product.stock_quantity >= 0 &&
      product.stock_quantity <= 3
  ).length;
  const activeCategories = (dashboard?.categories || []).filter((category) => category.is_active !== false).length;

  const filteredOrders = activeTab === "All"
    ? orders
    : orders.filter((o) => (o.order_status || "pending").toLowerCase() === activeTab.toLowerCase());

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

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setStatus({ tone: "", message: "" });
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.ok) {
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
      }
      refreshDashboard();
      setStatus({ tone: "success", message: result.message });
    } else {
      setStatus({ tone: "error", message: result.message });
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
          {/* Welcome Header */}
          <section className="admin-hero">
            <div className="admin-hero-copy">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: "3rem", height: "3rem", borderRadius: "50%",
                  background: "var(--primary-tint)", display: "grid", placeItems: "center",
                  color: "var(--primary)"
                }}>
                  <Icon name="user" />
                </div>
                <div>
                  <h1 style={{ fontSize: "1.25rem", margin: 0 }}>Welcome back! 👋</h1>
                  <p className="admin-session-note">{session?.user?.email || "admin user"}</p>
                </div>
              </div>
              <div className="admin-toolbar">
                <Button to="/admin/products/new">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Icon name="plus" /> Add Product
                  </span>
                </Button>
                <Button onClick={() => window.open("/", "_blank")} type="button" variant="secondary">
                  View Store
                </Button>
                <Button onClick={refreshDashboard} type="button" variant="secondary">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Icon name="refresh-cw" /> Refresh
                  </span>
                </Button>
                <Button onClick={handleSignOut} type="button" variant="danger">
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="admin-overview-grid">
              <KPICard label="Total Orders" value={metricsLoading ? "..." : totalOrders} icon="package" color="#2196F3" />
              <KPICard label="Revenue" value={metricsLoading ? "..." : formatPrice(totalRevenue)} icon="cart" color="#4CAF50" />
              <KPICard label="Products" value={metricsLoading ? "..." : totalProducts} icon="package" color="#9C27B0" />
              <KPICard label="Categories" value={metricsLoading ? "..." : activeCategories} icon="package" color="#FF9800" />
              <KPICard label="Low Stock" value={metricsLoading ? "..." : lowStockAlerts} icon="package" color="#F44336" />
              <KPICard label="Custom Requests" value={metricsLoading ? "..." : (dashboard?.customOrderRequests || []).length} icon="edit" color="#00BCD4" />
            </div>
          </section>

          {status.message ? (
            <div className={`admin-banner ${status.tone === "error" ? "admin-banner-error" : ""}`}>
              {status.message}
            </div>
          ) : null}

          {/* Bottom Nav */}
          <div className="admin-tab-row" style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
            {["dashboard", "orders", "products", "categories", "discounts"].map((view) => (
              <button
                className={`admin-tab ${adminView === view ? "is-active" : ""}`}
                key={view}
                onClick={() => setAdminView(view)}
                style={{ whiteSpace: "nowrap" }}
                type="button"
              >
                {view === "dashboard" ? "📊 Dashboard" : view === "orders" ? "📦 Orders" : view === "products" ? "🛍️ Products" : view === "categories" ? "📂 Categories" : "🏷️ Discounts"}
              </button>
            ))}
          </div>

          {/* Dashboard View */}
          {adminView === "dashboard" ? (
            <>
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="eyebrow">Recent orders</p>
                    <h2>Latest Activity</h2>
                  </div>
                  <Button onClick={() => setAdminView("orders")} variant="secondary">View All</Button>
                </div>
                {metricsLoading ? (
                  <AdminDashboardSkeleton />
                ) : orders.length ? (
                  <div className="admin-record-list">
                    {orders.slice(0, 5).map((order) => (
                      <OrderCard key={order.id} order={order} onClick={() => { setAdminView("orders"); setSelectedOrder(order); }} />
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty">No orders yet.</div>
                )}
              </section>

              {(dashboard?.customOrderRequests || []).length > 0 ? (
                <section className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <p className="eyebrow">Custom orders</p>
                      <h2>Custom Requests</h2>
                    </div>
                  </div>
                  <div className="admin-record-list">
                    {(dashboard?.customOrderRequests || []).slice(0, 5).map((req) => (
                      <div className="admin-record-card" key={req.id}>
                        <div className="admin-record-copy">
                          <strong>{req.name}</strong>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>
                            {req.email} • {req.product_type || "General"}
                          </span>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>{req.details?.slice(0, 100)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}

          {/* Orders View */}
          {adminView === "orders" ? (
            selectedOrder ? (
              <OrderDetailsView 
                order={selectedOrder} 
                onBack={() => setSelectedOrder(null)} 
                onStatusChange={handleOrderStatusChange}
                primaryMediaByProduct={primaryMediaByProduct}
              />
            ) : (
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="eyebrow">Order management</p>
                    <h2>All Orders</h2>
                  </div>
                </div>
                <div className="admin-tab-row">
                  {ORDER_TABS.map((tab) => (
                    <button
                      className={`admin-tab ${activeTab === tab ? "is-active" : ""}`}
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <p className="admin-table-meta">
                  {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"} {activeTab !== "All" ? `with status "${activeTab}"` : "total"}
                </p>
                {metricsLoading ? (
                  <AdminDashboardSkeleton />
                ) : filteredOrders.length ? (
                  <div className="admin-record-list">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty">No orders match this filter.</div>
                )}
              </section>
            )
          ) : null}

          {/* Products View */}
          {adminView === "products" ? (
            <section className="admin-panel admin-table-card">
              <div className="admin-panel-head">
                <div>
                  <p className="eyebrow">Products</p>
                  <h2>Catalog Overview</h2>
                  <p className="admin-table-meta">
                    {dashboardState.status === "loading"
                      ? "Loading the live catalog..."
                      : `${totalProducts} products in catalog.`}
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

                        const statusLabel =
                          product.is_active === false
                            ? "Hidden"
                            : stockValue === 0
                              ? "Out of stock"
                              : stockValue !== null && stockValue <= 3
                                ? "Low stock"
                                : "Live";

                        const statusStyle = {
                          fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          background: statusLabel === "Live" ? "#4CAF5018" : statusLabel === "Low stock" ? "#FF980018" : "#F4433618",
                          color: statusLabel === "Live" ? "#4CAF50" : statusLabel === "Low stock" ? "#FF9800" : "#F44336"
                        };

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
                            <td><span style={statusStyle}>{statusLabel}</span></td>
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
          ) : null}

          {/* Categories View */}
          {adminView === "categories" ? (
            <section className="admin-panel admin-table-card">
              <div className="admin-panel-head">
                <div>
                  <p className="eyebrow">Categories</p>
                  <h2>Category Management</h2>
                </div>
                <Button onClick={() => window.alert('Category editor coming soon')} variant="secondary">
                  New Category
                </Button>
              </div>
              
              {metricsLoading ? (
                <AdminDashboardSkeleton />
              ) : (dashboard?.categories || []).length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Color Theme</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dashboard?.categories || []).map((category) => (
                        <tr key={category.id}>
                          <td>
                            <div className="admin-table-product">
                              {category.image_url ? (
                                <img alt={category.name} src={category.image_url} style={{ borderRadius: '50%' }} />
                              ) : (
                                <div className="admin-table-placeholder" style={{ borderRadius: '50%', background: category.tint_color, color: category.accent_color, display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>
                                  {category.short_label}
                                </div>
                              )}
                              <div>
                                <strong>{category.name}</strong>
                                <span>{category.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: category.accent_color }} />
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: category.tint_color }} />
                            </div>
                          </td>
                          <td>
                            <span style={{
                              fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px",
                              background: category.is_active ? "#4CAF5018" : "#F4433618",
                              color: category.is_active ? "#4CAF50" : "#F44336"
                            }}>
                              {category.is_active ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <button aria-label="Edit" className="icon-button" onClick={() => window.alert('Coming soon')} type="button">
                                <Icon name="edit" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty">No categories found.</div>
              )}
            </section>
          ) : null}

          {/* Discounts View */}
          {adminView === "discounts" ? (
            <section className="admin-panel admin-table-card">
              <div className="admin-panel-head">
                <div>
                  <p className="eyebrow">Discounts</p>
                  <h2>Discount Codes</h2>
                </div>
                <Button onClick={() => window.alert('Discount editor coming soon')} variant="secondary">
                  New Discount
                </Button>
              </div>
              
              {metricsLoading ? (
                <AdminDashboardSkeleton />
              ) : (dashboard?.discounts || []).length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Usage</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dashboard?.discounts || []).map((discount) => (
                        <tr key={discount.id}>
                          <td><strong>{discount.code}</strong></td>
                          <td>{discount.discount_percent}% off</td>
                          <td>{discount.uses_count} {discount.max_uses ? `/ ${discount.max_uses}` : "uses"}</td>
                          <td>
                            <span style={{
                              fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px",
                              background: discount.is_active ? "#4CAF5018" : "#F4433618",
                              color: discount.is_active ? "#4CAF50" : "#F44336"
                            }}>
                              {discount.is_active ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <button aria-label="Edit" className="icon-button" onClick={() => window.alert('Coming soon')} type="button">
                                <Icon name="edit" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty">No discounts created yet.</div>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
