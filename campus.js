const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const sourceImages = import.meta.glob(['/assets/campus-approved/*.png','/assets/campus-cream/*.png','/assets/campus-new/*.png','/assets/tracksuit/iit-mandi-tracksuit-front.png','/assets/tracksuit/iit-mandi-tracksuit-back.png','/assets/tracksuit/iit-mandi-tracksuit-minimal-front-v2.png','/assets/tracksuit/iit-mandi-tracksuit-minimal-back.png'], { eager:true, query:'?url', import:'default' });
const imageUrl = (id,artwork='mountain',view=0) => CAMPUS_DESIGNS.find(design=>design.id===id)?.gallery?.[Number(view)||0] || `optimized/campus-approved/${id}-${artwork}.webp`;
const sourceUrl = (id,artwork='mountain',view=0) => sourceImages['/'+imageUrl(id,artwork,view).replace(/^optimized\//,'assets/').replace(/\.webp$/,'.png')];
const supportEmail = 'care@capracool.com';
const categories = {polo:'Polo',hoodie:'Hoodie',zip:'Zip hoodie',tee:'T-shirt',track:'Tracksuit',varsity:'Varsity jacket'};
import {CAMPUS_DESIGNS, CAMPUS_SIZES, PERSONALISATION_CENTS, campusUnitCents, CAMPUS_COMBOS, campusComboSavings, CAMPUS_ARTWORKS} from './campus-catalog.js';
const money = cents => `₹${(cents / 100).toLocaleString('en-IN',{minimumFractionDigits:cents % 100 ? 2 : 0, maximumFractionDigits:2})}`;

let category = 'all';
let query = '';
let washedOnly = false;
let sort = 'featured';
let activeDesign = null;
let activeSize = '';
let activeArtwork = 'mountain';
let previousHash = '#collection';
const dialogOpeners = new WeakMap();
const designById = id => CAMPUS_DESIGNS.find(design => design.id === id);
const availableArtworks = design => CAMPUS_ARTWORKS.filter(art=>!design.artworks||design.artworks.includes(art.id));
const artworkLabel = (design,id) => design.artworkName || CAMPUS_ARTWORKS.find(art=>art.id===id)?.name || 'Cream Mountain';
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mailLink = (subject, body) => `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

function loadBag() {
  try {
    const saved = JSON.parse(localStorage.getItem('capraCampusEnquiry') || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && designById(item.id) && CAMPUS_SIZES.includes(item.size)).map(item => ({
      id:item.id, qty:Math.min(10,Math.max(1,Math.floor(Number(item.qty) || 1))),
      size:item.size, artwork:CAMPUS_ARTWORKS.some(art=>art.id===item.artwork)?item.artwork:'mountain', personalisation:Boolean(item.personalisation && String(item.name || '').trim()), name:String(item.name || '').slice(0,40)
    })) : [];
  } catch { return []; }
}
let bag = loadBag();
const bagHasUnavailableItems = () => bag.some(item => designById(item.id).inStock === false);

function artMarkup(design, {view = 0, overview = false, loading = 'lazy', artwork = 'mountain'} = {}) {
  return `<div class="campus-photo${design.gallery?' standalone-photo':''}${overview ? ' show-overview' : ''}" data-view="${view}" data-panels="${design.panels || 2}"><img src="${imageUrl(design.id,artwork,view)}" data-design-image="${design.id}" data-artwork="${artwork}" alt="${escapeHtml(`${design.name}, IIT Mandi — ${design.colour}`)}" loading="${loading}" decoding="async"></div>`;
}
function bindImageFallbacks(root) {
  $$('img[data-design-image]',root).forEach(image => {
    image.addEventListener('error', () => { image.src = sourceUrl(image.dataset.designImage,image.dataset.artwork,image.closest('.campus-photo').dataset.view); }, {once:true});
  });
}
function matchingDesigns(search = query, selectedCategory = category) {
  const needle = search.trim().toLowerCase();
  const designs = CAMPUS_DESIGNS.filter(design =>
    (selectedCategory === 'all' || design.category === selectedCategory) &&
    (!washedOnly || design.collection === 'Washed') &&
    (!needle || `${design.name} ${design.colour} ${design.collection} ${categories[design.category]} IIT Mandi`.toLowerCase().includes(needle))
  );
  return sort === 'name' ? designs.sort((a,b) => a.name.localeCompare(b.name)) : designs;
}
function renderProducts() {
  const designs = matchingDesigns();
  $('#campusProducts').innerHTML = designs.map(design => `<article class="campus-product" data-design-id="${design.id}">
    <div class="product-art"><a class="product-image-link" href="#design/${design.id}" data-open-design="${design.id}" aria-label="View ${escapeHtml(design.name)} in ${escapeHtml(design.colour)}">${artMarkup(design,{overview:design.overview})}<span class="image-view-label">${design.overview ? 'ALL VIEWS' : 'FRONT / BACK'}</span></a>${design.inStock === false ? '<span class="stock-badge">Out of stock</span>' : ''}<button class="card-save" type="button" data-quick-save="${design.id}" ${design.inStock === false ? 'disabled' : ''} aria-label="Save ${escapeHtml(design.name)} in ${escapeHtml(design.colour)}" aria-pressed="${bag.some(item=>item.id === design.id)}">${bag.some(item=>item.id === design.id) ? '♥' : '♡'}</button></div>
    <div class="product-meta"><span>IIT MANDI / ${categories[design.category].toUpperCase()}</span>${design.collection === 'Washed' ? '<span>WASHED EDIT</span>' : ''}</div>
    <h3><a href="#design/${design.id}" data-open-design="${design.id}">${escapeHtml(design.name)}</a></h3><div class="product-bottom"><p>${escapeHtml(design.colour)}${design.gsm ? ` · ${design.gsm} GSM` : ''}</p><button type="button" data-open-design="${design.id}">${design.inStock === false ? 'View details ↗' : 'Choose size ↗'}</button></div><div class="card-prices"><strong>${money(design.priceCents)}</strong>${design.listPriceCents>design.priceCents?`<s aria-label="List price ${money(design.listPriceCents)}">${money(design.listPriceCents)}</s><span class="launch-label">LAUNCH −20%</span>`:""}</div>
  </article>`).join('') || '<div class="empty-results"><h3>No designs found.</h3><p>Try a different category or search.</p><button class="text-button" type="button" data-reset-filters>Show all designs ↗</button></div>';
  $('#campusResultCount').textContent = `${designs.length} ${designs.length === 1 ? 'style' : 'styles'}${washedOnly ? ' · Washed edit' : ''}`;
  $$('.filter-tabs button').forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  $('#inlineSearchSummary').hidden = !query && !washedOnly;
  $('#searchSummaryText').textContent = query ? `Search: “${query}”` : 'The washed edit';
  bindImageFallbacks($('#campusProducts'));
}
function setCategory(next) {
  category = next;
  washedOnly = false;
  renderProducts();
}
function openDialog(dialog, focusTarget) {
  const opener = document.activeElement;
  $$('dialog[open]').forEach(other => other.close());
  dialogOpeners.set(dialog,opener);
  dialog.showModal();
  document.body.classList.add('dialog-open');
  (focusTarget || $('[data-close-dialog]',dialog))?.focus({preventScroll:true});
}
function setGalleryView(view) {
  const photo = $('#designPhoto');
  photo.classList.toggle('standalone-photo',Boolean(activeDesign.gallery));
  if(activeDesign.gallery)$('#designImage').src=imageUrl(activeDesign.id,activeArtwork,view);
  photo.dataset.view = view === 'all' ? '0' : view;
  photo.dataset.panels = activeDesign.panels || 2;
  photo.classList.toggle('show-overview',view === 'all');
  $$('#galleryControls button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.view === String(view))));
}
function openDesign(id, updateHash = true) {
  const design = designById(id);
  if (!design) return;
  activeDesign = design;
  activeArtwork = design.defaultArtwork || 'mountain';
  $('#designArtworks').innerHTML=availableArtworks(design).map(art=>`<button type="button" data-artwork-choice="${art.id}" aria-pressed="${art.id===activeArtwork}">${artworkLabel(design,art.id)}</button>`).join('');
  $('#designArtworkNote').textContent=design.galleryNote || (design.gallery?'White mountain back artwork with the original institute emblems. Front and back views of the complete set.':CAMPUS_ARTWORKS[0].description);
  $('.personalisation-toggle').lastChild.textContent=design.category==='track'?'Add jacket name / department print (+₹51)':'Add name / department print (+₹51)';
  $('#designTitle').textContent = design.name;
  $('#designCategory').textContent = `IIT MANDI / ${categories[design.category].toUpperCase()}`;
  $('#designColour').textContent = design.colour;
  $('#designDescription').textContent = design.description;
  const image = $('#designImage');
  image.onerror = () => { image.onerror = null; image.src = sourceUrl(design.id,activeArtwork,$('#designPhoto').dataset.view); };
  image.src = imageUrl(design.id,activeArtwork);
  image.alt = `${design.name} — ${design.colour}, IIT Mandi`;
  activeSize = '';
  $('#designSizes').innerHTML = CAMPUS_SIZES.map(size=>`<button type="button" data-size="${size}" aria-pressed="false" ${design.inStock === false ? 'disabled' : ''}>${size}</button>`).join('');
  $('#designPersonalisation').disabled = design.inStock === false;
  $('#designPersonalisation').checked = Boolean(design.personalised);
  $('#designName').value = '';
  $('#personalisationField').hidden = !design.personalised;
  $('#designOptionError').hidden = true;
  $('#saveDesign').innerHTML = 'Choose a size <span aria-hidden="true">+</span>';
  const views = design.gallery ? design.gallery.map((_,index)=>[String(index),design.galleryLabels?.[index] || ['Front','Back'][index] || 'Detail']) : design.panels === 3 ? [['0','Front'],['1','Side'],['2','Back'],['all','All views']] : [['0','Front'],['1','Back'],['all','Both views']];
  $('#galleryControls').innerHTML = views.map(([view,name])=>`<button type="button" data-view="${view}" aria-pressed="false">${name}</button>`).join('');
  setGalleryView(design.overview ? 'all' : '0');
  updateDesignEnquiry();
  if (!location.hash.startsWith('#design/')) previousHash = location.hash || '#collection';
  if (updateHash) history.replaceState(null,'',`#design/${design.id}`);
  openDialog($('#campusProductDialog'));
  $('#campusProductDialog').scrollTop = 0;
}
function preference() {
  return {size:activeSize,artwork:activeArtwork,personalisation:$('#designPersonalisation').checked,name:$('#designPersonalisation').checked ? $('#designName').value.trim() : ''};
}
function designMessage(design, item = {}) {
  return `${design.name} (${design.colour})\nDesign: ${design.id}\nArtwork: ${artworkLabel(design,item.artwork||'mountain')}\nQuantity: ${item.qty || 1}\nSize preference: ${item.size || 'Please help me choose'}${item.name ? `\nName for print: ${item.name}` : ''}`;
}
function updateDesignEnquiry() {
  if (!activeDesign) return;
  const selected = preference();
  $('#designPrice').innerHTML = `<strong>${money(campusUnitCents(activeDesign,selected.personalisation))}</strong>${activeDesign.listPriceCents>activeDesign.priceCents?`<s>${money(activeDesign.listPriceCents + (selected.personalisation ? PERSONALISATION_CENTS : 0))}</s>`:''}<small>${activeDesign.category==='track'?'Jacket + trousers':activeDesign.listPriceCents>activeDesign.priceCents?'20% launch discount on garment':'Price per garment'} · ${selected.personalisation ? `${money(PERSONALISATION_CENTS)} print added` : 'Name / department print +₹51'}</small>`;
  if (activeSize) $('#saveDesign').innerHTML = `Add to bag — ${money(campusUnitCents(activeDesign,selected.personalisation))} <span aria-hidden="true">+</span>`;
  $('#saveDesign').disabled = activeDesign.inStock === false;
  if (activeDesign.inStock === false) {
    $('#saveDesign').textContent = 'Out of stock';
    $('#designPrice').insertAdjacentHTML('beforeend','<p class="stock-status" role="status">Out of stock in all sizes.</p>');
  }
  $('#enquireDesign').href = mailLink(`IIT Mandi enquiry — ${activeDesign.name}`,`Hello CAPRA COOL,\n\nPlease confirm price, available sizes and delivery for:\n\n${designMessage(activeDesign,preference())}\n\nThank you.`);
}
function saveDesign(id, item = {}) {
  const design = designById(id);
  if (!design) return;
  if (design.inStock === false) { showToast('This colour is currently out of stock.'); return; }
  const size = String(item.size || '').slice(0,20);
  const name = String(item.name || '').slice(0,40);
  const personalisation = Boolean(item.personalisation);
  const artwork=CAMPUS_ARTWORKS.some(art=>art.id===item.artwork)?item.artwork:'mountain';
  const existing = bag.find(entry => entry.id === id && entry.artwork === artwork && entry.size === size && entry.name === name && entry.personalisation === personalisation);
  if (existing) existing.qty = Math.min(10, existing.qty + 1);
  else bag.push({id,size,artwork,name,personalisation,qty:1});
  persistBag();
  showToast(`${design.name} added to your bag.`);
}
function persistBag() {
  try { localStorage.setItem('capraCampusEnquiry',JSON.stringify(bag)); } catch { /* In-memory selection remains usable. */ }
  renderBag();
  renderProducts();
}
function bagTotals() {
  const subtotal = bag.reduce((total,item)=>total+campusUnitCents(designById(item.id),item.personalisation)*item.qty,0);
  const {discountCents:discount}=campusComboSavings(bag);
  const shipping = subtotal && subtotal-discount < 99900 ? 9900 : 0;
  return {subtotal,discount,shipping,total:subtotal-discount+shipping};
}
function renderBag() {
  $('#campusBagCount').textContent = bag.reduce((total,item)=>total+item.qty,0);
  $('#enquiryBagItems').innerHTML = bag.length ? bag.map((item,index)=> {
    const design = designById(item.id);
    return `<article class="enquiry-item">${artMarkup(design,{overview:true,artwork:item.artwork})}<div><strong>${escapeHtml(design.name)}</strong><p>${escapeHtml(design.colour)} · ${money(campusUnitCents(design,item.personalisation) * item.qty)}</p><small>${escapeHtml(artworkLabel(designById(item.id),item.artwork))}<br>Size: ${escapeHtml(item.size)}${item.name ? `<br>Name / department: ${escapeHtml(item.name)} (+₹51 each)` : ''}</small><div class="quantity-controls"><button type="button" data-quantity="-1" data-index="${index}" aria-label="Decrease ${escapeHtml(design.name)} quantity">−</button><span>${item.qty}</span><button type="button" data-quantity="1" data-index="${index}" aria-label="Increase ${escapeHtml(design.name)} quantity">+</button></div></div><button type="button" class="remove-design" data-remove="${index}" aria-label="Remove ${escapeHtml(design.name)}">×</button></article>`;
  }).join('') : '<div class="empty-bag"><span aria-hidden="true">↗</span><h3>Find a design you like.</h3><p>Your campus pieces will appear here.</p><button class="text-button" type="button" data-close-dialog>Explore the collection ↗</button></div>';
  const email = $('#emailCampusBag');
  $$('.enquiry-item', $('#enquiryBagItems')).forEach((row,index) => {
    if (designById(bag[index].id).inStock !== false) return;
    $('small',row).insertAdjacentHTML('beforeend','<br><span class="stock-status">Out of stock · Remove this item to continue.</span>');
    $$('[data-quantity]',row).forEach(button => { button.disabled = true; });
  });
  email.hidden = !bag.length;
  email.href = mailLink('IIT Mandi collection enquiry',`Hello CAPRA COOL,\n\nPlease confirm prices, sizes, availability and delivery for these designs:\n\n${bag.map(item=>designMessage(designById(item.id),item)).join('\n\n')}\n\nThank you.`);
  const totals = bagTotals();
  $('#campusBagTotals').innerHTML = `<div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>${totals.discount?`<div class="combo-saving"><span>Combo saving</span><strong>−${money(totals.discount)}</strong></div>`:''}<div><span>Shipping</span><span>${totals.shipping ? money(totals.shipping) : bag.length ? 'Free' : '—'}</span></div><div><span>Total</span><strong>${money(totals.total)}</strong></div><small>Free shipping from ₹999 after savings. Personalisation charged per garment.</small>`;
  $('#campusCheckoutOpen').disabled = !bag.length || bagHasUnavailableItems();
  if (bagHasUnavailableItems()) $('#campusBagTotals').insertAdjacentHTML('beforeend','<p class="stock-status" role="status">Remove the out-of-stock item to continue to checkout.</p>');
  bindImageFallbacks($('#enquiryBagItems'));
}
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $('#campusToast');
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(()=>toast.classList.remove('visible'),3000);
}
function renderSearch() {
  const term = $('#campusSearchInput').value.trim().toLowerCase();
  const results = CAMPUS_DESIGNS.filter(design => `${design.name} ${design.colour} ${design.collection} ${categories[design.category]}`.toLowerCase().includes(term));
  $('#campusSearchResults').innerHTML = results.length ? results.map(design=>`<button type="button" class="search-design" data-open-design="${design.id}">${artMarkup(design,{overview:true})}<span><strong>${escapeHtml(design.name)}</strong><small>${escapeHtml(design.colour)}</small></span><span aria-hidden="true">↗</span></button>`).join('') : '<p class="search-empty">No matching designs. Try “polo”, “hoodie” or “washed”.</p>';
  bindImageFallbacks($('#campusSearchResults'));
}
function openSearch() {
  $('#campusSearchInput').value = query;
  renderSearch();
  openDialog($('#campusSearchDialog'),$('#campusSearchInput'));
}
document.addEventListener('click',event => {
  const open = event.target.closest('[data-open-design]');
  if (open) { event.preventDefault(); openDesign(open.dataset.openDesign); return; }
  const quickSave = event.target.closest('[data-quick-save]');
  if (quickSave) {
    openDesign(quickSave.dataset.quickSave);
    return;
  }
  const close = event.target.closest('[data-close-dialog]');
  if (close) { close.closest('dialog')?.close(); return; }
  if (event.target.closest('[data-reset-filters]')) { query=''; washedOnly=false; setCategory('all'); }
});
$$('[data-category]').forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.category)));
$$('[data-nav-category]').forEach(link=>link.addEventListener('click',()=>{query='';setCategory(link.dataset.navCategory);}));
$('#campusSort').addEventListener('change',event=>{sort=event.target.value;renderProducts();});
$('#campusSearchOpen').addEventListener('click',openSearch);
$('#campusSearchInput').addEventListener('input',renderSearch);
$('#campusSearchInput').addEventListener('keydown',event=>{
  if (event.key === 'Enter') { event.preventDefault(); query=event.currentTarget.value.trim(); category='all'; washedOnly=false; $('#campusSearchDialog').close(); renderProducts(); $('#collection').scrollIntoView({behavior:'smooth'}); }
});
$('#clearCampusSearch').addEventListener('click',()=>{query='';washedOnly=false;renderProducts();});
$('#showWashed').addEventListener('click',()=>{query='';category='all';washedOnly=true;renderProducts();$('#collection').scrollIntoView({behavior:'smooth'});});
$('#galleryControls').addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(button)setGalleryView(button.dataset.view);});
$('#saveDesign').addEventListener('click',()=>{
  if (!activeDesign || activeDesign.inStock === false) return;
  const selected=preference();
  if(!selected.size || (selected.personalisation && !selected.name)) {
    $('#designOptionError').textContent=!selected.size ? 'Choose your size to continue.' : 'Enter the name or department you want printed.';
    $('#designOptionError').hidden=false;
    (!selected.size ? $('#designSizes button') : $('#designName')).focus();return;
  }
  saveDesign(activeDesign.id,selected);$('#campusProductDialog').close();openDialog($('#campusBagDialog'));
});
$('#designSizes').addEventListener('click',event=>{const button=event.target.closest('[data-size]');if(!button)return;activeSize=button.dataset.size;$$('#designSizes button').forEach(chip=>chip.setAttribute('aria-pressed',String(chip===button)));$('#designOptionError').hidden=true;updateDesignEnquiry();});
$('#designPersonalisation').addEventListener('change',event=>{$('#personalisationField').hidden=!event.target.checked;updateDesignEnquiry();});
$('#designName').addEventListener('input',updateDesignEnquiry);
$('#campusBagOpen').addEventListener('click',()=>{renderBag();openDialog($('#campusBagDialog'));});
$('#enquiryBagItems').addEventListener('click',event=>{
  const remove=event.target.closest('[data-remove]');
  const quantity=event.target.closest('[data-quantity]');
  if(remove)bag.splice(Number(remove.dataset.remove),1);
  else if(quantity){const index=Number(quantity.dataset.index);bag[index].qty=Math.min(10,Math.max(1,bag[index].qty+Number(quantity.dataset.quantity)));}
  else return;
  persistBag();
  if (!bag.length) $('[data-close-dialog]',$('#campusBagDialog')).focus();
});
$$('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{
    if(event.target !== dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');
    if(dialog.id==='campusProductDialog' && location.hash.startsWith('#design/'))history.replaceState(null,'',previousHash);
    const opener=dialogOpeners.get(dialog);
    if(!document.querySelector('dialog[open]')) {
      if(opener?.isConnected && !opener.closest('dialog:not([open])'))opener.focus({preventScroll:true});
      else $('#campusBagOpen').focus({preventScroll:true});
    }
  });
});
$('#campusBulkForm').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const body=`Hello CAPRA COOL,\n\nIIT Mandi group enquiry\nGroup: ${data.get('group')}\nGarment: ${data.get('garment')}\nApprox. quantity: ${data.get('quantity')}\nNotes: ${data.get('notes') || 'None'}\n\nPlease share pricing, size guidance and production timelines.`;
  $('#bulkEmailDraft').href=mailLink('IIT Mandi — group order enquiry',body);
  $('#bulkDraftReady').hidden=false;
  $('#bulkEmailDraft').focus();
});
document.addEventListener('keydown',event=>{
  if(event.key==='/' && !document.querySelector('dialog[open]') && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();openSearch();}
});
$('#campusCheckoutOpen').addEventListener('click',()=>{
  if(!bag.length || bagHasUnavailableItems())return;
  const totals=bagTotals();
  $('#campusCheckoutSummary').innerHTML=bag.map(item=>`<div><span>${escapeHtml(designById(item.id).name)} · ${escapeHtml(item.size)} × ${item.qty}<small> · ${escapeHtml(artworkLabel(designById(item.id),item.artwork))}</small>${item.name ? `<br><small>Print: ${escapeHtml(item.name)}</small>` : ''}</span><strong>${money(campusUnitCents(designById(item.id),item.personalisation)*item.qty)}</strong></div>`).join('')+`${totals.discount?`<div class="combo-saving"><span>Combo saving</span><strong>−${money(totals.discount)}</strong></div>`:''}<div><span>Shipping</span><strong>${totals.shipping ? money(totals.shipping) : 'Free'}</strong></div><div><span>Total · Cash on Delivery</span><strong>${money(totals.total)}</strong></div>`;
  $('#campusCheckoutForm').hidden=false;
  $('#campusOrderSuccess').hidden=true;
  $('#campusCheckoutError').hidden=true;
  openDialog($('#campusCheckoutDialog'));
});
$('#campusCheckoutForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity() || !bag.length || bagHasUnavailableItems())return;
  const button=$('button[type="submit"]',form);
  if(button.disabled)return;
  button.disabled=true;button.textContent='Submitting your order…';
  $('#campusCheckoutError').hidden=true;
  try {
    const customer=Object.fromEntries(new FormData(form));
    const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer,items:bag.map(item=>({...item}))})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok || !data.order_id)throw new Error(data.error || 'We could not submit your order. Please try again or email care@capracool.com.');
    $('#campusOrderReference').textContent=data.order_id;
    bag=[];persistBag();form.reset();form.hidden=true;$('#campusOrderSuccess').hidden=false;
  } catch(error) {
    $('#campusCheckoutError').textContent=error.message;
    $('#campusCheckoutError').hidden=false;
  } finally {button.disabled=false;button.innerHTML='Place order · Pay on delivery <span aria-hidden="true">↗</span>';}
});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#design/'))openDesign(location.hash.slice(8),false);});
renderProducts();
renderBag();
if(location.hash.startsWith('#design/'))openDesign(location.hash.slice(8),false);

