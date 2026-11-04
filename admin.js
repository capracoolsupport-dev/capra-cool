const $ = (selector, root = document) => root.querySelector(selector);

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function orderItem(item){
  const custom=item.customisation;
  return `<p>${escapeHtml(item.name)} · ${escapeHtml(item.size)} × ${Number(item.qty)||1}${item.artwork_name?`<br>Artwork: ${escapeHtml(item.artwork_name)}`:''}${item.combo_discount?`<br>Combo saving: ${money(item.combo_discount)}`:''}${item.print_text?`<br><strong>Print: ${escapeHtml(item.print_text)}</strong>`:''}</p>${custom?`<div class="admin-custom-design"><p><strong>Custom design: ${escapeHtml(item.design_id)}</strong><br>${escapeHtml(item.colour)} · ${escapeHtml(custom.method)} · ${escapeHtml((custom.areas||[]).join(', '))}</p><button type="button" class="text-link" data-studio-download="${escapeHtml(custom.preview_id)}">Download front/back preview</button>${(custom.asset_ids||[]).map((id,i)=>`<button type="button" class="text-link" data-studio-download="${escapeHtml(id)}" data-original="1">Download original artwork ${i+1}</button>`).join('')}<details><summary>Placements and text for production</summary><pre>${escapeHtml(JSON.stringify(custom.document,null,2))}</pre></details></div>`:''}`;
}

function renderOrders(orders) {
  const table = $('#ordersTable');
  if (!orders.length) {
    table.innerHTML = '<tr><td colspan="7">No orders found yet.</td></tr>';
    return;
  }
  table.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${escapeHtml(order.order_number)}</strong>${Array.isArray(order.items) && order.items.length ? `<details class="admin-order-items"><summary>View items</summary>${order.items.map(orderItem).join('')}</details>` : ''}</td>
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

$('#ordersTable').addEventListener('click',async event=>{
  const button=event.target.closest('[data-studio-download]');if(!button)return;
  button.disabled=true;
  try{
    const token=$('#adminLogin [name="token"]').value;
    const response=await fetch(`/api/designer?action=asset&id=${encodeURIComponent(button.dataset.studioDownload)}${button.dataset.original?'&original=1':''}`,{headers:{'x-admin-token':token}});
    if(!response.ok)throw new Error('Artwork download failed. Check your dashboard access.');
    const url=URL.createObjectURL(await response.blob()),a=document.createElement('a');a.href=url;a.download=button.dataset.original?`capra-original-${button.dataset.studioDownload}`:`capra-preview-${button.dataset.studioDownload}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(error){$('#adminStatus').textContent=error.message;}finally{button.disabled=false;}
});
