import './catalog-filters.css';
import {PRICE_RANGES,values,filterRecords,facetCounts,sortRecords} from './catalog-filter-model.js';
export {priceRange,productCategory,colourValues} from './catalog-filter-model.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sizeOrder=['XS','S','M','L','XL','XXL','XXXL','One size'];
export function mountCatalogFilters({gridSelector,records,onChange,onClear,searchSelector,sortSelector,label='Product filters',priceNote=''}){
 const grid=document.querySelector(gridSelector);if(!grid)return null;
 const state={query:'',selected:{}},all=new Map(records.map(r=>[r.id,r]));let base=records,openFacets=new Set(['type','price','availability']);
 const wrapper=document.createElement('div');wrapper.className='catalog-browser';grid.before(wrapper);
 const sidebar=document.createElement('aside');sidebar.className='catalog-filter-panel';sidebar.setAttribute('aria-label',label);
 sidebar.innerHTML='<div class="catalog-filter-heading"><h3>Filters</h3><button type="button" class="catalog-clear">Clear all</button></div><div class="catalog-facets"></div>'+(priceNote?'<p class="catalog-filter-note">'+escape(priceNote)+'</p>':'');
 const results=document.createElement('div');results.className='catalog-results';wrapper.append(sidebar,results);
 const toolbar=document.createElement('div');toolbar.className='catalog-filter-toolbar';results.append(toolbar);
 const mobile=document.createElement('button');mobile.type='button';mobile.className='catalog-mobile-filter';mobile.textContent='Filters';mobile.setAttribute('aria-expanded','false');toolbar.append(mobile);
 mobile.addEventListener('click',()=>{const expanded=wrapper.classList.toggle('filters-open');mobile.setAttribute('aria-expanded',String(expanded));});
 let search=searchSelector&&document.querySelector(searchSelector);
 if(!search){const field=document.createElement('label');field.className='catalog-search';field.innerHTML='<span>Search products</span><input type="search" placeholder="Search this collection…" aria-label="Search collection products">';toolbar.append(field);search=field.querySelector('input');}
 let sorting=sortSelector&&document.querySelector(sortSelector);
 if(!sorting){const field=document.createElement('label');field.className='catalog-sort';field.innerHTML='<span>Sort</span><select aria-label="Sort filtered products"><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select>';toolbar.append(field);sorting=field.querySelector('select');sorting.addEventListener('change',onChange);}
 const summary=document.createElement('p');summary.className='catalog-filter-summary';summary.setAttribute('role','status');results.append(summary,grid);
 const empty=document.createElement('div');empty.className='catalog-filter-empty';empty.hidden=true;empty.innerHTML='<h3>No matching products</h3><p>Try another filter or clear your selections.</p><button type="button" class="catalog-clear">Clear all filters</button>';results.append(empty);
 const facets=sidebar.querySelector('.catalog-facets');
 const definitions=[['type','Product type'],['category','Category'],['sizes','Size'],['colours','Colour'],['price','Price'],['availability','Availability']];
 const options=new Map(definitions.map(([key])=>[key,[...new Set(records.flatMap(r=>values(r,key)))].sort((a,b)=>key==='sizes'?sizeOrder.indexOf(a)-sizeOrder.indexOf(b):a.localeCompare(b))]));
 const priceNames=Object.fromEntries(PRICE_RANGES);
 function refreshFacets(){
  const focused=document.activeElement?.dataset.filterValue,focusedKey=document.activeElement?.dataset.filterKey;
  facets.innerHTML=definitions.filter(([key])=>options.get(key).length).map(([key,name])=>{
   const counts=facetCounts(base,state,key),choices=key==='price'?PRICE_RANGES.map(([id])=>id).filter(id=>options.get(key).includes(id)):options.get(key);
   return `<details data-facet="${key}" ${openFacets.has(key)?'open':''}><summary>${name}</summary><div class="catalog-checkboxes">${choices.map(value=>`<label><input type="checkbox" data-filter-key="${key}" data-filter-value="${escape(value)}" ${(state.selected[key]||[]).includes(value)?'checked':''}><span>${escape(key==='price'?priceNames[value]:value)}</span><small>${counts.get(value)||0}</small></label>`).join('')}</div></details>`;
  }).join('');
  facets.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)openFacets.add(details.dataset.facet);else openFacets.delete(details.dataset.facet);}));
  if(focused){const input=[...facets.querySelectorAll('input')].find(i=>i.dataset.filterValue===focused&&i.dataset.filterKey===focusedKey);input?.focus({preventScroll:true});}
 }
 facets.addEventListener('change',event=>{const input=event.target;if(!input.matches('input[data-filter-key]'))return;const key=input.dataset.filterKey,chosen=new Set(state.selected[key]||[]);input.checked?chosen.add(input.dataset.filterValue):chosen.delete(input.dataset.filterValue);state.selected[key]=[...chosen];onChange();});
 search.addEventListener('input',()=>{state.query=search.value;onChange();});
 function clear(){state.query='';state.selected={};search.value='';sorting.value='featured';onClear?.();onChange();}
 wrapper.querySelectorAll('.catalog-clear').forEach(button=>button.addEventListener('click',clear));
 return {apply(items){base=items.map(item=>all.get(item.id)).filter(Boolean);const matches=sortRecords(filterRecords(base,state),sorting.value),ids=new Map(items.map(item=>[item.id,item]));summary.textContent=`Showing ${matches.length} of ${records.length} products`;empty.hidden=matches.length!==0;grid.hidden=matches.length===0;refreshFacets();return matches.map(r=>ids.get(r.id));},clear};
}
