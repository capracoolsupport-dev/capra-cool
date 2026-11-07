import {mountCatalogFilters,productCategory,colourValues} from './catalog-filters.js';
import {GARMENTS,productSizes,productColours} from './designer/catalog.js';
const urls=import.meta.glob(['/assets/designer/*.png','/assets/brand-mountain/*.png','/assets/campus-approved/*.png','/assets/campus-new/*.png','/assets/campus-cream/*.png','/assets/campus-acid-black/*.png','/assets/tracksuit/*.png'],{eager:true,query:'?url',import:'default'});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types=[['tee','T-shirts'],['polo','Polos'],['hoodie','Hoodies'],['zip','Zip hoodies'],['varsity','Varsity jackets'],['track','Tracksuits'],['mug','Mugs'],['cap','Caps'],['tote','Bags'],['bottle','Bottles'],['cushion','Home gifts'],['notebook','Stationery']];
const clothing=new Set(['tee','polo','hoodie','zip','varsity','track']);
let customFilters=null;
let category='all',subcategory='all';
function updateTypes(){
 const choices=types.filter(([id])=>category==='all'||category==='clothing'&&clothing.has(id));
 document.querySelector('#customTypeControl').hidden=!['all','clothing'].includes(category);
 document.querySelector('#customType').innerHTML='<option value="all">All types</option>'+choices.map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
 document.querySelector('#customType').value='all';subcategory='all';
}
function render(){
 const query=document.querySelector('#customSearch').value.trim().toLowerCase();
 const words=query.split(/\s+/).filter(Boolean);
 let products=GARMENTS.filter(p=>(category==='all'||category==='clothing'&&clothing.has(p.family)||p.family===category)&&(subcategory==='all'||p.family===subcategory)&&words.every(word=>`${p.name} ${p.group||'Studio basics'} ${p.family} ${types.find(([id])=>id===p.family)?.[1]||''}`.toLowerCase().includes(word)));
 if(customFilters)products=customFilters.apply(products);
 document.querySelector('#customCount').textContent=`${products.length} ${products.length===1?'product':'products'}`;
 document.querySelector('#customGrid').innerHTML=products.map(p=>{
  const path=(p.photo||`assets/designer/${p.id}.png`).replace(/^optimized\//,'assets/').replace(/\.webp$/,'.png');
  const src=urls['/'+path]||path,paired=p.photo?p.paired:true;
  return `<article class="custom-card"><a class="custom-photo ${paired?'paired':''}" href="design.html?product=${encodeURIComponent(p.id)}" aria-label="Customize ${escape(p.name)}"><img src="${escape(src)}" alt="${escape(p.name)} customization preview" loading="lazy" width="600" height="800">${p.quoteOnly?'<span>REQUEST A QUOTE</span>':p.inStock===false?'<span>OUT OF STOCK</span>':''}</a><p class="custom-group">${escape(p.group||'Studio basics')}</p><h3>${escape(p.name.replace(/^(Brand|Campus) · /,''))}</h3><p>${p.quoteOnly?'Price confirmed after design review':`From ₹${(p.baseCents/100).toLocaleString('en-IN')} + decoration`}</p><a class="text-link" href="design.html?product=${encodeURIComponent(p.id)}">${p.inStock===false?'Design & ask about availability':'Customize'} ↗</a></article>`;
 }).join('')||'<p class="empty-products">No matches. Try a different name or collection.</p>';
}
customFilters=mountCatalogFilters({gridSelector:'#customGrid',label:'Custom product filters',priceNote:'Clothing prices exclude decoration. Gift prices are supplied with your quote.',records:GARMENTS.map(p=>({id:p.id,name:p.name,type:types.find(([id])=>id===p.family)?.[1]||p.family,category:clothing.has(p.family)?'Clothing':productCategory(p.family),sizes:productSizes(p),colours:p.colourName?colourValues(p.colourName):productColours(p).map(c=>c.name),price:p.quoteOnly?null:p.baseCents/100,availability:p.quoteOnly?'Quote required':p.inStock===false?'Out of stock':'In stock',search:[p.name,p.group||'Studio basics',p.colourName,p.family,types.find(([id])=>id===p.family)?.[1]].join(' ')})),searchSelector:'#customSearch',onChange:render,onClear:()=>{category='all';updateTypes();document.querySelectorAll('[data-custom-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.customCategory==='all')));}});
document.querySelectorAll('[data-custom-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.customCategory;document.querySelectorAll('[data-custom-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));updateTypes();render();}));
document.querySelector('#customType').addEventListener('change',event=>{subcategory=event.target.value;render();});
document.querySelector('#customSearch').addEventListener('input',render);updateTypes();render();
