const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `₹${Number(value).toLocaleString('en-IN')}`;

const CONFIG = {
  freeShipping: 999,
  shippingFee: 99,
  supportEmail: 'care@capracool.com',
  whatsapp: String(import.meta.env?.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || 'https://qhaheskahldwcvggrvbu.supabase.co',
  supabaseKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kxaAQiApVfqqNI4mbR8tTw_AanAVrci'
};

const SIZE_CHARTS = {
  tee: {
    S: ['38–40"', '27"', '18.5"'], M: ['40–42"', '28"', '19.5"'], L: ['42–44"', '29"', '20.5"'], XL: ['44–46"', '30"', '21.5"'], XXL: ['46–48"', '31"', '22.5"']
  },
  hoodie: {
    S: ['42–44"', '27"', '20"'], M: ['44–46"', '28"', '21"'], L: ['46–48"', '29"', '22"'], XL: ['48–50"', '30"', '23"'], XXL: ['50–52"', '31"', '24"']
  },
  track: {
    S: ['40" / 30"', '27" / 39"', 'Raglan'], M: ['42" / 32"', '28" / 40"', 'Raglan'], L: ['44" / 34"', '29" / 41"', 'Raglan'], XL: ['46" / 36"', '30" / 42"', 'Raglan'], XXL: ['48" / 38"', '31" / 43"', 'Raglan']
  }
};

const PRODUCTS = [
  {
    id: 'summit-tee', name: 'Summit Tee', category: 'tee', price: 799, rating: 4.8,
    image: 'assets/product_summit_tee.jpg', badge: 'Bestseller', color: 'Ivory', gsm: '180 GSM',
    fabric: 'Premium combed cotton', fit: 'Regular everyday fit', sku: 'CC-TEE-001',
    description: 'A clean everyday tee in breathable 180 GSM combed cotton, finished with the CAPRA COOL mountain-ridge language and a dependable neck rib.',
    care: 'Cold machine wash with similar colours. Line dry in shade.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'alpine-hoodie', name: 'Alpine Hoodie', category: 'hoodie', price: 1499, rating: 4.9,
    image: 'assets/product_alpine_hoodie.jpg', badge: 'Signature', color: 'Olive Drab', gsm: '380 GSM',
    fabric: 'Brushed cotton fleece', fit: 'Structured athletic fit', sku: 'CC-HD-001',
    description: 'Dense brushed fleece for cold mornings and late-night campus movement, with a structured hood and restrained alpine insignia.',
    care: 'Gentle cold wash. Hang dry in shade. Do not iron directly on print.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'trail-tracksuit', name: 'Trail Tracksuit', category: 'track', price: 1999, rating: 4.7,
    image: 'assets/product_trail_tracksuit.jpg', badge: '2-piece set', color: 'Deep Olive', gsm: '340 GSM',
    fabric: 'Technical double-knit', fit: 'Tapered outerwear set', sku: 'CC-TRK-001',
    description: 'A coordinated zip jacket and tapered track pant built for easy layering, travel, and daily movement without losing shape.',
    care: 'Fasten zips, cold wash, air dry.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'classic-tee', name: 'Capra Classic Tee', category: 'tee', price: 799, rating: 4.6,
    image: 'assets/sharp_product_classic_tee.jpg', badge: 'Core icon', color: 'Jet Black', gsm: '180 GSM',
    fabric: 'Heavy combed cotton', fit: 'Relaxed boxy cut', sku: 'CC-TEE-002', imageFit: 'contain',
    description: 'The wordmark essential: long-staple cotton, a relaxed streetwear shape, and a collar engineered to hold its line through repeat wear.',
    care: 'Wash cold inside-out. Do not bleach. Cool iron.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'capra-cool-tee', name: 'Capra Cool Tee', category: 'tee', price: 899, rating: 4.9,
    image: 'assets/capra-cool-studio-front.jpg', badge: 'New drop', color: 'Jet Black / Navy / White / Olive', gsm: '220 GSM',
    fabric: 'Cool-touch cotton blend', fit: 'Relaxed athletic fit', sku: 'CC-TEE-003', imageFit: 'contain',
    description: 'A breathable everyday T-shirt built for warm days, campus runs, and repeat wear. Soft cotton-blend jersey, clean CAPRA COOL chest mark, and a steady collar that keeps its shape.',
    care: 'Wash cold inside-out. Line dry in shade. Do not iron directly on print.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'horizon-hoodie', name: 'Horizon Hoodie', category: 'hoodie', price: 1499, rating: 4.8,
    image: 'assets/product_horizon_hoodie.jpg', badge: 'Mountain art', color: 'Desert Cream', gsm: '380 GSM',
    fabric: 'Heavy brushed fleece', fit: 'Drop-shoulder structure', sku: 'CC-HD-002',
    description: 'A heavyweight fleece hoodie with a scenic Himalayan back graphic and a relaxed shoulder line designed for winter layering.',
    care: 'Cold gentle wash. Line dry. Do not tumble dry.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'peak-tracksuit', name: 'Peak Tracksuit', category: 'track', price: 1999, rating: 4.7,
    image: 'assets/product_peak_tracksuit_clean.jpg', badge: 'Utility', color: 'Basalt Black', gsm: '340 GSM',
    fabric: 'Technical double-knit jersey', fit: 'Tapered performance cut', sku: 'CC-TRK-002', imageFit: 'contain',
    description: 'A technical black two-piece with clean piping, useful pockets, and a tapered profile that moves easily between training, travel, and campus.',
    care: 'Wash with like colours. Do not iron over logo. Air dry.', sizes: ['S','M','L','XL','XXL']
  }
];

const ACCESSORIES = [
  { id:'handmade-muffler', name:'Handmade Muffler', price:460, image:'assets/handmade-muffler.jpg', note:'Small-batch winter knit', lowres:true },
  { id:'handmade-winter-cap', name:'Handmade Winter Cap', price:210, image:'assets/handmade-winter-cap.jpg', note:'Campus-made cold-weather knit', lowres:true },
  { id:'handmade-krishna', name:'Handmade Krishna', price:1199, image:'assets/handmade-krishna.jpg', note:'Handcrafted collectible', lowres:true },
  { id:'sunflower-keychain', name:'Sunflower Keychain', price:99, image:'assets/sunflower-keychain.jpg', note:'Handmade campus accessory', lowres:true }
];

const CATEGORY_LABELS = { tee:'T-Shirt', hoodie:'Hoodie', track:'Tracksuit' };
let currentFilter = 'all';
let currentSort = 'featured';
let activeProduct = null;
let activeSize = null;
let cart = safeParse(safeStorageGet('capraCoolCart'), []);

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function safeStorageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* storage may be blocked in private/restricted contexts */ }
}

