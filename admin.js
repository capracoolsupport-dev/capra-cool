const $ = selector => document.querySelector(selector);

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function renderOrders(orders) {
  const table = $('#ordersTable');
  if (!orders.length) {
    table.innerHTML = '<tr><td colspan="7">No orders found yet.</td></tr>';
    return;
  }
  table.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${escapeHtml(order.order_number)}</strong></td>
      <td>${escapeHtml(order.customer_name)}</td>
      <td><a href="mailto:${escapeHtml(order.customer_email)}">${escapeHtml(order.customer_email)}</a><br><small>${escapeHtml(order.customer_phone)}</small></td>
      <td>${escapeHtml(order.city)}, ${escapeHtml(order.state)}</td>
      <td>${money(order.grand_total)}</td>
      <td><span class="status-pill">${escapeHtml(order.order_status || 'pending')}</span></td>
      <td>${order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : '—'}</td>
    </tr>
  `).join('');
}

async function loadOrders(token) {
  const response = await fetch('/api/admin/orders', { headers: { 'x-admin-token': token } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Could not load orders.');
  return data.orders || [];
}

$('#adminLogin')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const token = new FormData(form).get('token');
  const status = $('#adminStatus');
  const button = $('button', form);
  button.disabled = true;
  status.textContent = 'Loading…';
  try {
    const orders = await loadOrders(token);
    renderOrders(orders);
    status.textContent = `${orders.length} loaded`;
  } catch (error) {
    $('#ordersTable').innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}</td></tr>`;
    status.textContent = 'Failed';
  } finally {
    button.disabled = false;
  }
});
