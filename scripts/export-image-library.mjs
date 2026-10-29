import fs from 'node:fs/promises';
import path from 'node:path';
import {constants} from 'node:fs';
const destination=process.argv[2];
if(!destination)throw new Error('Pass the destination image-library directory.');
const entries=[];
async function copy(source,relative){
 const target=path.join(destination,relative);
 await fs.mkdir(path.dirname(target),{recursive:true});
 try{await fs.copyFile(source,target,constants.COPYFILE_EXCL);}catch(error){if(error.code!=='EEXIST')throw error;}
 entries.push({source,file:relative.replaceAll('\\','/')});
}
const clean=name=>name.replaceAll('_','-').toLowerCase();
async function walk(directory){
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  const source=path.join(directory,entry.name);
  if(entry.isDirectory()){await walk(source);continue;}
  if(!/\.(png|jpe?g|svg|webp|avif)$/i.test(entry.name))continue;
  const name=clean(entry.name);
  const group=source.split(path.sep).includes('brand-hover')?'Brand/Hover-Views':source.includes(`${path.sep}campus-acid-black${path.sep}`)?'Campus/Acid-Wash-Black':source.includes(`${path.sep}campus-new${path.sep}`)?(name.includes('varsity')?'Campus/Varsity':'Campus/Grey-Polo'):source.includes(`${path.sep}campus-cream${path.sep}`)?'Campus/Cream-Hoodie':source.includes(`${path.sep}tracksuit${path.sep}`)?(/-(front|back)\.png$/.test(name)?'Campus/Tracksuit':'Archive/Tracksuit'):source.includes(`${path.sep}campus-approved${path.sep}`)?'Campus/Approved':source.includes(`${path.sep}design-gold${path.sep}`)?(name.startsWith('mandi-')?'Archive/Discarded-gold-campus':'Brand/Gold'):source.includes(`${path.sep}design-v2${path.sep}`)?'Archive/Monochrome-proposals':source.includes(`${path.sep}identity${path.sep}`)?'Logos':source.includes(`${path.sep}campus${path.sep}`)?'Campus':source.includes(`${path.sep}editorial${path.sep}`)?'Editorial':/^handmade|keychain|charms|spiderman/.test(name)?'Handmade':/^iit-/.test(name)?'Campus/Archive':/logo|crest|mark|hangtag/.test(name)?'Logos/Originals':/^(test-|corner-|model-|pdp-|heart-|catalog-grid|discover-section)/.test(name)?'Archive':'Brand';
  await copy(source,path.join(group,name));
 }
}
await walk('assets');
await copy('favicon.svg','Logos/Originals/original-site-favicon.svg');
async function webReady(directory,prefix=''){
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  const source=path.join(directory,entry.name);
  if(entry.isDirectory())await webReady(source,path.join(prefix,entry.name));
  else if(/\.(webp|avif)$/i.test(entry.name))await copy(source,path.join('Web-ready',prefix,clean(entry.name)));
 }
}
await webReady('public/optimized');
await copy('IMAGE_ASSET_GUIDE.md','IMAGE_ASSET_GUIDE.md');
await copy('APPROVED_IMAGE_PROMPTS.json','APPROVED_IMAGE_PROMPTS.json');
await copy('TRACKSUIT_IMAGE_PROMPTS.json','TRACKSUIT_IMAGE_PROMPTS.json');
await copy('TRACKSUIT_MINIMAL_PROMPTS.json','TRACKSUIT_MINIMAL_PROMPTS.json');
await copy('CREAM_HOODIE_PROMPTS.json','CREAM_HOODIE_PROMPTS.json');
await copy('VARSITY_POLO_IMAGE_PROMPTS.json','VARSITY_POLO_IMAGE_PROMPTS.json');
await copy('ACID_BLACK_HOODIE_PROMPTS.json','ACID_BLACK_HOODIE_PROMPTS.json');
await copy('BRAND_HOVER_IMAGE_PROMPTS.json','BRAND_HOVER_IMAGE_PROMPTS.json');
await fs.writeFile(path.join(destination,'image-manifest.json'),JSON.stringify(entries,null,2));
console.log(`Exported ${entries.length} files to ${destination}; existing files preserved.`);