function optimizedPath(src, ext) {
  const filename = src.split('/').pop().replace(/\.[^.]+$/, '');
  return `optimized/${filename}.${ext}`;
}

function pictureMarkup(src, alt, options = {}) {
  const cls = options.className ? ` class="${options.className}"` : '';
  const loading = options.loading || 'lazy';
  const decoding = options.decoding || 'async';
  const extra = options.extra || '';
  return `<picture><source srcset="${optimizedPath(src,'avif')}" type="image/avif"><source srcset="${optimizedPath(src,'webp')}" type="image/webp"><img${cls} src="${src}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="${decoding}" ${extra}></picture>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function productById(id) { return PRODUCTS.find(product => product.id === id); }

function sortedProducts() {
  let list = currentFilter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(product => product.category === currentFilter);
  if (currentSort === 'price-asc') list.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (currentSort === 'rating') list.sort((a,b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  const grid = $('#productsGrid');
  if (!grid) return;
  const list = sortedProducts();
  grid.innerHTML = list.map(product => `
    <article class="product-card" data-product-id="${product.id}" data-image-fit="${product.imageFit || 'cover'}" data-reveal>
      <div class="product-image-wrap">
        ${pictureMarkup(product.image, `${product.name} — ${product.color}`, { extra:'width="768" height="1024"' })}
        <span class="product-badge">${escapeHtml(product.badge)}</span>
        <button class="quick-add" type="button" data-open-product="${product.id}" aria-label="View ${escapeHtml(product.name)}">+</button>
      </div>
      <div class="product-info">
        <div class="product-line"><h3 class="product-title">${escapeHtml(product.name)}</h3><span class="product-price">${money(product.price)}</span></div>
        <p class="product-sub">${escapeHtml(product.color)} · ${escapeHtml(product.fit)}</p>
        <div class="product-spec-row"><span>${escapeHtml(product.gsm)}</span><span>${escapeHtml(product.fabric)}</span></div>
        <button class="product-detail-link" type="button" data-open-product="${product.id}">View details & size guide</button>
      </div>
    </article>
  `).join('');
  $('#productCount').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
  bindProductButtons();
  prepareRevealElements(grid);
}

function renderAccessories() {
  const grid = $('#accessoriesGrid');
  if (!grid) return;
  grid.innerHTML = ACCESSORIES.map(item => `
    <article class="accessory-card" data-lowres="${item.lowres ? 'true':'false'}" data-reveal>
      <div class="accessory-image">${pictureMarkup(item.image, item.name)}</div>
      <div class="accessory-copy"><strong><span>${escapeHtml(item.name)}</span><span>${money(item.price)}</span></strong><p>${escapeHtml(item.note)}</p></div>
    </article>
  `).join('');
  prepareRevealElements(grid);
}

function bindProductButtons() {
  $$('[data-open-product]').forEach(button => button.addEventListener('click', () => openProduct(button.dataset.openProduct)));
}

function openProduct(id) {
  const product = productById(id);
  if (!product) return;
  activeProduct = product;
  activeSize = null;
  const modalImage = $('#productModalImage');
  modalImage.onerror = () => { modalImage.onerror = null; modalImage.src = product.image; };
  modalImage.src = optimizedPath(product.image, 'webp');
  modalImage.alt = `${product.name} — ${product.color}`;
  $('#productModalCategory').textContent = `${CATEGORY_LABELS[product.category]} · ${product.gsm}`;
  $('#productModalTitle').textContent = product.name;
  $('#productModalPrice').textContent = money(product.price);
  $('#productModalRating').textContent = `★ ${product.rating.toFixed(1)} · ${product.sku}`;
  $('#productModalDescription').textContent = product.description;
  $('#productModalSpecs').innerHTML = [
    ['Fabric', product.fabric], ['Fit', product.fit], ['Colour', product.color], ['Care', product.care]
  ].map(([label,value]) => `<div><small>${label}</small><strong>${escapeHtml(value)}</strong></div>`).join('');
  $('#productModalSizes').innerHTML = product.sizes.map(size => `<button class="size-chip" type="button" data-size="${size}">${size}</button>`).join('');
  $('#productSizeChart').innerHTML = sizeChartTable(product.category);
  $$('.size-chip', $('#productModalSizes')).forEach(button => button.addEventListener('click', () => {
    activeSize = button.dataset.size;
    $$('.size-chip', $('#productModalSizes')).forEach(chip => chip.classList.toggle('selected', chip === button));
  }));
  openModal($('#productModal'));
}

function sizeChartTable(category) {
  const chart = SIZE_CHARTS[category] || SIZE_CHARTS.tee;
  const heads = category === 'track' ? ['Size','Chest / Waist','Top / Pant length','Shoulder'] : ['Size','Chest','Length','Shoulder'];
  return `<table class="size-table"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${Object.entries(chart).map(([size,vals]) => `<tr><td>${size}</td>${vals.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function addActiveProductToCart() {
  if (!activeProduct) return;
  if (!activeSize) { showToast('Choose a size before adding to your bag.'); return; }
  const existing = cart.find(item => item.id === activeProduct.id && item.size === activeSize);
  if (existing) existing.qty += 1;
  else cart.push({ id:activeProduct.id, size:activeSize, qty:1 });
  persistCart();
  closeModal($('#productModal'));
  showToast(`${activeProduct.name} · ${activeSize} added to your bag.`);
  openCart();
}

function persistCart() {
  safeStorageSet('capraCoolCart', JSON.stringify(cart));
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  cart = cart.filter(item => productById(item.id) && item.qty > 0);
  const items = $('#cartItems');
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  $('#bagCount').textContent = count;
  if (!items) return;
  if (!cart.length) {
    items.innerHTML = '<div class="cart-empty">Your bag is empty.<br><small>Add a core piece to begin.</small></div>';
  } else {
    items.innerHTML = cart.map((item,index) => {
      const product = productById(item.id);
      return `<article class="cart-item">
        <img src="${optimizedPath(product.image,'webp')}" data-fallback-src="${product.image}" alt="${escapeHtml(product.name)}">
        <div class="cart-item-copy"><strong>${escapeHtml(product.name)}</strong><small>${item.size} · ${escapeHtml(product.color)}</small><div class="qty-control"><button type="button" data-qty="-1" data-index="${index}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-qty="1" data-index="${index}" aria-label="Increase quantity">+</button></div></div>
        <div class="cart-item-side"><strong>${money(product.price * item.qty)}</strong><button class="remove-item" type="button" data-remove="${index}">Remove</button></div>
      </article>`;
    }).join('');
  }
  $$('img[data-fallback-src]', items).forEach(img => img.addEventListener('error', () => { if (img.src.endsWith(img.dataset.fallbackSrc)) return; img.src = img.dataset.fallbackSrc; }, {once:true}));
  $$('[data-qty]', items).forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.index);
    if (!cart[index]) return;
    cart[index].qty = Math.max(0, cart[index].qty + Number(button.dataset.qty));
    if (!cart[index].qty) cart.splice(index,1);
    persistCart();
  }));
  $$('[data-remove]', items).forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.remove),1); persistCart();
  }));
  const subtotal = cartTotal();
  const shipping = subtotal === 0 || subtotal >= CONFIG.freeShipping ? 0 : CONFIG.shippingFee;
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartShipping').textContent = subtotal === 0 ? '—' : shipping === 0 ? 'Complimentary' : money(shipping);
  $('#cartTotal').textContent = money(subtotal + shipping);
  const progress = Math.min(100, subtotal / CONFIG.freeShipping * 100);
  $('#shippingFill').style.width = `${progress}%`;
  $('#shippingMessage').textContent = subtotal >= CONFIG.freeShipping ? 'Complimentary shipping unlocked' : `Add ${money(CONFIG.freeShipping - subtotal)} for complimentary shipping`;
  $('#checkoutOpen').disabled = cart.length === 0;
}

function openCart() { $('#cartDrawer').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden','false'); openShade(); }
function closeCart() { $('#cartDrawer').classList.remove('open'); $('#cartDrawer').setAttribute('aria-hidden','true'); closeShadeIfClear(); }
function openShade() { $('#pageShade').classList.add('open'); $('#pageShade').setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
function closeShadeIfClear() {
  const somethingOpen = $('.modal.open') || $('#cartDrawer').classList.contains('open') || $('#mobileMenu').classList.contains('open');
  if (!somethingOpen) { $('#pageShade').classList.remove('open'); $('#pageShade').setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); }
}

function openModal(modal) { if (!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); openShade(); }
function closeModal(modal) { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); closeShadeIfClear(); }
function closeAll() { $$('.modal.open').forEach(closeModal); closeCart(); closeMenu(); closeSearch(); }

function openMenu() { $('#mobileMenu').classList.add('open'); $('#mobileMenu').setAttribute('aria-hidden','false'); $('#menuOpen').setAttribute('aria-expanded','true'); document.body.classList.add('no-scroll'); }
function closeMenu() { $('#mobileMenu').classList.remove('open'); $('#mobileMenu').setAttribute('aria-hidden','true'); $('#menuOpen').setAttribute('aria-expanded','false'); if (!$('#cartDrawer').classList.contains('open') && !$('.modal.open')) document.body.classList.remove('no-scroll'); }

function openSearch() { $('#searchOverlay').classList.add('open'); $('#searchOverlay').setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); setTimeout(() => $('#searchInput')?.focus(), 80); runSearch(''); }
function closeSearch() { $('#searchOverlay').classList.remove('open'); $('#searchOverlay').setAttribute('aria-hidden','true'); if (!$('#cartDrawer').classList.contains('open') && !$('.modal.open')) document.body.classList.remove('no-scroll'); }
function runSearch(query) {
  const q = String(query || '').trim().toLowerCase();
  const matches = (q ? PRODUCTS.filter(p => [p.name,p.category,p.color,p.fabric,p.fit,p.gsm].join(' ').toLowerCase().includes(q)) : PRODUCTS).slice(0,6);
  $('#searchResults').innerHTML = matches.map(product => `<button class="search-result" type="button" data-search-product="${product.id}"><img src="${optimizedPath(product.image,'webp')}" data-fallback-src="${product.image}" alt=""><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.gsm)} · ${escapeHtml(product.fit)}</small></span><span>${money(product.price)}</span></button>`).join('') || '<p>No pieces matched that search.</p>';
  $$('img[data-fallback-src]', $('#searchResults')).forEach(img => img.addEventListener('error', () => { img.src = img.dataset.fallbackSrc; }, {once:true}));
  $$('[data-search-product]').forEach(button => button.addEventListener('click', () => { closeSearch(); openProduct(button.dataset.searchProduct); }));
}

function updateAtelier() {
  const form = $('#atelierForm'); if (!form) return;
  const data = new FormData(form);
  const garment = data.get('garment') || 'hoodie';
  const garmentInput = form.querySelector('input[name="garmentColor"]:checked');
  const garmentColor = garmentInput?.value || 'Black';
  const garmentHex = garmentInput?.dataset.color || '#171717';
  const printSelect = $('#printColor');
  const printOption = printSelect?.selectedOptions?.[0];
  const printHex = printOption?.dataset.color || '#f6f1e7';
  const printName = printOption?.value || 'Ivory';
  const institute = String(data.get('instituteName') || '').trim().toUpperCase() || 'YOUR INSTITUTE';
  const frontPlacement = data.get('frontPlacement') || 'left';
  const backPlacement = data.get('backPlacement') || 'center';
  const quantity = Math.max(12, Number(data.get('quantity')) || 50);
  const studio = $('#mockupStudio');
  studio.dataset.garment = garment;
  studio.dataset.placement = frontPlacement;
  studio.dataset.backPlacement = backPlacement;
  studio.style.setProperty('--garment', garmentHex);
  studio.style.setProperty('--print', printHex);
  $('#previewFrontInstitute').textContent = institute;
  $('#previewBackInstitute').textContent = institute;
  $('#previewGarmentLabel').textContent = `${garment === 'tshirt' ? 'T-Shirt' : garment[0].toUpperCase()+garment.slice(1)} · ${garmentColor}`;
  $('#previewFrontMeta').textContent = `${frontPlacement[0].toUpperCase()+frontPlacement.slice(1)} chest · ${printName} print`;
  $('#previewBackMeta').textContent = `${backPlacement[0].toUpperCase()+backPlacement.slice(1)} back · ${printName} print`;
  $('#atelierSummary').textContent = `${garment === 'tshirt' ? 'T-Shirt' : garment[0].toUpperCase()+garment.slice(1)} · ${garmentColor} · ${quantity} pieces`;
}

function atelierMessage() {
  const data = new FormData($('#atelierForm'));
  const colour = $('#atelierForm input[name="garmentColor"]:checked')?.value || 'Black';
  return `CAPRA COOL — CUSTOM CAMPUS QUOTE\n\nInstitute: ${data.get('instituteName')}\nGarment: ${data.get('garment')}\nGarment colour: ${colour}\nFront placement: ${data.get('frontPlacement')}\nBack placement: ${data.get('backPlacement')}\nPrint colour: ${data.get('printColor')}\nQuantity: ${data.get('quantity')}\nNotes: ${data.get('notes') || '—'}\n\nPlease share artwork guidance, production timeline, and a quote.`;
}

function submitAtelier(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const subject = encodeURIComponent('CAPRA COOL custom campus quote request');
  const body = encodeURIComponent(atelierMessage());
  window.location.href = `mailto:${CONFIG.supportEmail}?subject=${subject}&body=${body}`;
  showToast('Opening your custom quote request in email.');
}

async function postSupabase(table, payload) {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey) throw new Error('Store data service is not configured.');
  const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${table}`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', apikey:CONFIG.supabaseKey, Authorization:`Bearer ${CONFIG.supabaseKey}`, Prefer:'return=minimal' },
    body:JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Store service returned ${response.status}.`);
}

function openCheckout() {
  if (!cart.length) { showToast('Your bag is empty.'); return; }
  closeCart();
  renderCheckoutPreview();
  $('#checkoutForm').hidden = false;
  $('#checkoutSuccess').hidden = true;
  openModal($('#checkoutModal'));
}

function renderCheckoutPreview() {
  const subtotal = cartTotal();
  const shipping = subtotal >= CONFIG.freeShipping ? 0 : CONFIG.shippingFee;
  $('#checkoutPreview').innerHTML = cart.map(item => {
    const p = productById(item.id); return `<div class="checkout-preview-row"><span>${escapeHtml(p.name)} · ${item.size} × ${item.qty}</span><strong>${money(p.price * item.qty)}</strong></div>`;
  }).join('') + `<div class="checkout-preview-row"><span>Shipping</span><strong>${shipping ? money(shipping) : 'Complimentary'}</strong></div><div class="checkout-preview-row"><span>Total</span><strong>${money(subtotal + shipping)}</strong></div>`;
}

async function submitCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const button = $('button[type="submit"]', form);
  button.disabled = true; button.textContent = 'Submitting…';
  const data = new FormData(form);
  const subtotal = cartTotal();
  const shipping = subtotal >= CONFIG.freeShipping ? 0 : CONFIG.shippingFee;
  const orderId = `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  const payload = {
    id: orderId,
    order_number: orderId,
    customer_name: String(data.get('name') || '').trim(),
    customer_phone: String(data.get('phone') || '').trim(),
    customer_email: String(data.get('email') || '').trim(),
    delivery_address: String(data.get('address') || '').trim(),
    city: String(data.get('city') || '').trim(),
    state: String(data.get('state') || '').trim(),
    pincode: String(data.get('pincode') || '').trim(),
    notes: String(data.get('notes') || '').trim(),
    payment_method: String(data.get('payment_method') || 'cod'),
    order_channel: 'web',
    items: cart.map(item => { const p = productById(item.id); return { id:item.id, name:p.name, size:item.size, qty:item.qty, unit_price:p.price }; }),
    subtotal,
    shipping_fee: shipping,
    grand_total: subtotal + shipping,
    order_status: 'pending'
  };
  try {
    await postSupabase('customer_orders', payload);
    cart = []; persistCart(); form.reset();
    $('#successOrderId').textContent = orderId;
    form.hidden = true; $('#checkoutSuccess').hidden = false;
  } catch (error) {
    console.error('Order submission failed:', error);
    showToast('We could not submit the order. Please email care@capracool.com and we’ll help immediately.');
  } finally {
    button.disabled = false; button.textContent = 'Place order';
  }
}

