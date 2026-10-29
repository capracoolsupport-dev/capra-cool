# CAPRA COOL collection expansion

Add a distinct CAPRA COOL version of every Campus garment while preserving the seven existing Brand products and all Campus products. The user confirmed the same selling prices, sizes and stock status as Campus.

## Design direction

Latest user direction: use a small monochrome hill logo on the front, plain backs on polos and outerwear, and a selective hill/streetwear landscape back print on the washed tee. Existing seven Brand styles keep their original identity. Keep each garment's colour, construction and fabric finish. No institute crests, university names, number 3 patches or multicolour prints. Photograph the new collection consistently as front/back studio pairs on warm off-white, with no models or marketing copy in the image.

## Tasks

1. Create and inspect 14 front/back mockup pairs using built-in imagegen; preserve originals and record prompts.
2. Add a shared Brand catalog for browser and order API, with an explicit mapping to the corresponding Campus style. Preserve prices, sizes and unavailable states.
3. Extend Brand filters, hover previews, mobile front/back gallery, stock controls, bag and trusted checkout. Keep the existing seven products.
4. Check every image, category, gallery, stock restriction and server price. Review desktop and mobile appearance.
5. Export images to the existing image library, commit the reviewed change and publish through the existing GitHub/Vercel workflow.

| Campus source | CAPRA COOL version | Price | Availability |
|---|---|---:|---|
| mandi-mountain-polo | Ridge Polo / Black | ₹600 | In stock |
| mandi-maroon-polo | Contrast Polo / Oxblood & Cream | ₹600 | In stock |
| mandi-contrast-polo | Contrast Polo / Black & White | ₹600 | Out of stock |
| mandi-grey-polo | Heather Polo / Grey | ₹600 | Out of stock |
| mandi-washed-tee | Washed Ridge Tee | ₹800 | In stock |
| mandi-mountain-hoodie | Core Ridge Hoodie / Black | ₹1,200 | In stock |
| mandi-washed-hoodie | Washed Ridge Hoodie | ₹1,600 | In stock |
| mandi-acid-black-hoodie | Acid Wash Ridge Hoodie | ₹1,600 | In stock |
| mandi-cream-hoodie | Ivory Ridge Hoodie | ₹1,200 | Out of stock |
| mandi-mountain-zip | Ridge Zip Hoodie | ₹1,400 | In stock |
| mandi-varsity-black | Varsity Jacket / Black & White | ₹2,999 | Out of stock |
| mandi-varsity-brown | Varsity Jacket / Brown & Cream | ₹2,999 | Out of stock |
| iit-mandi-tracksuit | Ridge Tracksuit | ₹2,999 | In stock |
| iit-mandi-tracksuit-minimal | Essential Tracksuit | ₹2,999 | In stock |

The 14 additions offer S–XXXL. Existing Brand products keep their current sizes and prices. Comparison prices mirror Campus. Artwork is fixed for each Brand garment; no Campus artwork or personalisation selector carries into Brand.

## Verification

All 14 hill-logo front/back pairs were visually reviewed. The production build passed. The final browser run passed 119 checks across desktop, tablet and mobile, with four mouse-hover cases skipped on touch devices. Nineteen catalog/order checks passed, including every new price, XXXL sizing and all five unavailable styles. Browser order writes were mocked; no real order was submitted. The existing Desktop image library now contains 475 exported files, including the new Brand/Hill-Collection assets.

Implementation and image export are complete. The reviewed change is ready for the existing GitHub/Vercel publication workflow.
