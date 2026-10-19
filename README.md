# Capra Cool GitHub update

Upload these files into the capracoolsupport-dev/capra-cool repository, preserving the same paths:

- index.html
- script.js
- styles.css
- ssets/capra-cool-studio-front.jpg
- ssets/capra-cool-lifestyle.jpg
- ssets/capra-cool-fabric-detail.jpg
- ssets/capra-cool-color-lineup.jpg

What this update adds:

- Adds the Capra Cool Tee as a new shop product.
- Updates the shop count from 6 pieces to 7 pieces.
- Adds a new homepage product-story section with four generated visuals.
- Adds CSS for the new product-story image grid.

After pushing to GitHub, Vercel should deploy automatically from the connected repository.

## Storefront development

The current refinement plan and product review are in `STOREFRONT_PLAN.md`. The shared visual refinement is in `storefront.css`, applied to the storefront, policies and admin pages.

- Run `npm run dev` for the local preview.
- Run `npm run build` to optimize images and build the brand, campus, policies and admin HTML entry points.
- Run `npm run test:e2e` after building. Tests run against the production preview on port 4173 using installed Chrome, including mobile and tablet emulation. On PowerShell systems that restrict npm scripts, use `npm.cmd`.
- Checkout tests intercept data writes; they do not submit real orders.
- Add new catalog images to `scripts/optimize-images.mjs` and the source URL map in `script.js` so both optimized files and fingerprinted fallbacks are available in deployment.

## IIT Mandi campus store

`campus.html` is the separate campus destination; `index.html` retains the brand store. The scope and product decisions are in `CAMPUS_PLAN.md`. Eleven supplied mockups live in `assets/campus`; the image optimizer generates WebP and AVIF versions during development and builds.

`campus-catalog.js` shares trusted prices and sizes between the browser and order API. Launch prices are rounded whole-rupee amounts above the supplied base prices; list prices are launch prices divided by 0.8, showing exactly 20% off. Personalisation adds ₹51. All calculations use integer paise. Run `node --test tests/campus-pricing.test.mjs` for pricing and server validation checks.

Campus checkout posts to `/api/orders`. Configure the server Supabase variables and staff token described in `.env.example` on the deployment. Browser checkout tests use intercepted responses; live database writes and deployment credentials have not been verified. Vite alone does not serve Vercel API functions.


Campus, Brand and Handmade share `store-header.css` and identical header markup. Handmade lives at `handmade.html`; its four existing items use availability enquiries until prices are confirmed.
