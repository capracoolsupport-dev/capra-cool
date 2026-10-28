import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPUS_SIZES} from '../campus-catalog.js';
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
