import { getSupabaseRows, methodAllowed, send } from '../_shared.js';

export default async function handler(req, res) {
  if (!methodAllowed(req, res, ['GET'])) return;

  const expected = process.env.ADMIN_DASHBOARD_TOKEN;
  const supplied = req.headers['x-admin-token'];
  if (!expected || supplied !== expected) return send(res, 401, { error: 'Unauthorized.' });

  try {
    const rows = await getSupabaseRows('customer_orders', 'order_number,customer_name,customer_phone,customer_email,city,state,grand_total,order_status,created_at', 50);
    send(res, 200, { orders: rows });
  } catch (error) {
    console.error('admin_orders_failed', error);
    send(res, error.status || 500, { error: 'Could not load orders.' });
  }
}
