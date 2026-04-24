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

  return error ? fail(error.message || "We could not sign you in.") : { ok: true, message: "" };
}

export async function signOutAdmin() {
  if (!supabase) {
    return fail("Supabase is not configured.");
  }

  const { error } = await supabase.auth.signOut();

  return error ? fail(error.message || "We could not sign you out.") : { ok: true, message: "" };
}
