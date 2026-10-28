# Approved image assets

Acid-wash Black Hoodie: `assets/campus-acid-black/mandi-acid-black-hoodie-front.png`, `mandi-acid-black-hoodie-back.png` and `mandi-acid-black-hoodie-detail.png`. This separate cool charcoal/black colourway is in stock at ₹1,600 (list ₹2,000), with the complete institute chest emblem and Cream Mountain back print. Built-in imagegen prompts and saved paths are in `ACID_BLACK_HOODIE_PROMPTS.json`.

The campus catalog is ordered by Polos, T-shirts, Hoodies, Zip hoodies, Varsity jackets and Tracksuits, with available items first within each type. All individual campus styles show a rounded 20% discount label. Selling prices are preserved; whole-rupee list prices are calculated above them. ₹2,999 styles list at ₹3,749.

New black/white and brown/cream varsity jackets and heather grey polo: nine standalone front/back/detail photographs are in `assets/campus-new`. Each uses the complete IIT Mandi chest emblem and approved arched IIT MANDI mountain back design. Varsity jackets retain the number 3 patch and cost ₹2,999 each (list price ₹3,749); the grey polo costs ₹600. All three products are out of stock in every size. Built-in imagegen prompts and all saved image paths are in `VARSITY_POLO_IMAGE_PROMPTS.json`.

Cream / Ivory Ridge Hoodie: `assets/campus-cream/iit-mandi-cream-hoodie-front.png`, `iit-mandi-cream-hoodie-back.png` and `iit-mandi-cream-hoodie-detail.png`. The three standalone photographs use the complete institute chest emblem and the approved Green Ridge layout with dark lettering on cream. The hoodie is listed at ₹1,200 and out of stock in all sizes. Built-in imagegen prompts and the rear-view revision are recorded in `CREAM_HOODIE_PROMPTS.json`.

The supplied gold CAPRA COOL logo is the shared website identity across Brand, Campus and Handmade. Brand apparel uses the gold logo. Campus apparel keeps the approved IIT Mandi institute chest emblem and campus back prints.

- `assets/campus-approved`: seven garment/colour variants with Cream Mountain or Green Ridge artwork; original references are preserved.
- `assets/design-gold`: gold-logo Brand apparel and hero imagery.
- `assets/identity/capra-gold-original.png`: supplied logo, unchanged; CSS frames its transparent padding.
- `assets/tracksuit/iit-mandi-tracksuit-front.png` and `iit-mandi-tracksuit-back.png`: selected standalone tracksuit photographs. Only these two views appear on the website. Other generated angles and the collage remain local archive sources, ignored by Git.

The complete IIT Mandi jacket and trousers set costs ₹2,999. Its mountain artwork is fixed. Optional jacket name/department printing costs ₹51. Its list price is ₹3,749 with a rounded 20% discount label.

The second option, Minimal Tracksuit Set, also costs ₹2,999. Its selected assets are `assets/tracksuit/iit-mandi-tracksuit-minimal-front-v2.png` (complete institute chest logo and small trouser mountain) and `iit-mandi-tracksuit-minimal-back.png` (IIT MANDI lettering alone). The earlier front draft is archived locally and ignored by Git. Prompt history is recorded in `TRACKSUIT_MINIMAL_PROMPTS.json`.

Other campus garments offer sizes S–XXXL, either approved artwork and optional ₹51 printing. Everyday Set costs ₹1,700 (save ₹100); Washed Set costs ₹2,200 (save ₹200). Print fees are excluded from combo savings.

Built-in imagegen produced the raster edits. Prompt records are in `APPROVED_IMAGE_PROMPTS.json` and `TRACKSUIT_IMAGE_PROMPTS.json`. Source images are untouched. `scripts/optimize-images.mjs` creates WebP and AVIF copies for the website.

The image-library export is organised under `App Image/Website Assets/2026-10-27 Approved` with Campus/Approved, Campus/Tracksuit, Brand/Gold, Logos, Web-ready and Archive folders. Run `scripts/export-image-library.mjs` with that destination to create the manifest and copies; existing files are preserved.

Browser checkout tests intercept writes and do not create real orders. Live database persistence requires separate authenticated order verification.
