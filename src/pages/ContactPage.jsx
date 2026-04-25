import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { FormPageSkeleton } from "../components/Skeletons.jsx";
import StorefrontErrorState from "../components/StorefrontErrorState.jsx";
import { submitContactMessage } from "../lib/storefrontApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function ContactPage() {
  const { data, storefrontState } = useOutletContext();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  if (!data) {
    if (storefrontState.status === "error") {
      return <StorefrontErrorState title="Support is temporarily unavailable." />;
    }

    return <FormPageSkeleton />;
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
            <Input
              label="Name"
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              type="text"
              value={form.name}
            />

            <Input
              label="Email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />

            <Input
              label="Phone Number (optional)"
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              type="tel"
              value={form.phone}
            />

            <Input
              as="textarea"
              label="Message"
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
              rows={6}
              value={form.message}
            />

            <Button disabled={busy} type="submit" wide>
              {busy ? "Saving..." : "Send Message"}
            </Button>
            <p className="form-status">{status}</p>
          </form>
        </div>

        <aside className="info-card">
          <p className="eyebrow">Studio details</p>
          <h2>{data.settings.brandName}</h2>
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
