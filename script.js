/**
 * CAPRA COOL — Official Visual Storefront Script
 * Brand: CAPRA COOL | Crest: Alpine Mountain Ibex | Tagline: WEAR HIGHER.
 * IIT Mandi, Himalayas | 31.7086° N, 76.9419° E
 */

// --- AUTHENTIC PRODUCT CATALOG (DIRECT FROM CAPRA BRAND BOARD) ---
const PRODUCTS = [
  {
    id: "summit-tee",
    name: "Summit Tee",
    category: "tee",
    price: 799,
    image: "assets/product_summit_tee.jpg",
    color: "Ivory",
    fabric: "Premium 180 GSM Cotton",
    gsm: "180 GSM",
    fit: "Regular Everyday Explorer Fit",
    sku: "CC-TEE-001",
    badge: "BESTSELLER",
    rating: 4.8,
    reviews: 120,
    colors: ["#ede7d8", "#191a17", "#444d3d", "#505459"],
    desc: "A minimal tee for everyday explorers. Crafted with premium 180 GSM combed cotton for all-day breathability and comfort. Features the signature Capra Cool Mountain Ridge print.",
    care: "Machine wash cold with like colors. Line dry in shade. Warm iron.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "38-40\"", length: "27\"", shoulder: "18.5\"" },
      M: { chest: "40-42\"", length: "28\"", shoulder: "19.5\"" },
      L: { chest: "42-44\"", length: "29\"", shoulder: "20.5\"" },
      XL: { chest: "44-46\"", length: "30\"", shoulder: "21.5\"" },
      XXL: { chest: "46-48\"", length: "31\"", shoulder: "22.5\"" }
    }
  },
  {
    id: "alpine-hoodie",
    name: "Alpine Hoodie",
    category: "hoodie",
    price: 1499,
    image: "assets/product_alpine_hoodie.jpg",
    color: "Olive Drab",
    fabric: "380 GSM Brushed Cotton Fleece",
    gsm: "380 GSM",
    fit: "Structured Athletic Fit",
    sku: "CC-HD-001",
    badge: "SIGNATURE IBEX",
    rating: 4.9,
    reviews: 86,
    colors: ["#191a17", "#3f4a39", "#989386"],
    desc: "Built for higher days and chilly mountain morning roads. Premium brushed fleece with the iconic Capra Alpine Ibex emblem printed cleanly on the back.",
    care: "Gentle machine cycle. Hang dry in shade. Do not iron directly on emblem.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "42-44\"", length: "27\"", shoulder: "20\"" },
      M: { chest: "44-46\"", length: "28\"", shoulder: "21\"" },
      L: { chest: "46-48\"", length: "29\"", shoulder: "22\"" },
      XL: { chest: "48-50\"", length: "30\"", shoulder: "23\"" },
      XXL: { chest: "50-52\"", length: "31\"", shoulder: "24\"" }
    }
  },
  {
    id: "trail-tracksuit",
    name: "Trail Tracksuit",
    category: "track",
    price: 1999,
    image: "assets/product_trail_tracksuit.jpg",
    color: "Deep Olive",
    fabric: "Technical Double-Knit Poly-Cotton",
    gsm: "340 GSM",
    fit: "2-Piece Outerwear Set",
    sku: "CC-TRK-001",
    badge: "COMPLETE SUIT",
    rating: 4.7,
    reviews: 54,
    colors: ["#3d4937", "#1c1c1a"],
    desc: "The complete mountain uniform. Includes our mock-neck full-zip athletic jacket and matching tapered trackpants with the signature Capra mountain goat insignia.",
    care: "Machine wash cold. Fasten zips before washing. Air dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "Chest 40\" / Waist 30\"", length: "Top 27\" / Pants 39\"", shoulder: "Raglan" },
      M: { chest: "Chest 42\" / Waist 32\"", length: "Top 28\" / Pants 40\"", shoulder: "Raglan" },
      L: { chest: "Chest 44\" / Waist 34\"", length: "Top 29\" / Pants 41\"", shoulder: "Raglan" },
      XL: { chest: "Chest 46\" / Waist 36\"", length: "Top 30\" / Pants 42\"", shoulder: "Raglan" },
      XXL: { chest: "Chest 48\" / Waist 38\"", length: "Top 31\" / Pants 43\"", shoulder: "Raglan" }
    }
  },
  {
    id: "classic-tee",
    name: "Capra Classic Tee",
    category: "tee",
    price: 799,
    image: "assets/product_classic_tee.jpg",
    color: "Jet Black",
    fabric: "180 GSM Heavy Combed Cotton",
    gsm: "180 GSM",
    fit: "Relaxed Boxy Streetwear Cut",
    sku: "CC-TEE-002",
    badge: "CORE ICON",
    rating: 4.6,
    reviews: 78,
    colors: ["#191a17", "#ede7d8", "#444d3d"],
    desc: "A bold essential featuring the original CAPRA COOL chest typographical wordmark. Dense long-staple cotton engineered to resist collar stretching over years of repeat wear.",
    care: "Machine wash cold inside-out. Do not bleach. Cool iron.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "38-40\"", length: "27\"", shoulder: "18.5\"" },
      M: { chest: "40-42\"", length: "28\"", shoulder: "19.5\"" },
      L: { chest: "42-44\"", length: "29\"", shoulder: "20.5\"" },
      XL: { chest: "44-46\"", length: "30\"", shoulder: "21.5\"" },
      XXL: { chest: "46-48\"", length: "31\"", shoulder: "22.5\"" }
    }
  },
  {
    id: "horizon-hoodie",
    name: "Horizon Hoodie",
    category: "hoodie",
    price: 1499,
    image: "assets/product_horizon_hoodie.jpg",
    color: "Desert Cream",
    fabric: "380 GSM Heavy Fleece",
    gsm: "380 GSM",
    fit: "Structured Drop-Shoulder",
    sku: "CC-HD-002",
    badge: "MOUNTAIN ART",
    rating: 4.8,
    reviews: 91,
    colors: ["#d8d3c5", "#191a17", "#3f4a39"],
    desc: "Heavyweight brushed fleece featuring the scenic Himalayan Peaks backprint and CAPRA COOL graphic. Built for warmth on high Himalayan treks and urban transits.",
    care: "Cold gentle wash. Line dry in shade. Do not tumble dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "42-44\"", length: "27\"", shoulder: "20\"" },
      M: { chest: "44-46\"", length: "28\"", shoulder: "21\"" },
      L: { chest: "46-48\"", length: "29\"", shoulder: "22\"" },
      XL: { chest: "48-50\"", length: "30\"", shoulder: "23\"" },
      XXL: { chest: "50-52\"", length: "31\"", shoulder: "24\"" }
    }
  },
  {
    id: "peak-tracksuit",
    name: "Peak Tracksuit",
    category: "track",
    price: 1999,
    image: "assets/product_peak_tracksuit.jpg",
    color: "Basalt Black",
    fabric: "Technical Double-Knit Jersey",
    gsm: "340 GSM",
    fit: "Tapered Performance Cut",
    sku: "CC-TRK-002",
    badge: "UTILITY",
    rating: 4.7,
    reviews: 62,
    colors: ["#191a17", "#394134"],
    desc: "Technical tapered athletic suit with white piping, elasticated waistband, drawstring fastening, deep zippered utility pockets, and the white Capra mountain goat crest.",
    care: "Wash with like colors. Do not iron over logo. Low tumble dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "Waist 28-30\"", length: "39\"", shoulder: "Thigh 23\"" },
      M: { chest: "Waist 31-33\"", length: "40\"", shoulder: "Thigh 24\"" },
      L: { chest: "Waist 34-36\"", length: "41\"", shoulder: "Thigh 25\"" },
      XL: { chest: "Waist 37-39\"", length: "42\"", shoulder: "Thigh 26\"" },
      XXL: { chest: "Waist 40-42\"", length: "43\"", shoulder: "Thigh 27\"" }
    }
  }
];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("capraCoolCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("capraCoolWishlist") || "[]");
let selectedProduct = null;
let selectedSize = null;
let activeCategory = "all";
let activeSort = "featured";

// Global Store Configuration
const CONFIG = {
  FREE_SHIPPING_THRESHOLD: 999, // As shown on brand board: Free Shipping (₹999+)
  SHIPPING_FEE: 99,
  WHATSAPP_NUMBER: "919999999999",
  STORE_EMAIL: "care@capracool.com"
};

// Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const formatMoney = num => "₹" + Number(num).toLocaleString("en-IN");

// --- PERSISTENCE & CART ---
function saveCart() {
  localStorage.setItem("capraCoolCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId, size, qty = 1) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      color: prod.color,
      category: prod.category,
      size: size,
      qty: qty
    });
  }

  saveCart();
  showToast(`Added ${prod.name} (${size}) to bag`);
  openDrawer();
}

function updateItemQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeItem(index) {
  if (!cart[index]) return;
  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  showToast(`Removed ${removedName} from bag`);
}

function clearCart() {
  cart = [];
  saveCart();
  showToast("Bag cleared");
}

// --- CART DRAWER RENDERING ---
function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const headerCount = $("#headerBagCount");
  if (headerCount) headerCount.textContent = totalCount;

  const drawerCount = $("#drawerItemCount");
  if (drawerCount) drawerCount.textContent = `(${totalCount})`;

  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const trackerMsg = $("#shippingTrackerMsg");
  const trackerFill = $("#shippingTrackerFill");
  if (trackerMsg && trackerFill) {
    if (subtotal === 0) {
      trackerMsg.innerHTML = `<span>Free shipping on orders above ${formatMoney(CONFIG.FREE_SHIPPING_THRESHOLD)}</span>`;
      trackerFill.style.width = "0%";
      trackerFill.classList.remove("unlocked");
    } else if (isFreeShip) {
      trackerMsg.innerHTML = `<span style="color:var(--green);font-weight:700">✓ Free Express Shipping Unlocked!</span>`;
      trackerFill.style.width = "100%";
      trackerFill.classList.add("unlocked");
    } else {
      const remaining = CONFIG.FREE_SHIPPING_THRESHOLD - subtotal;
      const pct = Math.min(100, Math.round((subtotal / CONFIG.FREE_SHIPPING_THRESHOLD) * 100));
      trackerMsg.innerHTML = `<span>Add <strong>${formatMoney(remaining)}</strong> for FREE shipping</span> <span>${pct}%</span>`;
      trackerFill.style.width = `${pct}%`;
      trackerFill.classList.remove("unlocked");
    }
  }

  const itemsContainer = $("#cartItemsList");
  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--muted);padding:40px 20px">
          <div style="font-size:44px;margin-bottom:14px;opacity:0.6">🏔️</div>
          <h3 style="font:800 18px var(--display);margin:0 0 8px;color:var(--ink)">Your bag is empty</h3>
          <p style="font-size:13px;max-width:240px;margin-bottom:20px">Discover our high-altitude essentials designed for everyday elevation.</p>
          <a href="#shop" class="btn dark" onclick="closeDrawer()">Shop Collection</a>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-variant">Size: <strong>${item.size}</strong> · ${item.color}</div>
            </div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" onclick="updateItemQty(${idx}, -1)" aria-label="Decrease">−</button>
                <span>${item.qty}</span>
                <button type="button" onclick="updateItemQty(${idx}, 1)" aria-label="Increase">+</button>
              </div>
              <div class="cart-item-price">${formatMoney(item.price * item.qty)}</div>
            </div>
            <button type="button" class="cart-remove-btn" onclick="removeItem(${idx})">Remove</button>
          </div>
        </div>
      `).join("");
    }
  }

  const subtotalEl = $("#cartSubtotal");
  const shippingEl = $("#cartShipping");
  const totalEl = $("#cartTotal");
  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (shippingEl) shippingEl.textContent = subtotal === 0 ? "—" : (isFreeShip ? "FREE" : formatMoney(CONFIG.SHIPPING_FEE));
  if (totalEl) totalEl.textContent = formatMoney(grandTotal);

  const checkoutBtn = $("#checkoutProceedBtn");
  const quickWaBtn = $("#quickWhatsAppBtn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  if (quickWaBtn) quickWaBtn.disabled = cart.length === 0;
}

// --- WISHLIST TOGGLE ---
function toggleWishlist(productId, btn) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove("active");
    btn.innerHTML = "♡";
    showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    btn.classList.add("active");
    btn.innerHTML = "♥";
    showToast("Added to wishlist");
  }
  localStorage.setItem("capraCoolWishlist", JSON.stringify(wishlist));
}

// --- DYNAMIC PRODUCT GRID RENDERING ---
function renderProducts() {
  const container = $("#productsGrid");
  if (!container) return;

  // Filter
  let list = activeCategory === "all" ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === activeCategory);

  // Sort
  if (activeSort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  container.innerHTML = list.map(p => {
    const isWished = wishlist.includes(p.id);
    const colorDots = p.colors ? p.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join("") : "";

    return `
      <article class="product" data-product-id="${p.id}" data-cat="${p.category}" data-name="${p.name}" data-price="${p.price}">
        <div class="visual">
          <span class="visual-badge">${p.badge || p.gsm}</span>
          <button type="button" class="wish-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" aria-label="Add to wishlist">
            ${isWished ? '♥' : '♡'}
          </button>
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-meta">
          <div>
            <h3 onclick="triggerQuickView('${p.id}')">${p.name}</h3>
            <small>${p.fabric} · ${p.color}</small>
          </div>
          <div class="product-price">${formatMoney(p.price)}</div>
        </div>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span>${p.rating} (${p.reviews})</span>
        </div>
        <div class="color-dots">${colorDots}</div>
        <div class="product-actions">
          <button type="button" class="add-btn" onclick="triggerSizeSelector('${p.id}')">
            <span>Choose Size</span>
          </button>
          <button type="button" class="details-btn" onclick="triggerQuickView('${p.id}')" title="Product details">ℹ</button>
        </div>
      </article>
    `;
  }).join("");

  const countEl = $("#catalogInfoCount");
  if (countEl) {
    countEl.textContent = `Showing ${list.length} item${list.length === 1 ? '' : 's'}`;
  }
}

// --- MODAL CONTROLS ---
function openModal(id) {
  const modal = $(id);
  const shade = $("#shade");
  if (modal) modal.classList.add("open");
  if (shade) shade.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = $(id);
  if (modal) modal.classList.remove("open");
  if (!document.querySelector(".modal.open") && !$("#bagDrawer")?.classList.contains("open")) {
    const shade = $("#shade");
    if (shade) shade.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function closeAllModals() {
  $$(".modal.open").forEach(m => m.classList.remove("open"));
  closeDrawer();
  closeSearch();
  closeMobileNav();
  const shade = $("#shade");
  if (shade) shade.classList.remove("open");
  document.body.style.overflow = "";
}

function openDrawer() {
  const drawer = $("#bagDrawer");
  const shade = $("#shade");
  if (drawer) drawer.classList.add("open");
  if (shade) shade.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = $("#bagDrawer");
  if (drawer) drawer.classList.remove("open");
  if (!document.querySelector(".modal.open")) {
    const shade = $("#shade");
    if (shade) shade.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openMobileNav() {
  const drawer = $("#mobileNavDrawer");
  if (drawer) drawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  const drawer = $("#mobileNavDrawer");
  if (drawer) drawer.classList.remove("open");
  document.body.style.overflow = "";
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, duration = 3000) {
  let container = $("#toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span style="color:var(--accent);font-weight:bold">⌃</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- SIZE SELECTOR MODAL ---
function triggerSizeSelector(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  selectedProduct = prod;
  selectedSize = null;

  $("#sizeModalTitle").textContent = prod.name;
  $("#sizeModalPrice").textContent = formatMoney(prod.price);
  $("#sizeModalColor").textContent = `${prod.fabric} · ${prod.color}`;
  $("#sizeModalThumb").src = prod.image;
  $("#sizeModalThumb").alt = prod.name;

  const sizesGrid = $("#sizeModalButtons");
  sizesGrid.innerHTML = prod.sizes.map(s => `
    <button type="button" class="size-btn" data-size="${s}" onclick="selectSizeButton(this, '${s}')">${s}</button>
  `).join("");

  const tableContainer = $("#sizeModalChart");
  if (tableContainer && prod.chart) {
    let rows = Object.entries(prod.chart).map(([sz, meas]) => `
      <tr>
        <td><strong>${sz}</strong></td>
        <td>${meas.chest}</td>
        <td>${meas.length}</td>
        <td>${meas.shoulder}</td>
      </tr>
    `).join("");
    tableContainer.innerHTML = `
      <table class="size-table">
        <thead><tr><th>Size</th><th>Chest/Waist</th><th>Length</th><th>Shoulder</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    tableContainer.style.display = "none";
  }

  openModal("#sizeModal");
}

