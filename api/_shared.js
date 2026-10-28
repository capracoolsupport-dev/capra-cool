import {CAMPUS_DESIGNS, CAMPUS_SIZES, campusUnitCents, campusComboSavings, CAMPUS_ARTWORKS} from '../campus-catalog.js';
const PRODUCTS = {
  'summit-tee': { name: 'Summit Tee', price: 799, category: 'T-Shirt' },
  'alpine-hoodie': { name: 'Alpine Hoodie', price: 1499, category: 'Hoodie' },
  'trail-tracksuit': { name: 'Trail Tracksuit', price: 1999, category: 'Tracksuit' },
  'classic-tee': { name: 'Capra Classic Tee', price: 799, category: 'T-Shirt' },
  'capra-cool-tee': { name: 'Capra Cool Tee', price: 899, category: 'T-Shirt' },
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
  if (!Array.isArray(items)) {
    const error = new Error('Items must be an array.'); error.status = 400; throw error;
  }
  const normalized = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const campus = CAMPUS_DESIGNS.find(design => design.id === item.id);
    const product = PRODUCTS[item.id];
    const qty = Math.min(10, Math.max(1, Math.floor(Number(item.qty) || 1)));
    const size = cleanText(item.size, 8).toUpperCase();
    if (campus) {
      if (campus.inStock === false) {
        const error = new Error(`${campus.name} (${campus.colour}) is out of stock. Remove it from your bag to continue.`);
        error.status = 409;
        error.code = 'OUT_OF_STOCK';
        throw error;
      }
      const artwork=CAMPUS_ARTWORKS.find(art=>art.id===(item.artwork||campus.defaultArtwork||'mountain'));
      const personalisation = item.personalisation === true;
      const print = personalisation ? cleanText(item.name, 40) : '';
      if (!artwork || (campus.artworks && !campus.artworks.includes(artwork.id)) || !CAMPUS_SIZES.includes(size) || (personalisation && !print)) {
        const error = new Error('Choose a valid size and enter your print text.'); error.status = 400; throw error;
      }
      normalized.push({id:campus.id,name:`IIT Mandi ${campus.name}`,category:campus.category,colour:campus.colour,size,artwork:artwork.id,artwork_name:campus.artworkName||artwork.name,qty,personalisation,print_text:print,...(campus.category==='track'&&personalisation?{print_placement:'Jacket'}:{}),unit_price:campusUnitCents(campus,personalisation)/100});
      continue;
    }
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
  const {discountCents,offers}=campusComboSavings(normalized);
  for(const offer of offers){
    let remaining=offer.quantity;
    for(const item of normalized.filter(item=>item.id===offer.items.at(-1))){
      const discountedQuantity=Math.min(remaining,item.qty);
      item.combo_discount=discountedQuantity*offer.savingCents/100;
      item.line_total=Math.round(item.unit_price*100*item.qty-discountedQuantity*offer.savingCents)/100;
      item.combo_name=offer.name;
      remaining-=discountedQuantity;
    }
  }
  const merchandise_subtotal = normalized.reduce((sum, item) => sum + Math.round(item.unit_price * 100) * item.qty, 0) / 100;
  const subtotal = Math.round(merchandise_subtotal*100-discountCents)/100;
  const shipping_fee = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  return { items: normalized, merchandise_subtotal, discount_total:discountCents/100, subtotal, shipping_fee, grand_total: Math.round((subtotal + shipping_fee) * 100) / 100 };
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
