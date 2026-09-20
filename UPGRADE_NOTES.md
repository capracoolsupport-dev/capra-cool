# CAPRA COOL Premium Storefront Upgrade

This package contains the completed premium storefront overhaul for `capracoolsupport-dev/capra-cool`.

## What changed

- Premium split editorial hero that avoids stretching the existing panoramic hero image.
- Refined luxury typography, spacing, hierarchy, header, footer, navigation, search, cart, checkout, and modals.
- Six core clothing products kept as the primary shop collection.
- Handmade items moved into a separate **Campus Accessories** section.
- Product cards normalized for image ratio, spacing, price, GSM, fit, and actions.
- Product detail modal includes size guide, fabric, GSM, fit, care, delivery and exchange information.
- Rebuilt **Campus Atelier** with live front/back garment preview and instant updates for:
  - T-shirt / hoodie / tracksuit
  - garment colour
  - institute name
  - front print placement
  - back print placement
  - print colour
  - quantity
  - custom notes
- Professional custom quote / bulk-order workflow through support email, with optional WhatsApp support via environment variable.
- Safer reveal animations: content is visible by default, so an animation or IntersectionObserver failure can never leave blank sections.
- Responsive design verified at 1440px desktop, 834px tablet and 390px mobile without horizontal overflow or zero-height sections.
- Newsletter now submits to Supabase instead of only displaying a toast.
- Checkout, newsletter, and custom campus quote submissions now go through Vercel API routes instead of exposing database writes directly in browser code.
- Added an optional OpenAI-powered fit concierge at `/api/product-assistant`; it uses `OPENAI_API_KEY` only on the server.
- Added a protected admin order desk at `/admin.html`, backed by `/api/admin/orders`.
- New image optimization pipeline generates WebP and AVIF derivatives from existing source photography at build time.
- Supabase hardening migration removes public SELECT access to customer order data.
- Added richer SEO metadata, canonical URL, structured data, security headers, checkout consent, stock labels, and a server-side total recalculation for orders.

## Files to replace

- `index.html`
- `styles.css`
- `script.js`
- `policies.html`
- `package.json`
- `vite.config.js`
- `vercel.json`
- `playwright.config.js`
- `admin.html`
- `admin.js`

## Files to add

- `scripts/optimize-images.mjs`
- `api/`
- `supabase/capra_cool_api_updates.sql`
- `supabase/security_hardening.sql`
- `tests/e2e/premium-storefront.spec.js`

Your existing `assets/` and `public/assets/` folders should remain in place. The optimizer reads the source images from `assets/` and writes optimized derivatives to `public/optimized/`.

## Install / validate

Run from the repository root:

```bash
npm install
npm run build
npm run test:e2e
```

`npm install` is important because the upgrade adds `sharp` as a development dependency and regenerates `package-lock.json`.

## Supabase migrations

Before accepting real customer orders, execute:

`supabase/security_hardening.sql`

in the Supabase SQL editor. This removes anonymous/public read access to the `customer_orders` table while retaining validated public inserts.

Also execute:

`supabase/capra_cool_api_updates.sql`

This adds `campus_quote_requests` for the custom campus quote workflow.

## Environment variables

Add these in Vercel Project Settings → Environment Variables:

```text
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://qhaheskahldwcvggrvbu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_DASHBOARD_TOKEN=choose-a-long-private-token
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```

`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_DASHBOARD_TOKEN` are server-only. Do not prefix them with `VITE_`.

If WhatsApp is not configured, the site automatically uses email support instead of showing a broken WhatsApp action.

## Validation completed

A browser validation pass was performed against the rebuilt HTML/CSS/JavaScript at:

- Desktop: 1440 × 1000
- Tablet: 834 × 1112
- Mobile: 390 × 844

Validated:

- no horizontal overflow
- no hidden/blank/zero-height content sections
- production build completes with `npm run build`
- serverless API modules import successfully
- mobile menu open/close
- search results
- product detail + size selection + cart flow
- live Campus Atelier institute/product/colour/placement updates

The Vite production build was not installed/executed in the restricted container because package installation/network access is unavailable there. Run `npm install && npm run build` once in the repository or CI to regenerate the lockfile and execute the image optimizer.

## Safe rollout

1. Create a feature branch from `main`.
2. Apply this package to the branch.
3. Run `npm install`, `npm run build`, and `npm run test:e2e`.
4. Apply the Supabase hardening migration.
5. Deploy the branch as a Vercel preview.
6. Review desktop/tablet/mobile preview.
7. Merge only after approval.

The live `main` branch was intentionally not modified because the connected GitHub integration returned `403 Resource not accessible by integration` for repository write actions.
