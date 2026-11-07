import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {existsSync} from 'node:fs';
import {BRAND_PRODUCTS} from '../brand-catalog.js';
import {CAMPUS_DESIGNS} from '../campus-catalog.js';
import {GARMENTS,documentForProduct,productFaces,productSizes,productMethods,validateDocument,zoneFor,estimateDesign,STUDIO_RATES} from '../designer/catalog.js';
import {GIFT_PRODUCTS} from '../designer/products.js';
const withText=id=>{const doc=documentForProduct(id),z=zoneFor(id,'front');return {...doc,elements:[{id:randomUUID(),kind:'text',text:'YOUR IDEA',font:'sans',fill:'#223322',face:'front',x:z.x+z.w/2,y:z.y+z.h/2,width:60,height:20,angle:0}]};};
test('all existing Brand and Campus products retain prices, stock, sizes and valid customization documents',()=>{
 assert.equal(GARMENTS.length,47);assert.equal(new Set(GARMENTS.map(p=>p.id)).size,47);
 for(const p of [...BRAND_PRODUCTS,...CAMPUS_DESIGNS]){
  const custom=GARMENTS.find(g=>g.id===p.id),doc=withText(p.id),quote=estimateDesign(doc,STUDIO_RATES);
  assert.equal(custom.baseCents,p.priceCents??p.price*100);assert.equal(custom.inStock,p.inStock!==false);
  assert.ok(productSizes(custom).includes(doc.size));validateDocument(doc);
  assert.equal(quote.totalCents,custom.baseCents+10000);assert.equal(quote.complete,p.inStock!==false);
 }
});
test('all six gifts have previews, safe product-specific options and quote-only pricing',()=>{
 for(const p of GIFT_PRODUCTS){
  assert.ok(existsSync(p.photo),p.id);const doc=withText(p.id);validateDocument(doc);
  const quote=estimateDesign(doc,STUDIO_RATES);assert.equal(quote.complete,false);assert.equal(quote.quoteOnly,true);assert.equal(p.baseCents,null);
  assert.deepEqual(productSizes(p),['One size']);assert.throws(()=>validateDocument({...doc,size:'XXXL'}),/product options/);
  assert.throws(()=>validateDocument({...doc,colour:'navy'}),/product options/);
  if(!productMethods(p).includes('embroidery'))assert.throws(()=>validateDocument({...doc,method:'embroidery'}),/product options/);
  if(!productFaces(p).includes('back'))assert.throws(()=>validateDocument({...doc,elements:doc.elements.map(e=>({...e,face:'back'}))}),/placement/);
 }
});
