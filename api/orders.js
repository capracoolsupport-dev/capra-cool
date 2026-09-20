import { cleanEmail, cleanText, createOrderId, isEmail, methodAllowed, orderTotals, postSupabase, readJson, send } from './_shared.js';

export default async function handler(req, res) {
  if (!methodAllowed(req, res)) return;

  try {
    const body = await readJson(req);
    const totals = orderTotals(body.items);
    const customer_email = cleanEmail(body.customer?.email);
    const customer_phone = cleanText(body.customer?.phone, 24).replace(/[^\d+\s-]/g, '');
    const pincode = cleanText(body.customer?.pincode, 6);

    if (!totals.items.length) return send(res, 400, { error: 'Add at least one valid item.' });
    if (!cleanText(body.customer?.name, 120)) return send(res, 400, { error: 'Full name is required.' });
    if (!customer_phone || customer_phone.replace(/\D/g, '').length < 10) return send(res, 400, { error: 'A valid phone number is required.' });
    if (!isEmail(customer_email)) return send(res, 400, { error: 'A valid email address is required.' });
    if (!/^\d{6}$/.test(pincode)) return send(res, 400, { error: 'Enter a valid 6-digit PIN code.' });

    const orderId = createOrderId();
    const payload = {
      id: orderId,
      order_number: orderId,
      customer_name: cleanText(body.customer.name, 120),
      customer_phone,
      customer_email,
      delivery_address: cleanText(body.customer.address, 500),
      city: cleanText(body.customer.city, 80),
      state: cleanText(body.customer.state, 80),
      pincode,
      notes: cleanText(body.customer.notes, 500),
      payment_method: 'cod',
      order_channel: 'web',
      items: totals.items,
      subtotal: totals.subtotal,
      shipping_fee: totals.shipping_fee,
      grand_total: totals.grand_total,
      order_status: 'pending'
    };

    await postSupabase('customer_orders', payload);
    send(res, 200, { order_id: orderId, ...totals });
  } catch (error) {
    console.error('order_submit_failed', error);
    send(res, error.status || 500, { error: 'Order submission is unavailable right now.' });
  }
}
