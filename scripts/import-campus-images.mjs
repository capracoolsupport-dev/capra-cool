import { mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Pass the source image directory as the first argument.');
const images = {
  'black.png': 'mandi-mountain-polo',
  '2.png': 'mandi-maroon-polo',
  'unnamed (1).png': 'mandi-contrast-polo',
  'unnamed (2).png': 'mandi-wordmark-polo',
  'unnamed (3).png': 'mandi-ridge-polo',
  'unnamed (4).png': 'mandi-ridge-hoodie',
  'unnamed (5).png': 'mandi-name-hoodie',
  'unnamed (6).png': 'mandi-mountain-hoodie',
  'unnamed (7).png': 'mandi-mountain-zip',
  'unnamed (8).png': 'mandi-washed-tee',
  'unnamed (10).png': 'mandi-washed-hoodie'
};
await mkdir('assets/campus', { recursive: true });
for (const [original, name] of Object.entries(images)) {
  await copyFile(join(sourceDirectory, original), join('assets/campus', `${name}.png`));
}
console.log(`Imported ${Object.keys(images).length} unique campus mockups.`);
