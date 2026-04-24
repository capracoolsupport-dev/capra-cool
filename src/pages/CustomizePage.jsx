import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { submitCustomOrderRequest } from "../lib/storefrontApi";

const initialForm = {
  name: "",
  email: "",
  productType: "",
  details: ""
};

export default function CustomizePage() {
  const { data } = useOutletContext();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!data) {
    return (
      <section className="page-section">
        <div className="loading-card">Loading custom order form...</div>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setBusy(true);
    const result = await submitCustomOrderRequest({
      ...form
    });

    setStatus(result.message);
    setBusy(false);

    if (result.ok) {
      setForm(initialForm);
    }
  };

  return (
    <>
      <section className="page-section inner-hero">
        <p className="eyebrow">Custom crochet orders</p>
        <h1>{data.settings.customizeTitle}</h1>
        <p className="section-lead">{data.settings.customizeDescription}</p>
      </section>

      <section className="page-section">
        <div className="form-card">
          <div className="section-heading left-aligned">
            <p className="eyebrow">Custom order form</p>
            <h2>Send your request</h2>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                type="text"
                value={form.name}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="field">
              <span>Product Type</span>
              <select
                onChange={(event) => setForm({ ...form, productType: event.target.value })}
                required
                value={form.productType}
              >
                <option value="">Select a crochet type</option>
                {data.products.map((product) => (
                  <option key={product.slug} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Customization Details</span>
              <textarea
                onChange={(event) => setForm({ ...form, details: event.target.value })}
                placeholder="Colors, size, and what you want made."
                required
                rows="6"
                value={form.details}
              />
            </label>

            <button className="button button-primary button-wide" disabled={busy} type="submit">
              {busy ? "Saving..." : "Request Custom Order"}
            </button>
            <p className="form-status">{status}</p>
          </form>
        </div>
      </section>
    </>
  );
}
