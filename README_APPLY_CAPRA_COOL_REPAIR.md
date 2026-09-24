# CAPRA COOL repair apply guide

This package targets `capracoolsupport-dev/capra-cool` at commit `3f8d88b35a27fc7705701fe555f61f8691453ca7`.

## What the patch restores

- Checkout submits only product IDs, sizes, and quantities to `/api/orders`; the server recalculates prices, shipping, totals, and pending status.
- Campus quote requests go through `/api/campus-quote` again and are stored server-side, with email fallback if the route is unavailable.
- Newsletter signup goes through `/api/newsletter` instead of direct browser Supabase writes.
- `admin.html` is included in the Vite production build again.
- Canonical URL, absolute Open Graph URL/image, and `ClothingStore` structured data are restored.
- Vercel security headers are restored.
- `.env.example` documents server-only Supabase and admin credentials.
- `supabase/security_hardening.sql` removes anonymous direct inserts for `customer_orders`.

## Apply order

1. Apply `capra-cool-main-repair.patch` to a fresh checkout of `main`.
2. Review `script.js` after applying. The important behavior is:
   - no `VITE_SUPABASE_*` browser checkout writes;
   - checkout calls `/api/orders`;
   - quotes call `/api/campus-quote`;
   - newsletter calls `/api/newsletter`.
3. Run the normal build:

   ```bash
   npm install
   npm run build
   ```

4. In Vercel, set the server environment variables:

   ```text
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_ANON_KEY
   ADMIN_DASHBOARD_TOKEN
   VITE_WHATSAPP_NUMBER
   ```

5. In Supabase, review and run `supabase/security_hardening.sql`.
6. Deploy from GitHub/Vercel.
7. Validate production:
   - place one test checkout order;
   - submit one campus quote;
   - submit one newsletter email;
   - visit `/admin` and confirm token-gated access;
   - confirm response headers include `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`;
   - confirm page source includes canonical URL and structured data.

## Current blocker

Codex was able to read the repository, but both branch creation and direct file updates were rejected by GitHub with:

```text
403 Resource not accessible by integration
```

Grant the GitHub app write access to `capracoolsupport-dev/capra-cool`, then the same change can be pushed normally.
