import {CAMPUS_DESIGNS, CAMPUS_SIZES, CAMPUS_CATEGORY_ORDER} from './campus-catalog.js';

// Browser and order API use the same Brand identity, stock and selling prices.
export const BRAND_CATEGORY_LABELS = {polo:'Polo',tee:'T-Shirt',hoodie:'Hoodie',zip:'Zip hoodie',varsity:'Varsity jacket',track:'Tracksuit'};
export const BRAND_ORIGINAL_PRODUCTS = [
  {
    id: 'summit-tee', name: 'Summit Tee', category: 'tee', price: 799,
    image: 'assets/product_summit_tee.jpg', backImage: 'assets/brand-hover/summit-tee-back.png', color: 'Ivory', gsm: '180 GSM',
    fabric: 'Combed cotton', fit: 'Regular fit', sku: 'CC-TEE-001',
    description: 'An everyday cotton tee with a small mountain chest print. Ivory, 180 GSM.',
    care: 'Cold machine wash with similar colours. Line dry in shade.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'alpine-hoodie', name: 'Alpine Hoodie', category: 'hoodie', price: 1499,
    image: 'assets/brand-hover/alpine-hoodie-front.png', backImage: 'assets/product_alpine_hoodie.jpg', color: 'Black', gsm: '380 GSM',
    fabric: 'Brushed cotton fleece', fit: 'Structured athletic fit', sku: 'CC-HD-001',
    description: 'Black brushed-fleece hoodie with the CAPRA COOL goat graphic on the back. 380 GSM.',
    care: 'Gentle cold wash. Hang dry in shade. Do not iron directly on print.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'trail-tracksuit', name: 'Trail Tracksuit', category: 'track', price: 1999,
    image: 'assets/product_trail_tracksuit.jpg', backImage: 'assets/brand-hover/trail-tracksuit-back.png', color: 'Deep Olive', gsm: '340 GSM',
    fabric: 'Technical double-knit', fit: 'Tapered outerwear set', sku: 'CC-TRK-001',
    description: 'An olive zip jacket and tapered track pant, sold as a two-piece set. 340 GSM double-knit.',
    care: 'Fasten zips, cold wash, air dry.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'classic-tee', name: 'Capra Classic Tee', category: 'tee', price: 799,
    image: 'assets/product_classic_tee.jpg', backImage: 'assets/brand-hover/classic-tee-back.png', color: 'Jet Black', gsm: '180 GSM',
    fabric: 'Heavy combed cotton', fit: 'Relaxed boxy cut', sku: 'CC-TEE-002', imageFit: 'contain',
    description: 'Black cotton tee with a relaxed cut and CAPRA COOL chest mark. 180 GSM.',
    care: 'Wash cold inside-out. Do not bleach. Cool iron.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'capra-cool-tee', name: 'Capra Cool Tee', category: 'tee', price: 899,
    image: 'assets/capra-cool-studio-front.jpg', backImage: 'assets/brand-hover/capra-cool-tee-back.png', color: 'Jet Black', gsm: '220 GSM',
    fabric: 'Cool-touch cotton blend', fit: 'Relaxed athletic fit', sku: 'CC-TEE-003', imageFit: 'contain',
    description: 'A cotton-blend tee with a relaxed athletic fit and small chest wordmark. Jet Black, 220 GSM.',
    care: 'Wash cold inside-out. Line dry in shade. Do not iron directly on print.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'horizon-hoodie', name: 'Horizon Hoodie', category: 'hoodie', price: 1499,
    image: 'assets/product_horizon_hoodie.jpg', backImage: 'assets/brand-hover/horizon-hoodie-back.png', color: 'Olive', gsm: '380 GSM',
    fabric: 'Heavy brushed fleece', fit: 'Drop-shoulder structure', sku: 'CC-HD-002',
    description: 'Olive fleece hoodie with sleeve artwork and a relaxed shoulder. 380 GSM.',
    care: 'Cold gentle wash. Line dry. Do not tumble dry.', sizes: ['S','M','L','XL','XXL']
  },
  {
    id: 'peak-tracksuit', name: 'Peak Tracksuit', category: 'track', price: 1999,
    image: 'assets/product_peak_tracksuit_clean.jpg', backImage: 'assets/brand-hover/peak-tracksuit-back.png', color: 'Basalt Black', gsm: '340 GSM',
    fabric: 'Technical double-knit jersey', fit: 'Tapered performance cut', sku: 'CC-TRK-002', imageFit: 'contain',
    description: 'Black zip jacket and matching track pants. A two-piece set in 340 GSM double-knit.',
    care: 'Wash with like colours. Do not iron over logo. Air dry.', sizes: ['S','M','L','XL','XXL']
  }
];

