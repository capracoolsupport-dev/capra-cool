# Production Deployment To-Do List

This checklist outlines the exact manual steps required from your side to take this e-commerce project live. Walk through these item-by-item to ensure a smooth deployment.

## 1. Supabase Setup (Database & Storage)
- [ ] **Create Project**: Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard).
- [ ] **Run Core SQL Schemas**: Open the SQL Editor in Supabase and execute these scripts strictly in this order:
  1. `supabase/rebuild_from_scratch.sql`
  2. `supabase/shopify_catalog_seed.sql` (for the processed real catalog from `Shopify/`).
  3. *(Optional)* `supabase/seed.sql` only if you want the dummy/mock products instead.
- [ ] **CRITICAL**: Do **NOT** run `supabase/admin_dev_access.sql` in your production database. That script bypasses security rules for local development and will expose your private admin tables.
- [ ] **Setup Storage Buckets**: Confirm these buckets exist after running the rebuild SQL:
  - `product-media`
  - `request-media`

## 2. API Keys & Edge Functions
- [ ] **Gather Third-Party Credentials**: Have your live production keys ready:
  - **Razorpay**: Live Key ID & Live Key Secret
  - **Shiprocket**: API User Email & API Password
- [ ] **Set Backend Secrets in Supabase**: Link your terminal to your Supabase project (`supabase login` -> `supabase link --project-ref your-ref-id`) and securely store your secrets:
  ```bash
  supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
  supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_secret
  supabase secrets set SHIPROCKET_API_EMAIL=api-user@example.com
  supabase secrets set SHIPROCKET_API_PASSWORD=your_shiprocket_password
  supabase secrets set SHIPROCKET_WEBHOOK_SECRET=create_a_random_secure_password_here
  ```
- [ ] **Deploy Backend Functions**: Push your Edge Functions to Supabase's live servers:
  ```bash
  supabase functions deploy create-razorpay-order
  supabase functions deploy verify-razorpay-payment
  supabase functions deploy lookup-order-tracking
  supabase functions deploy refresh-tracking
  supabase functions deploy shiprocket-webhook
  ```

## 3. Vercel Deployment (Frontend React App)
- [ ] **Connect Vercel to Git**: Import your repository into [Vercel](https://vercel.com/new).
- [ ] **Configure Build Settings**: Vercel should auto-detect Vite, but ensure these are set:
  - **Framework Preset**: `Vite`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- [ ] **Set Frontend Environment Variables**: In your Vercel deployment setup, add your public Supabase keys (Find these in Supabase -> Project Settings -> API):
  - `VITE_SUPABASE_URL`: `https://your-project-ref.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `your-long-anon-key-string`
- [ ] **Deploy**: Click Deploy to launch the site.

## 4. Final Connections
- [ ] **Connect Shiprocket Webhooks**: 
  - Log into Shiprocket and go to Settings -> Webhooks.
  - Set the webhook URL to your Supabase `shiprocket-webhook` endpoint (e.g., `https://<YOUR_REF>.supabase.co/functions/v1/shiprocket-webhook`).
  - Add a custom header: Key = `x-api-key`, Value = `[The same password you set for SHIPROCKET_WEBHOOK_SECRET]`.
- [ ] **Map Custom Domain**: In Vercel, assign your live domain (e.g., `trendyspicestore.com`) under the project's Domain settings.
- [ ] **Live End-to-End Test**: Once live, open your URL, place a real test order using a minimal amount or a sandbox Razorpay card, and ensure you land on the "Order placed successfully" screen!
