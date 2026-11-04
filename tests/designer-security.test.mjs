import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {defaultDocument,estimateDesign,STUDIO_RATES,validateDocument,fitElement,zoneFor,upgradeDocument,projectElement} from '../designer/catalog.js';
import {validateUpload,safeSvg,guestOwner} from '../api/_studio.js';
import {orderTotals} from '../api/_shared.js';
import designer from '../api/designer.js';
import orders from '../api/orders.js';
const textElement=(face='front')=>({id:randomUUID(),kind:'text',text:'CAPRA',font:'sans',fill:'#ffffff',face,x:300,y:290,width:90,height:26,angle:0});
const design=()=>({...defaultDocument(),elements:[textElement()]});
function response(){return {headers:{},status(n){this.code=n;return this;},setHeader(k,v){this.headers[k]=v;return this;},end(body){this.raw=body;try{this.data=JSON.parse(body);}catch{this.data=body;}}};}

test('all garments use trusted base and per-area rates; custom geometry rejects overflow',()=>{
  for(const [productId,base] of [['tshirt',600],['oversized-tshirt',600],['hoodie',1200],['oversized-hoodie',1200]]){
    const doc={...design(),productId};doc.elements=doc.elements.map(e=>fitElement(e,zoneFor(productId,e.face)));
    assert.equal(estimateDesign(doc,STUDIO_RATES).totalCents,(base+100)*100);
    doc.elements.push({...fitElement(textElement('back'),zoneFor(productId,'back')),id:randomUUID()});
    assert.equal(estimateDesign(doc,STUDIO_RATES).totalCents,(base+200)*100);
    validateDocument(doc);
    doc.elements[0].x=-999;assert.throws(()=>validateDocument(doc),/printable/);
  }
  const doc=design();doc.elements[0].angle=NaN;assert.throws(()=>validateDocument(doc),/dimensions/);
  assert.throws(()=>orderTotals([{id:`custom:${randomUUID()}`,__custom:true,unit_price:.01}]),/private storage/);
});
test('uploads enforce decoded formats, size limits and SVG content restrictions',async()=>{
  const png=await sharp({create:{width:80,height:80,channels:4,background:'#228844'}}).png().toBuffer();
  const valid=await validateUpload({name:'mark.png',mime:'image/png',data:png.toString('base64')});assert.equal(valid.width,80);
  await assert.rejects(()=>validateUpload({mime:'image/jpeg',data:png.toString('base64')}),/still image/);
  await assert.rejects(()=>validateUpload({mime:'application/javascript',data:'YWJj'}),/PNG/);
  await assert.rejects(()=>validateUpload({mime:'image/png',data:Buffer.alloc(2097153).toString('base64')}),/2 MB/);
  for(const svg of ['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>','<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg/>','<svg><image href="https://attacker.test/track"/></svg>','<svg onload="alert(1)"><path d="M0 0"/></svg>','<svg><path fill="url(https://attacker.test/a)"/></svg>'])assert.throws(()=>safeSvg(svg),/SVG/);
  const safe=await validateUpload({name:'safe.svg',mime:'image/svg+xml',data:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path fill="#00ff00" d="M0 0h100v100z"/></svg>').toString('base64')});assert.equal(safe.width,100);
  const webp=await sharp(png).webp().toBuffer();
  const review=await validateUpload({name:'four-angle-review.webp',mime:'image/webp',data:webp.toString('base64')},{preview:true});assert.equal(review.ext,'webp');
});

test('larger print surfaces retain legacy designs and keep sleeve editing separate from front projection',()=>{
  for(const garment of ['tshirt','oversized-tshirt','hoodie','oversized-hoodie']){
    for(const face of ['front','back','leftSleeve','rightSleeve']){
      const old=zoneFor(garment,face,1),next=zoneFor(garment,face,2);
      assert.ok(next.w>old.w);assert.ok(next.h>old.h);
      const element={...textElement(face),x:old.x+old.w/2,y:old.y+old.h/2,width:old.w*.6,height:20};
      const original={...defaultDocument(),version:1,productId:garment,elements:[element]};
      validateDocument(original);const upgraded=upgradeDocument(original);validateDocument(upgraded);
      assert.equal(upgraded.version,2);assert.equal(upgraded.elements[0].id,element.id);
      assert.equal(upgraded.elements[0].text,element.text);
      assert.equal(estimateDesign(upgraded,STUDIO_RATES).totalCents,estimateDesign(original,STUDIO_RATES).totalCents);
      assert.deepEqual(original.elements[0],element);
      if(face.endsWith('Sleeve')){
        const saved=upgraded.elements[0],side=projectElement(saved,garment,face,2),front=projectElement(saved,garment,'front',2);
        assert.equal(side.x,saved.x);assert.equal(side.width,saved.width);assert.notEqual(front.x,saved.x);
      }
    }
    const enlarged={...defaultDocument(),productId:garment,elements:[fitElement({...textElement(),width:240,height:180},zoneFor(garment,'front'))]};
    validateDocument(enlarged);assert.throws(()=>validateDocument({...enlarged,version:1}),/printable/);
  }
});
test('private upload → immutable design → trusted checkout preserves artwork and rejects other guests',async()=>{
  const originalFetch=globalThis.fetch,oldEnv={...process.env};
  process.env.SUPABASE_URL='https://studio.test';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only-service-key';process.env.ADMIN_DASHBOARD_TOKEN='test-admin';
  const rows={custom_studio_assets:[],custom_studio_designs:[],customer_orders:[]},objects=new Map();
  globalThis.fetch=async(input,init={})=>{
    const url=new URL(typeof input==='string'?input:input.url),method=init.method||'GET';
    if(url.hostname!=='studio.test')throw new Error('Unexpected real network request.');
    const table=url.pathname.split('/').pop();
    if(url.pathname==='/rest/v1/rpc/consume_studio_quota')return new Response('null');
    if(url.pathname.startsWith('/rest/v1/')){
      if(method==='POST'){rows[table].push(JSON.parse(init.body));return new Response(null,{status:201});}
      let data=rows[table]||[];
      for(const field of ['id','owner_hash'])if(url.searchParams.has(field))data=data.filter(row=>row[field]===url.searchParams.get(field).slice(3));
      return new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
    }
    if(url.pathname.startsWith('/storage/v1/object/')){
      const key=url.pathname.replace('/storage/v1/object/authenticated/','').replace('/storage/v1/object/','');
      if(method==='POST'){objects.set(key,init.body);return new Response('{}',{status:200});}
      if(method==='GET')return objects.has(key)?new Response(objects.get(key)):new Response('{}',{status:404});
      if(method==='DELETE')return new Response('[]');
    }
    throw new Error(`Unexpected backend request ${url}`);
  };
  try{
    const headers={host:'capra.test',origin:'https://capra.test'},png=await sharp({create:{width:100,height:100,channels:4,background:'#ff0000'}}).png().toBuffer();
    const uploadBody={mime:'image/png',name:'logo.png',data:png.toString('base64')};
    const uploaded=response();await designer({method:'POST',headers,query:{action:'upload'},body:uploadBody},uploaded);assert.equal(uploaded.code,201);
    headers.cookie=uploaded.headers['Set-Cookie'].split(';')[0];
    const preview=response();await designer({method:'POST',headers,query:{action:'upload'},body:{...uploadBody,preview:true}},preview);assert.equal(preview.code,201);
    const doc={...design(),elements:[{...textElement(),kind:'image',assetId:uploaded.data.id}]};
    const saved=response();await designer({method:'POST',headers,query:{action:'save'},body:{document:doc,previewId:preview.data.id}},saved);assert.equal(saved.code,201);
    assert.equal(rows.custom_studio_designs.length,1);assert.equal(rows.custom_studio_assets.length,2);
    const alien=response();await designer({method:'GET',headers:{host:'capra.test'},query:{action:'design',id:saved.data.id}},alien);assert.equal(alien.code,401);
    const alienRes=response(),alienOwner=guestOwner({headers:{}},alienRes,true);assert.ok(alienOwner);
    const forbidden=response();await designer({method:'GET',headers:{cookie:alienRes.headers['Set-Cookie'].split(';')[0]},query:{action:'asset',id:uploaded.data.id}},forbidden);assert.equal(forbidden.code,404);
    const csrf=response();await designer({method:'POST',headers:{...headers,origin:'https://attacker.test'},query:{action:'save'},body:{}},csrf);assert.equal(csrf.code,403);
    const badCookie=response();assert.throws(()=>guestOwner({headers:{cookie:headers.cookie+'tampered'}},badCookie),/session/);
    const result=response();await orders({method:'POST',headers,body:{customer:{name:'Test Customer',phone:'9999999999',email:'test@example.test',address:'No real dispatch',city:'Mandi',state:'HP',pincode:'175001'},items:[{id:`custom:${saved.data.id}`,designId:saved.data.id,size:'XXL',qty:1,unit_price:.01,price:.01,custom:{price:.01}}]}},result);
    assert.equal(result.code,200);assert.equal(result.data.subtotal,700);assert.equal(result.data.grand_total,799);
    const item=rows.customer_orders[0].items[0];assert.equal(item.size,'M');assert.equal(item.unit_price,700);assert.equal(item.customisation.document.elements[0].assetId,uploaded.data.id);assert.equal(item.customisation.preview_id,preview.data.id);
    assert.equal(JSON.stringify(result.data).includes('test-only-service-key'),false);
  }finally{globalThis.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in oldEnv))delete process.env[key];Object.assign(process.env,oldEnv);}
});
