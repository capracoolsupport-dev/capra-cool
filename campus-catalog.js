// Shared by the browser and order API. Amounts are integer paise.
export const CAMPUS_SIZES = ['S','M','L','XL','XXL','XXXL'];
export const PERSONALISATION_CENTS = 5100;
export const CAMPUS_ARTWORKS = [{id:'mountain',name:'Cream Mountain',description:'Arched IIT MANDI lettering, cream mountain artwork and the IITians in Himalayas line.'},{id:'ridge',name:'Green Ridge',description:'Straight IIT Mandi lettering, the green ridge line and IITians in Himalayas.'}];
export const CAMPUS_DESIGNS = [
  {
    "id": "mandi-mountain-polo",
    "name": "Mountain Polo",
    "category": "polo",
    "colour": "Black",
    "collection": "Core",
    "base": 469,
    "gsm": 230,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-maroon-polo",
    "name": "Contrast Polo",
    "category": "polo",
    "colour": "Maroon / Cream",
    "collection": "Contrast",
    "base": 469,
    "gsm": 230,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-contrast-polo",
    "name": "Contrast Polo",
    "category": "polo",
    "colour": "Black / White",
    "collection": "Contrast",
    "base": 469,
    "gsm": 230,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-mountain-hoodie",
    "name": "Mountain Hoodie",
    "category": "hoodie",
    "colour": "Black",
    "collection": "Core",
    "base": 969,
    "gsm": 400,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-mountain-zip",
    "name": "Mountain Zip Hoodie",
    "category": "zip",
    "colour": "Black",
    "collection": "Core",
    "base": 1059,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-washed-tee",
    "name": "Washed Mountain Tee",
    "category": "tee",
    "colour": "Washed Black",
    "collection": "Washed",
    "base": 649,
    "gsm": 230,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  },
  {
    "id": "mandi-washed-hoodie",
    "name": "Washed Mountain Hoodie",
    "category": "hoodie",
    "colour": "Washed Black",
    "collection": "Washed",
    "base": 1150,
    "gsm": 400,
    "description": "Choose the approved Cream Mountain or Green Ridge back artwork. Both keep the original IIT Mandi institute emblem at the chest. Add your name or department for ₹51."
  }
  ,{id:'iit-mandi-tracksuit',name:'Campus Tracksuit Set',category:'track',colour:'Black / Charcoal',collection:'Tracksuit',base:2999,launchPrice:2999,listPriceCents:299900,artworks:['mountain'],artworkName:'Mountain Print',gallery:['optimized/tracksuit/iit-mandi-tracksuit-front.webp','optimized/tracksuit/iit-mandi-tracksuit-back.webp'],description:'A full-zip jacket and matching trousers, sold as one set. Black with charcoal side panels and white accents. Original institute chest and thigh emblems, with the IIT Mandi mountain back print. Optional name printing applies to the jacket.'}
  ,{id:'iit-mandi-tracksuit-minimal',name:'Minimal Tracksuit Set',category:'track',colour:'Black / Charcoal',collection:'Tracksuit',base:2999,launchPrice:2999,listPriceCents:299900,artworks:['mountain'],artworkName:'Minimal Print',gallery:['optimized/tracksuit/iit-mandi-tracksuit-minimal-front-v2.webp','optimized/tracksuit/iit-mandi-tracksuit-minimal-back.webp'],galleryNote:'Complete IIT Mandi chest emblem, a small mountain on the trousers, and IIT MANDI lettering alone on the back.',description:'A full-zip jacket and matching trousers in black with charcoal panels. Complete IIT Mandi logo on the chest, a simple white mountain on the trousers, and IIT MANDI lettering on the back. Optional name printing applies to the jacket.'}
].map(design => {
  const launchPrice = design.launchPrice ?? (design.base === 469 ? 600 : design.base === 649 ? 800 : design.base === 969 ? 1200 : design.base === 1059 ? 1400 : 1600);
  return {...design,listPriceCents:design.listPriceCents??launchPrice * 125,priceCents:launchPrice * 100};
});

export function campusUnitCents(design, personalisation = false) {
  return design.priceCents + (personalisation ? PERSONALISATION_CENTS : 0);
}

// Savings are below individual launch prices; print charges are never discounted.
export const CAMPUS_COMBOS = [
  {id:'everyday-set',name:'The Everyday Set',description:'Mountain Polo + Mountain Hoodie',items:['mandi-mountain-polo','mandi-mountain-hoodie'],savingCents:10000},
  {id:'washed-set',name:'The Washed Set',description:'Washed Mountain Tee + Washed Mountain Hoodie',items:['mandi-washed-tee','mandi-washed-hoodie'],savingCents:20000}
];

export function campusComboSavings(items) {
  const quantities = new Map();
  for(const item of items) quantities.set(item.id,(quantities.get(item.id)||0)+Math.min(10,Math.max(0,Math.floor(Number(item.qty)||0))));
  const offers = CAMPUS_COMBOS.map(combo=>({...combo,quantity:Math.min(...combo.items.map(id=>quantities.get(id)||0))})).filter(offer=>offer.quantity>0);
  return {discountCents:offers.reduce((total,offer)=>total+offer.savingCents*offer.quantity,0),offers};
}
