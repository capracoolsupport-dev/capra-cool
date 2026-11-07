import {GARMENTS} from './designer/catalog.js';
const urls=import.meta.glob(['/assets/designer/*.png','/assets/brand-mountain/*.png','/assets/campus-approved/*.png','/assets/campus-new/*.png','/assets/campus-cream/*.png','/assets/campus-acid-black/*.png','/assets/tracksuit/*.png'],{eager:true,query:'?url',import:'default'});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let group='all';
function render(){
 const query=document.querySelector('#customSearch').value.trim().toLowerCase();
 const products=GARMENTS.filter(p=>(group==='all'||(p.group||'Studio basics')===group)&&`${p.name} ${p.group||'Studio basics'} ${p.family}`.toLowerCase().includes(query));
 document.querySelector('#customCount').textContent=`${products.length} products`;
 document.querySelector('#customGrid').innerHTML=products.map(p=>{
  const path=(p.photo||`assets/designer/${p.id}.png`).replace(/^optimized\//,'assets/').replace(/\.webp$/,'.png');
  const src=urls['/'+path]||path,paired=p.photo?p.paired:true;
  return `<article class="custom-card"><a class="custom-photo ${paired?'paired':''}" href="design.html?product=${encodeURIComponent(p.id)}" aria-label="Customize ${escape(p.name)}"><img src="${escape(src)}" alt="${escape(p.name)} customization preview" loading="lazy" width="600" height="800">${p.quoteOnly?'<span>REQUEST A QUOTE</span>':p.inStock===false?'<span>OUT OF STOCK</span>':''}</a><p class="custom-group">${escape(p.group||'Studio basics')}</p><h3>${escape(p.name.replace(/^(Brand|Campus) · /,''))}</h3><p>${p.quoteOnly?'Price confirmed after design review':`From ₹${(p.baseCents/100).toLocaleString('en-IN')} + decoration`}</p><a class="text-link" href="design.html?product=${encodeURIComponent(p.id)}">${p.inStock===false?'Design & ask about availability':'Customize'} ↗</a></article>`;
 }).join('')||'<p class="empty-products">No matches. Try a different name or collection.</p>';
}
document.querySelectorAll('[data-group]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.group;document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
document.querySelector('#customSearch').addEventListener('input',render);render();
