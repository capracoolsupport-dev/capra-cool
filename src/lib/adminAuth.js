import { supabase } from "./supabase.js";

function fail(message) {
  return {
    ok: false,
    message
  };
}

export async function getCurrentSession() {
  if (!supabase) {
    return {
      ok: false,
      session: null,
      message: "Supabase is not configured."
    };
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return {
      ok: false,
      session: null,
      message: error.message || "We could not load the admin session."
    };
  }

  return {
    ok: true,
    session: data.session || null,
    message: ""
  };
}

async function checkAdminAccess() {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  const { data, error } = await supabase.rpc("is_admin_user");

  if (error) {
    return fail(error.message || "We could not verify admin access.");
  }

  return {
    ok: Boolean(data),
    message: data ? "" : "This account does not have admin access."
  };
}

export async function getAdminSession() {
  const sessionResult = await getCurrentSession();

  if (!sessionResult.ok || !sessionResult.session) {
    return {
      ok: sessionResult.ok,
      session: null,
      message: sessionResult.message
    };
  }

  const accessResult = await checkAdminAccess();

  return {
    ok: accessResult.ok,
    session: accessResult.ok ? sessionResult.session : null,
    message: accessResult.message
  };
}

export function onAdminAuthChange(callback) {
  if (!supabase) {
    return {
      data: {
        subscription: {
          unsubscribe() {}
        }
      }
    };
  }

  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

export async function signInAdmin({ email, password }) {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return fail(error.message || "We could not sign you in.");
  }

  const accessResult = await checkAdminAccess();

  if (!accessResult.ok) {
    await supabase.auth.signOut();
    return fail(accessResult.message);
  }

  return { ok: true, message: "" };
}

export async function signOutAdmin() {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  const { error } = await supabase.auth.signOut();

  return error ? fail(error.message || "We could not sign you out.") : { ok: true, message: "" };
}
