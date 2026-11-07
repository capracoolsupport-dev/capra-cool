import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {CAMPUS_DESIGNS,CAMPUS_SIZES} from '../campus-catalog.js';
import {BRAND_PRODUCTS} from '../brand-catalog.js';
import {orderTotals} from '../api/_shared.js';

for(const suffix of ['navy-bomber','coffee-sweatshirt'])test(`${suffix}: confirmed price, stock, six sizes and both Campus signatures`,()=>{
 const campus=CAMPUS_DESIGNS.find(p=>p.id===`mandi-${suffix}`);
 const brand=BRAND_PRODUCTS.find(p=>p.id===`capra-${suffix}`);
 assert.equal(campus.priceCents,150000);assert.equal(brand.price,1500);
 assert.equal(campus.inStock,true);assert.equal(brand.inStock,true);
 assert.deepEqual(CAMPUS_SIZES,['S','M','L','XL','XXL','XXXL']);
 assert.deepEqual(campus.artworks,['mountain','ridge']);
 for(const artwork of campus.artworks){
  assert.ok(existsSync(`assets/campus-approved/${campus.id}-${artwork}.png`));
  for(const size of CAMPUS_SIZES){
   assert.equal(orderTotals([{id:campus.id,size,artwork,qty:1,unit_price:1}]).grand_total,1500);
   assert.equal(orderTotals([{id:campus.id,size,artwork,qty:1,personalisation:true,name:'CSE 2027',unit_price:1}]).grand_total,1551);
  }
 }
 for(const size of CAMPUS_SIZES)assert.equal(orderTotals([{id:brand.id,size,qty:1,unit_price:1}]).grand_total,1500);
});
