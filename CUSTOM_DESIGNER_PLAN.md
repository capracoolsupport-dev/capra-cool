# Custom clothing studio

## Scope and architecture

Add a React / Fabric.js studio as a separate Vite entry at `/design`. Preserve the existing Brand, Campus and Handmade stores. The existing Brand bag and `/api/orders` remain the checkout path.

1. Shared garment, colour, size, placement and pricing model, validated on the server.
2. Blank photographic garment bases, four fits, front/back and sleeve print zones.
3. Live multi-element editor: local upload preview, text, transforms, placement presets, layers, undo/redo and reset. IndexedDB stores local drafts and original files rather than filling localStorage.
4. Private Supabase bucket and design records, guest ownership through a signed HttpOnly cookie, strict server-side content/size/SVG validation and ownership checks.
5. Immutable saved design revisions attached to cart items. Server reloads saved revisions and calculates prices, never trusts client totals. Fulfilment details remain on orders and staff can retrieve artwork privately.
6. Responsive and keyboard-accessible UI, browser upload/transform/cart tests and security/order tests.

## Confirmed and pending business inputs

- Owner approved Campus base prices: tees ₹600, hoodies ₹1,200. Oversized fit currently uses the same family base pending any surcharge.
- Six sizes XS–XXL and Black, White, Beige, Grey and Navy Blue requested.
- Owner answered ₹100 to the decoration-rate question. Both methods use ₹100 per decorated area, with no extra colour, size, fit or layer surcharge; this interpretation was stated to the owner. Rates are shared by browser and API and can be overridden server-side with validated integer-paise configuration.
- Existing database provider is Supabase. A service-role key and the new migration are required for private artwork storage; no server credential is currently configured in the local checkout.

## Release criteria

All tools work with actual uploaded files; artwork survives view and garment switches, reload and checkout; print zones contain rotated/scaled artwork; unsupported/malicious images are rejected; other guests cannot access saved artwork; prices are computed server-side; ordinary shopping remains intact. Do not claim production readiness until the private storage migration, production credentials, confirmed prices and real service integration checks pass.

## Implemented

- Dedicated React 19 / Fabric 7 studio, responsive sidebars and photographic, colour-tinted garment bases. Fabric object origins are set explicitly; images and printable regions align correctly in both the live canvas and the two-sided exported preview.
- Upload PNG/JPEG/WEBP/safe SVG, multi-element layers, text/font/colour, pointer dragging, proportional resizing, rotation, preset placements, keyboard nudging, duplicate/delete, undo/redo and reset. Original files and drafts are kept in IndexedDB, with immediate save status.
- Private immutable Supabase design revisions, signed HttpOnly guest cookies, persisted guest/network quotas, bounded file decoding, safe SVG allowlists and ownership-checked artwork serving. Orders use an unforgeable server-only marker after reloading the design from storage; client price fields cannot become trusted custom items.
- Existing bag accepts a mix of ordinary and custom products. Reload verifies private design references, changed pricing blocks checkout for review, and failed requests preserve the draft/bag. Confirmation includes design references. Staff can download private originals and the front/back preview, and inspect exact text/font/geometry in the order desk.
- Node 24 runtime is pinned for the installed server dependencies. Vite development/preview uses the same API handlers, while the production deployment uses Vercel functions.

## Local verification completed

Production Vite build passed. The complete Chrome suite passed 131 checks with four expected mouse-hover skips on touch projects. All 22 Node checks passed, including private upload → design save → order persistence through an in-memory Supabase HTTP transport, forged-price rejection, ownership isolation, CSRF rejection and SVG validation. Browser checks include a real canvas mouse drag with a rendered-pixel assertion, all supported upload formats, four print areas, text style changes, front/back export, undo/redo, reload recovery, mixed-cart persistence, checkout confirmation and failure recovery. Final desktop/tablet/mobile screenshots were inspected. No real customer order was submitted. Production dependencies had no reported audit vulnerabilities in the installation audit; production database and bucket access remain unverified until deployment setup is complete.

## Sleeve side-angle update

Added photographic left/right side-profile pairs for all four garments and calibrated the editable sleeve regions to the outer arm. The front view projects sleeve artwork for context; selecting that projection opens its side editor. Enlarged tees' front/back surfaces to 290 px wide, hoodie fronts to 270 px and hoodie backs to 290 px, with increased heights. Sleeve surfaces are also larger, with long printable regions on hoodie sleeves. These are mockup coordinates, not claims about physical print dimensions.

Document version 2 stores the new geometry; version 1 validation remains supported for saved orders. The editor upgrades earlier drafts without changing element identities, text or prices. Reviews now include front, back and both sleeve profiles; WebP keeps the four-angle upload below the existing size limit and the server still produces a safe PNG for private serving.

The production build, 15 Studio browser checks (desktop/tablet/mobile) and geometry/upload/order server checks passed. All eight side photographs and the final rendered placements were visually reviewed. Pricing, colour choices, stock and ordinary shopping are unchanged by this update.

## Operational handoff

`CUSTOM_DESIGNER_SETUP.md` contains the exact Supabase SQL and Vercel environment setup. The owner requested guided steps; the migration and server credential have not yet been verified in production. The Vercel connector cannot access the existing project, and its team-authorization link returned “Team not found”; existing GitHub Desktop → Vercel deployment remains the release path. A push made during implementation contained the previous campus-order commit, because the studio had not yet been committed.
