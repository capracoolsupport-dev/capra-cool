export const PRICE_RANGES=[['under-500','Under ₹500'],['500-1000','₹500–₹1,000'],['1000-2000','₹1,000–₹2,000'],['2000-5000','₹2,000–₹5,000'],['5000-plus','₹5,000 and above'],['quote','Price on request']];
export function priceRange(price){return !Number.isFinite(price)?'quote':price<500?'under-500':price<1000?'500-1000':price<2000?'1000-2000':price<5000?'2000-5000':'5000-plus';}
export const productCategory=type=>['tee','polo'].includes(type)?'Tops':['hoodie','zip','varsity','bomber','sweatshirt'].includes(type)?'Outerwear':type==='track'?'Matching sets':['mug','bottle'].includes(type)?'Drinkware':['cap','tote'].includes(type)?'Accessories':type==='cushion'?'Home & living':type==='notebook'?'Stationery':type;
export function colourValues(value){return String(value||'').split('/').map(c=>c.trim()).filter(Boolean);}
export const values=(record,key)=>key==='price'?[priceRange(record.price)]:Array.isArray(record[key])?record[key]:record[key]?[record[key]]:[];
export function filterRecords(records,state={},skip){
 const words=String(state.query||'').toLowerCase().split(/\s+/).filter(Boolean);
 return records.filter(record=>words.every(w=>(record.search||record.name||'').toLowerCase().includes(w))&&Object.entries(state.selected||{}).every(([key,chosen])=>key===skip||!chosen.length||chosen.some(v=>values(record,key).includes(v))));
}
export function facetCounts(records,state,key){const counts=new Map();for(const record of filterRecords(records,state,key))for(const value of new Set(values(record,key)))counts.set(value,(counts.get(value)||0)+1);return counts;}
export function sortRecords(records,sort){
 if(sort==='featured')return records;
 return [...records].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):!Number.isFinite(a.price)?(!Number.isFinite(b.price)?0:1):!Number.isFinite(b.price)?-1:sort==='price-desc'?b.price-a.price:a.price-b.price);
}
