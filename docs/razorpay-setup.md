# Razorpay Setup

This storefront uses Razorpay Standard Checkout with a server-side order creation and verification flow through Supabase Edge Functions.

## What you need

- Razorpay `Key ID`
- Razorpay `Key Secret`
- Supabase project with Edge Functions enabled

Do not use your Razorpay dashboard email or password in code. Razorpay checkout integrations use API keys instead.

## Database setup

Run these SQL files in Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/payments.sql`
3. `supabase/admin_dev_access.sql` for development-only browser admin access

## Edge Function secrets

Set these secrets in Supabase:

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your_secret_here
```

The standard Supabase function secrets `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are used by the functions for database writes.

## Deploy the functions

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

## Frontend env

The frontend only needs:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Official references

- Razorpay Orders and checkout flow: https://razorpay.com/docs/payments/orders/
- Razorpay quick integration and signature verification: https://razorpay.com/docs/payments/payment-gateway/quick-integration/integration-steps/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
