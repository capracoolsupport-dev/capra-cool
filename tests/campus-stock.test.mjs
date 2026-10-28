import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPUS_SIZES,CAMPUS_DESIGNS} from '../campus-catalog.js';
import {orderTotals} from '../api/_shared.js';
import ordersHandler from '../api/orders.js';

test('black/white Contrast Polo is blocked for every size and artwork, including mixed bags',()=>{
 for(const size of CAMPUS_SIZES)for(const artwork of ['mountain','ridge']){
  const sold={id:'mandi-contrast-polo',size,artwork,qty:1,inStock:true,unit_price:1};
  for(const items of [[sold],[{id:'mandi-maroon-polo',size:'M',qty:1},sold]]){
   assert.throws(()=>orderTotals(items),error=>error.status===409&&error.code==='OUT_OF_STOCK'&&/Black \/ White/.test(error.message));
  }
 }
 assert.equal(orderTotals([{id:'mandi-maroon-polo',size:'M',qty:1}]).grand_total,699);
});

test('order endpoint returns a clear stock error before any database write',async context=>{
 let writes=0;
 context.mock.method(globalThis,'fetch',async()=>{writes++;throw new Error('Unexpected database write');});
 context.mock.method(console,'error',()=>{});
 const response={statusCode:0,payload:null,status(code){this.statusCode=code;return this;},setHeader(){return this;},end(body){this.payload=JSON.parse(body);}};
 await ordersHandler({method:'POST',body:{items:[{id:'mandi-contrast-polo',size:'L',artwork:'ridge',qty:1}]}},response);
 assert.equal(response.statusCode,409);
 assert.match(response.payload.error,/out of stock/);
 assert.equal(writes,0);
});

test('cream hoodie keeps the hoodie price and blocks purchases in every size',()=>{
 const design=CAMPUS_DESIGNS.find(design=>design.id==='mandi-cream-hoodie');
 assert.equal(design.priceCents,120000);
 assert.equal(design.listPriceCents,150000);
 assert.equal(design.gallery.length,3);
 assert.deepEqual(design.artworks,['ridge']);
 for(const size of CAMPUS_SIZES)assert.throws(()=>orderTotals([{id:design.id,artwork:'ridge',size,qty:1}]),error=>error.status===409&&/Cream \/ Ivory/.test(error.message));
});

test('both varsity colours and the grey polo keep approved prices and are blocked in every size',()=>{
 for(const [id,price] of [['mandi-varsity-black',299900],['mandi-varsity-brown',299900],['mandi-grey-polo',60000]]){
  const design=CAMPUS_DESIGNS.find(design=>design.id===id);
  assert.equal(design.priceCents,price);
  assert.equal(design.gallery.length,3);
  if(id.includes('varsity'))assert.equal(design.listPriceCents,374900);
  for(const size of CAMPUS_SIZES)assert.throws(()=>orderTotals([{id,artwork:'mountain',size,qty:1,inStock:true,unit_price:1}]),error=>error.status===409&&error.code==='OUT_OF_STOCK');
 }
});
