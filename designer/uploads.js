import {MAX_FILE_BYTES} from './catalog.js';
const types={'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','webp':'image/webp','svg':'image/svg+xml'};
export function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not read this file.'));reader.readAsDataURL(file);});}
export async function prepareFile(file){
  if(!file)throw new Error('Choose an image first.');
  const ext=file.name.split('.').pop().toLowerCase(),mime=types[ext];
  if(!mime||(file.type&&file.type!==mime))throw new Error('Use PNG, JPG, SVG or WEBP artwork.');
  if(!file.size||file.size>MAX_FILE_BYTES)throw new Error('Choose a file up to 2 MB.');
  let dataUrl;
  if(mime==='image/svg+xml'){
    const text=await file.text();
    const doc=new DOMParser().parseFromString(text,'image/svg+xml');
    const tags=new Set(['svg','g','path','rect','circle','ellipse','line','polyline','polygon','defs','linearGradient','radialGradient','stop','clipPath','title','desc']);
    if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg'||/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet/i.test(text))throw new Error('This SVG is not supported. Try a transparent PNG.');
    for(const node of doc.querySelectorAll('*')){
      if(!tags.has(node.tagName))throw new Error('SVG contains unsupported content. Export it as a PNG.');
      for(const attr of node.attributes){if(attr.name==='xmlns'&&attr.value==='http://www.w3.org/2000/svg')continue;if(/^on|href|style/i.test(attr.name)||/javascript:|https?:|data:|\/\/|@import/i.test(attr.value)||(/url\s*\(/i.test(attr.value)&&!/^url\(#[a-z0-9_-]+\)$/i.test(attr.value)))throw new Error('SVG links and embedded content are not supported.');}
    }
    dataUrl=`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
  }else dataUrl=await readFile(file);
  const image=new Image();image.src=dataUrl;await image.decode().catch(()=>{throw new Error('This image could not be read. Try another file.');});
  if(image.naturalWidth>8192||image.naturalHeight>8192||image.naturalWidth*image.naturalHeight>16000000)throw new Error('Use an image up to 16 megapixels and 8192 pixels per side.');
  return {id:crypto.randomUUID(),name:file.name,mime,dataUrl,width:image.naturalWidth,height:image.naturalHeight};
}
export async function studioRequest(action,body){
  const response=await fetch(`/api/designer?action=${action}`,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},credentials:'same-origin',...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||'Cloud saving is temporarily unavailable. Your local draft is safe.');
  return data;
}
