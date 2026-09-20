import { cleanEmail, cleanText, createOrderId, isEmail, methodAllowed, postSupabase, readJson, send } from './_shared.js';

export default async function handler(req, res) {
  if (!methodAllowed(req, res)) return;

  try {
    const body = await readJson(req);
    const email = cleanEmail(body.email);
    const quantity = Math.max(12, Math.min(5000, Number(body.quantity) || 12));

    if (!cleanText(body.instituteName, 120)) return send(res, 400, { error: 'Institute name is required.' });
    if (!cleanText(body.contactName, 120)) return send(res, 400, { error: 'Contact name is required.' });
    if (!isEmail(email)) return send(res, 400, { error: 'A valid email address is required.' });

    const quoteId = createOrderId('CQ');
    await postSupabase('campus_quote_requests', {
      id: quoteId,
      quote_number: quoteId,
      institute_name: cleanText(body.instituteName, 120),
      contact_name: cleanText(body.contactName, 120),
      contact_email: email,
      contact_phone: cleanText(body.phone, 24),
      garment: cleanText(body.garment, 40),
      garment_color: cleanText(body.garmentColor, 40),
      front_placement: cleanText(body.frontPlacement, 40),
      back_placement: cleanText(body.backPlacement, 40),
      print_color: cleanText(body.printColor, 40),
      quantity,
      notes: cleanText(body.notes, 800),
      status: 'new'
    });
    send(res, 200, { quote_id: quoteId });
  } catch (error) {
    console.error('campus_quote_failed', error);
    send(res, error.status || 500, { error: 'Quote submission is unavailable right now.' });
  }
}
