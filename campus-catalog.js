// Shared by the browser and order API. Amounts are integer paise.
export const CAMPUS_SIZES = ['S','M','L','XL','XXL','XXXL'];
export const PERSONALISATION_CENTS = 5100;
export const CAMPUS_DESIGNS = [
  {id:'mandi-mountain-polo',name:'Mountain Polo',category:'polo',colour:'Black',collection:'Mountain',base:469,gsm:230,description:'IIT Mandi lettering and a mountain graphic across the back, with an institute chest mark.'},
  {id:'mandi-maroon-polo',name:'Contrast Polo',category:'polo',colour:'Maroon / Cream',collection:'Contrast',base:469,gsm:230,description:'A maroon polo with cream collar and cuffs. IIT Mandi mountain artwork on the back.'},
  {id:'mandi-contrast-polo',name:'Contrast Polo',category:'polo',colour:'Black / White',collection:'Contrast',base:469,gsm:230,description:'A black polo with contrast collar and cuffs, a small chest mark and mountain artwork on the back.'},
  {id:'mandi-wordmark-polo',name:'Wordmark Polo',category:'polo',colour:'Black',collection:'Wordmark',base:469,gsm:230,description:'A simple IIT Mandi wordmark on the back, with an institute mark at the chest.'},
  {id:'mandi-ridge-polo',name:'Ridge Polo',category:'polo',colour:'Black / Green',collection:'Ridge',base:469,gsm:230,description:'A green mountain line, IIT Mandi lettering and a small institute chest mark.'},
  {id:'mandi-mountain-hoodie',name:'Mountain Hoodie',category:'hoodie',colour:'Black',collection:'Mountain',base:969,gsm:400,description:'A pullover hoodie with IIT Mandi mountain artwork on the back and a chest mark.'},
  {id:'mandi-mountain-zip',name:'Mountain Zip Hoodie',category:'zip',colour:'Black',collection:'Mountain',base:1059,description:'The mountain artwork in a full-zip hoodie, with a split front pocket and institute chest mark.'},
  {id:'mandi-ridge-hoodie',name:'Ridge Hoodie',category:'hoodie',colour:'Black / Green',collection:'Ridge',base:969,gsm:400,panels:3,overview:true,description:'IIT Mandi lettering and green ridge artwork. The preview shows the front, side and back placements.'},
  {id:'mandi-name-hoodie',name:'Personalised Type Hoodie',category:'hoodie',colour:'Black / Orange',collection:'Type',base:969,gsm:400,personalised:true,overview:true,description:'Bold institute typography on the back, with a space for your name. Add name printing to personalise this design.'},
  {id:'mandi-washed-tee',name:'Washed Mountain Tee',category:'tee',colour:'Washed Black',collection:'Washed',base:649,gsm:230,description:'A washed-effect round-neck tee with outlined IIT Mandi lettering and a mountain back graphic.'},
  {id:'mandi-washed-hoodie',name:'Washed Mountain Hoodie',category:'hoodie',colour:'Washed Black',collection:'Washed',base:1150,gsm:400,description:'The washed-effect design in a pullover hoodie, with outlined IIT Mandi mountain artwork.'}
].map(design => {
  const launchPrice = design.base === 469 ? 600 : design.base === 649 ? 800 : design.base === 969 ? 1200 : design.base === 1059 ? 1400 : 1600;
  return {...design,listPriceCents:launchPrice * 125,priceCents:launchPrice * 100};
});

export function campusUnitCents(design, personalisation = false) {
  return design.priceCents + (personalisation ? PERSONALISATION_CENTS : 0);
}
