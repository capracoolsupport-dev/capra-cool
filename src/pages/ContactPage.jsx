import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { submitContactMessage } from "../lib/storefrontApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function ContactPage() {
  const { data } = useOutletContext();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  if (!data) {
    return (
      <section className="page-section">
        <div className="loading-card">Loading contact form...</div>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    const result = await submitContactMessage(form);
    setStatus(result.message);
    setBusy(false);

    if (result.ok) {
      setForm(initialForm);
    }
  };

  return (
    <>
      <section className="page-section inner-hero soft">
        <p className="eyebrow">Support that feels human</p>
        <h1>{data.settings.contactTitle}</h1>
        <p className="section-lead">{data.settings.contactDescription}</p>
      </section>

      <section className="page-section two-column">
        <div className="form-card">
          <div className="section-heading left-aligned">
            <p className="eyebrow">Contact form</p>
            <h2>Send a message</h2>
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
              <span>Phone Number (optional)</span>
              <input
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                type="tel"
                value={form.phone}
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Tell us what you are looking for, and we will help."
                required
                rows="6"
                value={form.message}
              />
            </label>

            <button className="button button-primary button-wide" disabled={busy} type="submit">
              {busy ? "Saving..." : "Send Message"}
            </button>
            <p className="form-status">{status}</p>
          </form>
        </div>

        <aside className="info-card">
          <p className="eyebrow">Studio details</p>
          <h2>{data.settings.brandName}</h2>
          <p>
            Handmade crochet with premium presentation, thoughtful support, and a warm shopping experience from start to finish.
          </p>
          <ul className="info-list">
            <li>Email: {data.settings.supportEmail}</li>
            <li>Phone: {data.settings.supportPhone}</li>
            <li>Location: {data.settings.businessLocation}</li>
            <li>Support Window: {data.settings.supportWindow}</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
