import test from 'node:test';
import assert from 'node:assert/strict';
import {priceRange,filterRecords,facetCounts,sortRecords} from '../catalog-filter-model.js';
const records=[
 {id:'a',name:'Black Tee',search:'Black Tee cotton',type:'T-shirt',sizes:['S','M'],price:499,availability:'In stock'},
 {id:'b',name:'Ivory Tee',search:'Ivory Tee',type:'T-shirt',sizes:['M','XXXL'],price:800,availability:'Out of stock'},
 {id:'c',name:'Black Hoodie',search:'Black Hoodie fleece',type:'Hoodie',sizes:['L','XXXL'],price:1200,availability:'In stock'},
 {id:'d',name:'Mug',search:'White ceramic mug',type:'Mug',sizes:['One size'],price:null,availability:'Quote required'}
];
test('price ranges use non-overlapping boundaries and preserve unknown prices',()=>{assert.deepEqual([0,499,500,999,1000,1999,2000,4999,5000,null,undefined].map(priceRange),['under-500','under-500','500-1000','500-1000','1000-2000','1000-2000','2000-5000','2000-5000','5000-plus','quote','quote']);});
test('choices within a facet combine with OR and different facets with AND',()=>{
 assert.deepEqual(filterRecords(records,{selected:{type:['T-shirt','Hoodie'],sizes:['XXXL'],availability:['In stock']}}).map(r=>r.id),['c']);
 assert.deepEqual(filterRecords(records,{query:'black cotton',selected:{sizes:['M']}}).map(r=>r.id),['a']);
 assert.equal(filterRecords(records,{selected:{sizes:['XS']}}).length,0);
});
test('facet counts exclude their own selections while retaining other filters',()=>{
 const state={selected:{type:['T-shirt'],availability:['In stock']}};
 assert.deepEqual([...facetCounts(records,state,'type')],[['T-shirt',1],['Hoodie',1]]);
 assert.deepEqual([...facetCounts(records,state,'availability')],[['In stock',1],['Out of stock',1]]);
});
test('quote-only items never match in-stock or known-price ranges and sort after priced items',()=>{
 assert.equal(filterRecords(records,{selected:{availability:['In stock']}}).some(r=>r.id==='d'),false);
 assert.deepEqual(filterRecords(records,{selected:{price:['quote']}}).map(r=>r.id),['d']);
 assert.deepEqual(sortRecords(records,'price-desc').map(r=>r.id),['c','b','a','d']);assert.deepEqual(sortRecords(records,'price-asc').map(r=>r.id),['a','b','c','d']);
 assert.deepEqual(records.map(r=>r.id),['a','b','c','d']);
});
