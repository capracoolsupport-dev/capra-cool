# Approved image assets

The supplied gold CAPRA COOL logo is the shared website identity across Brand, Campus and Handmade. Brand apparel uses the gold logo. Campus apparel keeps the approved IIT Mandi institute chest emblem and campus back prints.

- `assets/campus-approved`: seven garment/colour variants with Cream Mountain or Green Ridge artwork; original references are preserved.
- `assets/design-gold`: gold-logo Brand apparel and hero imagery.
- `assets/identity/capra-gold-original.png`: supplied logo, unchanged; CSS frames its transparent padding.
- `assets/tracksuit/iit-mandi-tracksuit-front.png` and `iit-mandi-tracksuit-back.png`: selected standalone tracksuit photographs. Only these two views appear on the website. Other generated angles and the collage remain local archive sources, ignored by Git.

The complete IIT Mandi jacket and trousers set costs ₹2,999. Its mountain artwork is fixed. Optional jacket name/department printing costs ₹51. No unconfirmed comparison price or discount is shown for this set.

Other campus garments offer sizes S–XXXL, either approved artwork and optional ₹51 printing. Everyday Set costs ₹1,700 (save ₹100); Washed Set costs ₹2,200 (save ₹200). Print fees are excluded from combo savings.

Built-in imagegen produced the raster edits. Prompt records are in `APPROVED_IMAGE_PROMPTS.json` and `TRACKSUIT_IMAGE_PROMPTS.json`. Source images are untouched. `scripts/optimize-images.mjs` creates WebP and AVIF copies for the website.

The image-library export is organised under `App Image/Website Assets/2026-10-27 Approved` with Campus/Approved, Campus/Tracksuit, Brand/Gold, Logos, Web-ready and Archive folders. Run `scripts/export-image-library.mjs` with that destination to create the manifest and copies; existing files are preserved.

Browser checkout tests intercept writes and do not create real orders. Live database persistence requires separate authenticated order verification.
