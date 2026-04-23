import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminRecord,
  loadAdminDashboard,
  saveAdminRecord
} from "../lib/adminApi.js";
import { formatPrice } from "../lib/formatting.js";
import { refreshShiprocketTracking } from "../lib/shippingApi.js";
import { hasSupabaseConfig } from "../lib/supabase.js";

const adminTabs = [
  { id: "overview", label: "Overview" },
  { id: "brand", label: "Brand & Home" },
  { id: "catalog", label: "Catalog" },
  { id: "inbox", label: "Inbox" }
];

const trustIconOptions = [
  { value: "shield", label: "Shield" },
  { value: "yarn", label: "Yarn" },
  { value: "check", label: "Check" },
  { value: "support", label: "Support" }
];

function createEmptyDashboard() {
  return {
    settings: null,
    announcements: [],
    categories: [],
    trustBadges: [],
    products: [],
    productMedia: [],
    reviews: [],
    customerOrders: [],
    newsletterSignups: [],
    contactMessages: [],
    customOrderRequests: []
  };
}

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatDateTime(value) {
  if (!value) {
    return "No timestamp yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function parseListField(value) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function slugifyText(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHeroStatsText(heroStats = []) {
  return heroStats
    .map((item) => `${item.value || ""} | ${item.label || ""}`.trim())
    .join("\n");
}

function parseHeroStats(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, ...labelParts] = line.split("|");
      return {
        value: (value || "").trim(),
        label: labelParts.join("|").trim()
      };
    })
    .filter((item) => item.value || item.label);
}

function buildSettingsForm(settings) {
  return {
    id: settings?.id || "",
    brand_name: settings?.brand_name || "",
    brand_subline: settings?.brand_subline || "",
    support_email: settings?.support_email || "",
    support_phone: settings?.support_phone || "",
    business_location: settings?.business_location || "",
    support_window: settings?.support_window || "",
    instagram_url: settings?.instagram_url || "",
    facebook_url: settings?.facebook_url || "",
    hero_eyebrow: settings?.hero_eyebrow || "",
    hero_title: settings?.hero_title || "",
    hero_description: settings?.hero_description || "",
    hero_primary_cta_label: settings?.hero_primary_cta_label || "",
    hero_primary_cta_href: settings?.hero_primary_cta_href || "",
    hero_secondary_cta_label: settings?.hero_secondary_cta_label || "",
    hero_secondary_cta_href: settings?.hero_secondary_cta_href || "",
    hero_stats_text: buildHeroStatsText(settings?.hero_stats || []),
    showcase_eyebrow: settings?.showcase_eyebrow || "",
    showcase_title: settings?.showcase_title || "",
    showcase_description: settings?.showcase_description || "",
    showcase_video_url: settings?.showcase_video_url || "",
    showcase_poster_url: settings?.showcase_poster_url || "",
    about_title: settings?.about_title || "",
    about_intro: settings?.about_intro || "",
    about_story: settings?.about_story || "",
    quality_promise: settings?.quality_promise || "",
    customize_title: settings?.customize_title || "",
    customize_description: settings?.customize_description || "",
    contact_title: settings?.contact_title || "",
    contact_description: settings?.contact_description || ""
  };
}

function buildSettingsPayload(form) {
  return {
    id: form.id || undefined,
    brand_name: form.brand_name.trim(),
    brand_subline: form.brand_subline.trim(),
    support_email: form.support_email.trim(),
    support_phone: form.support_phone.trim() || null,
    business_location: form.business_location.trim(),
    support_window: form.support_window.trim() || null,
    instagram_url: form.instagram_url.trim() || null,
    facebook_url: form.facebook_url.trim() || null,
    hero_eyebrow: form.hero_eyebrow.trim(),
    hero_title: form.hero_title.trim(),
    hero_description: form.hero_description.trim(),
    hero_primary_cta_label: form.hero_primary_cta_label.trim(),
    hero_primary_cta_href: form.hero_primary_cta_href.trim(),
    hero_secondary_cta_label: form.hero_secondary_cta_label.trim(),
    hero_secondary_cta_href: form.hero_secondary_cta_href.trim(),
    hero_stats: parseHeroStats(form.hero_stats_text),
    showcase_eyebrow: form.showcase_eyebrow.trim(),
    showcase_title: form.showcase_title.trim(),
    showcase_description: form.showcase_description.trim(),
    showcase_video_url: form.showcase_video_url.trim() || null,
    showcase_poster_url: form.showcase_poster_url.trim() || null,
    about_title: form.about_title.trim(),
    about_intro: form.about_intro.trim(),
    about_story: form.about_story.trim(),
    quality_promise: form.quality_promise.trim(),
    customize_title: form.customize_title.trim(),
    customize_description: form.customize_description.trim(),
    contact_title: form.contact_title.trim(),
    contact_description: form.contact_description.trim()
  };
}

