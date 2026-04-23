# Shiprocket Tracking Setup

This project uses Shiprocket for delivery tracking only. Payment orders stay in `customer_orders`, and Shiprocket data is synced into the same record.

## What you need

- Shiprocket API user email
- Shiprocket API user password
- Optional webhook token for automatic updates

Use the Shiprocket API user credentials, not a frontend-exposed secret.

## Database setup

Run these SQL files in Supabase SQL Editor:

1. `supabase/payments.sql`
2. `supabase/shipping.sql`
3. `supabase/admin_dev_access.sql` for development-only admin/browser access

## Edge Function secrets

Set these secrets in Supabase:

```bash
supabase secrets set SHIPROCKET_API_EMAIL=api-user@example.com
supabase secrets set SHIPROCKET_API_PASSWORD=your-shiprocket-api-password
supabase secrets set SHIPROCKET_WEBHOOK_SECRET=optional-webhook-token
```

## Deploy the functions

```bash
supabase functions deploy lookup-order-tracking
supabase functions deploy refresh-shiprocket-tracking
supabase functions deploy shiprocket-webhook
```

## Webhook

If you want automatic status updates, configure Shiprocket to send webhooks to your deployed `shiprocket-webhook` function URL and use the same `x-api-key` token value as `SHIPROCKET_WEBHOOK_SECRET`.

## Official references

- Shiprocket API user auth note: https://support.shiprocket.in/support/solutions/articles/43000337456-shiprocket-api-document-helpsheet
- Shiprocket tracking endpoints: https://www.postman.com/shiprocketdev/shiprocket-dev-s-public-workspace/documentation/840j4t0/shiprocket-api
- Shiprocket webhooks overview: https://www.postman.com/shiprocketdev/shiprocket-dev-s-public-workspace/documentation/840j4t0/shiprocket-api
