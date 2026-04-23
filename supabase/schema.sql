create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.store_settings (
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

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
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

create table if not exists public.trust_badges (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  detail text not null,
  icon_name text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null unique,
  name text not null,
  price_inr numeric(10, 2) not null check (price_inr >= 0),
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  review_snippet text,
  tagline text,
  description text,
  highlights jsonb not null default '[]'::jsonb,
  badge_text text,
  is_featured_home boolean not null default false,
  featured_rank integer,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_media (
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

create table if not exists public.reviews (
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

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.custom_order_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  product_type text not null,
  customization_details text not null,
  reference_storage_path text,
  created_at timestamptz not null default timezone('utc', now())
);

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

drop policy if exists "Public read store settings" on public.store_settings;
create policy "Public read store settings"
on public.store_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Public read announcements" on public.announcements;
create policy "Public read announcements"
on public.announcements
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read trust badges" on public.trust_badges;
create policy "Public read trust badges"
on public.trust_badges
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
on public.products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public read product media" on public.product_media;
create policy "Public read product media"
on public.product_media
for select
to anon, authenticated
using (true);

drop policy if exists "Public read reviews" on public.reviews;
create policy "Public read reviews"
on public.reviews
for select
to anon, authenticated
using (true);

drop policy if exists "Public insert newsletter signups" on public.newsletter_signups;
create policy "Public insert newsletter signups"
on public.newsletter_signups
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public insert contact messages" on public.contact_messages;
create policy "Public insert contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public insert custom order requests" on public.custom_order_requests;
create policy "Public insert custom order requests"
on public.custom_order_requests
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('request-media', 'request-media', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read product bucket" on storage.objects;
create policy "Public read product bucket"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-media');

drop policy if exists "Public upload custom references" on storage.objects;
create policy "Public upload custom references"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'request-media'
  and (storage.foldername(name))[1] = 'custom-orders'
);

drop policy if exists "Authenticated read request bucket" on storage.objects;
create policy "Authenticated read request bucket"
on storage.objects
for select
to authenticated
using (bucket_id = 'request-media');
