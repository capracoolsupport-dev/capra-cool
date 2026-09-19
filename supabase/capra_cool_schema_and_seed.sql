-- ==============================================================================
-- CAPRA COOL — Complete Database Schema & Seed Data for Supabase
-- Brand: CAPRA COOL | Wear Higher | IIT Mandi, Himalayas
-- Project URL: https://qhaheskahldwcvggrvbu.supabase.co
-- ==============================================================================

begin;

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Clean up existing tables if any
drop table if exists public.order_items cascade;
drop table if exists public.customer_orders cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.store_settings cascade;
drop table if exists public.newsletter_signups cascade;
drop table if exists public.contact_messages cascade;

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
create table public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  display_order int default 0,
  created_at timestamptz default timezone('utc', now())
);

alter table public.categories enable row level security;
create policy "Allow public read access on categories" 
  on public.categories for select using (true);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
create table public.products (
  id text primary key,
  name text not null,
  category text not null references public.categories(id) on delete cascade,
  price numeric(10,2) not null,
  image text not null,
  color text not null,
  fabric text not null,
  gsm text not null,
  fit text not null,
  sku text not null,
  badge text,
  rating numeric(3,2) default 4.8,
  reviews_count int default 50,
  colors jsonb default '[]'::jsonb,
  description text not null,
  care text not null,
  sizes jsonb default '["S","M","L","XL","XXL"]'::jsonb,
  size_chart jsonb default '{}'::jsonb,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default timezone('utc', now())
);

alter table public.products enable row level security;
create policy "Allow public read access on products" 
  on public.products for select using (is_active = true);

-- ------------------------------------------------------------------------------
-- 3. CUSTOMER ORDERS TABLE
-- ------------------------------------------------------------------------------
create table public.customer_orders (
  id text primary key,
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text not null,
  city text,
  state text,
  pincode text not null,
  notes text,
  payment_method text not null default 'cod',
  order_channel text not null default 'web',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null default 0,
  order_status text not null default 'confirmed',
  created_at timestamptz default timezone('utc', now())
);

alter table public.customer_orders enable row level security;

-- Allow visitors/customers to create orders
create policy "Allow public to insert orders" 
  on public.customer_orders for insert with check (true);

-- Allow public to query an order by order_number/id for confirmation
create policy "Allow public read order by id" 
  on public.customer_orders for select using (true);

-- ------------------------------------------------------------------------------
-- 4. STORE SETTINGS TABLE
-- ------------------------------------------------------------------------------
create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'CAPRA COOL',
  tagline text not null default 'WEAR HIGHER.',
  origin_location text not null default 'Kamand Campus, IIT Mandi, Himachal Pradesh, 175005',
  support_email text not null default 'support@capracool.com',
  support_phone text not null default '+91 98765 43210',
  whatsapp_number text not null default '919876543210',
  free_shipping_threshold numeric(10,2) not null default 999,
  shipping_fee numeric(10,2) not null default 99,
  announcement_text text not null default 'FREE SHIPPING ABOVE ₹999 • EASY 7-DAY RETURNS • IIT MANDI, HIMALAYAS',
  updated_at timestamptz default timezone('utc', now())
);

alter table public.store_settings enable row level security;
create policy "Allow public read access on store_settings" 
  on public.store_settings for select using (true);

-- ------------------------------------------------------------------------------
-- 5. NEWSLETTER & CONTACT
-- ------------------------------------------------------------------------------
create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default timezone('utc', now())
);

alter table public.newsletter_signups enable row level security;
create policy "Allow public to subscribe to newsletter" 
  on public.newsletter_signups for insert with check (true);

-- ------------------------------------------------------------------------------
-- SEED DATA: CATEGORIES
-- ------------------------------------------------------------------------------
insert into public.categories (id, name, slug, description, display_order) values
  ('tee', 'T-Shirts', 't-shirts', '180 GSM Heavy Combed Cotton Everyday Comfort', 1),
  ('hoodie', 'Hoodies', 'hoodies', '380 GSM Brushed Cotton Fleece Built for Higher Days', 2),
  ('track', 'Tracksuits', 'tracksuits', '340 GSM Double-Knit Technical Outerwear', 3);

