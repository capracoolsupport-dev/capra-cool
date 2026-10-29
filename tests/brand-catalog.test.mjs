import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {BRAND_PRODUCTS,BRAND_ADAPTED_PRODUCTS,BRAND_ORIGINAL_PRODUCTS} from '../brand-catalog.js';
import {CAMPUS_DESIGNS,CAMPUS_SIZES} from '../campus-catalog.js';
import {orderTotals} from '../api/_shared.js';
import ordersHandler from '../api/orders.js';

test('every Campus garment has a separate Brand version with matching commercial details',()=>{
 assert.equal(BRAND_PRODUCTS.length,21);
 assert.equal(BRAND_ORIGINAL_PRODUCTS.length,7);
 assert.equal(BRAND_ADAPTED_PRODUCTS.length,14);
 assert.equal(new Set(BRAND_PRODUCTS.map(p=>p.id)).size,21);
 assert.deepEqual(BRAND_ADAPTED_PRODUCTS.map(p=>p.sourceId).sort(),CAMPUS_DESIGNS.map(p=>p.id).sort());
 for(const product of BRAND_ADAPTED_PRODUCTS){
  const campus=CAMPUS_DESIGNS.find(p=>p.id===product.sourceId);
  assert.equal(product.price,campus.priceCents/100);
  assert.equal(product.listPrice,campus.listPriceCents/100);
  assert.equal(product.inStock,campus.inStock!==false);
  assert.deepEqual(product.sizes,CAMPUS_SIZES);
  assert.equal(product.pairedImage,true);
  assert.ok(existsSync(product.image),product.image);
  assert.doesNotMatch(product.name+' '+product.description,/IIT|Mandi|ibex/i);
 }
});

test('every available Brand adaptation uses trusted prices and supports XXXL',()=>{
 for(const product of BRAND_ADAPTED_PRODUCTS.filter(p=>p.inStock)){
  const totals=orderTotals([{id:product.id,size:'XXXL',qty:2,unit_price:1,price:1}]);
  assert.equal(totals.items.length,1);
  assert.equal(totals.items[0].unit_price,product.price);
  assert.equal(totals.subtotal,product.price*2);
  assert.equal(totals.discount_total,0);
 }
 assert.equal(orderTotals([{id:'summit-tee',size:'M',qty:1}]).grand_total,898);
 assert.equal(orderTotals([{id:'summit-tee',size:'XXXL',qty:1}]).items.length,0);
});

test('all five unavailable Brand styles remain blocked for every size and in mixed bags',()=>{
 const unavailable=BRAND_ADAPTED_PRODUCTS.filter(p=>!p.inStock);
 assert.equal(unavailable.length,5);
 for(const product of unavailable)for(const size of CAMPUS_SIZES){
  assert.throws(()=>orderTotals([{id:'summit-tee',size:'M',qty:1},{id:product.id,size,qty:1,inStock:true,unit_price:1}]),error=>error.status===409&&error.code==='OUT_OF_STOCK');
 }
});

test('order endpoint rejects unavailable Brand products before database writes',async context=>{
 let writes=0;
 context.mock.method(globalThis,'fetch',async()=>{writes++;throw new Error('Unexpected database write');});
 context.mock.method(console,'error',()=>{});
 const res={statusCode:0,payload:null,status(code){this.statusCode=code;return this;},setHeader(){return this;},end(body){this.payload=JSON.parse(body);}};
 await ordersHandler({method:'POST',body:{items:[{id:'capra-varsity-black',size:'XL',qty:1}]}},res);
 assert.equal(res.statusCode,409);
 assert.match(res.payload.error,/out of stock/i);
 assert.equal(writes,0);
});
