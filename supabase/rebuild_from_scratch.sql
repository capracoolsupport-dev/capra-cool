-- Reset the app schema and recreate the required database objects.
--
-- Suggested run order:
-- 1. Run this file.
-- 2. Run supabase/seed.sql or your own catalog seed.
-- 3. Run supabase/admin_dev_access.sql for local development, or
--    supabase/admin_production_access.sql for production.
--
-- Note:
-- This script resets database tables, functions, triggers, policies, and
-- bucket metadata used by the app. It does not delete files already stored in
-- Supabase Storage. Remove existing bucket objects from the Storage dashboard
-- if you want a full media wipe as well.

begin;

create extension if not exists pgcrypto;

-- Clean up Storage policies from earlier dev or prod runs.
drop policy if exists "Dev admin manage product bucket" on storage.objects;
drop policy if exists "Public read product bucket" on storage.objects;
drop policy if exists public_read_product_bucket on storage.objects;
drop policy if exists admin_manage_product_bucket on storage.objects;
drop policy if exists "Dev admin manage request bucket" on storage.objects;
drop policy if exists "Public upload custom references" on storage.objects;
drop policy if exists "Authenticated read request bucket" on storage.objects;
drop policy if exists public_upload_custom_references on storage.objects;
drop policy if exists admin_manage_request_bucket on storage.objects;

drop table if exists public.customer_orders cascade;
drop table if exists public.custom_order_requests cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.newsletter_signups cascade;
drop table if exists public.reviews cascade;
drop table if exists public.product_media cascade;
drop table if exists public.products cascade;
drop table if exists public.trust_badges cascade;
drop table if exists public.categories cascade;
drop table if exists public.announcements cascade;
drop table if exists public.store_settings cascade;

