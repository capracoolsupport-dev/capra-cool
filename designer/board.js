import {Canvas,FabricImage,FabricText,Rect,Shadow} from 'fabric';
import {GARMENTS,COLOURS,FONTS,zoneFor,fitElement,isSleeve,displayZoneFor,projectElement} from './catalog.js';
const imageURLs=import.meta.glob(['/assets/designer/*.png','/assets/brand-mountain/*.png','/assets/brand-hover/*.png','/assets/campus-approved/*.png','/assets/campus-new/*.png','/assets/campus-cream/*.png','/assets/campus-acid-black/*.png','/assets/tracksuit/*.png'],{eager:true,query:'?url',import:'default'});
const photoCache=new Map();
function photo(productId,face){
  const name=productId+(isSleeve(face)?'-sides-v1':'');
  if(!photoCache.has(name))photoCache.set(name,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{image.onerror=()=>reject(new Error('Garment preview could not load. Please refresh.'));image.src=imageURLs[`/assets/designer/${name}.png`];};image.src=`/optimized/designer/${name}.webp`;}));
  return photoCache.get(name);
}
async function garmentImage(document,face){
  const product=GARMENTS.find(p=>p.id===document.productId);
  if(product.photo){
    const src=(face==='back'?product.backPhoto:product.photo)||product.photo;
    const original=src.replace(/^optimized\//,'assets/').replace(/\.webp$/,'.png');
    const key=original;
    if(!photoCache.has(key))photoCache.set(key,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Product preview could not load. Please refresh.'));image.src=imageURLs['/'+original]||'/'+src;}));
    const image=await photoCache.get(key),board=documentCanvas(),ctx=board.getContext('2d'),w=product.paired?image.naturalWidth/(product.panels||2):image.naturalWidth;
    const sx=product.paired&&face==='back'?w:0;
    ctx.fillStyle='#f2f0e9';ctx.fillRect(0,0,600,800);
    const scale=Math.min(600/w,800/image.naturalHeight),width=w*scale,height=image.naturalHeight*scale;
    ctx.drawImage(image,sx,0,w,image.naturalHeight,(600-width)/2,(800-height)/2,width,height);
    return new FabricImage(board,{originX:'left',originY:'top',left:0,top:0,selectable:false,evented:false,excludeFromExport:true});
  }
  const image=await photo(document.productId,face),board=documentCanvas(),ctx=board.getContext('2d'),half=image.naturalWidth/2;
  ctx.drawImage(image,face==='back'||face==='rightSleeve'?half:0,0,half,image.naturalHeight,0,0,600,800);
  // Tint the alpha cutout while retaining the photographic fabric luminance.
  const pixels=ctx.getImageData(0,0,600,800),hex=COLOURS.find(c=>c.id===document.colour).hex;
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  for(let i=0;i<pixels.data.length;i+=4){const light=(pixels.data[i]*.2126+pixels.data[i+1]*.7152+pixels.data[i+2]*.0722)/190;for(let c=0;c<3;c++)pixels.data[i+c]=Math.min(255,rgb[c]*light);}
  ctx.putImageData(pixels,0,0);
  return new FabricImage(board,{originX:'left',originY:'top',left:0,top:0,selectable:false,evented:false,excludeFromExport:true});
}
function documentCanvas(){const c=window.document.createElement('canvas');c.width=600;c.height=800;return c;}
export class DesignBoard {
  constructor(element,container,onChange,onSelect,onError){
    this.canvas=new Canvas(element,{selection:false,preserveObjectStacking:true,enableRetinaScaling:true,allowTouchScrolling:false});
    this.onChange=onChange;this.onSelect=onSelect;this.onError=onError;this.generation=0;this.applying=false;this.container=container;
    const c=this.canvas;
    c.on('selection:created',e=>{if(!this.applying)this.onSelect(e.selected[0]?.studioId);});
    c.on('selection:updated',e=>{if(!this.applying)this.onSelect(e.selected[0]?.studioId);});
    c.on('selection:cleared',()=>{if(!this.applying)this.onSelect(null);});
    c.on('mouse:down',({target})=>{if(!this.applying&&target?.studioProjection)this.onSelect(target.studioId);});
    const constrain=({target})=>{if(!target?.studioId)return;this.constrain(target);};
    for(const event of ['object:moving','object:scaling','object:rotating'])c.on(event,constrain);
    c.on('object:modified',({target})=>{
      if(this.applying||!target?.studioId)return;
      this.constrain(target);
      this.onChange(target.studioId,{x:target.left,y:target.top,width:target.width*target.scaleX,height:target.height*target.scaleY,angle:((target.angle+180)%360+360)%360-180});
    });
    this.observer=new ResizeObserver(entries=>{const width=Math.min(600,entries[0].contentRect.width);if(width<1)return;c.setDimensions({width,height:width*4/3});c.setZoom(width/600);c.requestRenderAll();});this.observer.observe(container);
  }
  constrain(obj){
    const normalized=fitElement({x:obj.left,y:obj.top,width:Math.abs(obj.width*obj.scaleX),height:Math.abs(obj.height*obj.scaleY),angle:obj.angle},zoneFor(this.document.productId,obj.studioFace,this.document.version));
    obj.set({left:normalized.x,top:normalized.y,scaleX:normalized.width/obj.width,scaleY:normalized.height/obj.height});obj.setCoords();
  }
  async render(document,face,assets,selectedId){
    this.document=document;const generation=++this.generation;
    try{
      const background=await garmentImage(document,face);
      const visible=document.elements.filter(e=>face==='front'?e.face!=='back':e.face===face);
      const objects=await Promise.all(visible.map(async e=>{
        let obj;
        if(e.kind==='image'){
          const src=assets[e.assetId]?.dataUrl||`/api/designer?action=asset&id=${e.assetId}`;
          obj=await FabricImage.fromURL(src);
        }else obj=new FabricText(e.text,{fontFamily:FONTS.find(f=>f.id===e.font)?.family||'Arial',fontSize:48,fill:e.fill,textAlign:'center'});
        const display=projectElement(e,document.productId,face,document.version),projection=e.face!==face;
        obj.set({originX:'center',originY:'center',left:display.x,top:display.y,scaleX:display.width/obj.width,scaleY:display.height/obj.height,angle:display.angle,selectable:!projection,hoverCursor:projection?'pointer':'move',lockScalingFlip:true,lockSkewingX:true,lockSkewingY:true,cornerColor:'#fff',cornerStrokeColor:'#252b23',borderColor:'#526449',cornerSize:13,transparentCorners:false,padding:3,opacity:document.method==='print'?.95:1,objectCaching:false});
        if(document.method==='embroidery')obj.set('shadow',new Shadow({color:'rgba(0,0,0,.35)',blur:1,offsetX:.5,offsetY:1}));
        const zone=displayZoneFor(document.productId,e.face,face,document.version);
        obj.clipPath=new Rect({originX:'left',originY:'top',left:zone.x,top:zone.y,width:zone.w,height:zone.h,absolutePositioned:true});
        obj.studioId=e.id;obj.studioFace=e.face;obj.studioProjection=projection;
        obj.setControlsVisibility({ml:false,mr:false,mt:false,mb:false});return obj;
      }));
      if(generation!==this.generation)return false;
      this.applying=true;this.canvas.clear();this.canvas.backgroundImage=background;
      const zone=zoneFor(document.productId,face,document.version);
      this.guide=new Rect({originX:'left',originY:'top',left:zone.x,top:zone.y,width:zone.w,height:zone.h,fill:'transparent',stroke:'#66745d',strokeWidth:1,strokeDashArray:[5,5],selectable:false,evented:false,excludeFromExport:true});
      this.canvas.add(this.guide,...objects);
      const selected=objects.find(o=>o.studioId===selectedId);if(selected)this.canvas.setActiveObject(selected);
      this.container.dataset.view=face;this.container.dataset.angle=isSleeve(face)?'side':'straight';
      this.canvas.requestRenderAll();this.applying=false;return true;
    }catch(error){this.applying=false;this.onError(error.message);return false;}
  }
  select(id){this.applying=true;const object=this.canvas.getObjects().find(o=>o.studioId===id);if(object)this.canvas.setActiveObject(object);else this.canvas.discardActiveObject();this.canvas.requestRenderAll();this.applying=false;}
  async preview(){
    this.applying=true;this.canvas.discardActiveObject();if(this.guide)this.guide.visible=false;this.canvas.renderAll();
    const url=this.canvas.toDataURL({format:'png',multiplier:600/this.canvas.getWidth(),enableRetinaScaling:false});
    if(this.guide)this.guide.visible=true;this.canvas.requestRenderAll();this.applying=false;return url;
  }
  async dispose(){this.generation++;this.observer.disconnect();await this.canvas.dispose();}
}
