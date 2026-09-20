import { cleanText, methodAllowed, PRODUCTS, readJson, send } from './_shared.js';

const catalog = Object.values(PRODUCTS).map(product => `${product.name}: ${product.category}, ₹${product.price}`).join('\n');

export default async function handler(req, res) {
  if (!methodAllowed(req, res)) return;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return send(res, 503, { error: 'Fit assistant is not configured yet.' });

    const body = await readJson(req);
    const question = cleanText(body.question, 800);
    if (question.length < 3) return send(res, 400, { error: 'Ask a short fit or product question.' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        store: false,
        max_output_tokens: 260,
        input: [
          {
            role: 'system',
            content: 'You are the CAPRA COOL fit concierge. Answer briefly and practically using only the provided product catalog, size guidance, and policies. If unsure, recommend emailing care@capracool.com. Do not claim an order was placed.'
          },
          {
            role: 'user',
            content: `Catalog:\n${catalog}\n\nSize guidance: T-shirts are regular everyday fit, hoodies are structured and relaxed for layering, tracksuits are tapered two-piece sets. Sizes run S to XXL. Shipping is complimentary above ₹999 and the exchange window is 7 days for unworn pieces with tags.\n\nCustomer question: ${question}`
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('openai_assistant_failed', data);
      return send(res, response.status, { error: 'Fit assistant is unavailable right now.' });
    }

    send(res, 200, { answer: data.output_text || 'Please email care@capracool.com and we will help you choose.' });
  } catch (error) {
    console.error('assistant_failed', error);
    send(res, 500, { error: 'Fit assistant is unavailable right now.' });
  }
}
