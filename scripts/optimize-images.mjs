import { mkdir, access } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputDir = join(root, 'public', 'optimized');
await mkdir(outputDir, { recursive: true });

const sources = [
  'assets/crop_hero_model_3x4.jpg',
  'assets/test_hero_crop.jpg',
  'assets/collection_tees.jpg',
  'assets/collection_hoodies.jpg',
  'assets/collection_tracksuits.jpg',
  'assets/product_summit_tee.jpg',
  'assets/product_alpine_hoodie.jpg',
  'assets/product_trail_tracksuit.jpg',
  'assets/sharp_product_classic_tee.jpg',
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