let activeCombo;
function renderCombos(){
 $('#campusCombos').innerHTML=CAMPUS_COMBOS.map(combo=>{
   const designs=combo.items.map(designById);
   const separate=designs.reduce((total,design)=>total+design.priceCents,0);
   return `<article class="combo-card"><div class="combo-art">${designs.map(design=>artMarkup(design,{view:1})).join('')}</div><div class="combo-copy"><p class="eyebrow">SAVE ${money(combo.savingCents)}</p><h3>${combo.name}</h3><p>${combo.description}</p><div class="combo-card-bottom"><div><strong>${money(separate-combo.savingCents)}</strong><s>${money(separate)} separately</s></div><button class="text-button" type="button" data-open-combo="${combo.id}">Choose your sizes ↗</button></div></div></article>`;
 }).join('');
 bindImageFallbacks($('#campusCombos'));
}
function updateComboPrice(){
 if(!activeCombo)return;
 const printCount=$$('#campusComboForm [data-combo-print]:checked').length;
 const separate=activeCombo.items.reduce((total,id)=>total+designById(id).priceCents,0);
 $('#comboPrice').textContent=money(separate-activeCombo.savingCents+printCount*PERSONALISATION_CENTS)+' · Save '+money(activeCombo.savingCents)+(printCount?' · Name printing included':' · Free shipping');
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-open-combo]');if(!button)return;
 activeCombo=CAMPUS_COMBOS.find(combo=>combo.id===button.dataset.openCombo);
 $('#comboTitle').textContent=activeCombo.name;
 $('#comboDescription').textContent=activeCombo.description;
 $('#comboOptions').innerHTML=activeCombo.items.map(id=>{const design=designById(id);return `<fieldset class="combo-option"><legend>${escapeHtml(design.name)}</legend><div class="combo-item-layout">${artMarkup(design)}<div><label>Size for ${escapeHtml(design.name)}<select name="size-${id}" required><option value="">Choose size</option>${CAMPUS_SIZES.map(size=>'<option>'+size+'</option>').join('')}</select></label><label>Artwork<select name="artwork-${id}" data-combo-artwork="${id}">${CAMPUS_ARTWORKS.map(art=>'<option value="'+art.id+'">'+art.name+'</option>').join('')}</select></label><label class="combo-print-toggle"><input type="checkbox" name="print-${id}" data-combo-print="${id}">Add name print (+₹51)</label><label class="combo-print-field" hidden>Name / department for ${escapeHtml(design.name)}<input name="name-${id}" maxlength="40" placeholder="Exact text to print"></label></div></div></fieldset>`;}).join('');
 bindImageFallbacks($('#comboOptions'));updateComboPrice();openDialog($('#campusComboDialog'));
});
$('#campusComboForm').addEventListener('change',event=>{
 if(event.target.matches('[data-combo-artwork]')){const image=event.target.closest('.combo-option').querySelector('img');image.src=imageUrl(event.target.dataset.comboArtwork,event.target.value);image.dataset.artwork=event.target.value;}
 if(event.target.matches('[data-combo-print]')){
  const label=event.target.closest('.combo-option').querySelector('.combo-print-field');label.hidden=!event.target.checked;label.querySelector('input').required=event.target.checked;
 }
 updateComboPrice();
});
$('#campusComboForm').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity()||!activeCombo)return;
 const data=new FormData(form);
 const selections=activeCombo.items.map(id=>({id,size:data.get('size-'+id),artwork:data.get('artwork-'+id),personalisation:data.get('print-'+id)==='on',name:String(data.get('name-'+id)||'').trim()}));
 if(selections.some(item=>item.personalisation&&!item.name))return;
 for(const item of selections)saveDesign(item.id,{...item,name:item.personalisation?item.name:''});
 openDialog($('#campusBagDialog'));showToast(activeCombo.name+' added. Combo saving applied.');
});
renderCombos();

$('#designArtworks').addEventListener('click',event=>{
 const button=event.target.closest('[data-artwork-choice]');if(!button||!activeDesign)return;
 activeArtwork=button.dataset.artworkChoice;
 $$('#designArtworks button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 $('#designImage').src=imageUrl(activeDesign.id,activeArtwork,$('#designPhoto').dataset.view);
 $('#designArtworkNote').textContent=activeDesign.galleryNote || (activeDesign.gallery?'Front and back views of the complete jacket and trousers set.':CAMPUS_ARTWORKS.find(art=>art.id===activeArtwork).description);
 updateDesignEnquiry();
});