-- ------------------------------------------------------------------------------
-- SEED DATA: STORE SETTINGS
-- ------------------------------------------------------------------------------
insert into public.store_settings (
  brand_name,
  tagline,
  origin_location,
  support_email,
  support_phone,
  whatsapp_number,
  free_shipping_threshold,
  shipping_fee,
  announcement_text
) values (
  'CAPRA COOL',
  'WEAR HIGHER.',
  'Kamand Campus, IIT Mandi, Himachal Pradesh, 175005',
  'support@capracool.com',
  '+91 98765 43210',
  '919876543210',
  999.00,
  99.00,
  'FREE SHIPPING ABOVE ₹999 • EASY 7-DAY RETURNS • IIT MANDI, HIMALAYAS'
);

-- ------------------------------------------------------------------------------
-- SEED DATA: 6 AUTHENTIC CAPRA COOL PRODUCTS
-- ------------------------------------------------------------------------------
insert into public.products (
  id, name, category, price, image, color, fabric, gsm, fit, sku, badge, rating, reviews_count, colors, description, care, sizes, size_chart, display_order
) values
(
  'summit-tee',
  'Summit Tee',
  'tee',
  799.00,
  'assets/product_summit_tee.jpg',
  'Ivory',
  'Premium 180 GSM Cotton',
  '180 GSM',
  'Regular Everyday Explorer Fit',
  'CC-TEE-001',
  'BESTSELLER',
  4.8,
  120,
  '["#ede7d8", "#191a17", "#444d3d", "#505459"]'::jsonb,
  'A minimal tee for everyday explorers. Crafted with premium 180 GSM combed cotton for all-day breathability and comfort. Features the signature Capra Cool Mountain Ridge print.',
  'Machine wash cold with like colors. Line dry in shade. Warm iron.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "38-40\"", "length": "27\"", "shoulder": "18.5\""},
    "M": {"chest": "40-42\"", "length": "28\"", "shoulder": "19.5\""},
    "L": {"chest": "42-44\"", "length": "29\"", "shoulder": "20.5\""},
    "XL": {"chest": "44-46\"", "length": "30\"", "shoulder": "21.5\""},
    "XXL": {"chest": "46-48\"", "length": "31\"", "shoulder": "22.5\""}
  }'::jsonb,
  1
),
(
  'alpine-hoodie',
  'Alpine Hoodie',
  'hoodie',
  1499.00,
  'assets/product_alpine_hoodie.jpg',
  'Olive Drab',
  '380 GSM Brushed Cotton Fleece',
  '380 GSM',
  'Structured Athletic Fit',
  'CC-HD-001',
  'SIGNATURE IBEX',
  4.9,
  86,
  '["#191a17", "#3f4a39", "#989386"]'::jsonb,
  'Built for higher days and chilly mountain morning roads. Premium brushed fleece with the iconic Capra Alpine Ibex emblem printed cleanly on the back.',
  'Gentle machine cycle. Hang dry in shade. Do not iron directly on emblem.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "42-44\"", "length": "27\"", "shoulder": "20\""},
    "M": {"chest": "44-46\"", "length": "28\"", "shoulder": "21\""},
    "L": {"chest": "46-48\"", "length": "29\"", "shoulder": "22\""},
    "XL": {"chest": "48-50\"", "length": "30\"", "shoulder": "23\""},
    "XXL": {"chest": "50-52\"", "length": "31\"", "shoulder": "24\""}
  }'::jsonb,
  2
),
(
  'trail-tracksuit',
  'Trail Tracksuit',
  'track',
  1999.00,
  'assets/product_trail_tracksuit.jpg',
  'Deep Olive',
  'Technical Double-Knit Poly-Cotton',
  '340 GSM',
  '2-Piece Outerwear Set',
  'CC-TRK-001',
  'COMPLETE SUIT',
  4.7,
  54,
  '["#3d4937", "#1c1c1a"]'::jsonb,
  'The complete mountain uniform. Includes our mock-neck full-zip athletic jacket and matching tapered trackpants with the signature Capra mountain goat insignia.',
  'Machine wash cold. Fasten zips before washing. Air dry.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "Chest 40\" / Waist 30\"", "length": "Top 27\" / Pants 39\"", "shoulder": "Raglan"},
    "M": {"chest": "Chest 42\" / Waist 32\"", "length": "Top 28\" / Pants 40\"", "shoulder": "Raglan"},
    "L": {"chest": "Chest 44\" / Waist 34\"", "length": "Top 29\" / Pants 41\"", "shoulder": "Raglan"},
    "XL": {"chest": "Chest 46\" / Waist 36\"", "length": "Top 30\" / Pants 42\"", "shoulder": "Raglan"},
    "XXL": {"chest": "Chest 48\" / Waist 38\"", "length": "Top 31\" / Pants 43\"", "shoulder": "Raglan"}
  }'::jsonb,
  3
),
(
  'classic-tee',
  'Capra Classic Tee',
  'tee',
  799.00,
  'assets/product_classic_tee.jpg',
  'Jet Black',
  '180 GSM Heavy Combed Cotton',
  '180 GSM',
  'Relaxed Boxy Streetwear Cut',
  'CC-TEE-002',
  'CORE ICON',
  4.6,
  78,
  '["#191a17", "#ede7d8", "#444d3d"]'::jsonb,
  'A bold essential featuring the original CAPRA COOL chest typographical wordmark. Dense long-staple cotton engineered to resist collar stretching over years of repeat wear.',
  'Machine wash cold inside-out. Do not bleach. Cool iron.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "38-40\"", "length": "27\"", "shoulder": "18.5\""},
    "M": {"chest": "40-42\"", "length": "28\"", "shoulder": "19.5\""},
    "L": {"chest": "42-44\"", "length": "29\"", "shoulder": "20.5\""},
    "XL": {"chest": "44-46\"", "length": "30\"", "shoulder": "21.5\""},
    "XXL": {"chest": "46-48\"", "length": "31\"", "shoulder": "22.5\""}
  }'::jsonb,
  4
),
(
  'horizon-hoodie',
  'Horizon Hoodie',
  'hoodie',
  1499.00,
  'assets/product_horizon_hoodie.jpg',
  'Desert Cream',
  '380 GSM Heavy Fleece',
  '380 GSM',
  'Structured Drop-Shoulder',
  'CC-HD-002',
  'MOUNTAIN ART',
  4.8,
  91,
  '["#d8d3c5", "#191a17", "#3f4a39"]'::jsonb,
  'Heavyweight brushed fleece featuring the scenic Himalayan Peaks backprint and CAPRA COOL graphic. Built for warmth on high Himalayan treks and urban transits.',
  'Cold gentle wash. Line dry in shade. Do not tumble dry.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "42-44\"", "length": "27\"", "shoulder": "20\""},
    "M": {"chest": "44-46\"", "length": "28\"", "shoulder": "21\""},
    "L": {"chest": "46-48\"", "length": "29\"", "shoulder": "22\""},
    "XL": {"chest": "48-50\"", "length": "30\"", "shoulder": "23\""},
    "XXL": {"chest": "50-52\"", "length": "31\"", "shoulder": "24\""}
  }'::jsonb,
  5
),
(
  'peak-tracksuit',
  'Peak Tracksuit',
  'track',
  1999.00,
  'assets/product_peak_tracksuit.jpg',
  'Basalt Black',
  'Technical Double-Knit Jersey',
  '340 GSM',
  'Tapered Performance Cut',
  'CC-TRK-002',
  'UTILITY',
  4.9,
  62,
  '["#181916", "#373e32"]'::jsonb,
  'Engineered for maximum mountain mobility. Technical double-knit fabric with water-resistant chest zip pockets, reflective alpine accents, and reinforced knees.',
  'Machine wash cold on delicate cycle. Air dry away from direct heat.',
  '["S", "M", "L", "XL", "XXL"]'::jsonb,
  '{
    "S": {"chest": "Chest 40\" / Waist 30\"", "length": "Top 27\" / Pants 39\"", "shoulder": "Raglan"},
    "M": {"chest": "Chest 42\" / Waist 32\"", "length": "Top 28\" / Pants 40\"", "shoulder": "Raglan"},
    "L": {"chest": "Chest 44\" / Waist 34\"", "length": "Top 29\" / Pants 41\"", "shoulder": "Raglan"},
    "XL": {"chest": "Chest 46\" / Waist 36\"", "length": "Top 30\" / Pants 42\"", "shoulder": "Raglan"},
    "XXL": {"chest": "Chest 48\" / Waist 38\"", "length": "Top 31\" / Pants 43\"", "shoulder": "Raglan"}
  }'::jsonb,
  6
);

commit;
