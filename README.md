# CAPRA COOL storefront

All four product sections share a catalog filter panel: product type, category, available sizes, colour, non-overlapping price ranges and availability. Choices use OR within a group and AND across groups; contextual option counts reflect the other filters. Search, price/name sorting, zero-result recovery and Clear all work with existing section subcategories. The panel collapses behind a Filters button on mobile. Stock uses the catalog flags: quote-only gifts remain “Quote required,” and Handmade remains “Confirm availability.” Clothing stock is supplied per style, not as per-size inventory. `catalog-filter-model.js` holds the testable matching/count/sort rules; `catalog-filters.js` mounts the shared interface.

The public navigation has four sections: Campus, Brand, Handmade and Custom Products. Campus and Brand use their eight clothing subcategories (polos, tees, sweatshirts, hoodies, zip hoodies, bomber jackets, varsity jackets and tracksuits). Handmade filters Winter knits, Collectibles and Keychains. The separate Custom Products hub at `/design-tips` groups Clothing, Mugs, Caps, Bags, Bottles, Home gifts and Stationery, with a product-type selector for clothing. Normal collection cards keep their shopping flow; customization starts in Custom Products. All public headers, including the studio and policies, show the four sections.

The Vite site has separate Brand (index.html), IIT Mandi Campus (campus.html), Handmade (handmade.html), Custom Studio (design.html), Policies and staff Admin pages. Brand and the studio use the original black identity; Campus and Handmade retain the supplied gold identity. Navigation and checkout remain consistent.

## Development

- npm run dev starts the local site and creates optimized images.
- npm run build optimizes images and builds all six HTML entries. Node 24 is required.
- npm run test:e2e runs Chrome browser checks against the production preview on port 4173.
- node --test tests/campus-pricing.test.mjs checks trusted prices, artwork validation and combo arithmetic.
- On Windows PowerShell, use npm.cmd if npm scripts are restricted.

## Campus catalog

The 16 campus styles are grouped by product type, with available colours first in each group. All show a rounded 20% discount against whole-rupee list prices; checkout uses the unchanged selling prices. The separate Acid-wash Black Hoodie (`mandi-acid-black-hoodie`) is in stock at ₹1,600 and has front, back and detail photos.

The Navy Bomber Jacket and Coffee Brown Sweatshirt are ₹1,500 each in both Campus and Brand, confirmed in stock in S–XXXL. Both use 350 GSM cotton fleece. Campus offers Cream Mountain and Green Ridge with the institute chest emblem; Brand uses the fine ivory mountain outline and a plain back. Each type has its own collection filter and is also available in Custom Products. `BOMBER_SWEATSHIRT_IMAGE_PROMPTS.json` records all six generated product images and source references.

The collection uses the approved institute chest emblem and campus back prints; each product lists its available artwork options. Sizes S–XXXL and optional ₹51 printing are available; tracksuit printing applies to the jacket. campus-catalog.js is shared by the UI and order API. Combo savings apply to complete pairs at the server as well as in the bag. Each ordered item stores the artwork, size and print instructions.

Campus checkout posts to /api/orders. Configure the Supabase server variables and staff token in .env.example on the deployment. A development/preview Vite plugin runs the designer and order handlers locally. Browser tests intercept order writes and do not create real orders; live deployment credentials and database persistence are not verified.

## Custom clothing studio

`/design-tips` is the custom-products hub: 4 studio basics, all 21 Brand garments, 16 Campus garments and 6 quote-only gifts (ceramic mug, baseball cap, cotton tote, steel bottle, cushion and notebook). Filter/search the range or open a clothing card's Customize link. `/design?product=<id>` preselects the actual garment, preserves its existing artwork and uses its trusted selling price, sizes and stock. Catalog garments expose front/back additions; the four blank basics retain colour selection and sleeve editing.

Gift designs support artwork/text placement, resizing, rotation, available sides, local draft recovery and preview/design-brief downloads. “Prepare quote email” opens a draft addressed to care@capracool.com; customers attach their downloaded files and original artwork themselves. No email is sent automatically. Gifts have no checkout price until the owner sets one; the server rejects quote-only and out-of-stock custom items. Print is available on all products; embroidery is limited to textiles. Canva opens separately and its exported artwork is uploaded through the normal image uploader. `tests/custom-products.test.mjs` and `tests/e2e/custom-products.spec.js` cover product rules and quote flow. `CUSTOM_GIFT_IMAGE_PROMPTS.json` records the six built-in imagegen mockups.

The React / Fabric.js studio at `/design` supports four fits, five colours, XS–XXL, upload/text layers, front/back/sleeve placement, transforms, undo/redo and local draft recovery. It uses the existing Brand bag and checkout. Prices are ₹600 per tee or ₹1,200 per hoodie plus ₹100 per decorated area for print or embroidery.

Apply `supabase/custom_designer.sql` and configure the server-only Supabase service credential before enabling private cloud saving. `CUSTOM_DESIGNER_SETUP.md` gives the steps. Saving fails closed when storage is unavailable; drafts stay on the device. `tests/designer-security.test.mjs` verifies content validation, guest ownership and the full save/order contract against a test transport; `tests/e2e/designer.spec.js` checks the real editor and cart in Chrome. Original artwork, design geometry and previews remain attached to custom order items and are available privately in the staff order desk.

## Homepage collection highlights

The Brand homepage has six rotating collection highlights: Summer, Winter, College, Gym, Corporate and Conference. Summer filters tees/polos; Winter filters hoodies, zip hoodies and varsity jackets. College opens the separate Campus store. The three other merchandise campaigns preselect the group enquiry form, which builds a reviewed email draft and does not submit automatically. Controls support arrows, keyboard navigation, touch swipes, pause, focus/hover pauses and reduced motion. Campaign images are labelled design previews, with no implied customer endorsements. `home-highlights.js` contains campaign copy and destinations; `CAMPAIGN_IMAGE_PROMPTS.json` records the six built-in imagegen briefs and source paths.

## Campus stock

The black/white Contrast Polo (`mandi-contrast-polo`), cream Ridge Hoodie (`mandi-cream-hoodie`), black/white and brown/cream varsity jackets (`mandi-varsity-black`, `mandi-varsity-brown`) and grey polo (`mandi-grey-polo`) are marked `inStock: false` in `campus-catalog.js` for all sizes. Set a product's flag to `true` and publish to restore purchasing. Sold-out products remain visible; saved bags require removing unavailable items, and the order API rejects them before writing an order. This is a catalog setting; the admin order desk does not yet provide a stock toggle.

## Images

Active campus mockups are in assets/campus-approved, selected tracksuit photographs in assets/tracksuit, Brand hill mockups in assets/brand-collection, and blank studio garment bases in assets/designer. The supplied gold logo is in assets/identity/capra-gold-original.png. The CSS logo frame preserves original pixels while hiding transparent padding. The source image folder on the Desktop is preserved. IMAGE_ASSET_GUIDE.md documents the organised export and the prompt files record the built-in imagegen briefs, including DESIGNER_IMAGE_PROMPTS.json.

CAMPUS_PLAN.md records the current product decisions and verification. store-header.css styles the shared store navigation; campus.css and storefront.css style the campus and brand shopping pages.
