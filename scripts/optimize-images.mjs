import { mkdir, access, readdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputDir = join(root, 'public', 'optimized');
await mkdir(outputDir, { recursive: true });

const sources = [
  'assets/crop_hero_model_3x4.jpg',
  'assets/editorial/campus-collection-editorial.png',
  'assets/editorial/handmade-knits-editorial.png',
  'assets/test_hero_crop.jpg',
  'assets/collection_tees.jpg',
  'assets/collection_hoodies.jpg',
  'assets/collection_tracksuits.jpg',
  'assets/product_summit_tee.jpg',
  'assets/product_alpine_hoodie.jpg',
  'assets/product_trail_tracksuit.jpg',
  'assets/sharp_product_classic_tee.jpg',
  'assets/product_classic_tee.jpg',
  'assets/capra-cool-studio-front.jpg',
  'assets/product_horizon_hoodie.jpg',
  'assets/product_peak_tracksuit_clean.jpg',
  'assets/crop_editorial_3x4.jpg',
  'assets/handmade-muffler.jpg',
  'assets/handmade-winter-cap.jpg',
  'assets/handmade-krishna.jpg',
  'assets/sunflower-keychain.jpg'
];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

for (const relative of sources) {
  const input = join(root, relative);
  if (!(await exists(input))) {
    console.warn(`[images] skipped missing ${relative}`);
    continue;
  }
  const stem = basename(relative, extname(relative));
  const image = sharp(input).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
  await Promise.all([
    image.clone().webp({ quality: 82, effort: 5 }).toFile(join(outputDir, `${stem}.webp`)),
    image.clone().avif({ quality: 58, effort: 5 }).toFile(join(outputDir, `${stem}.avif`))
  ]);
  console.log(`[images] optimized ${relative}`);
}

const campusDirectory = join(root, 'assets', 'campus');
if (await exists(campusDirectory)) {
  const campusOutput = join(outputDir, 'campus');
  await mkdir(campusOutput, { recursive: true });
  for (const filename of await readdir(campusDirectory)) {
    if (!/\.png$/i.test(filename)) continue;
    const stem = basename(filename, extname(filename));
    const source = sharp(join(campusDirectory, filename)).rotate().resize({width:1600, withoutEnlargement:true});
    await Promise.all([
      source.clone().webp({quality:86, effort:5}).toFile(join(campusOutput, `${stem}.webp`)),
      source.clone().avif({quality:65, effort:5}).toFile(join(campusOutput, `${stem}.avif`))
    ]);
    console.log(`[images] optimized campus/${filename}`);
  }
}

const designDirectory=join(root,'assets','design-gold');
if(await exists(designDirectory)){
 const target=join(outputDir,'design-gold');await mkdir(target,{recursive:true});
 for(const filename of await readdir(designDirectory)){
  if(!filename.endsWith('.png'))continue;
  const stem=basename(filename,'.png');const source=sharp(join(designDirectory,filename)).resize({width:1600,withoutEnlargement:true});
  await Promise.all([source.clone().webp({quality:88,effort:5}).toFile(join(target,stem+'.webp')),source.clone().avif({quality:66,effort:5}).toFile(join(target,stem+'.avif'))]);
  console.log('[images] optimized design-gold/'+filename);
 }
}

const approvedDirectory=join(root,'assets','campus-approved');
if(await exists(approvedDirectory)){
 const target=join(outputDir,'campus-approved');await mkdir(target,{recursive:true});
 for(const filename of await readdir(approvedDirectory)){
  if(!filename.endsWith('.png'))continue;
  const stem=basename(filename,'.png');const source=sharp(join(approvedDirectory,filename)).resize({width:1600,withoutEnlargement:true});
  await Promise.all([source.clone().webp({quality:88,effort:5}).toFile(join(target,stem+'.webp')),source.clone().avif({quality:66,effort:5}).toFile(join(target,stem+'.avif'))]);
  console.log('[images] optimized campus-approved/'+filename);
 }
}

const tracksuitOutput=join(outputDir,'tracksuit');await mkdir(tracksuitOutput,{recursive:true});
for(const view of ['front','back']){const image=sharp(join(root,'assets','tracksuit',`iit-mandi-tracksuit-${view}.png`)).resize({width:1400,withoutEnlargement:true});await Promise.all([image.clone().webp({quality:88}).toFile(join(tracksuitOutput,`iit-mandi-tracksuit-${view}.webp`)),image.clone().avif({quality:64}).toFile(join(tracksuitOutput,`iit-mandi-tracksuit-${view}.avif`))]);}
