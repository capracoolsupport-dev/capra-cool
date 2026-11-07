import {BRAND_PRODUCTS} from '../brand-catalog.js';
import {CAMPUS_DESIGNS,CAMPUS_SIZES} from '../campus-catalog.js';

const apparel = (p,group) => ({
 id:p.id,name:`${group} · ${p.name}`,group,family:p.category,gsm:p.gsm,
 baseCents:group==='Brand'?Math.round(p.price*100):p.priceCents,
 sizes:p.sizes||CAMPUS_SIZES,colourId:`product-${p.id}`,colourName:p.color||p.colour,
 faces:['front','back'],methods:['print','embroidery'],inStock:p.inStock!==false,
 photo:group==='Brand'?p.image:(p.gallery?.[0]||`assets/campus-approved/${p.id}-mountain.png`),
 backPhoto:group==='Brand'?p.backImage:(p.gallery?.[1]||p.gallery?.[0]||`assets/campus-approved/${p.id}-mountain.png`),
 paired:group==='Brand'?Boolean(p.pairedImage):!p.gallery,panels:p.panels||2,
 previewNote:'Existing garment artwork stays in place. Add your design inside the marked area.'
});
export const GIFT_PRODUCTS = [
 {id:'ceramic-mug',name:'Ceramic Mug',family:'mug',colourName:'White ceramic',faces:['front','back'],methods:['print'],spec:'330 ml ceramic mug'},
 {id:'cap',name:'Baseball Cap',family:'cap',colourName:'Black cotton',faces:['front'],methods:['print','embroidery'],spec:'Adjustable cotton cap'},
 {id:'tote-bag',name:'Cotton Tote Bag',family:'tote',colourName:'Natural cotton',faces:['front','back'],methods:['print','embroidery'],spec:'Reusable cotton tote'},
 {id:'water-bottle',name:'Steel Water Bottle',family:'bottle',colourName:'White steel',faces:['front','back'],methods:['print'],spec:'750 ml steel bottle'},
 {id:'cushion',name:'Cushion',family:'cushion',colourName:'Ivory cotton',faces:['front','back'],methods:['print','embroidery'],spec:'40 cm square cushion'},
 {id:'notebook',name:'Hardcover Notebook',family:'notebook',colourName:'Ivory cover',faces:['front','back'],methods:['print'],spec:'A5 hardcover notebook'}
].map(p=>({...p,group:'Gifts',baseCents:null,quoteOnly:true,sizes:['One size'],colourId:`product-${p.id}`,photo:`assets/designer/${p.id}.png`,paired:true,cutout:true,previewNote:'Design preview. Materials, quantities and final pricing are confirmed in your quote.'}));
export const EXTENDED_PRODUCTS = [...BRAND_PRODUCTS.map(p=>apparel(p,'Brand')),...CAMPUS_DESIGNS.map(p=>apparel(p,'Campus')),...GIFT_PRODUCTS];
export const productFaces = p => p?.faces||['front','back','leftSleeve','rightSleeve'];
export const productSizes = p => p?.sizes||['XS','S','M','L','XL','XXL'];
export const productMethods = p => p?.methods||['print','embroidery'];
export function productZone(product,face){
 if(!product?.photo)return null;
 const zones={mug:{x:190,y:285,w:210,h:220},cap:{x:205,y:220,w:190,h:100},tote:{x:155,y:355,w:290,h:245},bottle:{x:235,y:270,w:130,h:270},cushion:{x:150,y:245,w:300,h:300},notebook:{x:180,y:220,w:240,h:360}};
 if(zones[product.family])return zones[product.family];
 if(face==='front'&&['bomber','zip'].includes(product.family))return {x:345,y:350,w:105,h:135};
 if(product.family==='track')return {x:190,y:150,w:220,h:160};
 // Catalog pairs are framed as complete straight-on garments; keep additions
 // below existing chest branding and away from collars, fasteners and hems.
 if(product.paired)return face==='back'?{x:190,y:255,w:220,h:265}:{x:220,y:330,w:160,h:155};
 return face==='back'?{x:215,y:290,w:170,h:200}:{x:230,y:325,w:140,h:130};
}
