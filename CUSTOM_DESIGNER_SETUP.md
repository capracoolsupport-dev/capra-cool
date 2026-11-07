# Enable the custom clothing studio

## Expanded product range

The studio now includes all Brand/Campus garments and six new gifts. Existing catalog garments use their actual price, colour, stock and sizes from the shared catalogs. Their front/back artwork stays visible beneath customer additions. The original four studio basics retain four views and five colours. The gift range is deliberately quote-only until retail prices are approved: no guessed prices and no checkout bypass. Customers can download the review and design brief locally even if private cloud storage is unavailable, then prepare a quote email and attach their files. Quote drafts do not submit automatically. All direct custom orders still require the private save/upload setup below.

The studio is a React / Fabric.js entry in the current Vite website at `/design`. Existing shopping pages and checkout remain in place. Node 24 is pinned in package.json, matching the tested local runtime.

## 1. Private database and artwork storage

Open the existing Supabase project (`qhaheskahldwcvggrvbu`) → SQL Editor → New query. Paste and run `supabase/custom_designer.sql`. It adds three private tables, a rate-limit function and the private `custom-artwork` bucket. It does not modify existing order rows or their JSONB items column. All new tables deny anonymous/authenticated direct access. Do not add a public bucket or public artwork policies.

Confirm that `custom_studio_assets`, `custom_studio_designs` and `custom_studio_quota` exist, and that the new bucket is private.

## 2. Server environment

In Vercel → capra-cool → Settings → Environment Variables, select Production and Preview and save:

- `SUPABASE_URL`: `https://qhaheskahldwcvggrvbu.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase server secret / legacy service_role key, stored as a secret. Never use a VITE_ prefix or commit its value.

Existing `ADMIN_DASHBOARD_TOKEN` is used for private production-artwork downloads in the order desk. Keep its current value. Optionally set a stable random `CUSTOM_DESIGN_SECRET` to sign guest cookies independently of the Supabase credential; otherwise the server key signs them. Rotating that signing secret ends existing guest sessions, but does not remove order artwork.

The current price model is ₹600 for either tee and ₹1,200 for either hoodie, plus ₹100 per decorated area for print or embroidery. Multiple elements on one area do not add a fee. There are no colour/size/fit surcharges. A validated `CUSTOM_STUDIO_RATES` JSON environment variable can override rates and version; see `.env.example`. Existing saved designs whose price changes must be reviewed again before checkout.

## 3. Deploy and verify

Push the completed studio commit to main in GitHub Desktop. Changes to environment variables take effect with the next deployment. Wait for Vercel success, then visit `/design` and `/api/designer?action=catalog`. The latter must report `storageReady: true`.

Use a small test PNG, add text to the back, choose a sleeve, change colour and fit, and review the two-sided preview. Add the design to the bag, reload and confirm the artwork and price remain. The order desk should expose original artwork, a preview, exact text, fonts and element placement data for custom order items. Do not submit a real order merely to test the page; browser checks use mocked checkout and the server contract test uses an in-memory Supabase transport.

If saving is unavailable, the studio keeps the local draft and disables adding an unsaved design to checkout. Check server-key configuration, migration execution and the bucket's private status. Do not substitute the anonymous key or make the bucket public.

## Local development

Use `npm run dev`. Vite forwards `/api/designer` and `/api/orders` to the same Node handlers used in Vercel. To exercise a real development database, provide its server variables to the Node process; never use production credentials in automated tests. `npm run build` prepares optimized images before building all entries. The editor is isolated from the ordinary storefront bundle.

## Data and fulfilment

Original artwork stays private at its source quality. Normalized safe PNGs are used for display; raw SVG is never rendered from the server. Each add-to-cart creates an immutable design revision. Orders include its design ID, original asset IDs, preview ID, garment options and exact 600 × 800 board coordinates. Actual print dimensions and thread details still need the normal pre-production confirmation. Guest access is browser/session scoped; staff access uses the existing dashboard token. Uploaded draft files are not automatically deleted; agree a retention policy before adding scheduled cleanup.
