import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { FormPageSkeleton } from "../components/Skeletons.jsx";
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
    return <FormPageSkeleton />;
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
              as="select"
              emptyOptionLabel="Select a crochet type"
              label="Product Type"
              onChange={(event) => setForm({ ...form, productType: event.target.value })}
              required
              value={form.productType}
            >
              {data.products.map((product) => (
                <option key={product.slug} value={product.name}>
                  {product.name}
                </option>
              ))}
            </Input>

            <Input
              as="textarea"
              label="Customization Details"
              onChange={(event) => setForm({ ...form, details: event.target.value })}
              required
              rows={6}
              value={form.details}
            />

            <Button disabled={busy} type="submit" wide>
              {busy ? "Saving..." : "Request Custom Order"}
            </Button>
            <p className="form-status">{status}</p>
          </form>
        </div>
      </section>
    </>
  );
}