const additions = [
 ['capra-ridge-polo','mandi-mountain-polo','Ridge Polo','Small ivory hill chest embroidery, CAPRA COOL lettering and a completely plain back.'],
 ['capra-oxblood-polo','mandi-maroon-polo','Oxblood Contrast Polo','Cream collar and cuffs with a small hill chest mark and a completely plain back.'],
 ['capra-contrast-polo','mandi-contrast-polo','Contrast Polo','White collar and cuffs, ivory hill chest embroidery and a completely plain back.'],
 ['capra-heather-polo','mandi-grey-polo','Heather Polo','Heather grey piqué with charcoal hill embroidery and a completely plain back.'],
 ['capra-washed-tee','mandi-washed-tee','Washed Ridge Tee','Washed black cotton with a small hill chest mark and a restrained alpine landscape back print.'],
 ['capra-core-hoodie','mandi-mountain-hoodie','Core Ridge Hoodie','Black fleece with a small hill chest mark and a completely plain back.'],
 ['capra-washed-hoodie','mandi-washed-hoodie','Washed Ridge Hoodie','Faded black fleece with a small hill chest mark and a completely plain back.'],
 ['capra-acid-hoodie','mandi-acid-black-hoodie','Acid Wash Ridge Hoodie','Charcoal acid-wash fleece with a small hill chest print and a completely plain back.'],
 ['capra-ivory-hoodie','mandi-cream-hoodie','Ivory Ridge Hoodie','Ivory fleece with dark hill chest embroidery and a completely plain back.'],
 ['capra-zip-hoodie','mandi-mountain-zip','Ridge Zip Hoodie','A full-zip black hoodie with a small hill chest mark and a completely plain back.'],
 ['capra-varsity-black','mandi-varsity-black','Varsity Jacket','Black body and white sleeves with a small hill chest patch and a completely plain back.'],
 ['capra-varsity-brown','mandi-varsity-brown','Varsity Jacket','Brown body and cream sleeves with a small hill chest patch and a completely plain back.'],
 ['capra-ridge-tracksuit','iit-mandi-tracksuit','Ridge Tracksuit','Black jacket and trousers with charcoal panels, ivory hill chest and thigh marks, and a completely plain back.'],
 ['capra-essential-tracksuit','iit-mandi-tracksuit-minimal','Essential Tracksuit','Black jacket and trousers with charcoal panels, small tonal hill marks and a completely plain back.']
];

export const BRAND_ADAPTED_PRODUCTS = additions.map(([id,sourceId,name,description])=>{
 const source=CAMPUS_DESIGNS.find(product=>product.id===sourceId);
 if(!source) throw new Error('Missing source garment: '+sourceId);
 const fabric=source.category==='polo'?'Cotton piqué':source.category==='tee'?'Cotton jersey':['hoodie','zip'].includes(source.category)?'Fleece':'See garment details';
 return {id,sourceId,name,description,category:source.category,color:source.colour,
  price:source.priceCents/100,listPrice:source.listPriceCents/100,inStock:source.inStock!==false,
  gsm:source.gsm?source.gsm+' GSM':source.category==='track'?'Jacket + trousers':source.category==='zip'?'Zip-front hoodie':'Snap-front jacket',
  fabric,fit:'Regular fit',sku:id.toUpperCase(),sizes:[...CAMPUS_SIZES],
  image:'assets/brand-collection/'+id+(source.category==='polo'?'-hill-v2':'')+'.png',backImage:'assets/brand-collection/'+id+(source.category==='polo'?'-hill-v2':'')+'.png',pairedImage:true,
  care:'Wash cold inside-out with similar colours. Line dry in shade. Do not iron directly on artwork.'};
});

export const BRAND_PRODUCTS = [...BRAND_ORIGINAL_PRODUCTS,...BRAND_ADAPTED_PRODUCTS]
 .sort((a,b)=>CAMPUS_CATEGORY_ORDER.indexOf(a.category)-CAMPUS_CATEGORY_ORDER.indexOf(b.category)||Number(a.inStock===false)-Number(b.inStock===false));
