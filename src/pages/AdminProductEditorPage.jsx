import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icons.jsx";
import Input from "../components/Input.jsx";
import { loadAdminDashboard, saveAdminRecord } from "../lib/adminApi.js";
import { hasSupabaseConfig, supabase } from "../lib/supabase.js";

function slugifyText(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createInitialForm() {
  return {
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    stock: "",
    imagePath: "",
    imageUrl: "",
    mediaId: ""
  };
}

function resolveMediaPreview(mediaItem) {
  if (!mediaItem || !supabase) {
    return "";
  }

  if (mediaItem.public_url) {
    return mediaItem.public_url;
  }

  if (!mediaItem.bucket_name || !mediaItem.storage_path) {
    return "";
  }

  const { data } = supabase.storage.from(mediaItem.bucket_name).getPublicUrl(mediaItem.storage_path);
  return data.publicUrl;
}

async function uploadProductImage(file) {
  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured."
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = slugifyText(file.name.replace(/\.[^/.]+$/, "")) || "product-image";
  const storagePath = `products/${Date.now()}-${fileName}.${extension}`;

  const { error } = await supabase.storage.from("product-media").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "We could not upload the image."
    };
  }

  const { data } = supabase.storage.from("product-media").getPublicUrl(storagePath);

  return {
    ok: true,
    storagePath,
    publicUrl: data.publicUrl
  };
}

