const PRODUCTS = {
  'summit-tee': { name: 'Summit Tee', price: 799, category: 'T-Shirt' },
  'alpine-hoodie': { name: 'Alpine Hoodie', price: 1499, category: 'Hoodie' },
  'trail-tracksuit': { name: 'Trail Tracksuit', price: 1999, category: 'Tracksuit' },
  'classic-tee': { name: 'Capra Classic Tee', price: 799, category: 'T-Shirt' },
  'horizon-hoodie': { name: 'Horizon Hoodie', price: 1499, category: 'Hoodie' },
  'peak-tracksuit': { name: 'Peak Tracksuit', price: 1999, category: 'Tracksuit' }
};

const VALID_SIZES = new Set(['S', 'M', 'L', 'XL', 'XXL']);

export function send(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function methodAllowed(req, res, methods = ['POST']) {
  if (methods.includes(req.method)) return true;
  res.setHeader('Allow', methods.join(', '));
  send(res, 405, { error: 'Method not allowed.' });
  return false;
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function cleanText(value, max = 400) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function cleanEmail(value) {
  return cleanText(value, 254).toLowerCase();
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function orderTotals(items = []) {
  const normalized = [];
  for (const item of items) {
    const product = PRODUCTS[item.id];
    const qty = Math.min(10, Math.max(1, Number(item.qty) || 1));
    const size = cleanText(item.size, 8).toUpperCase();
    if (!product || !VALID_SIZES.has(size)) continue;
    normalized.push({
      id: item.id,
      name: product.name,
      category: product.category,
      size,
      qty,
      unit_price: product.price
    });
  }
  const subtotal = normalized.reduce((sum, item) => sum + item.unit_price * item.qty, 0);
  const shipping_fee = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  return { items: normalized, subtotal, shipping_fee, grand_total: subtotal + shipping_fee };
}

export function createOrderId(prefix = 'CC') {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export async function postSupabase(table, payload, options = {}) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    const error = new Error('Supabase is not configured.');
    error.status = 503;
    throw error;
  }

  const prefer = options.returnRepresentation ? 'return=representation' : 'return=minimal';
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: prefer
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = new Error(`Supabase returned ${response.status}.`);
    error.status = response.status;
    error.details = await response.text().catch(() => '');
    throw error;
  }
  return options.returnRepresentation ? response.json() : null;
}

export async function getSupabaseRows(table, select = '*', limit = 50) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    const error = new Error('Supabase is not configured.');
    error.status = 503;
    throw error;
  }

  const params = new URLSearchParams({ select, order: 'created_at.desc', limit: String(limit) });
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  if (!response.ok) {
    const error = new Error(`Supabase returned ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export { PRODUCTS };
