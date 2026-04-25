# Trendy Spice Store Deployment Runbook

This website is split across multiple services:

- `Vercel`: hosts the React + Vite frontend
- `Supabase`: database, storage, and Edge Functions
- `Razorpay`: payment gateway
- `Shiprocket`: delivery tracking

Vercel does **not** host the backend logic for this project. Payment and tracking server logic runs from Supabase Edge Functions.

## 1. What goes where

### Put these in Vercel environment variables

These are public client variables used by the React app:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Put these in Supabase Edge Function secrets

These must **not** go into Vercel frontend env:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
SHIPROCKET_API_EMAIL=api-user@example.com
SHIPROCKET_API_PASSWORD=your-shiprocket-api-password
SHIPROCKET_WEBHOOK_SECRET=optional-webhook-token
```

## 2. SQL files to run in Supabase

Run these in this order:

1. `supabase/rebuild_from_scratch.sql`
2. `supabase/shopify_catalog_seed.sql` for the processed real catalog from `Shopify/`
3. `supabase/seed.sql` only if you want starter/demo content instead

### Important

`supabase/admin_dev_access.sql` is **development only**.

Do **not** run `supabase/admin_dev_access.sql` in production unless you intentionally want public browser CRUD access to your admin data.

## 3. Supabase storage

`supabase/rebuild_from_scratch.sql` creates and uses these buckets:

- `product-media`
- `request-media`

Make sure your real product images are uploaded and your `product_media` rows point to either:

- `public_url`
- or `storage_path` inside `product-media`

## 4. Edge Functions to deploy

Deploy these Supabase Edge Functions:

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy lookup-order-tracking
supabase functions deploy refresh-tracking
supabase functions deploy shiprocket-webhook
```

### Set function secrets

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your-razorpay-secret
supabase secrets set SHIPROCKET_API_EMAIL=api-user@example.com
supabase secrets set SHIPROCKET_API_PASSWORD=your-shiprocket-api-password
supabase secrets set SHIPROCKET_WEBHOOK_SECRET=optional-webhook-token
```

## 5. Vercel project settings

Recommended Vercel setup:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

This repo now includes `vercel.json` for SPA rewrites so these routes work on direct refresh:

- `/checkout`
- `/track-order`
- `/products/:slug`
- `/admin`

## 6. Custom domain

After the first Vercel deploy, add your production domain:

- `trendyspicestore.com`
- optionally `www.trendyspicestore.com`

If you use email links, payment references, or support copy, keep them aligned with:

- Store name: `Trendy Spice Store`
- Support email: `trendyspicestore@gmail.com`

## 7. Razorpay checklist

You need:

- live `Key ID`
- live `Key Secret`

The current code creates orders server-side in Supabase and verifies payment signatures server-side.

Do not use Razorpay dashboard email/password in code.

## 8. Shiprocket checklist

You need:

- Shiprocket API email
- Shiprocket API password

Tracking can work in two ways:

- manual refresh from admin using `refresh-tracking`
- automatic updates through `shiprocket-webhook`

If using webhook mode, configure Shiprocket to call your deployed Supabase function URL and send the same token as `x-api-key`.

## 9. Production risks to handle before going live

### Admin security

Current `/admin` was built for development convenience.

Before public launch, you should:

- remove dev-open RLS access
- protect admin with Supabase Auth
- restrict admin writes to authenticated owner accounts only

### CORS hardening

Current Edge Function CORS is permissive.

Before public launch, you should restrict allowed origins to your real domains:

- `https://trendyspicestore.com`
- `https://www.trendyspicestore.com`
- your Vercel preview domains only if needed

### Real content

Before launch, verify:

- brand copy in `store_settings`
- real product media
- correct support email and phone
- shipping/tracking references
- real payment keys

## 10. Recommended go-live order

1. Prepare Supabase project
2. Run SQL files
3. Upload media
4. Set Supabase function secrets
5. Deploy Supabase functions
6. Set Vercel env vars
7. Deploy frontend to Vercel
8. Connect custom domain
9. Test payment in live mode
10. Test tracking and webhook
11. Lock down admin/auth before public launch

## 11. Minimum test checklist

Before launch, test all of these:

- homepage loads from real Supabase data
- search works
- product page loads
- cart works
- checkout opens Razorpay
- successful payment creates `customer_orders` row
- tracking page works with order number + email
- Shiprocket refresh works from admin
- contact form writes to Supabase
- custom order form writes to Supabase
- newsletter signup writes to Supabase
- direct refresh on `/checkout`, `/track-order`, `/admin`, and `/products/...` works on Vercel

## 12. What you do not need in Vercel

Do not add these to Vercel frontend env:

- `RAZORPAY_KEY_SECRET`
- `SHIPROCKET_API_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY`
- any admin-only secret

## 13. Local quick reference

### Local frontend

```bash
npm run dev
```

### Production build test

```bash
npm run build
npm run preview
```