function selectSizeButton(btn, size) {
  $$("#sizeModalButtons .size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSize = size;
}

function toggleSizeGuide() {
  const chart = $("#sizeModalChart");
  if (chart) {
    const isHidden = chart.style.display === "none";
    chart.style.display = isHidden ? "block" : "none";
    $("#sizeGuideToggleText").textContent = isHidden ? "Hide size chart ▲" : "View garment size chart ▼";
  }
}

function confirmSizeSelection() {
  if (!selectedSize) {
    showToast("Please pick a size (S–XXL)");
    return;
  }
  if (!selectedProduct) return;
  addToCart(selectedProduct.id, selectedSize, 1);
  closeModal("#sizeModal");
}

// --- QUICK VIEW MODAL ---
function triggerQuickView(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  selectedProduct = prod;
  selectedSize = null;

  $("#quickViewImg").src = prod.image;
  $("#quickViewImg").alt = prod.name;
  $("#quickViewTitle").textContent = prod.name;
  $("#quickViewPrice").textContent = `${formatMoney(prod.price)} (Inclusive of all taxes)`;
  $("#quickViewDesc").textContent = prod.desc;
  $("#quickViewSpecs").innerHTML = `
    <div><strong>Fabric:</strong> ${prod.fabric}</div>
    <div><strong>Weight:</strong> ${prod.gsm}</div>
    <div><strong>Fit:</strong> ${prod.fit}</div>
    <div><strong>Colorway:</strong> ${prod.color}</div>
    <div><strong>SKU:</strong> ${prod.sku}</div>
    <div><strong>Care:</strong> ${prod.care}</div>
  `;

  const sizesGrid = $("#quickViewSizes");
  sizesGrid.innerHTML = prod.sizes.map(s => `
    <button type="button" class="size-btn" data-size="${s}" onclick="selectQuickViewSize(this, '${s}')">${s}</button>
  `).join("");

  const chartEl = $("#quickViewChart");
  if (chartEl && prod.chart) {
    let rows = Object.entries(prod.chart).map(([sz, meas]) => `
      <tr>
        <td><strong>${sz}</strong></td>
        <td>${meas.chest}</td>
        <td>${meas.length}</td>
        <td>${meas.shoulder}</td>
      </tr>
    `).join("");
    chartEl.innerHTML = `
      <table class="size-table">
        <thead><tr><th>Size</th><th>Chest/Waist</th><th>Length</th><th>Shoulder</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  openModal("#quickViewModal");
}

function selectQuickViewSize(btn, size) {
  $$("#quickViewSizes .size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSize = size;
}

function confirmQuickViewAdd() {
  if (!selectedSize) {
    showToast("Please choose a size first");
    return;
  }
  if (!selectedProduct) return;
  addToCart(selectedProduct.id, selectedSize, 1);
  closeModal("#quickViewModal");
}

// --- BRAND BOARD MODAL ---
function openBrandBoardModal() {
  openModal("#brandBoardModal");
}

function openVideoTeaserModal() {
  openModal("#videoTeaserModal");
}

// --- SEARCH OVERLAY ---
function openSearch() {
  const panel = $("#searchPanel");
  const input = $("#searchInput");
  if (panel) panel.classList.add("open");
  if (input) {
    input.value = "";
    input.focus();
  }
  runSearch("");
  document.body.style.overflow = "hidden";
}

function closeSearch() {
  const panel = $("#searchPanel");
  if (panel) panel.classList.remove("open");
  document.body.style.overflow = "";
}

function runSearch(query) {
  const resultsContainer = $("#searchResults");
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  const matched = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    p.color.toLowerCase().includes(q) || 
    p.fabric.toLowerCase().includes(q)
  );

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<p style="color:var(--muted);padding:20px 0">No pieces found matching "${query}". Try "tee", "hoodie", or "tracksuit".</p>`;
    return;
  }

  resultsContainer.innerHTML = matched.map(p => `
    <div class="search-result-item" onclick="jumpToProduct('${p.id}', '${p.category}')">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="search-result-thumb"><img src="${p.image}" alt="${p.name}"></div>
        <div>
          <div style="font:700 15px var(--display)">${p.name}</div>
          <div style="font-size:11px;color:var(--muted)">${p.fabric} · ${p.color}</div>
        </div>
      </div>
      <div style="font:700 15px var(--display)">${formatMoney(p.price)}</div>
    </div>
  `).join("");
}

function jumpToProduct(productId, category) {
  closeSearch();
  filterProducts(category);
  const el = $(`[data-product-id="${productId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.boxShadow = "0 0 0 2px var(--ink)";
    setTimeout(() => { el.style.boxShadow = ""; }, 1200);
  }
}

function filterProducts(cat) {
  activeCategory = cat;
  $$(".filter").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === cat);
  });
  renderProducts();
}

function sortProducts(sortBy) {
  activeSort = sortBy;
  renderProducts();
}

// --- CHECKOUT FLOW ---
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your bag is empty");
    return;
  }
  closeDrawer();
  renderCheckoutPreview();
  switchCheckoutTab("whatsapp");
  openModal("#checkoutModal");
}

function switchCheckoutTab(tab) {
  $$(".checkout-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  const isWa = tab === "whatsapp";
  $("#checkoutWhatsappTab").style.display = isWa ? "block" : "none";
  $("#checkoutDirectTab").style.display = isWa ? "none" : "block";
}

function renderCheckoutPreview() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const preview = $("#checkoutItemsPreview");
  if (preview) {
    preview.innerHTML = cart.map(i => `
      <div style="display:flex;justify-content:space-between;padding:4px 0">
        <span>${i.name} (${i.size}) × ${i.qty}</span>
        <strong>${formatMoney(i.price * i.qty)}</strong>
      </div>
    `).join("") + `
      <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)">
        <span>Subtotal</span>
        <span>${formatMoney(subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0">
        <span>Shipping ${isFreeShip ? '(Free above ₹999)' : ''}</span>
        <span>${isFreeShip ? 'FREE' : formatMoney(shippingFee)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:15px;color:var(--ink);padding-top:6px">
        <span>Total Payable</span>
        <span>${formatMoney(grandTotal)}</span>
      </div>
    `;
  }
}

function handleWhatsAppOrder(e) {
  e.preventDefault();
  if (cart.length === 0) return;

  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const pincode = form.pincode.value.trim();
  const notes = form.notes ? form.notes.value.trim() : "";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const itemsList = cart.map((item, i) => 
    `${i + 1}. *${item.name}* (Size: ${item.size}) | Qty: ${item.qty} | ${formatMoney(item.price * item.qty)}`
  ).join("\n");

  const message = 
`🏔️ *CAPRA COOL — NEW ORDER REQUEST*

*CUSTOMER DETAILS:*
• Name: ${name}
• WhatsApp / Phone: ${phone}
• Delivery Address: ${address}
• PIN Code: ${pincode}
${notes ? `• Special Notes: ${notes}\n` : ''}
*ORDER ITEMS:*
${itemsList}

*SUMMARY:*
• Subtotal: ${formatMoney(subtotal)}
• Shipping: ${isFreeShip ? 'FREE' : formatMoney(shippingFee)}
• *TOTAL AMOUNT: ${formatMoney(grandTotal)}*

Please confirm order receipt and share delivery tracking once dispatched. Thank you!`;

  const encodedUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const orderId = `CC-${Date.now().toString().slice(-6)}`;
  showOrderSuccess(orderId, name, grandTotal, "WhatsApp Order");
  window.open(encodedUrl, "_blank");
}

function handleDirectOrder(e) {
  e.preventDefault();
  if (cart.length === 0) return;

  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const address = form.address.value.trim();
  const city = form.city.value.trim();
  const state = form.state.value.trim();
  const pincode = form.pincode.value.trim();
  const paymentMethod = form.payment_method.value;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const orderId = `CC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const orderRecord = {
    orderId,
    date: new Date().toISOString(),
    customer: { name, phone, email, address, city, state, pincode },
    paymentMethod,
    items: [...cart],
    subtotal,
    shippingFee,
    grandTotal
  };

  const existingOrders = JSON.parse(localStorage.getItem("capraCoolOrders") || "[]");
  existingOrders.unshift(orderRecord);
  localStorage.setItem("capraCoolOrders", JSON.stringify(existingOrders));

  cart = [];
  saveCart();

  showOrderSuccess(orderId, name, grandTotal, paymentMethod);
}

function showOrderSuccess(orderId, customerName, total, paymentMethod) {
  closeModal("#checkoutModal");

  const successView = $("#orderSuccessModal");
  if (successView) {
    $("#successCustomerName").textContent = customerName;
    $("#successOrderId").textContent = orderId;
    $("#successOrderTotal").textContent = formatMoney(total);
    $("#successPaymentMethod").textContent = paymentMethod === "cod" ? "Cash on Delivery" : (paymentMethod === "upi" ? "UPI / QR Payment" : paymentMethod);
    
    const waShareBtn = $("#receiptWhatsAppShareBtn");
    if (waShareBtn) {
      waShareBtn.onclick = () => {
        const msg = `Hi Capra Cool, I placed order #${orderId} (${formatMoney(total)}). Please share dispatch tracking!`;
        window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
      };
    }

    openModal("#orderSuccessModal");
  } else {
    showToast(`Order confirmed! ID: ${orderId}`);
  }
}

// --- INITIALIZATION ---
function initApp() {
  renderProducts();
  renderCart();

  // Category filter clicks
  $$(".filter").forEach(btn => {
    btn.addEventListener("click", () => filterProducts(btn.dataset.filter));
  });

  // Sort dropdown
  const sortEl = $("#sortSelect");
  if (sortEl) {
    sortEl.addEventListener("change", e => sortProducts(e.target.value));
  }

  // Header Scroll Shrink & Back to Top visibility
  const header = $("#mainHeader");
  const backToTopBtn = $("#backToTopBtn");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (header) {
      if (y > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (backToTopBtn) {
      if (y > 400) backToTopBtn.classList.add("visible");
      else backToTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Drawer & Search Toggles
  const bagBtn = $("#openBagBtn");
  if (bagBtn) bagBtn.addEventListener("click", openDrawer);

  const closeBagBtn = $("#closeBagBtn");
  if (closeBagBtn) closeBagBtn.addEventListener("click", closeDrawer);

  const searchBtn = $("#searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", openSearch);

  const closeSearchBtn = $("#closeSearchBtn");
  if (closeSearchBtn) closeSearchBtn.addEventListener("click", closeSearch);

  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => runSearch(e.target.value));
  }

  // Keyboard shortcut
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Shade backdrop
  const shade = $("#shade");
  if (shade) shade.addEventListener("click", closeAllModals);

  // Mobile menu
  const mobileMenuBtn = $("#mobileMenuBtn");
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileNav);

  const closeMobileNavBtn = $("#closeMobileNavBtn");
  if (closeMobileNavBtn) closeMobileNavBtn.addEventListener("click", closeMobileNav);

  // Forms
  const waForm = $("#whatsappOrderForm");
  if (waForm) waForm.addEventListener("submit", handleWhatsAppOrder);

  const directForm = $("#directOrderForm");
  if (directForm) directForm.addEventListener("submit", handleDirectOrder);

  const checkoutProceedBtn = $("#checkoutProceedBtn");
  if (checkoutProceedBtn) checkoutProceedBtn.addEventListener("click", openCheckoutModal);

  const quickWaBtn = $("#quickWhatsAppBtn");
  if (quickWaBtn) {
    quickWaBtn.addEventListener("click", () => {
      openCheckoutModal();
      switchCheckoutTab("whatsapp");
    });
  }

  const newsForm = $("#newsletterForm");
  if (newsForm) {
    newsForm.addEventListener("submit", e => {
      e.preventDefault();
      showToast("Thank you for joining the Capra Cool edit.");
      e.target.reset();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Window exposure
window.addToCart = addToCart;
window.updateItemQty = updateItemQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.triggerSizeSelector = triggerSizeSelector;
window.selectSizeButton = selectSizeButton;
window.toggleSizeGuide = toggleSizeGuide;
window.confirmSizeSelection = confirmSizeSelection;
window.triggerQuickView = triggerQuickView;
window.selectQuickViewSize = selectQuickViewSize;
window.confirmQuickViewAdd = confirmQuickViewAdd;
window.openBrandBoardModal = openBrandBoardModal;
window.openVideoTeaserModal = openVideoTeaserModal;
window.openCheckoutModal = openCheckoutModal;
window.switchCheckoutTab = switchCheckoutTab;
window.closeModal = closeModal;
window.closeDrawer = closeDrawer;
window.openDrawer = openDrawer;
window.closeMobileNav = closeMobileNav;
window.jumpToProduct = jumpToProduct;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
