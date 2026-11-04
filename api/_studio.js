import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import sharp from 'sharp';
import {DOMParser,XMLSerializer} from '@xmldom/xmldom';
import {GARMENTS,COLOURS,STUDIO_RATES,MAX_FILE_BYTES,UUID,estimateDesign,validateDocument,validateRates} from '../designer/catalog.js';
import {CUSTOM_ORDER_ITEM} from './_studio-order-token.js';

export const BUCKET='custom-artwork';
export function studioError(message,status=400){return Object.assign(new Error(message),{status,studio:true});}
export function studioClient(){
  const url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw studioError('Cloud saving is temporarily unavailable. Your local draft is safe.',503);
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export function studioRates(){
  if(!process.env.CUSTOM_STUDIO_RATES)return STUDIO_RATES;
  try{return validateRates(JSON.parse(process.env.CUSTOM_STUDIO_RATES));}catch{return validateRates(null);}
}
function signingKey(){const key=process.env.CUSTOM_DESIGN_SECRET||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)throw studioError('Cloud saving is temporarily unavailable.',503);return key;}
function signature(value){return createHmac('sha256',signingKey()).update(`capra-studio-v1:${value}`).digest('hex');}
export function guestOwner(req,res,create=false){
  const token=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('cc_studio='))?.slice(10);
  if(token){const [id,expiry,sig]=token.split('.'),body=`${id}.${expiry}`;
    if(UUID.test(id)&&/^\d{10,14}$/.test(expiry)&&Number(expiry)>Date.now()&&Number(expiry)<Date.now()+32*86400000&&/^[a-f0-9]{64}$/.test(sig||'')&&timingSafeEqual(Buffer.from(sig,'hex'),Buffer.from(signature(body),'hex')))return signature(id);
  }
  if(!create)throw studioError('This design belongs to another session or has expired. Reopen your local draft.',401);
  const id=randomUUID(),body=`${id}.${Date.now()+30*86400000}`;
  res.setHeader('Set-Cookie',`cc_studio=${body}.${signature(body)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000${process.env.VERCEL||process.env.NODE_ENV==='production'?'; Secure':''}`);
  return signature(id);
}
export function checkOrigin(req){
  if(req.headers['sec-fetch-site']==='cross-site')throw studioError('Open the studio on this website to continue.',403);
  if(req.headers.origin){
    let origin;try{origin=new URL(req.headers.origin);}catch{throw studioError('Invalid origin.',403);}
    if(origin.host!==req.headers.host)throw studioError('Open the studio on this website to continue.',403);
  }
}
export async function readStudioJson(req,maxBytes=3*1024*1024){
  if(Number(req.headers['content-length']||0)>maxBytes)throw studioError('This upload is too large. Maximum artwork size is 2 MB.',413);
  if(req.body){const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw)>maxBytes)throw studioError('Request is too large.',413);try{return JSON.parse(raw);}catch{throw studioError('Invalid request.');}}
  let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>maxBytes)throw studioError('Request is too large.',413);chunks.push(chunk);}
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw studioError('Invalid request.');}
}
const SVG_TAGS=new Set(['svg','g','path','rect','circle','ellipse','line','polyline','polygon','defs','linearGradient','radialGradient','stop','clipPath','title','desc']);
const SVG_ATTRS=new Set(['xmlns','viewBox','width','height','x','y','x1','y1','x2','y2','cx','cy','r','rx','ry','d','points','fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-miterlimit','opacity','transform','id','offset','stop-color','stop-opacity','gradientUnits','gradientTransform','spreadMethod','fx','fy','clip-path','clip-rule','preserveAspectRatio']);
export function safeSvg(source){
  if(/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet/i.test(source))throw studioError('SVG files must not contain scripts, external links or embedded content.');
  let invalid=false;
  const doc=new DOMParser({onError:()=>{invalid=true;}}).parseFromString(source,'image/svg+xml');
  if(invalid||doc.documentElement?.localName!=='svg')throw studioError('Invalid SVG file.');
  let count=0;
  function visit(node){
    if(++count>3000)throw studioError('SVG is too complex. Export a PNG instead.');
    if(node.nodeType===1){
      if(!SVG_TAGS.has(node.nodeName))throw studioError('SVG contains unsupported or unsafe content. Export a transparent PNG.');
      for(const attr of Array.from(node.attributes||[])){
        if(attr.name==='xmlns'&&attr.value==='http://www.w3.org/2000/svg')continue;
        if(!SVG_ATTRS.has(attr.name)||attr.value.length>100000||/javascript:|data:|https?:|\/\/|@import|expression\s*\(/i.test(attr.value)||(/url\s*\(/i.test(attr.value)&&!/^url\(#[a-z0-9_-]+\)$/i.test(attr.value)))throw studioError('SVG contains external or unsafe content. Export a PNG.');
      }
    }
    for(const child of Array.from(node.childNodes||[]))visit(child);
  }
  visit(doc.documentElement);
  return Buffer.from(new XMLSerializer().serializeToString(doc.documentElement));
}
export async function validateUpload(body,{preview=false}={}){
  const {data,mime,name}=body||{};
  const allowed=['image/png','image/jpeg','image/webp','image/svg+xml'];
  if(!allowed.includes(mime)||(preview&&mime!=='image/png')||typeof data!=='string'||!data.length||data.length>Math.ceil(MAX_FILE_BYTES/3)*4+4||!/^[A-Za-z0-9+/]+={0,2}$/.test(data))throw studioError('Use a PNG, JPG, SVG or WEBP file up to 2 MB.');
  const original=Buffer.from(data,'base64');
  if(original.length>MAX_FILE_BYTES)throw studioError('Artwork exceeds the 2 MB limit.',413);
  let input=original;
  if(mime==='image/svg+xml')input=safeSvg(original.toString('utf8'));
  const processor=sharp(input,{limitInputPixels:16000000,animated:false});
  let meta;try{meta=await processor.metadata();}catch{throw studioError('This image could not be read. Try a different file.');}
  const formats={'image/png':'png','image/jpeg':'jpeg','image/webp':'webp','image/svg+xml':'svg'};
  if(meta.format!==formats[mime]||!meta.width||!meta.height||meta.width>8192||meta.height>8192||meta.width*meta.height>16000000||meta.pages>1)throw studioError('Use a still image up to 16 megapixels and 8192 pixels per side.');
  const png=await processor.rotate().resize({width:2048,height:2048,fit:'inside',withoutEnlargement:true}).png().toBuffer();
  const output=await sharp(png).metadata();
  return {original:input,png,mime,name:String(name||'artwork').replace(/[\x00-\x1f<>"\\/]/g,'').slice(0,100),width:output.width,height:output.height,ext:meta.format==='jpeg'?'jpg':meta.format};
}
export async function rateLimit(client,owner,req){
  const address=String(req?.headers?.['x-forwarded-for']||req?.socket?.remoteAddress||'unknown').split(',')[0].trim();
  // The persisted IP quota survives guest-cookie resets. Store a keyed hash, not the address.
  for(const key of [owner,signature(`network:${address}`)]){
    const {error}=await client.rpc('consume_studio_quota',{p_owner:key});
    if(error)throw studioError(error.message?.includes('quota')?'Too many saves or uploads. Please try again in a few minutes.':'Cloud saving is temporarily unavailable.',error.message?.includes('quota')?429:503);
  }
}
export async function ownedRow(client,table,id,owner){
  if(!UUID.test(id||''))throw studioError('Design not found.',404);
  const {data,error}=await client.from(table).select('*').eq('id',id).eq('owner_hash',owner).maybeSingle();
  if(error)throw studioError('Cloud saving is temporarily unavailable.',503);
  if(!data)throw studioError('Design not found in this session.',404);
  return data;
}
export async function uploadAsset(client,owner,body,preview=false){
  const file=await validateUpload(body,{preview}),id=randomUUID(),folder=`${owner}/${id}`;
  const files=[[`${folder}/preview.png`,file.png,'image/png'],[`${folder}/original.${file.ext}`,file.original,file.mime]];
  try{
    for(const [path,bytes,contentType] of files){const {error}=await client.storage.from(BUCKET).upload(path,bytes,{contentType,upsert:false});if(error)throw error;}
    const row={id,owner_hash:owner,path:files[0][0],original_path:files[1][0],name:file.name,mime:file.mime,width:file.width,height:file.height,bytes:file.original.length,kind:preview?'preview':'artwork'};
    const {error}=await client.from('custom_studio_assets').insert(row);if(error)throw error;
    return row;
  }catch{await client.storage.from(BUCKET).remove(files.map(f=>f[0]));throw studioError('Artwork could not be saved. Your local draft is safe.',503);}
}
export async function saveDesign(client,owner,body){
  let document;try{document=validateDocument(body.document);}catch(error){throw studioError(error.message);}
  const ids=[...new Set(document.elements.filter(e=>e.kind==='image').map(e=>e.assetId))];
  for(const id of ids){const asset=await ownedRow(client,'custom_studio_assets',id,owner);if(asset.kind!=='artwork')throw studioError('Choose a valid artwork file.');}
  const preview=await ownedRow(client,'custom_studio_assets',body.previewId,owner);if(preview.kind!=='preview')throw studioError('Save the garment preview first.');
  const quote=estimateDesign(document,studioRates()),id=randomUUID();
  const row={id,owner_hash:owner,document,preview_id:preview.id,quote,asset_ids:ids};
  const {error}=await client.from('custom_studio_designs').insert(row);if(error)throw studioError('Your design could not be saved. Try again.',503);
  return row;
}
export async function normalizeCustomItems(req,res,items){
  if(!Array.isArray(items)||items.length>30)throw studioError('Your bag contains too many items.');
  if(!items.some(i=>i?.designId||String(i?.id||'').startsWith('custom:')))return items;
  const client=studioClient(),owner=guestOwner(req,res),rates=studioRates();
  const output=[];
  for(const item of items){
    if(!item?.designId&&!String(item?.id||'').startsWith('custom:')){output.push(item);continue;}
    const saved=await ownedRow(client,'custom_studio_designs',item.designId,owner),doc=validateDocument(saved.document),quote=estimateDesign(doc,rates);
    if(!quote.complete)throw studioError('Custom pricing is temporarily unavailable.',503);
    // A changed quote requires another review in the editor rather than silently charging more.
    if(quote.totalCents!==saved.quote.totalCents||quote.version!==saved.quote.version)throw studioError('Custom pricing has changed. Open your design to review the new price.',409);
    const product=GARMENTS.find(p=>p.id===doc.productId),colour=COLOURS.find(c=>c.id===doc.colour);
    output.push({[CUSTOM_ORDER_ITEM]:true,id:`custom:${saved.id}`,design_id:saved.id,name:`Custom ${product.name}`,category:'custom',colour:colour.name,size:doc.size,qty:Math.max(1,Math.min(10,Math.floor(Number(item.qty)||1))),unit_price:quote.totalCents/100,customisation:{document:doc,preview_id:saved.preview_id,asset_ids:saved.asset_ids,areas:quote.areas,method:doc.method,price_breakdown:quote.lines}});
  }
  return output;
}
