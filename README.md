# CAPRA COOL storefront

The Vite site has separate Brand (index.html), IIT Mandi Campus (campus.html), Handmade (handmade.html), Policies and staff Admin pages. All customer store headers use the supplied gold CAPRA COOL identity.

## Development

- npm run dev starts the local site and creates optimized images.
- npm run build optimizes images and builds all five HTML entries.
- npm run test:e2e runs Chrome browser checks against the production preview on port 4173.
- node --test tests/campus-pricing.test.mjs checks trusted prices, artwork validation and combo arithmetic.
- On Windows PowerShell, use npm.cmd if npm scripts are restricted.

## Campus catalog

Seven garment/colour variants each offer Cream Mountain and Green Ridge artwork, based on the approved original designs. The eighth product is the complete IIT Mandi tracksuit at ₹2,999, with selected front/back photographs and fixed mountain artwork. Sizes S–XXXL and optional ₹51 printing are available; tracksuit printing applies to the jacket. campus-catalog.js is shared by the UI and order API. Combo savings apply to complete pairs at the server as well as in the bag. Each ordered item stores the artwork, size and print instructions.

Campus checkout posts to /api/orders. Configure the Supabase server variables and staff token in .env.example on the deployment. Vite alone does not execute Vercel functions. Browser tests intercept order writes and do not create real orders; live deployment credentials and database persistence are not verified.

## Campus stock

The black/white Contrast Polo (`mandi-contrast-polo`), cream Ridge Hoodie (`mandi-cream-hoodie`), black/white and brown/cream varsity jackets (`mandi-varsity-black`, `mandi-varsity-brown`) and grey polo (`mandi-grey-polo`) are marked `inStock: false` in `campus-catalog.js` for all sizes. Set a product's flag to `true` and publish to restore purchasing. Sold-out products remain visible; saved bags require removing unavailable items, and the order API rejects them before writing an order. This is a catalog setting; the admin order desk does not yet provide a stock toggle.

## Images

Active campus mockups are in assets/campus-approved, selected tracksuit photographs in assets/tracksuit, brand mockups in assets/design-gold, and the supplied gold logo in assets/identity/capra-gold-original.png. The CSS logo frame preserves original pixels while hiding transparent padding. The source image folder on the Desktop is preserved. IMAGE_ASSET_GUIDE.md documents the organised export; APPROVED_IMAGE_PROMPTS.json and TRACKSUIT_IMAGE_PROMPTS.json record the built-in imagegen prompts.

CAMPUS_PLAN.md records the current product decisions and verification. store-header.css styles the shared store navigation; campus.css and storefront.css style the campus and brand shopping pages.