drop function if exists public.is_admin_user();
drop function if exists public.set_updated_at();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  brand_subline text not null,
  support_email text not null,
  support_phone text,
  business_location text not null,
  support_window text,
  instagram_url text,
  facebook_url text,
  hero_eyebrow text not null,
  hero_title text not null,
  hero_description text not null,
  hero_primary_cta_label text not null,
  hero_primary_cta_href text not null,
  hero_secondary_cta_label text not null,
  hero_secondary_cta_href text not null,
  hero_stats jsonb not null default '[]'::jsonb,
  showcase_eyebrow text not null default 'Showcase',
  showcase_title text not null,
  showcase_description text not null,
  showcase_video_url text,
  showcase_poster_url text,
  about_title text not null,
  about_intro text not null,
  about_story text not null,
  quality_promise text not null,
  customize_title text not null,
  customize_description text not null,
  contact_title text not null,
  contact_description text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_label text not null,
  accent_color text not null,
  tint_color text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.trust_badges (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  detail text not null,
  icon_name text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null unique,
  name text not null,
  price_inr numeric(10, 2) not null check (price_inr >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  review_snippet text,
  tagline text,
  description text,
  highlights jsonb not null default '[]'::jsonb,
  badge_text text,
  is_featured_home boolean not null default false,
  featured_rank integer check (featured_rank is null or featured_rank > 0),
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_kind text not null default 'image' check (media_kind in ('image', 'video')),
  bucket_name text not null default 'product-media',
  storage_path text,
  public_url text,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  reviewer_name text not null,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  headline text not null,
  body text not null,
  is_featured_home boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.custom_order_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  product_type text not null,
  customization_details text not null,
  reference_storage_path text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  receipt text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address_line_1 text not null,
  shipping_address_line_2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_postal_code text not null,
  shipping_country text not null default 'India',
  customer_notes text,
  currency text not null default 'INR',
  amount_inr numeric(10, 2) not null check (amount_inr >= 0),
  amount_subunits bigint not null check (amount_subunits >= 0),
  status text not null default 'draft' check (
    status in ('draft', 'created', 'authorized', 'paid', 'failed', 'verification_failed', 'cancelled')
  ),
  line_items jsonb not null default '[]'::jsonb,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  gateway_order_payload jsonb,
  gateway_payment_payload jsonb,
  failure_message text,
  payment_verified_at timestamptz,
  shipping_status text,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  shiprocket_channel_order_id text,
  shiprocket_awb_code text,
  shiprocket_courier_name text,
  shiprocket_tracking_url text,
  shiprocket_last_event text,
  shiprocket_last_scan_at timestamptz,
  shiprocket_tracking_payload jsonb,
  shiprocket_synced_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index categories_display_order_idx
on public.categories (display_order, is_active);

create index products_category_active_order_idx
on public.products (category_id, is_active, display_order);

create index products_featured_rank_idx
on public.products (is_featured_home, featured_rank);

create index product_media_product_order_idx
on public.product_media (product_id, sort_order, is_primary);

create index reviews_product_order_idx
on public.reviews (product_id, display_order);

create index customer_orders_status_idx
on public.customer_orders (status);

create index customer_orders_created_at_idx
on public.customer_orders (created_at desc);

create index customer_orders_shiprocket_awb_idx
on public.customer_orders (shiprocket_awb_code);

create index customer_orders_shiprocket_order_idx
on public.customer_orders (shiprocket_order_id);

create index customer_orders_shiprocket_channel_order_idx
on public.customer_orders (shiprocket_channel_order_id);

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
before update on public.store_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists set_customer_orders_updated_at on public.customer_orders;
create trigger set_customer_orders_updated_at
before update on public.customer_orders
for each row
execute function public.set_updated_at();

create or replace function public.finalize_paid_order(
  p_order_id uuid,
  p_status text,
  p_razorpay_payment_id text,
  p_razorpay_signature text,
  p_gateway_payment_payload jsonb,
  p_gateway_order_payload jsonb,
  p_payment_verified_at timestamptz
)
returns public.customer_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.customer_orders%rowtype;
  v_updated_order public.customer_orders%rowtype;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
begin
  if p_status not in ('authorized', 'paid') then
    raise exception 'Invalid final order status.';
  end if;

  select *
  into v_order
  from public.customer_orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order record not found.';
  end if;

  if v_order.status in ('authorized', 'paid') then
    update public.customer_orders
    set
      status = p_status,
      razorpay_payment_id = p_razorpay_payment_id,
      razorpay_signature = p_razorpay_signature,
      gateway_payment_payload = p_gateway_payment_payload,
      gateway_order_payload = p_gateway_order_payload,
      payment_verified_at = p_payment_verified_at,
      failure_message = null
    where id = p_order_id
    returning *
    into v_updated_order;

    return v_updated_order;
  end if;

  for v_item in
    select value
    from jsonb_array_elements(v_order.line_items)
  loop
    v_product_id := nullif(v_item ->> 'product_id', '')::uuid;
    v_quantity := coalesce((v_item ->> 'quantity')::integer, 0);

    if v_product_id is null or v_quantity <= 0 then
      raise exception 'Order line items are invalid.';
    end if;

    update public.products
    set
      stock_quantity = stock_quantity - v_quantity,
      updated_at = timezone('utc', now())
    where id = v_product_id
      and is_active = true
      and stock_quantity >= v_quantity;

    if not found then
      raise exception 'One or more items are out of stock.';
    end if;
  end loop;

  update public.customer_orders
  set
    status = p_status,
    razorpay_payment_id = p_razorpay_payment_id,
    razorpay_signature = p_razorpay_signature,
    gateway_payment_payload = p_gateway_payment_payload,
    gateway_order_payload = p_gateway_order_payload,
    payment_verified_at = p_payment_verified_at,
    failure_message = null
  where id = p_order_id
  returning *
  into v_updated_order;

  return v_updated_order;
end;
$$;

revoke all on function public.finalize_paid_order(
  uuid,
  text,
  text,
  text,
  jsonb,
  jsonb,
  timestamptz
) from public;

grant execute on function public.finalize_paid_order(
  uuid,
  text,
  text,
  text,
  jsonb,
  jsonb,
  timestamptz
) to service_role;

alter table public.store_settings enable row level security;
alter table public.announcements enable row level security;
alter table public.categories enable row level security;
alter table public.trust_badges enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.reviews enable row level security;
alter table public.newsletter_signups enable row level security;
alter table public.contact_messages enable row level security;
alter table public.custom_order_requests enable row level security;
alter table public.customer_orders enable row level security;

create policy "Public read store settings"
on public.store_settings
for select
to anon, authenticated
using (true);

create policy "Public read announcements"
on public.announcements
for select
to anon, authenticated
using (is_active = true);

create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy "Public read trust badges"
on public.trust_badges
for select
to anon, authenticated
using (is_active = true);

create policy "Public read products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy "Public read product media"
on public.product_media
for select
to anon, authenticated
using (true);

create policy "Public read reviews"
on public.reviews
for select
to anon, authenticated
using (true);

create policy "Public insert newsletter signups"
on public.newsletter_signups
for insert
to anon, authenticated
with check (true);

create policy "Public insert contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "Public insert custom order requests"
on public.custom_order_requests
for insert
to anon, authenticated
with check (true);

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

create policy "Public read product bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-media');

create policy "Public upload custom references"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'request-media'
  and (storage.foldername(name))[1] = 'custom-orders'
);

create policy "Authenticated read request bucket"
on storage.objects
for select
to authenticated
using (bucket_id = 'request-media');

commit;