async function submitNewsletter(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = String(new FormData(form).get('email') || '').trim().toLowerCase();
  if (!email) return;
  const button = $('button', form); button.disabled = true;
  try {
    await postSupabase('newsletter_signups', { email });
    form.reset(); showToast('You’re on the CAPRA COOL field-notes list.');
  } catch (error) {
    if (String(error).includes('409')) showToast('That email is already on the list.');
    else { console.error('Newsletter signup failed:', error); showToast('Signup did not go through. Please try again.'); }
  } finally { button.disabled = false; }
}

function showToast(message) {
  const region = $('#toastRegion');
  const node = document.createElement('div'); node.className = 'toast'; node.textContent = message; region.appendChild(node);
  setTimeout(() => node.remove(), 3600);
}

function prepareRevealElements(root = document) {
  const elements = $$('[data-reveal]:not([data-reveal-ready])', root);
  if (!elements.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => { el.dataset.revealReady='1'; el.classList.add('is-revealed'); });
    return;
  }
  const observer = window.__capraRevealObserver || new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); entry.target.classList.remove('reveal-offset'); observer.unobserve(entry.target); }
  }), { threshold:.08, rootMargin:'0px 0px -30px' });
  window.__capraRevealObserver = observer;
  elements.forEach(el => { el.dataset.revealReady='1'; el.classList.add('reveal-offset'); observer.observe(el); });
  // Safety: animation may fail, content never stays displaced indefinitely.
  setTimeout(() => elements.forEach(el => { el.classList.add('is-revealed'); el.classList.remove('reveal-offset'); }), 1800);
}