export default function AdminProductEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit") || "";
  const [dashboardState, setDashboardState] = useState({
    status: "loading",
    data: null,
    error: ""
  });
  const [form, setForm] = useState(createInitialForm);
  const [uploadState, setUploadState] = useState({
    busy: false,
    message: "",
    tone: ""
  });
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");
  const [saveState, setSaveState] = useState({
    busy: false,
    message: "",
    tone: ""
  });

  useEffect(() => {
    document.title = `${editId ? "Edit Product" : "New Product"} | Trendy Spice Store`;
  }, [editId]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  useEffect(() => {
    async function loadDashboard() {
      const result = await loadAdminDashboard();

      if (!result.ok || !result.data) {
        setDashboardState({
          status: "error",
          data: null,
          error: result.message
        });
        return;
      }

      const mediaByProductId = result.data.productMedia.reduce((accumulator, item) => {
        if (!accumulator[item.product_id] || item.is_primary) {
          accumulator[item.product_id] = item;
        }

        return accumulator;
      }, {});

      const editingProduct = result.data.products.find((item) => item.id === editId);
      const editingMedia = editingProduct ? mediaByProductId[editingProduct.id] : null;

      setDashboardState({
        status: "ready",
        data: result.data,
        error: ""
      });

      if (editingProduct) {
        setForm({
          title: editingProduct.name || "",
          description: editingProduct.description || "",
          price: editingProduct.price_inr === null || editingProduct.price_inr === undefined ? "" : String(editingProduct.price_inr),
          discountPrice: editingProduct.discount_price === null || editingProduct.discount_price === undefined ? "" : String(editingProduct.discount_price),
          categoryId: editingProduct.category_id || "",
          stock:
            editingProduct.stock_quantity === null || editingProduct.stock_quantity === undefined
              ? ""
              : String(editingProduct.stock_quantity),
          imagePath: editingMedia?.storage_path || "",
          imageUrl: resolveMediaPreview(editingMedia),
          mediaId: editingMedia?.id || ""
        });
      }
    }

    loadDashboard();
  }, [editId]);

  const categories = dashboardState.data?.categories || [];
  const products = dashboardState.data?.products || [];
  const nextDisplayOrder = useMemo(() => {
    if (!products.length) {
      return 1;
    }

    return Math.max(...products.map((item) => Number(item.display_order || 0))) + 1;
  }, [products]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPreviewObjectUrl(objectUrl);
    setForm((current) => ({
      ...current,
      imageUrl: objectUrl
    }));
    setUploadState({
      busy: false,
      message: "Image selected. It will upload when you save the product.",
      tone: "success"
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.imagePath && !pendingImageFile) {
      setSaveState({
        busy: false,
        message: "Upload a product image before saving.",
        tone: "error"
      });
      return;
    }

    setSaveState({
      busy: true,
      message: "",
      tone: ""
    });

    const previousImagePath = form.imagePath;
    let nextImagePath = form.imagePath;
    let uploadedImage = null;

    if (pendingImageFile) {
      setUploadState({
        busy: true,
        message: "Uploading image...",
        tone: ""
      });

      const uploadResult = await uploadProductImage(pendingImageFile);

      if (!uploadResult.ok) {
        setUploadState({
          busy: false,
          message: uploadResult.message,
          tone: "error"
        });
        setSaveState({
          busy: false,
          message: "We could not upload the product image.",
          tone: "error"
        });
        return;
      }

      uploadedImage = uploadResult;
      nextImagePath = uploadResult.storagePath;
      setUploadState({
        busy: false,
        message: "Image uploaded.",
        tone: "success"
      });
    }

    const productPayload = {
      id: editId || undefined,
      category_id: form.categoryId,
      name: form.title.trim(),
      slug: slugifyText(form.title),
      description: form.description.trim(),
      price_inr: Number(form.price),
      discount_price: form.discountPrice ? Number(form.discountPrice) : null,
      stock_quantity: Number(form.stock || 0),
      badge_text:
        categories.find((category) => category.id === form.categoryId)?.name || "Handmade",
      is_active: true,
      display_order: editId ? undefined : nextDisplayOrder
    };

    const productResult = await saveAdminRecord("products", productPayload);

    if (!productResult.ok || !productResult.data) {
      if (uploadedImage) {
        await supabase.storage.from("product-media").remove([uploadedImage.storagePath]);
      }

      setSaveState({
        busy: false,
        message: productResult.message,
        tone: "error"
      });
      return;
    }

    const mediaResult = await saveAdminRecord("product_media", {
      id: form.mediaId || undefined,
      product_id: productResult.data.id,
      media_kind: "image",
      bucket_name: "product-media",
      storage_path: nextImagePath,
      public_url: null,
      alt_text: form.title.trim(),
      sort_order: 0,
      is_primary: true
    });

    if (!mediaResult.ok) {
      if (uploadedImage) {
        await supabase.storage.from("product-media").remove([uploadedImage.storagePath]);
      }

      setSaveState({
        busy: false,
        message: mediaResult.message,
        tone: "error"
      });
      return;
    }

    if (uploadedImage && editId && previousImagePath && previousImagePath !== nextImagePath) {
      await supabase.storage.from("product-media").remove([previousImagePath]);
    }

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl("");
    }

    setPendingImageFile(null);
    navigate("/admin", {
      replace: true,
      state: {
        notice: editId ? "Product updated." : "Product created."
      }
    });
  };

  if (!hasSupabaseConfig) {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Product editor</p>
              <h2>Connect Supabase before editing products.</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (dashboardState.status === "loading") {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Product editor</p>
              <h2>Loading product form...</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (dashboardState.error) {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-banner admin-banner-error">{dashboardState.error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="admin-shell">
        <div className="admin-page">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <nav className="breadcrumbs" style={{ marginBottom: "0.5rem" }}>
                  <Link to="/admin">Dashboard</Link>
                  <span>/</span>
                  <span>{editId ? "Edit Product" : "New Product"}</span>
                </nav>
                <h1>{editId ? "Update Product" : "Add New Product"}</h1>
                <p className="section-lead">
                  Fill in the product details below. All fields marked with * are required.
                </p>
              </div>
              <Button to="/admin" variant="secondary">
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Icon name="arrow-left" /> Back
                </span>
              </Button>
            </div>

            <form className="admin-product-form" onSubmit={handleSave}>
              <Input
                label="Title *"
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
                type="text"
                value={form.title}
              />

              <Input
                as="textarea"
                label="Description *"
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                required
                rows={5}
                value={form.description}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Input
                  label="Price (₹) *"
                  min="0"
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  required
                  step="0.01"
                  type="number"
                  value={form.price}
                />
                <Input
                  label="Discount Price (Optional)"
                  min="0"
                  onChange={(event) => setForm((current) => ({ ...current, discountPrice: event.target.value }))}
                  step="0.01"
                  type="number"
                  value={form.discountPrice}
                />
              </div>

              <label className="field">
                <span>Category *</span>
                <select
                  onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  required
                  value={form.categoryId}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-file-upload">
                <label className="field">
                  <span>Product Image *</span>
                  <input
                    accept="image/*"
                    onChange={handleUpload}
                    type="file"
                    style={{
                      border: '1px dashed var(--border-strong)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      background: 'var(--surface-soft)'
                    }}
                  />
                  <small style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {uploadState.busy
                      ? "Uploading..."
                      : editId && !pendingImageFile
                        ? "Leave unchanged to keep current image."
                        : "⭐ First image will be the main product image."}
                  </small>
                </label>
                {form.imageUrl ? (
                  <div className="admin-image-preview">
                    <img alt={form.title || "Product preview"} src={form.imageUrl} />
                  </div>
                ) : null}
                {uploadState.message ? (
                  <p className={`form-status ${uploadState.tone === "error" ? "is-error" : ""}`}>{uploadState.message}</p>
                ) : null}
              </div>

              <Input
                label="Stock Quantity *"
                min="0"
                onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                required
                step="1"
                type="number"
                value={form.stock}
              />

              <Button disabled={saveState.busy || uploadState.busy} type="submit" wide>
                {saveState.busy ? "Saving Product..." : "Save Product"}
              </Button>

              {saveState.message ? (
                <p className={`form-status ${saveState.tone === "error" ? "is-error" : ""}`}>{saveState.message}</p>
              ) : null}
            </form>

            {editId ? (
              <p className="admin-editor-note">
                Editing an existing product. Need a different record? Head back to the <Link to="/admin">dashboard</Link>.
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </section>
  );
}
