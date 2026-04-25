import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { getAdminSession, signInAdmin } from "../lib/adminAuth.js";
import { hasSupabaseConfig } from "../lib/supabase.js";

const initialForm = {
  email: "",
  password: ""
};

export default function AdminLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState(null);

  const redirectTarget = location.state?.from || "/admin";

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const result = await getAdminSession();

      if (active) {
        setSessionChecked(true);
        setSession(result.session || null);
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  if (!hasSupabaseConfig) {
    return (
      <section className="page-section admin-auth-page">
        <div className="admin-auth-card">
          <p className="eyebrow">Admin login</p>
          <h1>Supabase credentials are required first.</h1>
          <p>Add your Supabase environment values before trying to sign in to the admin workspace.</p>
        </div>
      </section>
    );
  }

  if (!sessionChecked) {
    return (
      <section className="page-section admin-auth-page">
        <div className="admin-auth-card">
          <p className="eyebrow">Admin login</p>
          <h1>Checking your session...</h1>
        </div>
      </section>
    );
  }

  if (session) {
    return <Navigate replace to={redirectTarget} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    const result = await signInAdmin({
      email: form.email.trim(),
      password: form.password
    });

    setBusy(false);

    if (!result.ok) {
      setStatus(result.message);
      return;
    }

    navigate(redirectTarget, { replace: true });
  };

  return (
    <section className="page-section admin-auth-page">
      <div className="admin-auth-card">
        <p className="eyebrow">Admin login</p>
        <h1>Sign in to the studio dashboard.</h1>
        <p>Use the admin email and password from your Supabase Auth users before editing products.</p>

        <form className="stack-form" onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            label="Admin Email"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={form.email}
          />
          <Input
            autoComplete="current-password"
            label="Password"
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
            type="password"
            value={form.password}
          />
          <Button disabled={busy} type="submit" wide>
            {busy ? "Signing in..." : "Sign In"}
          </Button>
          {status ? <p className="form-status is-error">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}
