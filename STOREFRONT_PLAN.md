# CAPRA COOL storefront refinement

## Product review

The storefront should help a visitor see the clothing, choose a size, understand delivery and exchanges, and buy. The current visual identity is distinctive, but repeated positioning copy, tall imagery, small type, unsupported ratings, and excessive badges compete with that task. The deployed new Tee image is broken; the admin HTML is absent from the build.

## Direction

An official brand store: warm white, ink and olive; direct language; deliberate photography; restrained typography; thin dividers; useful information at the point of purchase. Keep the CAPRA COOL crest and Wear Higher identity. Do not invent reviews, stock counts, certification, or product claims. No new customer account requirement.

## Ordered tasks

1. Simplify information architecture and copy. Compact hero → shop → short origin story → campus builder → optional handmade edit → help → footer. Preserve existing section anchors. Remove repeated standards, long Tee campaign, service cards, and oversized newsletter section.
2. Establish a consistent responsive design system. Reduce heading scale, avoid decorative italics and pill overload, align widths, increase supporting type, use consistent product ratios, keep a visible mobile search.
3. Repair product presentation. Include the Tee in image optimization and resolve source URLs at build time. Remove unsupported ratings and labels. Match pictured colours; list the new Tee in pictured black only until other variants are confirmed. Show colour in the bag and checkout. Prioritize sizes and purchase action in the modal.
4. Put trust in the buying flow. Show prices, shipping cost, dispatch window, exchange link, and real support; simplify checkout language and policy text. Retain the existing checkout backend and do not create real test orders.
5. Finish secondary screens and accessibility. Style admin, include it in the Vite build, improve overlay focus and keyboard handling, and make accessories actionable through an availability enquiry.
6. Verify the production build and shopping flows at desktop/tablet/mobile sizes. Use isolated mocked API responses for order submissions. Verify generated assets, all HTML entries, no horizontal overflow, and keyboard navigation. Inspect actual screenshots.

## Acceptance criteria

- Main shopping action visible in the first mobile viewport.
- Every catalog image loads from the production build.
- Search is reachable on mobile; all product filters remain visible.
- Size selection and the pictured product colour appear accurately in bag and checkout.
- No fabricated rating or endorsement appears.
- Policies and admin are emitted by the production build.
- Modal focus stays inside the active overlay and returns to its opener.
- Existing customer purchase and campus enquiry flows remain usable.

## Delivery

Implement and verify locally first. Report changed files and validation. GitHub push and the resulting live deployment are separate from local completion.

## Completion review

- Task 1 complete: removed repeated standards, campaign gallery, service cards and newsletter; shop follows the compact hero; handmade edit is optional.
- Task 2 complete: warm neutral palette, sans-serif hierarchy, restrained controls, consistent product ratios, visible mobile search and first-screen shopping action.
- Task 3 complete: optimized Tee asset, build-resolved fallback images, accurate pictured colours, Classic Tee flat lay, size selection before secondary details, no unsupported ratings or sales labels.
- Task 4 complete: delivery/exchange links beside purchase actions, colour and totals in checkout, simpler customer-facing copy, preserved checkout integration.
- Task 5 complete: admin HTML included in build and styled; dialog focus contained and restored; accessory availability enquiries available.
- Task 6 complete: production build passes; 34 browser checks pass at desktop/tablet/mobile sizes. Two desktop/tablet mobile-menu checks are intentionally skipped. Checkout tests intercept all writes and exercise failure, retry and confirmation without creating real orders.
- Desktop and mobile screenshots visually inspected. Local preview ready; no GitHub push or production deployment performed.

Catalog limitation: only the pictured black variant is listed for the Capra Cool Tee. Confirm additional variants and real garment photography before expanding it. Existing sizes, fabrics, prices and dispatch estimates were retained; this design work does not independently certify those catalog facts.
