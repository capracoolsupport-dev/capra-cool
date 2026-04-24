-- Production hardening for the storefront and admin.
-- Replace the UUID inside public.is_admin_user() before running this file.
-- Run this after the base schema, and use it instead of supabase/admin_dev_access.sql.

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select coalesce(auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid, false);
$$;

alter table if exists public.store_settings enable row level security;
alter table if exists public.announcements enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.trust_badges enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.product_media enable row level security;
alter table if exists public.reviews enable row level security;
alter table if exists public.newsletter_signups enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.custom_order_requests enable row level security;
alter table if exists public.customer_orders enable row level security;

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

insert into storage.buckets (id, name, public)
values ('request-media', 'request-media', false)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

drop policy if exists "Dev admin full access store settings" on public.store_settings;
drop policy if exists "Public read store settings" on public.store_settings;
drop policy if exists public_read_store_settings on public.store_settings;
drop policy if exists admin_manage_store_settings on public.store_settings;

create policy public_read_store_settings
on public.store_settings
for select
to anon, authenticated
using (true);

create policy admin_manage_store_settings
on public.store_settings
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access announcements" on public.announcements;
drop policy if exists "Public read announcements" on public.announcements;
drop policy if exists public_read_announcements on public.announcements;
drop policy if exists admin_manage_announcements on public.announcements;

create policy public_read_announcements
on public.announcements
for select
to anon, authenticated
using (is_active = true);

create policy admin_manage_announcements
on public.announcements
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access categories" on public.categories;
drop policy if exists "Public read categories" on public.categories;
drop policy if exists public_read_categories on public.categories;
drop policy if exists admin_manage_categories on public.categories;

create policy public_read_categories
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy admin_manage_categories
on public.categories
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access trust badges" on public.trust_badges;
drop policy if exists "Public read trust badges" on public.trust_badges;
drop policy if exists public_read_trust_badges on public.trust_badges;
drop policy if exists admin_manage_trust_badges on public.trust_badges;

create policy public_read_trust_badges
on public.trust_badges
for select
to anon, authenticated
using (is_active = true);

create policy admin_manage_trust_badges
on public.trust_badges
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access products" on public.products;
drop policy if exists "Public read products" on public.products;
drop policy if exists public_read_products on public.products;
drop policy if exists admin_manage_products on public.products;

create policy public_read_products
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy admin_manage_products
on public.products
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access product media" on public.product_media;
drop policy if exists "Public read product media" on public.product_media;
drop policy if exists public_read_product_media on public.product_media;
drop policy if exists admin_manage_product_media on public.product_media;

create policy public_read_product_media
on public.product_media
for select
to anon, authenticated
using (true);

create policy admin_manage_product_media
on public.product_media
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access reviews" on public.reviews;
drop policy if exists "Public read reviews" on public.reviews;
drop policy if exists public_read_reviews on public.reviews;
drop policy if exists admin_manage_reviews on public.reviews;

create policy public_read_reviews
on public.reviews
for select
to anon, authenticated
using (true);

create policy admin_manage_reviews
on public.reviews
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access newsletter signups" on public.newsletter_signups;
drop policy if exists "Public insert newsletter signups" on public.newsletter_signups;
drop policy if exists public_insert_newsletter_signups on public.newsletter_signups;
drop policy if exists admin_manage_newsletter_signups on public.newsletter_signups;

create policy public_insert_newsletter_signups
on public.newsletter_signups
for insert
to anon, authenticated
with check (true);

create policy admin_manage_newsletter_signups
on public.newsletter_signups
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access contact messages" on public.contact_messages;
drop policy if exists "Public insert contact messages" on public.contact_messages;
drop policy if exists public_insert_contact_messages on public.contact_messages;
drop policy if exists admin_manage_contact_messages on public.contact_messages;

create policy public_insert_contact_messages
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy admin_manage_contact_messages
on public.contact_messages
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access custom order requests" on public.custom_order_requests;
drop policy if exists "Public insert custom order requests" on public.custom_order_requests;
drop policy if exists public_insert_custom_order_requests on public.custom_order_requests;
drop policy if exists admin_manage_custom_order_requests on public.custom_order_requests;

create policy public_insert_custom_order_requests
on public.custom_order_requests
for insert
to anon, authenticated
with check (true);

create policy admin_manage_custom_order_requests
on public.custom_order_requests
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin full access customer orders" on public.customer_orders;
drop policy if exists admin_manage_customer_orders on public.customer_orders;

create policy admin_manage_customer_orders
on public.customer_orders
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Dev admin manage product bucket" on storage.objects;
drop policy if exists "Public read product bucket" on storage.objects;
drop policy if exists public_read_product_bucket on storage.objects;
drop policy if exists admin_manage_product_bucket on storage.objects;

create policy public_read_product_bucket
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-media');

create policy admin_manage_product_bucket
on storage.objects
for all
to authenticated
using (public.is_admin_user() and bucket_id = 'product-media')
with check (public.is_admin_user() and bucket_id = 'product-media');

drop policy if exists "Dev admin manage request bucket" on storage.objects;
drop policy if exists "Public upload custom references" on storage.objects;
drop policy if exists "Authenticated read request bucket" on storage.objects;
drop policy if exists public_upload_custom_references on storage.objects;
drop policy if exists admin_manage_request_bucket on storage.objects;

create policy public_upload_custom_references
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'request-media'
  and (storage.foldername(name))[1] = 'custom-orders'
);

create policy admin_manage_request_bucket
on storage.objects
for all
to authenticated
using (public.is_admin_user() and bucket_id = 'request-media')
with check (public.is_admin_user() and bucket_id = 'request-media');
