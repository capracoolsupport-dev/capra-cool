-- CAPRA COOL storefront security hardening
-- Run this in the Supabase SQL editor after reviewing against the live schema.

-- Customer order rows contain personal information and must not be publicly readable.
drop policy if exists "Allow public read order by id" on public.customer_orders;

-- Keep anonymous insert capability for storefront checkout, but do not grant select/update/delete.
drop policy if exists "Allow public to insert orders" on public.customer_orders;
create policy "Allow public storefront order insert"
  on public.customer_orders
  for insert
  to anon, authenticated
  with check (
    length(trim(customer_name)) between 2 and 120
    and length(trim(customer_phone)) between 7 and 20
    and pincode ~ '^[0-9]{6}$'
    and jsonb_array_length(items) between 1 and 30
    and subtotal >= 0
    and shipping_fee >= 0
    and grand_total >= 0
  );

-- Newsletter: allow inserts only. No public select policy should exist.
drop policy if exists "Allow public to subscribe to newsletter" on public.newsletter_signups;
create policy "Allow public newsletter signup"
  on public.newsletter_signups
  for insert
  to anon, authenticated
  with check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$');

-- Recommended: keep order_status server/admin managed. The storefront submits 'pending'.
comment on table public.customer_orders is 'CAPRA COOL orders. Personal data: never expose public SELECT access.';
