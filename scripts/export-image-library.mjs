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
  const group=source.includes(`${path.sep}identity${path.sep}`)?'Logos':source.includes(`${path.sep}campus${path.sep}`)?'Campus':source.includes(`${path.sep}editorial${path.sep}`)?'Editorial':/^handmade|keychain|charms|spiderman/.test(name)?'Handmade':/^iit-/.test(name)?'Campus/Archive':/logo|crest|mark|hangtag/.test(name)?'Logos/Originals':/^(test-|corner-|model-|pdp-|heart-|catalog-grid|discover-section)/.test(name)?'Archive':'Brand';
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
await fs.writeFile(path.join(destination,'image-manifest.json'),JSON.stringify(entries,null,2));
console.log(`Exported ${entries.length} files to ${destination}; existing files preserved.`);
