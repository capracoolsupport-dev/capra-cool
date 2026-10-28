import fs from 'node:fs/promises';
let html=await fs.readFile('campus.html','utf8');
html=html.replace('All styles <span>10</span>','All styles <span>13</span>').replace('>10 styles</p>','>13 styles</p>');
html=html.replace('<button type="button" data-category="track"','<button type="button" data-category="varsity" aria-pressed="false">Varsity jackets</button><button type="button" data-category="track"');
await fs.writeFile('campus.html',html);
for(const file of ['tests/e2e/campus.spec.js','tests/e2e/premium-storefront.spec.js']){
 let source=await fs.readFile(file,'utf8');
 source=source.replaceAll('toHaveCount(10)','toHaveCount(13)').replace("['polo',3]","['polo',4]").replace("['track',2]","['track',2],['varsity',2]");
 await fs.writeFile(file,source);
}
let source=await fs.readFile('campus.js','utf8');
const comparison='<s aria-label="List price ${money(design.listPriceCents)}">${money(design.listPriceCents)}</s><span class="launch-label">LAUNCH −20%</span>';
if(!source.includes(comparison))throw new Error('Catalog price fragment not found');
source=source.replace(comparison,'${design.listPriceCents>design.priceCents?`'+comparison+'`:""}');
source=source.replace("${activeDesign.category==='track'?'Jacket + trousers':'20% launch discount on garment'}","${activeDesign.category==='track'?'Jacket + trousers':activeDesign.listPriceCents>activeDesign.priceCents?'20% launch discount on garment':'Price per garment'}");
await fs.writeFile('campus.js',source);
source=await fs.readFile('scripts/export-image-library.mjs','utf8');
source=source.replace("const group=source.includes(`${path.sep}campus-cream${path.sep}`)","const group=source.includes(`${path.sep}campus-new${path.sep}`)?(name.includes('varsity')?'Campus/Varsity':'Campus/Grey-Polo'):source.includes(`${path.sep}campus-cream${path.sep}`)");
await fs.writeFile('scripts/export-image-library.mjs',source);