function configureWhatsApp() {
  const button = $('#whatsappSupport');
  if (!button) return;
  if (!CONFIG.whatsapp) {
    button.textContent = 'Email order support';
    button.addEventListener('click', () => window.location.href = `mailto:${CONFIG.supportEmail}?subject=CAPRA%20COOL%20Support`);
    return;
  }
  button.addEventListener('click', () => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi CAPRA COOL, I need help with an order.')}`, '_blank', 'noopener'));
}

function bindEvents() {
  $('#cartOpen')?.addEventListener('click', openCart);
  $('#cartClose')?.addEventListener('click', closeCart);
  $('#checkoutOpen')?.addEventListener('click', openCheckout);
  $('#productAddToBag')?.addEventListener('click', addActiveProductToCart);
  $('#menuOpen')?.addEventListener('click', openMenu);
  $('#menuClose')?.addEventListener('click', closeMenu);
  $$('#mobileMenu a').forEach(link => link.addEventListener('click', closeMenu));
  $('#searchOpen')?.addEventListener('click', openSearch);
  $('#searchClose')?.addEventListener('click', closeSearch);
  $('#searchInput')?.addEventListener('input', event => runSearch(event.target.value));
  $('#pageShade')?.addEventListener('click', closeAll);
  $$('[data-modal-close]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
  $$('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }));
  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    $$('.filter-button').forEach(item => item.classList.toggle('active', item === button)); renderProducts();
  }));
  $('#sortSelect')?.addEventListener('change', event => { currentSort = event.target.value; renderProducts(); });
  $$('[data-category-jump]').forEach(card => card.addEventListener('click', () => {
    currentFilter = card.dataset.categoryJump;
    $$('.filter-button').forEach(button => button.classList.toggle('active', button.dataset.filter === currentFilter));
    renderProducts(); $('#shop')?.scrollIntoView({behavior:'smooth'});
  }));
  $('#atelierForm')?.addEventListener('input', updateAtelier);
  $('#atelierForm')?.addEventListener('change', updateAtelier);
  $('#atelierForm')?.addEventListener('submit', submitAtelier);
  $('#bulkEmailButton')?.addEventListener('click', () => window.location.href = `mailto:${CONFIG.supportEmail}?subject=CAPRA%20COOL%20Bulk%20Order`);
  $('#checkoutForm')?.addEventListener('submit', submitCheckout);
  $('#newsletterForm')?.addEventListener('submit', submitNewsletter);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll();
    if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) { event.preventDefault(); openSearch(); }
  });
  window.addEventListener('scroll', () => $('#siteHeader')?.classList.toggle('scrolled', window.scrollY > 20), {passive:true});
}

function init() {
  renderProducts();
  renderAccessories();
  renderCart();
  updateAtelier();
  runSearch('');
  configureWhatsApp();
  bindEvents();
  prepareRevealElements();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
else init();