function FormField({ field, value, onChange, context }) {
  const options =
    typeof field.options === "function" ? field.options(context) : field.options || [];
  const fieldClass = `field ${field.fullWidth ? "field-full" : ""} ${
    field.type === "checkbox" ? "field-checkbox" : ""
  }`;

  if (field.type === "checkbox") {
    return (
      <label className={fieldClass}>
        <span>{field.label}</span>
        <div className="admin-checkbox-row">
          <input
            checked={Boolean(value)}
            onChange={(event) => onChange(field.name, event.target.checked)}
            type="checkbox"
          />
          <small>{field.helpText || "Toggle this on to keep the item visible in the storefront."}</small>
        </div>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={fieldClass}>
        <span>{field.label}</span>
        <select
          onChange={(event) => onChange(field.name, event.target.value)}
          required={field.required}
          value={value ?? ""}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.helpText ? <small>{field.helpText}</small> : null}
      </label>
    );
  }

  if (field.type === "textarea" || field.type === "multiline-list") {
    return (
      <label className={fieldClass}>
        <span>{field.label}</span>
        <textarea
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.rows || 4}
          value={value ?? ""}
        />
        {field.helpText ? <small>{field.helpText}</small> : null}
      </label>
    );
  }

  return (
    <label className={fieldClass}>
      <span>{field.label}</span>
      <input
        min={field.min}
        onChange={(event) => onChange(field.name, event.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        step={field.step}
        type={field.type || "text"}
        value={value ?? ""}
      />
      {field.helpText ? <small>{field.helpText}</small> : null}
    </label>
  );
}

function SettingsEditor({ busy, onSave, settings, status }) {
  const [form, setForm] = useState(() => buildSettingsForm(settings));

  useEffect(() => {
    setForm(buildSettingsForm(settings));
  }, [settings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(buildSettingsPayload(form));
  };

  const updateField = (name, nextValue) => {
    setForm((current) => ({
      ...current,
      [name]: nextValue
    }));
  };

  const identityFields = [
    { name: "brand_name", label: "Brand Name", required: true },
    { name: "brand_subline", label: "Brand Subline", required: true },
    { name: "support_email", label: "Support Email", type: "email", required: true },
    { name: "support_phone", label: "Support Phone" },
    { name: "business_location", label: "Business Location", required: true, fullWidth: true },
    { name: "support_window", label: "Support Window", fullWidth: true },
    { name: "instagram_url", label: "Instagram URL", type: "url" },
    { name: "facebook_url", label: "Facebook URL", type: "url" }
  ];

  const heroFields = [
    { name: "hero_eyebrow", label: "Hero Eyebrow", required: true },
    { name: "hero_title", label: "Hero Title", required: true, fullWidth: true },
    {
      name: "hero_description",
      label: "Hero Description",
      type: "textarea",
      required: true,
      rows: 4,
      fullWidth: true
    },
    { name: "hero_primary_cta_label", label: "Primary CTA Label", required: true },
    { name: "hero_primary_cta_href", label: "Primary CTA Link", required: true },
    { name: "hero_secondary_cta_label", label: "Secondary CTA Label", required: true },
    { name: "hero_secondary_cta_href", label: "Secondary CTA Link", required: true },
    {
      name: "hero_stats_text",
      label: "Hero Stats",
      type: "textarea",
      rows: 4,
      fullWidth: true,
      helpText: "Use one line per stat in the format: value | label"
    }
  ];

  const storyFields = [
    { name: "showcase_eyebrow", label: "Showcase Eyebrow", required: true },
    { name: "showcase_title", label: "Showcase Title", required: true, fullWidth: true },
    {
      name: "showcase_description",
      label: "Showcase Description",
      type: "textarea",
      rows: 4,
      required: true,
      fullWidth: true
    },
    { name: "showcase_video_url", label: "Showcase Video URL", type: "url", fullWidth: true },
    { name: "showcase_poster_url", label: "Showcase Poster URL", type: "url", fullWidth: true },
    { name: "about_title", label: "About Title", required: true, fullWidth: true },
    {
      name: "about_intro",
      label: "About Intro",
      type: "textarea",
      rows: 4,
      required: true,
      fullWidth: true
    },
    {
      name: "about_story",
      label: "About Story",
      type: "textarea",
      rows: 5,
      required: true,
      fullWidth: true
    },
    {
      name: "quality_promise",
      label: "Quality Promise",
      type: "textarea",
      rows: 4,
      required: true,
      fullWidth: true
    },
    { name: "customize_title", label: "Customize Title", required: true, fullWidth: true },
    {
      name: "customize_description",
      label: "Customize Description",
      type: "textarea",
      rows: 4,
      required: true,
      fullWidth: true
    },
    { name: "contact_title", label: "Contact Title", required: true, fullWidth: true },
    {
      name: "contact_description",
      label: "Contact Description",
      type: "textarea",
      rows: 4,
      required: true,
      fullWidth: true
    }
  ];

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">Store settings</p>
          <h2>Brand &amp; Homepage Content</h2>
          <p className="section-lead">
            Update the brand story, hero content, about copy, and contact details without editing code.
          </p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          {identityFields.map((field) => (
            <FormField
              context={{}}
              field={field}
              key={field.name}
              onChange={updateField}
              value={form[field.name]}
            />
          ))}
        </div>

        <div className="admin-subsection">
          <h3>Hero Content</h3>
          <div className="admin-form-grid">
            {heroFields.map((field) => (
              <FormField
                context={{}}
                field={field}
                key={field.name}
                onChange={updateField}
                value={form[field.name]}
              />
            ))}
          </div>
        </div>

        <div className="admin-subsection">
          <h3>Story &amp; Support</h3>
          <div className="admin-form-grid">
            {storyFields.map((field) => (
              <FormField
                context={{}}
                field={field}
                key={field.name}
                onChange={updateField}
                value={form[field.name]}
              />
            ))}
          </div>
        </div>

        <div className="admin-form-footer">
          <button className="button button-primary" disabled={busy} type="submit">
            {busy ? "Saving..." : "Save Store Settings"}
          </button>
          {status?.message ? (
            <p className={`admin-status ${status.tone === "error" ? "is-error" : ""}`}>
              {status.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function CrudSection({
  allowDelete = true,
  busy,
  context,
  description,
  emptyLabel,
  fields = [],
  initialValues = {},
  onDelete,
  onSave,
  recordPreview,
  records,
  sectionKey,
  showForm = true,
  status,
  submitLabel,
  title,
  toPayload,
  toFormValues
}) {
  const createBlankForm = () => cloneState(initialValues);
  const [form, setForm] = useState(createBlankForm);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (editingId && !records.some((item) => item.id === editingId)) {
      setEditingId("");
      setForm(createBlankForm());
    }
  }, [editingId, records]);

  const resetForm = () => {
    setEditingId("");
    setForm(createBlankForm());
  };

  const updateField = (name, nextValue) => {
    setForm((current) => ({
      ...current,
      [name]: nextValue
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSave(sectionKey, toPayload(form, editingId, context));

    if (result.ok) {
      resetForm();
    }
  };

  const handleEdit = (record) => {
    if (!showForm) {
      return;
    }

    setEditingId(record.id);
    setForm(toFormValues(record, context));
  };

  const sectionButtonLabel = editingId ? `Save ${title}` : submitLabel;

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">Admin section</p>
          <h2>{title}</h2>
          <p className="section-lead">{description}</p>
        </div>
      </div>

      {showForm ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {fields.map((field) => (
              <FormField
                context={context}
                field={field}
                key={field.name}
                onChange={updateField}
                value={form[field.name]}
              />
            ))}
          </div>

          <div className="admin-form-footer">
            <div className="admin-form-actions">
              <button className="button button-primary" disabled={busy} type="submit">
                {busy ? "Saving..." : sectionButtonLabel}
              </button>
              {editingId ? (
                <button
                  className="button button-secondary"
                  disabled={busy}
                  onClick={resetForm}
                  type="button"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>

            {status?.message ? (
              <p className={`admin-status ${status.tone === "error" ? "is-error" : ""}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </form>
      ) : status?.message ? (
        <p className={`admin-status ${status.tone === "error" ? "is-error" : ""}`}>
          {status.message}
        </p>
      ) : null}

      <div className="admin-record-list">
        {records.length ? (
          records.map((record) => {
            const preview = recordPreview(record, context);

            return (
              <article className="admin-record-card" key={record.id}>
                <div className="admin-record-copy">
                  <strong>{preview.title}</strong>
                  {preview.lines.map((line, index) => (
                    <p key={`${record.id}-${index}`}>{line}</p>
                  ))}
                </div>

                <div className="admin-record-actions">
                  {showForm ? (
                    <button
                      className="button button-secondary"
                      disabled={busy}
                      onClick={() => handleEdit(record)}
                      type="button"
                    >
                      Edit
                    </button>
                  ) : null}

                  {allowDelete ? (
                    <button
                      className="button button-danger"
                      disabled={busy}
                      onClick={() => onDelete(sectionKey, record)}
                      type="button"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className="admin-empty">{emptyLabel}</div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="admin-stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function buildTrackingForm(order) {
  return {
    id: order?.id || "",
    shiprocket_channel_order_id: order?.shiprocket_channel_order_id || "",
    shiprocket_order_id: order?.shiprocket_order_id || "",
    shiprocket_shipment_id: order?.shiprocket_shipment_id || "",
    shiprocket_awb_code: order?.shiprocket_awb_code || "",
    shiprocket_courier_name: order?.shiprocket_courier_name || "",
    shiprocket_tracking_url: order?.shiprocket_tracking_url || "",
    shipping_status: order?.shipping_status || ""
  };
}

function ShippingOrdersSection({
  busy,
  onDelete,
  onRefresh,
  onSave,
  orders,
  status
}) {
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(() => buildTrackingForm(null));

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const nextOrder = orders.find((item) => item.id === editingId);

    if (!nextOrder) {
      setEditingId("");
      setForm(buildTrackingForm(null));
    }
  }, [editingId, orders]);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setForm(buildTrackingForm(order));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(buildTrackingForm(null));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    const result = await onSave({
      id: editingId,
      shiprocket_channel_order_id: form.shiprocket_channel_order_id.trim() || null,
      shiprocket_order_id: form.shiprocket_order_id.trim() || null,
      shiprocket_shipment_id: form.shiprocket_shipment_id.trim() || null,
      shiprocket_awb_code: form.shiprocket_awb_code.trim() || null,
      shiprocket_courier_name: form.shiprocket_courier_name.trim() || null,
      shiprocket_tracking_url: form.shiprocket_tracking_url.trim() || null,
      shipping_status: form.shipping_status.trim() || null
    });

    if (result.ok) {
      resetForm();
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">Shipping &amp; tracking</p>
          <h2>Shiprocket Orders</h2>
          <p className="section-lead">
            Store the AWB or Shiprocket order reference, refresh live tracking, and view the latest shipment progress.
          </p>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label className="field field-full">
            <span>Editing Order</span>
            <input
              disabled
              type="text"
              value={
                editingId
                  ? orders.find((item) => item.id === editingId)?.order_number || "Selected order"
                  : "Choose an order below to edit tracking details"
              }
            />
          </label>
          <label className="field">
            <span>Source Order ID</span>
            <input
              onChange={(event) => updateField("shiprocket_channel_order_id", event.target.value)}
              placeholder="Your Shiprocket source order id"
              type="text"
              value={form.shiprocket_channel_order_id}
            />
          </label>
          <label className="field">
            <span>Shiprocket Order ID</span>
            <input
              onChange={(event) => updateField("shiprocket_order_id", event.target.value)}
              placeholder="Shiprocket order id"
              type="text"
              value={form.shiprocket_order_id}
            />
          </label>
          <label className="field">
            <span>Shipment ID</span>
            <input
              onChange={(event) => updateField("shiprocket_shipment_id", event.target.value)}
              placeholder="Shiprocket shipment id"
              type="text"
              value={form.shiprocket_shipment_id}
            />
          </label>
          <label className="field">
            <span>AWB Code</span>
            <input
              onChange={(event) => updateField("shiprocket_awb_code", event.target.value)}
              placeholder="Courier AWB code"
              type="text"
              value={form.shiprocket_awb_code}
            />
          </label>
          <label className="field">
            <span>Courier Name</span>
            <input
              onChange={(event) => updateField("shiprocket_courier_name", event.target.value)}
              placeholder="Delhivery, XpressBees, etc."
              type="text"
              value={form.shiprocket_courier_name}
            />
          </label>
          <label className="field">
            <span>Shipping Status</span>
            <input
              onChange={(event) => updateField("shipping_status", event.target.value)}
              placeholder="In Transit"
              type="text"
              value={form.shipping_status}
            />
          </label>
          <label className="field field-full">
            <span>Tracking URL</span>
            <input
              onChange={(event) => updateField("shiprocket_tracking_url", event.target.value)}
              placeholder="Optional courier tracking link"
              type="url"
              value={form.shiprocket_tracking_url}
            />
          </label>
        </div>

        <div className="admin-form-footer">
          <div className="admin-form-actions">
            <button className="button button-primary" disabled={busy || !editingId} type="submit">
              {busy ? "Saving..." : "Save Tracking Fields"}
            </button>
            <button
              className="button button-secondary"
              disabled={busy || !editingId}
              onClick={() => onRefresh(editingId)}
              type="button"
            >
              Refresh From Shiprocket
            </button>
            {editingId ? (
              <button className="button button-secondary" disabled={busy} onClick={resetForm} type="button">
                Cancel Edit
              </button>
            ) : null}
          </div>
          {status?.message ? (
            <p className={`admin-status ${status.tone === "error" ? "is-error" : ""}`}>{status.message}</p>
          ) : null}
        </div>
      </form>

      <div className="admin-record-list">
        {orders.length ? (
          orders.map((order) => (
            <article className="admin-record-card" key={order.id}>
              <div className="admin-record-copy">
                <strong>{order.order_number} | {formatPrice(order.amount_inr)}</strong>
                <p>{order.customer_name} | {order.customer_email}</p>
                <p>Payment: {order.status} | Shipping: {order.shipping_status || "Awaiting shipment"}</p>
                <p>{order.shiprocket_awb_code || order.shiprocket_order_id || "No Shiprocket reference yet"}</p>
                <p>{order.shiprocket_last_event || `Created ${formatDateTime(order.created_at)}`}</p>
              </div>

              <div className="admin-record-actions">
                <button
                  className="button button-secondary"
                  disabled={busy}
                  onClick={() => handleEdit(order)}
                  type="button"
                >
                  Edit Tracking
                </button>
                <button
                  className="button button-secondary"
                  disabled={busy}
                  onClick={() => onRefresh(order.id)}
                  type="button"
                >
                  Refresh Live
                </button>
                <button
                  className="button button-danger"
                  disabled={busy}
                  onClick={() => onDelete(order)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty">No payment orders yet.</div>
        )}
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardState, setDashboardState] = useState(() => ({
    status: hasSupabaseConfig ? "loading" : "config",
    data: createEmptyDashboard(),
    error: ""
  }));
  const [busySection, setBusySection] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sectionMessages, setSectionMessages] = useState({});

  useEffect(() => {
    document.title = "Admin | Trendy Spice Store";
  }, []);

  const refreshDashboard = async ({ quiet = false } = {}) => {
    if (!hasSupabaseConfig) {
      return {
        ok: false,
        message: "Add your Supabase URL and anon key to use the admin workspace."
      };
    }

    if (!quiet) {
      setRefreshing(true);
    }

    const result = await loadAdminDashboard();
    setDashboardState({
      status: result.ok ? "ready" : "error",
      data: result.data || createEmptyDashboard(),
      error: result.ok ? "" : result.message
    });

    if (!quiet) {
      setRefreshing(false);
    }

    return result;
  };

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    refreshDashboard();
  }, []);

  const setSectionStatus = (sectionKey, tone, message) => {
    setSectionMessages((current) => ({
      ...current,
      [sectionKey]: {
        tone,
        message
      }
    }));
  };

  const handleSave = async (sectionKey, table, payload, options = {}) => {
    setBusySection(sectionKey);
    const result = await saveAdminRecord(table, payload, options);
    setSectionStatus(sectionKey, result.ok ? "success" : "error", result.message);

    if (result.ok) {
      await refreshDashboard({ quiet: true });
    }

    setBusySection("");
    return result;
  };

  const handleDelete = async (sectionKey, record, table, options = {}) => {
    const label =
      record.name ||
      record.title ||
      record.message ||
      record.email ||
      record.slug ||
      "this record";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return {
        ok: false,
        cancelled: true
      };
    }

    setBusySection(sectionKey);
    const result = await deleteAdminRecord(table, record, options);
    setSectionStatus(sectionKey, result.ok ? "success" : "error", result.message);

    if (result.ok) {
      await refreshDashboard({ quiet: true });
    }

    setBusySection("");
    return result;
  };

  const handleRefreshTracking = async (orderId) => {
    setBusySection("orders");
    const result = await refreshShiprocketTracking(orderId);
    setSectionStatus("orders", result.ok ? "success" : "error", result.message);

    if (result.ok) {
      await refreshDashboard({ quiet: true });
    }

    setBusySection("");
    return result;
  };

  const dashboard = dashboardState.data;
  const categoriesById = dashboard.categories.reduce((accumulator, category) => {
    accumulator[category.id] = category;
    return accumulator;
  }, {});
  const productsById = dashboard.products.reduce((accumulator, product) => {
    accumulator[product.id] = product;
    return accumulator;
  }, {});

  const categoryOptions = dashboard.categories.map((category) => ({
    value: category.id,
    label: category.name
  }));
  const productOptions = dashboard.products.map((product) => ({
    value: product.id,
    label: product.name
  }));

  const sharedContext = {
    categoriesById,
    productsById,
    categoryOptions,
    productOptions
  };

  const stats = [
    { label: "Catalog Products", value: dashboard.products.length },
    { label: "Categories", value: dashboard.categories.length },
    { label: "Orders", value: dashboard.customerOrders.length },
    { label: "Newsletter Leads", value: dashboard.newsletterSignups.length },
    { label: "Contact Messages", value: dashboard.contactMessages.length },
    { label: "Custom Requests", value: dashboard.customOrderRequests.length },
    {
      label: "Featured Reviews",
      value: dashboard.reviews.filter((review) => review.is_featured_home).length
    }
  ];

  if (!hasSupabaseConfig) {
    return (
      <div className="admin-shell">
        <div className="admin-page">
          <section className="admin-hero">
            <div className="admin-hero-copy">
              <p className="eyebrow">Admin workspace</p>
              <h1>Connect Supabase to manage the storefront.</h1>
              <p className="section-lead">
                Add your project URL and anon key in the local environment file, then reopen this page to manage
                homepage copy, products, and form responses in one place.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" to="/">
                  View storefront
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const announcementsSection = (
    <CrudSection
      busy={busySection === "announcements"}
      context={sharedContext}
      description="Control the scrolling top-bar messages and their order."
      emptyLabel="No announcements yet."
      fields={[
        { name: "message", label: "Announcement Message", required: true, fullWidth: true },
        { name: "display_order", label: "Display Order", type: "number", min: 0 },
        {
          name: "is_active",
          label: "Visible on Storefront",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{ id: "", message: "", display_order: "0", is_active: true }}
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "announcements")}
      onSave={(sectionKey, payload) => handleSave(sectionKey, "announcements", payload)}
      recordPreview={(record) => ({
        title: record.message,
        lines: [
          `Order: ${record.display_order}`,
          record.is_active ? "Visible on the storefront" : "Hidden from the storefront"
        ]
      })}
      records={dashboard.announcements}
      sectionKey="announcements"
      status={sectionMessages.announcements}
      submitLabel="Add Announcement"
      title="Announcement Bar"
      toFormValues={(record) => ({
        id: record.id,
        message: record.message,
        display_order: String(record.display_order ?? 0),
        is_active: Boolean(record.is_active)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        message: form.message.trim(),
        display_order: parseOptionalNumber(form.display_order) ?? 0,
        is_active: Boolean(form.is_active)
      })}
    />
  );

  const trustBadgesSection = (
    <CrudSection
      busy={busySection === "trust-badges"}
      context={sharedContext}
      description="Manage the trust badges shown around reviews and conversion sections."
      emptyLabel="No trust badges yet."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "icon_name", label: "Icon", type: "select", options: trustIconOptions, required: true },
        {
          name: "detail",
          label: "Detail",
          type: "textarea",
          rows: 3,
          required: true,
          fullWidth: true
        },
        { name: "display_order", label: "Display Order", type: "number", min: 0 },
        {
          name: "is_active",
          label: "Visible on Storefront",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{
        id: "",
        title: "",
        icon_name: "shield",
        detail: "",
        display_order: "0",
        is_active: true
      }}
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "trust_badges")}
      onSave={(sectionKey, payload) => handleSave(sectionKey, "trust_badges", payload)}
      recordPreview={(record) => ({
        title: record.title,
        lines: [
          record.detail,
          `Icon: ${record.icon_name}`,
          record.is_active ? "Visible on the storefront" : "Hidden from the storefront"
        ]
      })}
      records={dashboard.trustBadges}
      sectionKey="trust-badges"
      status={sectionMessages["trust-badges"]}
      submitLabel="Add Trust Badge"
      title="Trust Badges"
      toFormValues={(record) => ({
        id: record.id,
        title: record.title,
        icon_name: record.icon_name,
        detail: record.detail,
        display_order: String(record.display_order ?? 0),
        is_active: Boolean(record.is_active)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        title: form.title.trim(),
        icon_name: form.icon_name || "shield",
        detail: form.detail.trim(),
        display_order: parseOptionalNumber(form.display_order) ?? 0,
        is_active: Boolean(form.is_active)
      })}
    />
  );

  const categoriesSection = (
    <CrudSection
      busy={busySection === "categories"}
      context={sharedContext}
      description="Add and arrange the category chips used across the collection."
      emptyLabel="No categories yet."
      fields={[
        { name: "name", label: "Category Name", required: true },
        {
          name: "slug",
          label: "Slug",
          placeholder: "Auto-generated from the category name"
        },
        { name: "short_label", label: "Short Label", required: true },
        { name: "accent_color", label: "Accent Color", type: "color", required: true },
        { name: "tint_color", label: "Tint Color", type: "color", required: true },
        { name: "display_order", label: "Display Order", type: "number", min: 0 },
        {
          name: "is_active",
          label: "Visible on Storefront",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{
        id: "",
        name: "",
        slug: "",
        short_label: "",
        accent_color: "#b86071",
        tint_color: "#f4e7dd",
        display_order: "0",
        is_active: true
      }}
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "categories")}
      onSave={(sectionKey, payload) => handleSave(sectionKey, "categories", payload)}
      recordPreview={(record) => ({
        title: record.name,
        lines: [
          `Slug: ${record.slug}`,
          `Short label: ${record.short_label}`,
          `Colors: ${record.accent_color} / ${record.tint_color}`
        ]
      })}
      records={dashboard.categories}
      sectionKey="categories"
      status={sectionMessages.categories}
      submitLabel="Add Category"
      title="Categories"
      toFormValues={(record) => ({
        id: record.id,
        name: record.name,
        slug: record.slug,
        short_label: record.short_label,
        accent_color: record.accent_color,
        tint_color: record.tint_color,
        display_order: String(record.display_order ?? 0),
        is_active: Boolean(record.is_active)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        name: form.name.trim(),
        slug: slugifyText(form.slug || form.name),
        short_label: form.short_label.trim(),
        accent_color: form.accent_color || "#b86071",
        tint_color: form.tint_color || "#f4e7dd",
        display_order: parseOptionalNumber(form.display_order) ?? 0,
        is_active: Boolean(form.is_active)
      })}
    />
  );

  const productsSection = (
    <CrudSection
      busy={busySection === "products"}
      context={sharedContext}
      description="Manage product cards, pricing, order, and the details shown on each product page."
      emptyLabel="No products yet."
      fields={[
        {
          name: "category_id",
          label: "Category",
          type: "select",
          options: ({ categoryOptions: options }) => options,
          required: true
        },
        { name: "name", label: "Product Name", required: true, fullWidth: true },
        {
          name: "slug",
          label: "Slug",
          placeholder: "Auto-generated from the product name"
        },
        { name: "badge_text", label: "Badge Text", placeholder: "Handmade" },
        {
          name: "price_inr",
          label: "Price (INR)",
          type: "number",
          min: 0,
          step: "0.01",
          required: true
        },
        { name: "rating", label: "Star Rating", type: "number", min: 0, step: "0.1" },
        { name: "review_count", label: "Review Count", type: "number", min: 0 },
        { name: "display_order", label: "Display Order", type: "number", min: 0 },
        { name: "featured_rank", label: "Featured Rank", type: "number", min: 0 },
        { name: "tagline", label: "Tagline", fullWidth: true },
        {
          name: "review_snippet",
          label: "Review Snippet",
          type: "textarea",
          rows: 3,
          fullWidth: true
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 4,
          fullWidth: true
        },
        {
          name: "highlights_text",
          label: "Highlights",
          type: "textarea",
          rows: 5,
          fullWidth: true,
          helpText: "Use one line per highlight point."
        },
        {
          name: "is_featured_home",
          label: "Show in Featured Collection",
          type: "checkbox",
          fullWidth: true
        },
        {
          name: "is_active",
          label: "Visible on Storefront",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{
        id: "",
        category_id: "",
        name: "",
        slug: "",
        badge_text: "",
        price_inr: "",
        rating: "4.9",
        review_count: "0",
        display_order: "0",
        featured_rank: "",
        tagline: "",
        review_snippet: "",
        description: "",
        highlights_text: "",
        is_featured_home: false,
        is_active: true
      }}
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "products")}
      onSave={(sectionKey, payload) => handleSave(sectionKey, "products", payload)}
      recordPreview={(record, context) => ({
        title: record.name,
        lines: [
          `${formatPrice(record.price_inr)} in ${context.categoriesById[record.category_id]?.name || "Unassigned"}`,
          `Rating ${record.rating} from ${record.review_count} reviews`,
          record.is_featured_home ? "Featured on the homepage" : "Not featured on the homepage"
        ]
      })}
      records={dashboard.products}
      sectionKey="products"
      status={sectionMessages.products}
      submitLabel="Add Product"
      title="Products"
      toFormValues={(record) => ({
        id: record.id,
        category_id: record.category_id,
        name: record.name,
        slug: record.slug,
        badge_text: record.badge_text || "",
        price_inr: String(record.price_inr ?? ""),
        rating: String(record.rating ?? 0),
        review_count: String(record.review_count ?? 0),
        display_order: String(record.display_order ?? 0),
        featured_rank: record.featured_rank === null ? "" : String(record.featured_rank),
        tagline: record.tagline || "",
        review_snippet: record.review_snippet || "",
        description: record.description || "",
        highlights_text: Array.isArray(record.highlights) ? record.highlights.join("\n") : "",
        is_featured_home: Boolean(record.is_featured_home),
        is_active: Boolean(record.is_active)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        category_id: form.category_id,
        name: form.name.trim(),
        slug: slugifyText(form.slug || form.name),
        badge_text: form.badge_text.trim() || null,
        price_inr: parseOptionalNumber(form.price_inr) ?? 0,
        rating: parseOptionalNumber(form.rating) ?? 0,
        review_count: parseOptionalNumber(form.review_count) ?? 0,
        display_order: parseOptionalNumber(form.display_order) ?? 0,
        featured_rank: parseOptionalNumber(form.featured_rank),
        tagline: form.tagline.trim() || null,
        review_snippet: form.review_snippet.trim() || null,
        description: form.description.trim() || null,
        highlights: parseListField(form.highlights_text),
        is_featured_home: Boolean(form.is_featured_home),
        is_active: Boolean(form.is_active)
      })}
    />
  );

  const mediaSection = (
    <CrudSection
      busy={busySection === "product-media"}
      context={sharedContext}
      description="Attach images or videos to products. Use either a public URL or a Supabase storage path."
      emptyLabel="No product media yet."
      fields={[
        {
          name: "product_id",
          label: "Product",
          type: "select",
          options: ({ productOptions: options }) => options,
          required: true
        },
        {
          name: "media_kind",
          label: "Media Type",
          type: "select",
          options: [
            { value: "image", label: "Image" },
            { value: "video", label: "Video" }
          ],
          required: true
        },
        { name: "bucket_name", label: "Bucket Name", placeholder: "product-media" },
        { name: "sort_order", label: "Sort Order", type: "number", min: 0 },
        { name: "public_url", label: "Public URL", type: "url", fullWidth: true },
        {
          name: "storage_path",
          label: "Storage Path",
          fullWidth: true,
          helpText: "If you use Supabase Storage, add the path inside the selected bucket."
        },
        { name: "alt_text", label: "Alt Text", fullWidth: true },
        {
          name: "is_primary",
          label: "Primary Product Media",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{
        id: "",
        product_id: "",
        media_kind: "image",
        bucket_name: "product-media",
        sort_order: "0",
        public_url: "",
        storage_path: "",
        alt_text: "",
        is_primary: false
      }}
      onDelete={(sectionKey, record) =>
        handleDelete(sectionKey, record, "product_media", {
          storageCleanup: {
            bucket: record.bucket_name || "product-media",
            pathField: "storage_path"
          }
        })
      }
      onSave={(sectionKey, payload) => handleSave(sectionKey, "product_media", payload)}
      recordPreview={(record, context) => ({
        title: context.productsById[record.product_id]?.name || "Unknown product",
        lines: [
          `Type: ${record.media_kind}`,
          record.public_url || record.storage_path || "No media source added yet",
          record.is_primary ? "Primary media item" : "Secondary media item"
        ]
      })}
      records={dashboard.productMedia}
      sectionKey="product-media"
      status={sectionMessages["product-media"]}
      submitLabel="Add Product Media"
      title="Product Media"
      toFormValues={(record) => ({
        id: record.id,
        product_id: record.product_id,
        media_kind: record.media_kind || "image",
        bucket_name: record.bucket_name || "product-media",
        sort_order: String(record.sort_order ?? 0),
        public_url: record.public_url || "",
        storage_path: record.storage_path || "",
        alt_text: record.alt_text || "",
        is_primary: Boolean(record.is_primary)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        product_id: form.product_id,
        media_kind: form.media_kind || "image",
        bucket_name: form.bucket_name.trim() || "product-media",
        sort_order: parseOptionalNumber(form.sort_order) ?? 0,
        public_url: form.public_url.trim() || null,
        storage_path: form.storage_path.trim() || null,
        alt_text: form.alt_text.trim() || null,
        is_primary: Boolean(form.is_primary)
      })}
    />
  );

  const reviewsSection = (
    <CrudSection
      busy={busySection === "reviews"}
      context={sharedContext}
      description="Add product reviews and homepage testimonials. Update product rating and review count when needed."
      emptyLabel="No reviews yet."
      fields={[
        {
          name: "product_id",
          label: "Related Product",
          type: "select",
          options: ({ productOptions: options }) => options
        },
        { name: "reviewer_name", label: "Reviewer Name", required: true },
        {
          name: "rating",
          label: "Rating",
          type: "number",
          step: "0.1",
          min: 0,
          required: true
        },
        { name: "display_order", label: "Display Order", type: "number", min: 0 },
        { name: "headline", label: "Headline", required: true, fullWidth: true },
        {
          name: "body",
          label: "Review Body",
          type: "textarea",
          rows: 4,
          required: true,
          fullWidth: true
        },
        {
          name: "is_featured_home",
          label: "Feature on Homepage",
          type: "checkbox",
          fullWidth: true
        }
      ]}
      initialValues={{
        id: "",
        product_id: "",
        reviewer_name: "",
        rating: "5",
        display_order: "0",
        headline: "",
        body: "",
        is_featured_home: false
      }}
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "reviews")}
      onSave={(sectionKey, payload) => handleSave(sectionKey, "reviews", payload)}
      recordPreview={(record, context) => ({
        title: `${record.reviewer_name} • ${record.rating} stars`,
        lines: [
          record.headline,
          context.productsById[record.product_id]?.name || "Homepage testimonial",
          record.is_featured_home ? "Featured on the homepage" : "Stored only on the product side"
        ]
      })}
      records={dashboard.reviews}
      sectionKey="reviews"
      status={sectionMessages.reviews}
      submitLabel="Add Review"
      title="Reviews"
      toFormValues={(record) => ({
        id: record.id,
        product_id: record.product_id || "",
        reviewer_name: record.reviewer_name,
        rating: String(record.rating ?? 0),
        display_order: String(record.display_order ?? 0),
        headline: record.headline,
        body: record.body,
        is_featured_home: Boolean(record.is_featured_home)
      })}
      toPayload={(form, editingId) => ({
        id: editingId || undefined,
        product_id: form.product_id || null,
        reviewer_name: form.reviewer_name.trim(),
        rating: parseOptionalNumber(form.rating) ?? 5,
        display_order: parseOptionalNumber(form.display_order) ?? 0,
        headline: form.headline.trim(),
        body: form.body.trim(),
        is_featured_home: Boolean(form.is_featured_home)
      })}
    />
  );

  const ordersSection = (
    <CrudSection
      allowDelete
      busy={busySection === "orders"}
      context={sharedContext}
      description="View Razorpay checkout orders stored in Supabase while the project is in development."
      emptyLabel="No payment orders yet."
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "customer_orders")}
      onSave={() => Promise.resolve({ ok: false })}
      recordPreview={(record) => ({
        title: `${record.order_number} • ${formatPrice(record.amount_inr)}`,
        lines: [
          `${record.customer_name} • ${record.customer_email}`,
          `Status: ${record.status}`,
          record.razorpay_payment_id || record.razorpay_order_id || "Waiting for payment ids",
          `Created ${formatDateTime(record.created_at)}`
        ]
      })}
      records={dashboard.customerOrders}
      sectionKey="orders"
      showForm={false}
      status={sectionMessages.orders}
      submitLabel="Add Order"
      title="Payment Orders"
      toFormValues={() => ({})}
      toPayload={() => ({})}
    />
  );

  const shippingOrdersSection = (
    <ShippingOrdersSection
      busy={busySection === "orders"}
      onDelete={(record) => handleDelete("orders", record, "customer_orders")}
      onRefresh={handleRefreshTracking}
      onSave={(payload) => handleSave("orders", "customer_orders", payload)}
      orders={dashboard.customerOrders}
      status={sectionMessages.orders}
    />
  );

  const newsletterSection = (
    <CrudSection
      allowDelete
      busy={busySection === "newsletter"}
      context={sharedContext}
      description="Review newsletter leads captured from the storefront footer."
      emptyLabel="No newsletter leads yet."
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "newsletter_signups")}
      onSave={() => Promise.resolve({ ok: false })}
      recordPreview={(record) => ({
        title: record.email,
        lines: [`Submitted ${formatDateTime(record.created_at)}`]
      })}
      records={dashboard.newsletterSignups}
      sectionKey="newsletter"
      showForm={false}
      status={sectionMessages.newsletter}
      submitLabel="Add Lead"
      title="Newsletter Signups"
      toFormValues={() => ({})}
      toPayload={() => ({})}
    />
  );

  const contactSection = (
    <CrudSection
      allowDelete
      busy={busySection === "contact"}
      context={sharedContext}
      description="Read customer questions and clear them out once they are handled."
      emptyLabel="No contact messages yet."
      onDelete={(sectionKey, record) => handleDelete(sectionKey, record, "contact_messages")}
      onSave={() => Promise.resolve({ ok: false })}
      recordPreview={(record) => ({
        title: `${record.name} • ${record.email}`,
        lines: [record.phone || "No phone number shared", record.message, `Sent ${formatDateTime(record.created_at)}`]
      })}
      records={dashboard.contactMessages}
      sectionKey="contact"
      showForm={false}
      status={sectionMessages.contact}
      submitLabel="Add Message"
      title="Contact Messages"
      toFormValues={() => ({})}
      toPayload={() => ({})}
    />
  );

  const customOrdersSection = (
    <CrudSection
      allowDelete
      busy={busySection === "custom-orders"}
      context={sharedContext}
      description="Track custom order submissions and remove development requests when they are no longer needed."
      emptyLabel="No custom requests yet."
      onDelete={(sectionKey, record) =>
        handleDelete(sectionKey, record, "custom_order_requests", {
          storageCleanup: {
            bucket: "request-media",
            pathField: "reference_storage_path"
          }
        })
      }
      onSave={() => Promise.resolve({ ok: false })}
      recordPreview={(record) => ({
        title: `${record.name} • ${record.product_type}`,
        lines: [
          record.email,
          record.customization_details,
          record.reference_storage_path || "No reference image uploaded",
          `Sent ${formatDateTime(record.created_at)}`
        ]
      })}
      records={dashboard.customOrderRequests}
      sectionKey="custom-orders"
      showForm={false}
      status={sectionMessages["custom-orders"]}
      submitLabel="Add Request"
      title="Custom Order Requests"
      toFormValues={() => ({})}
      toPayload={() => ({})}
    />
  );

  return (
    <div className="admin-shell">
      <div className="admin-page">
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <p className="eyebrow">Admin workspace</p>
            <h1>Run the storefront without editing code.</h1>
            <p className="section-lead">
              Update homepage content, manage products, review customer submissions, and remove development data
              directly in Supabase from this dashboard.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                disabled={refreshing || dashboardState.status === "loading"}
                onClick={() => refreshDashboard()}
                type="button"
              >
                {refreshing || dashboardState.status === "loading" ? "Refreshing..." : "Refresh Data"}
              </button>
              <Link className="button button-secondary" to="/">
                Open Storefront
              </Link>
            </div>
          </div>

          <div className="admin-overview-grid">
            {stats.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        <div className="admin-note">
          Run the development-only SQL file in Supabase before using this page for edits. It opens broad browser CRUD
          access so this workspace can manage data and form submissions directly while the project is still in
          development.
        </div>

        {dashboardState.error ? (
          <div className="admin-banner admin-banner-error">{dashboardState.error}</div>
        ) : null}

        <div aria-label="Admin sections" className="admin-tab-row" role="tablist">
          {adminTabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={`admin-tab ${activeTab === tab.id ? "is-active" : ""}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {dashboardState.status === "loading" ? (
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">Loading</p>
                <h2>Fetching admin data</h2>
                <p className="section-lead">Pulling the latest content and customer submissions from Supabase.</p>
              </div>
            </div>
          </section>
        ) : (
          <div className="admin-tab-stack">
            {activeTab === "overview" ? (
              <>
                <section className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <p className="eyebrow">Quick summary</p>
                      <h2>At-a-glance storefront health</h2>
                      <p className="section-lead">
                        Keep an eye on incoming customer interest and the amount of content currently live in the shop.
                      </p>
                    </div>
                  </div>
                  <div className="admin-overview-grid">
                    {stats.map((item) => (
                      <StatCard key={`overview-${item.label}`} label={item.label} value={item.value} />
                    ))}
                  </div>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <p className="eyebrow">What this admin covers</p>
                      <h2>Content, catalog, and customer inbox</h2>
                      <p className="section-lead">
                        Use the tabs above to update homepage text, add or delete product content, and review every form
                        submission that comes in from the live storefront.
                      </p>
                    </div>
                  </div>
                  <div className="admin-record-list">
                    <article className="admin-record-card">
                      <div className="admin-record-copy">
                        <strong>Brand &amp; Home</strong>
                        <p>Edit the hero, brand story, contact details, announcements, and trust badges.</p>
                      </div>
                    </article>
                    <article className="admin-record-card">
                      <div className="admin-record-copy">
                        <strong>Catalog</strong>
                        <p>Add categories, products, media, and reviews without changing source files.</p>
                      </div>
                    </article>
                    <article className="admin-record-card">
                      <div className="admin-record-copy">
                        <strong>Inbox</strong>
                        <p>Read newsletter, contact, and custom order submissions directly from the backend tables.</p>
                      </div>
                    </article>
                  </div>
                </section>
              </>
            ) : null}

            {activeTab === "brand" ? (
              <>
                <SettingsEditor
                  busy={busySection === "settings"}
                  onSave={(payload) => handleSave("settings", "store_settings", payload)}
                  settings={dashboard.settings}
                  status={sectionMessages.settings}
                />
                {announcementsSection}
                {trustBadgesSection}
              </>
            ) : null}

            {activeTab === "catalog" ? (
              <>
                {categoriesSection}
                {productsSection}
                {mediaSection}
                {reviewsSection}
              </>
            ) : null}

            {activeTab === "inbox" ? (
              <>
                {shippingOrdersSection}
                {newsletterSection}
                {contactSection}
                {customOrdersSection}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
