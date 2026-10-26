import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPUS_DESIGNS, campusUnitCents} from '../campus-catalog.js';
import {orderTotals} from '../api/_shared.js';

test('rounded launch prices exceed supplied bases and show exactly 20% off',()=>{
  const polo=CAMPUS_DESIGNS.find(d=>d.id==='mandi-mountain-polo');
  assert.equal(polo.listPriceCents,75000);
  assert.equal(polo.priceCents,60000);
  assert.equal(campusUnitCents(polo,true),65100);
  for(const design of CAMPUS_DESIGNS.filter(design=>!design.gallery)){ assert.ok(design.priceCents > design.base * 100); assert.equal(design.priceCents % 100,0); assert.equal(design.listPriceCents * 0.8,design.priceCents); }
  const expected={'mandi-mountain-hoodie':120000,'mandi-mountain-zip':140000,'mandi-washed-tee':80000,'mandi-washed-hoodie':160000};
  for(const [id,price] of Object.entries(expected))assert.equal(CAMPUS_DESIGNS.find(d=>d.id===id).priceCents,price);
});

for(const [id,artworkName] of [['iit-mandi-tracksuit','Mountain Print'],['iit-mandi-tracksuit-minimal','Minimal Print']])test(`${id}: complete-set price and jacket-only personalisation`,()=>{
 const design=CAMPUS_DESIGNS.find(design=>design.id===id);
 assert.equal(design.priceCents,299900);
 assert.equal(design.listPriceCents,299900);
 assert.equal(design.gallery.length,2);
 const items=[{id:design.id,size:'XL',artwork:'mountain',qty:1,unit_price:1}];
 assert.equal(orderTotals(items).grand_total,2999);
 const printed=orderTotals([{...items[0],personalisation:true,name:'CSE 2027'}]);
 assert.equal(printed.grand_total,3050);
 assert.equal(printed.items[0].print_placement,'Jacket');
 assert.equal(printed.items[0].artwork_name,artworkName);
 assert.throws(()=>orderTotals([{...items[0],artwork:'ridge'}]),/valid size/);
});
test('server ignores submitted prices and retains print instructions',()=>{
  const totals=orderTotals([{id:'mandi-mountain-polo',size:'XXXL',qty:2,personalisation:true,name:'CSE 2027',unit_price:1}]);
  assert.equal(totals.subtotal,1302);
  assert.equal(totals.shipping_fee,0);
  assert.equal(totals.grand_total,1302);
  assert.equal(totals.items[0].unit_price,651);
  assert.equal(totals.items[0].print_text,'CSE 2027');
});
test('invalid size or missing print text is rejected',()=>{
  assert.throws(()=>orderTotals([{id:'mandi-mountain-polo',size:'BAD',qty:1}]),/valid size/);
  assert.throws(()=>orderTotals([{id:'mandi-mountain-polo',size:'M',qty:1,personalisation:true,name:'  '}]),/print text/);
  assert.throws(()=>orderTotals({}),/array/);
});
test('shipping is calculated after discount and legacy catalog is preserved',()=>{
  assert.equal(orderTotals([{id:'mandi-mountain-polo',size:'M',qty:1}]).grand_total,699);
  assert.equal(orderTotals([{id:'mandi-washed-hoodie',size:'L',qty:1}]).shipping_fee,0);
  assert.equal(orderTotals([{id:'summit-tee',size:'M',qty:1}]).grand_total,898);
});

test('combo saving applies only to complete matched pairs and preserves print fees',()=>{
 const items=[{id:'mandi-mountain-polo',size:'S',qty:1,personalisation:true,name:'CSE'},{id:'mandi-mountain-hoodie',size:'XXXL',qty:2,personalisation:true,name:'Arun'}];
 const totals=orderTotals(items);
 assert.equal(totals.merchandise_subtotal,3153);
 assert.equal(totals.discount_total,100);
 assert.equal(totals.grand_total,3053);
 assert.equal(totals.items[1].combo_discount,100);
 assert.equal(totals.items[1].line_total,2402);
 assert.equal(orderTotals(items.slice(1)).discount_total,0);
});

test('multiple combos and split sizes calculate once per physical pair',()=>{
 const totals=orderTotals([{id:'mandi-mountain-polo',size:'S',qty:2},{id:'mandi-mountain-hoodie',size:'M',qty:1},{id:'mandi-mountain-hoodie',size:'L',qty:1},{id:'mandi-washed-tee',size:'M',qty:1},{id:'mandi-washed-hoodie',size:'XL',qty:1}]);
 assert.equal(totals.discount_total,400);
 assert.equal(totals.grand_total,5600);
 assert.equal(totals.items.reduce((sum,item)=>sum+(item.line_total??item.unit_price*item.qty),0),totals.subtotal);
 assert.equal(orderTotals([{id:'made-up-combo',size:'M',qty:1,unit_price:1}]).items.length,0);
});

test('approved artwork choices are validated and saved independently of price',()=>{
 const totals=orderTotals([{id:'mandi-maroon-polo',size:'M',artwork:'ridge',qty:1,unit_price:1}]);
 assert.equal(totals.items[0].artwork_name,'Green Ridge');
 assert.equal(totals.items[0].unit_price,600);
 assert.throws(()=>orderTotals([{id:'mandi-maroon-polo',size:'M',artwork:'fake',qty:1}]),/valid size/);
});
