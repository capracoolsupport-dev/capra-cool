// Shared by the studio and API. Geometry uses a 600 × 800 design board.
import { CAMPUS_DESIGNS } from '../campus-catalog.js';
const tee = CAMPUS_DESIGNS.find(p => p.id === 'mandi-mountain-polo').priceCents;
const hoodie = CAMPUS_DESIGNS.find(p => p.id === 'mandi-mountain-hoodie').priceCents;
export const GARMENTS = [
  {id:'tshirt',name:'T-Shirt',baseCents:tee,family:'tee',gsm:230},
  {id:'oversized-tshirt',name:'Oversized T-Shirt',baseCents:tee,family:'tee',gsm:230},
  {id:'hoodie',name:'Hoodie',baseCents:hoodie,family:'hoodie',gsm:400},
  {id:'oversized-hoodie',name:'Oversized Hoodie',baseCents:hoodie,family:'hoodie',gsm:400}
];
export const COLOURS = [{id:'black',name:'Black',hex:'#242628'},{id:'white',name:'White',hex:'#f6f5ef'},{id:'beige',name:'Beige',hex:'#cfbea2'},{id:'grey',name:'Grey',hex:'#96999c'},{id:'navy',name:'Navy Blue',hex:'#29354c'}];
export const SIZES = ['XS','S','M','L','XL','XXL'];
export const FONTS = [{id:'sans',name:'Modern sans',family:'Arial'},{id:'serif',name:'Classic serif',family:'Georgia'},{id:'mono',name:'Studio mono',family:'Courier New'},{id:'bold',name:'Athletic',family:'Impact'}];
export const FACES = ['front','back','leftSleeve','rightSleeve'];
export const FACE_NAMES = {front:'Front',back:'Back',leftSleeve:'Left sleeve',rightSleeve:'Right sleeve'};
export const MAX_FILE_BYTES = 2*1024*1024;
export const MAX_ELEMENTS = 24;
export const MAX_ASSETS = 12;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function zoneFor(productId,face) {
  const hood=productId.includes('hoodie');
  if(face==='leftSleeve')return {x:480,y:240,w:45,h:85};
  if(face==='rightSleeve')return {x:75,y:240,w:45,h:85};
  return face==='back'?{x:205,y:hood?260:210,w:190,h:300}:{x:205,y:hood?265:210,w:190,h:hood?190:300};
}
export function placementsFor(face) {
  if(face==='front')return [{id:'leftChest',name:'Left chest',x:.76,y:.17,w:.27},{id:'centreChest',name:'Centre chest',x:.5,y:.24,w:.55},{id:'largeFront',name:'Large front print',x:.5,y:.5,w:.85}];
  if(face==='back')return [{id:'upperBack',name:'Upper back',x:.5,y:.18,w:.62},{id:'centreBack',name:'Centre back',x:.5,y:.48,w:.65},{id:'largeBack',name:'Large back print',x:.5,y:.5,w:.88}];
  return [{id:face,name:FACE_NAMES[face],x:.5,y:.5,w:.8}];
}
export const EMPTY_RATES = {version:1,confirmed:false,printAreaCents:null,embroideryAreaCents:null,extraElementCents:null,colours:{},sizes:{},fits:{}};
// Owner confirmed ₹100 per decorated area; no other surcharge supplied.
export const STUDIO_RATES = {version:1,confirmed:true,printAreaCents:10000,embroideryAreaCents:10000,extraElementCents:0,colours:{},sizes:{},fits:{}};
export function validateRates(raw) {
  if(!raw||raw.confirmed!==true)return {...EMPTY_RATES};
  const amount = n => Number.isInteger(n)&&n>=0&&n<=1000000;
  if(![raw.printAreaCents,raw.embroideryAreaCents,raw.extraElementCents].every(amount))return {...EMPTY_RATES};
  const maps=[raw.colours||{},raw.sizes||{},raw.fits||{}];
  for(const map of maps)if(typeof map!=='object'||Array.isArray(map)||Object.values(map).some(n=>!amount(n)))return {...EMPTY_RATES};
  if(!Number.isSafeInteger(raw.version)||raw.version<1)return {...EMPTY_RATES};
  return {...EMPTY_RATES,version:raw.version,printAreaCents:raw.printAreaCents,embroideryAreaCents:raw.embroideryAreaCents,extraElementCents:raw.extraElementCents,colours:maps[0],sizes:maps[1],fits:maps[2],confirmed:true};
}
export function estimateDesign(document,rates=EMPTY_RATES) {
  const product=GARMENTS.find(g=>g.id===document.productId);
  if(!product)throw new Error('Choose a valid garment.');
  const areas=FACES.filter(face=>document.elements?.some(e=>e.face===face));
  const valid=validateRates(rates);
  const lines=[{label:product.name,cents:product.baseCents}];
  for(const [label,cents] of [['Colour',valid.colours[document.colour]||0],['Size',valid.sizes[document.size]||0],['Fit',valid.fits[document.productId]||0]])if(cents)lines.push({label,cents});
  if(valid.confirmed){
    lines.push({label:`${document.method==='embroidery'?'Embroidery':'Print'} · ${areas.length} area${areas.length===1?'':'s'}`,cents:areas.length*(document.method==='embroidery'?valid.embroideryAreaCents:valid.printAreaCents)});
    const extras=Math.max(0,(document.elements?.length||0)-areas.length);
    if(extras&&valid.extraElementCents)lines.push({label:`Additional elements · ${extras}`,cents:extras*valid.extraElementCents});
  }
  return {lines,areas,totalCents:lines.reduce((sum,l)=>sum+l.cents,0),complete:valid.confirmed,version:valid.version};
}
export function defaultDocument(){return {version:1,productId:'tshirt',colour:'black',size:'M',method:'print',elements:[]};}
export function elementBounds(element){
  const r=element.angle*Math.PI/180,cos=Math.abs(Math.cos(r)),sin=Math.abs(Math.sin(r));
  return {w:element.width*cos+element.height*sin,h:element.width*sin+element.height*cos};
}
export function fitElement(element,zone) {
  const next={...element};let bounds=elementBounds(next);
  const factor=Math.min(1,zone.w/bounds.w,zone.h/bounds.h);
  next.width*=factor;next.height*=factor;bounds=elementBounds(next);
  next.x=Math.max(zone.x+bounds.w/2,Math.min(zone.x+zone.w-bounds.w/2,next.x));
  next.y=Math.max(zone.y+bounds.h/2,Math.min(zone.y+zone.h-bounds.h/2,next.y));
  return next;
}
export function validateDocument(raw) {
  if(!raw||raw.version!==1||!GARMENTS.some(g=>g.id===raw.productId)||!COLOURS.some(c=>c.id===raw.colour)||!SIZES.includes(raw.size)||!['print','embroidery'].includes(raw.method))throw new Error('Invalid garment options.');
  if(!Array.isArray(raw.elements)||raw.elements.length<1||raw.elements.length>MAX_ELEMENTS)throw new Error(`Add 1–${MAX_ELEMENTS} design elements.`);
  const ids=new Set();
  const elements=raw.elements.map(e=>{
    if(!e||!UUID.test(e.id)||ids.has(e.id)||!FACES.includes(e.face)||!['image','text'].includes(e.kind))throw new Error('Invalid design element.');
    ids.add(e.id);
    if(![e.x,e.y,e.width,e.height,e.angle].every(Number.isFinite)||e.width<4||e.height<4||Math.abs(e.angle)>360)throw new Error('Invalid design dimensions.');
    const zone=zoneFor(raw.productId,e.face), b=elementBounds(e);
    if(e.x-b.w/2<zone.x-.2||e.x+b.w/2>zone.x+zone.w+.2||e.y-b.h/2<zone.y-.2||e.y+b.h/2>zone.y+zone.h+.2)throw new Error('Keep your artwork inside the printable area.');
    const next={id:e.id,face:e.face,kind:e.kind,x:e.x,y:e.y,width:e.width,height:e.height,angle:e.angle};
    if(e.kind==='image'){
      if(!UUID.test(e.assetId))throw new Error('Artwork must be uploaded before saving.');next.assetId=e.assetId;
    }else{
      if(typeof e.text!=='string'||!e.text.trim()||e.text.length>120||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(e.text)||!FONTS.some(f=>f.id===e.font)||!/^#[0-9a-f]{6}$/i.test(e.fill))throw new Error('Invalid text style.');
      Object.assign(next,{text:e.text,font:e.font,fill:e.fill});
    }
    return next;
  });
  if(new Set(elements.filter(e=>e.kind==='image').map(e=>e.assetId)).size>MAX_ASSETS)throw new Error('Too many uploaded files.');
  return {version:1,productId:raw.productId,colour:raw.colour,size:raw.size,method:raw.method,elements};
}
