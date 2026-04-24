import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentSession, onAdminAuthChange } from "../lib/adminAuth.js";
import { hasSupabaseConfig } from "../lib/supabase.js";

export default function ProtectedAdminLayout() {
  const location = useLocation();
  const [state, setState] = useState({
    checked: false,
    session: null
  });

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const result = await getCurrentSession();

      if (active) {
        setState({
          checked: true,
          session: result.session || null
        });
      }
    }

    loadSession();

    const authListener = onAdminAuthChange((session) => {
      if (active) {
        setState({
          checked: true,
          session
        });
      }
    });

    return () => {
      active = false;
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  if (!hasSupabaseConfig) {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Admin setup</p>
              <h2>Connect Supabase to unlock the admin workspace.</h2>
              <p className="section-lead">
                Add the Supabase URL and anon key to this project before trying to use the protected admin routes.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!state.checked) {
    return (
      <section className="page-section">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Admin setup</p>
              <h2>Checking your admin session...</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!state.session) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to="/admin/login"
      />
    );
  }

  return <Outlet context={{ session: state.session }} />;
}
