-- Development only.
-- This file opens broad browser-side CRUD access so the in-app admin page can
-- manage storefront content and read form submissions directly with the anon key.
-- Do not keep these policies enabled in production.
-- Use supabase/admin_production_access.sql when you are ready to switch to
-- authenticated admin-only writes.

drop policy if exists "Dev admin full access store settings" on public.store_settings;
create policy "Dev admin full access store settings"
on public.store_settings
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access announcements" on public.announcements;
create policy "Dev admin full access announcements"
on public.announcements
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access categories" on public.categories;
create policy "Dev admin full access categories"
on public.categories
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access trust badges" on public.trust_badges;
create policy "Dev admin full access trust badges"
on public.trust_badges
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access products" on public.products;
create policy "Dev admin full access products"
on public.products
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access product media" on public.product_media;
create policy "Dev admin full access product media"
on public.product_media
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access reviews" on public.reviews;
create policy "Dev admin full access reviews"
on public.reviews
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access newsletter signups" on public.newsletter_signups;
create policy "Dev admin full access newsletter signups"
on public.newsletter_signups
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access contact messages" on public.contact_messages;
create policy "Dev admin full access contact messages"
on public.contact_messages
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access custom order requests" on public.custom_order_requests;
create policy "Dev admin full access custom order requests"
on public.custom_order_requests
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin full access customer orders" on public.customer_orders;
create policy "Dev admin full access customer orders"
on public.customer_orders
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Dev admin manage product bucket" on storage.objects;
create policy "Dev admin manage product bucket"
on storage.objects
for all
to anon, authenticated
using (bucket_id = 'product-media')
with check (bucket_id = 'product-media');

drop policy if exists "Dev admin manage request bucket" on storage.objects;
create policy "Dev admin manage request bucket"
on storage.objects
for all
to anon, authenticated
using (bucket_id = 'request-media')
with check (bucket_id = 'request-media');
