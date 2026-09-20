import { cleanEmail, isEmail, methodAllowed, postSupabase, readJson, send } from './_shared.js';

export default async function handler(req, res) {
  if (!methodAllowed(req, res)) return;

  try {
    const body = await readJson(req);
    const email = cleanEmail(body.email);
    if (!isEmail(email)) return send(res, 400, { error: 'Enter a valid email address.' });

    await postSupabase('newsletter_signups', { email, source: 'site_footer' });
    send(res, 200, { ok: true });
  } catch (error) {
    console.error('newsletter_submit_failed', error);
    const message = error.status === 409 ? 'That email is already on the list.' : 'Newsletter signup is unavailable right now.';
    send(res, error.status || 500, { error: message });
  }
}
