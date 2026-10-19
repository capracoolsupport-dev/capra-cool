# IIT Mandi campus store

## Scope

Build the campus storefront first, using only the supplied IIT Mandi designs. Keep CAPRA COOL brand storytelling and the existing brand catalog on index.html, with explicit links between the two pages. No other institutes, aspirant products, unrelated accessories, or generic mountain lifestyle campaign on the campus page.

## Reference review

- https://ksverse.in/: category-led campus merchandise, garment options, product cards and front/back browsing.
- https://iitianvibes.com/: clear institute context, garment categories, collection presentation and separate informational navigation.
- Apply the useful shopping patterns with original CAPRA COOL styling and supplied artwork. Do not reproduce their copy, photos, discounts, reviews or credentials.

## Ordered tasks

1. Import the eleven unique garment mockups from the user-provided App Image folder. Exclude duplicates and the unassigned measurement chart. Preserve source files; create optimized web assets.
2. Create campus.html and add it to production build. Separate campus and brand navigation; move the generic campus builder off the brand page in favour of this dedicated experience.
3. Build the IIT Mandi landing page: a garment-led hero, category navigation, complete collection with filters/search, a short bulk-order section and practical help.
4. Add front/back/overview product previews, product deep links and a persistent shopping bag with size selection, quantity, optional name/department printing and Cash on Delivery checkout.
5. Verify images, responsive layouts, navigation, filtering, search, enquiry serialization, dialog keyboard behaviour and the production build. Keep the original brand purchase flow covered.

## Catalog boundary

The user confirmed polos/tees ₹469, washed tees ₹649, hoodies ₹969, washed hoodies ₹1150, zip hoodies ₹1059, all sizes, and ₹51 name/department printing. The supplied chart spans S–XXXL; these are the size choices. Tees/polos are 230 GSM and hoodies are 400 GSM. The user revised pricing to clean launch prices above the supplied amounts: polos ₹600, washed tees ₹800, hoodies ₹1200, zip hoodies ₹1400, washed hoodies ₹1600. List prices are launch prices divided by 0.8, so the advertised launch reduction is exactly 20%. Keep the ₹51 print add-on separate. This is labelled launch/list pricing, not a claim about a previous selling price. Product images are mockups; no institute endorsement is claimed.

## Acceptance

- Campus page contains only IIT Mandi merchandise.
- Brand page is a separate destination, not a brand-story section mixed into the campus shop.
- Eleven unique designs; original file duplicates excluded.
- Mobile shows the collection action early and preserves search and category access.
- Every design can be inspected, sized, personalised and added to a bag without account creation.
- The server calculates current catalog prices; client-supplied prices are ignored. Personalisation instructions are saved with the order and visible to staff.
- Group enquiry emails include the selected details; nothing is sent automatically.
- Existing brand shopping bag stays independent.

## Completion and verification

All five implementation tasks are complete locally. The production build succeeds. Browser checks cover desktop, tablet and mobile; four pricing/server-validation tests pass. Desktop and mobile screenshots were visually reviewed. Checkout failure/retry/success and staff personalisation display are tested with isolated API responses, without submitting real orders.

Changes have not been pushed or deployed. Production Supabase configuration and actual order persistence still require verification on the deployment; Vite preview does not execute the Vercel API functions.

October 19 refinement: added a dedicated Handmade page with availability enquiries and a shared Campus / Brand / Handmade header, including mobile switches. Unified heading typography, colours and button corners. All 60 browser checks and four pricing/server checks pass. Full handmade page and all three mobile/desktop headers were visually reviewed. Review screenshots are in artifacts/review (ignored by Git).

Image refinement: two built-in imagegen collection editorials added, a monochrome mountain mark applied to Campus, and a separate monochrome ibex applied to Brand/Handmade. SVG and transparent PNG logo assets retained in assets/identity. Source catalog images are unchanged. The image library export contains 194 verified files in the user-named App Image folder; prompts and source mapping are documented in IMAGE_ASSET_GUIDE.md. All 60 browser checks pass; desktop and mobile images were reviewed.
