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

create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  receipt text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists customer_orders_status_idx on public.customer_orders(status);
create index if not exists customer_orders_created_at_idx on public.customer_orders(created_at desc);

drop trigger if exists set_customer_orders_updated_at on public.customer_orders;
create trigger set_customer_orders_updated_at
before update on public.customer_orders
for each row
execute function public.set_updated_at();

alter table public.customer_orders enable row level security;



alter table if exists public.customer_orders
  add column if not exists shipping_status text,
  add column if not exists shiprocket_order_id text,
  add column if not exists shiprocket_shipment_id text,
  add column if not exists shiprocket_channel_order_id text,
  add column if not exists shiprocket_awb_code text,
  add column if not exists shiprocket_courier_name text,
  add column if not exists shiprocket_tracking_url text,
  add column if not exists shiprocket_last_event text,
  add column if not exists shiprocket_last_scan_at timestamptz,
  add column if not exists shiprocket_tracking_payload jsonb,
  add column if not exists shiprocket_synced_at timestamptz,
  add column if not exists delivered_at timestamptz;

create index if not exists customer_orders_shiprocket_awb_idx on public.customer_orders(shiprocket_awb_code);
create index if not exists customer_orders_shiprocket_order_idx on public.customer_orders(shiprocket_order_id);
create index if not exists customer_orders_shiprocket_channel_order_idx on public.customer_orders(shiprocket_channel_order_id);




-- Development only.
-- This file opens broad browser-side CRUD access so the in-app admin page can
-- manage storefront content and read form submissions directly with the anon key.
-- Do not keep these policies enabled in production.

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



-- This seed resets the storefront content tables and inserts starter data.
-- Replace `public_url` values in `product_media` with your own Supabase Storage paths
-- whenever you upload real product imagery into the `product-media` bucket.

truncate table
  public.reviews,
  public.product_media,
  public.products,
  public.trust_badges,
  public.announcements,
  public.categories,
  public.store_settings
restart identity cascade;

insert into public.store_settings (
  brand_name,
  brand_subline,
  support_email,
  support_phone,
  business_location,
  support_window,
  instagram_url,
  facebook_url,
  hero_eyebrow,
  hero_title,
  hero_description,
  hero_primary_cta_label,
  hero_primary_cta_href,
  hero_secondary_cta_label,
  hero_secondary_cta_href,
  hero_stats,
  showcase_eyebrow,
  showcase_title,
  showcase_description,
  showcase_video_url,
  showcase_poster_url,
  about_title,
  about_intro,
  about_story,
  quality_promise,
  customize_title,
  customize_description,
  contact_title,
  contact_description
) values (
  'Loop & Love',
  'Crochet Studio',
  'hello@loopandlove.in',
  '+91 90000 00000',
  'Indiranagar, Bengaluru, India',
  'Monday to Saturday, 10 AM to 7 PM',
  'https://www.instagram.com/',
  'https://www.facebook.com/',
  'Premium handmade crochet',
  'Handmade crochet that feels personal, polished, and beautifully gift-ready.',
  'Built for mobile-first shopping, Loop & Love helps customers discover premium handmade crochet pieces in just a few taps without losing the warmth of the craft.',
  'Explore Collection',
  '/#featured',
  'Create Custom Order',
  '/customize',
  jsonb_build_array(
    jsonb_build_object('value', '100%', 'label', 'handmade finish'),
    jsonb_build_object('value', '2-3 taps', 'label', 'to product discovery'),
    jsonb_build_object('value', '4.9/5', 'label', 'average product love')
  ),
  'Showcase',
  'Texture, color, and craftsmanship made visible on every screen.',
  'Upload a real product reel later by setting `showcase_video_url` in Supabase. Until then, the React UI uses a visual fallback stage.',
  '',
  '',
  'Handmade crochet made to feel slow, warm, and intentionally premium.',
  'Loop & Love began with the idea that crochet should feel giftable, tactile, and easy to shop from a phone without sacrificing the story behind the product.',
  'Every collection is made in small runs so the colors stay curated, the texture stays soft, and each piece still carries the warmth of handmade work.',
  'Products are checked before dispatch, packed carefully, and supported with responsive customer service for custom orders and gifting guidance.',
  'Design a custom crochet piece that feels personal from the start.',
  'Share your colors, mood, occasion, and reference image. The request goes straight into Supabase so you can manage custom orders from one place.',
  'Need help choosing a handmade piece or placing an order?',
  'Reach out through the contact form and your messages will land directly in Supabase for follow-up and support.'
);

insert into public.categories (slug, name, short_label, accent_color, tint_color, display_order) values
  ('women', 'Women', 'WM', '#d96f71', '#fae0db', 1),
  ('men', 'Men', 'MN', '#457b9d', '#dcecf6', 2),
  ('unisex', 'Unisex', 'UX', '#58715f', '#dce8dd', 3),
  ('kids', 'Kids', 'KD', '#f2a65a', '#fde9d3', 4),
  ('gifting', 'Gifting', 'GF', '#8a5a97', '#ebdbef', 5);

insert into public.announcements (message, display_order) values
  ('Free Shipping on Selected Orders', 1),
  ('Use Code HANDMADE10 for Discount', 2),
  ('100% Handmade Crochet Products', 3),
  ('Perfect Gifts for Loved Ones', 4);

insert into public.trust_badges (title, detail, icon_name, display_order) values
  ('Secure Payment', 'Protected checkout experience with clear customer confidence.', 'shield', 1),
  ('Handmade Product', 'Designed and finished by hand for a more personal feel.', 'yarn', 2),
  ('Quality Checked', 'Every order is reviewed before packing and dispatch.', 'check', 3),
  ('Fast Support', 'Quick responses for gifting, custom orders, and care questions.', 'support', 4);

insert into public.products (
  category_id,
  slug,
  name,
  price_inr,
  rating,
  review_count,
  review_snippet,
  tagline,
  description,
  highlights,
  badge_text,
  is_featured_home,
  featured_rank,
  display_order
)
values
  ((select id from public.categories where slug = 'women'), 'scrunchies', 'Scrunchies', 349, 4.9, 128, 'Soft on hair and beautifully stitched.', 'Soft everyday crochet with a premium finish.', 'A soft, stretchy crochet scrunchie designed for effortless daily styling. The yarn is comfortable on hair and gives a handcrafted texture that feels elevated.', '["Cotton blend yarn","Gentle hold","Gift-ready wrap"]'::jsonb, 'Women', true, 1, 1),
  ((select id from public.categories where slug = 'women'), 'double-color-scrunchies', 'Double Color Scrunchies', 429, 4.8, 94, 'Color pairing looks playful and premium.', 'Two-tone texture for a fuller handcrafted look.', 'These double color scrunchies bring contrast and depth into a simple daily accessory. The layered yarn styling makes the shape look fuller and more giftable.', '["Dual colorwork","Soft elastic core","Lightweight wear"]'::jsonb, 'Women', true, 2, 2),
  ((select id from public.categories where slug = 'unisex'), 'keychains', 'Keychains', 299, 4.9, 156, 'Perfect gifting add-on with handmade charm.', 'Pocket-sized crochet details made to delight.', 'Small but memorable crochet keychains that work beautifully as personal keepsakes, bag charms, and lightweight gifts for loved ones.', '["Giftable mini format","Secure loop attachment","Easy add-on item"]'::jsonb, 'Unisex', true, 3, 3),
  ((select id from public.categories where slug = 'gifting'), 'flowers', 'Flowers', 499, 4.9, 112, 'A forever bouquet with soft crochet texture.', 'Handmade floral stems that stay lovely year-round.', 'Crochet flowers designed as keepsakes for desks, celebrations, and thoughtful gifting. They bring warmth and color without fading over time.', '["Decor-ready","Long-lasting keepsake","Perfect for gifting"]'::jsonb, 'Gifting', true, 4, 4),
  ((select id from public.categories where slug = 'kids'), 'hair-clips', 'Hair Clips', 259, 4.7, 84, 'Sweet finish for kids and gifting bundles.', 'Cute crochet accents for playful everyday styling.', 'Crochet hair clips made to feel gentle, colorful, and charming. They are especially easy to include in gift boxes for birthdays and festive moments.', '["Lightweight clip base","Kid-friendly styling","Bright gift appeal"]'::jsonb, 'Kids', false, null, 5),
  ((select id from public.categories where slug = 'women'), 'hair-bands', 'Hair Bands', 389, 4.8, 73, 'Comfortable fit with visible handmade texture.', 'Crochet headbands that feel polished and easy to wear.', 'Designed to balance comfort with a boutique finish, these crochet hair bands bring soft structure and color to daily looks without feeling heavy.', '["Comfort-first fit","Boutique styling","Soft yarn texture"]'::jsonb, 'Women', false, null, 6),
  ((select id from public.categories where slug = 'men'), 'winter-clothes', 'Winter Clothes', 1199, 4.9, 65, 'Warm, textured, and ideal for cozy gifting.', 'Handmade winter essentials with comfort at the center.', 'A cozy crochet winter collection built for softness, layered warmth, and visual depth. These pieces feel personal, seasonal, and premium for gifting.', '["Warm layered yarn","Seasonal gifting","Statement handmade texture"]'::jsonb, 'Men', false, null, 7),
  ((select id from public.categories where slug = 'gifting'), 'gifting-products', 'Gifting Products', 649, 5.0, 91, 'Curated handmade sets ready to gift.', 'Ready-made crochet gifting bundles with thoughtful details.', 'Designed for birthdays, celebrations, and thank-you moments, these gifting products combine crochet charm with presentation that feels ready to delight.', '["Curated gift bundles","Ready to present","Premium handmade appeal"]'::jsonb, 'Gifting', false, null, 8),
  ((select id from public.categories where slug = 'kids'), 'crochet-bow', 'Crochet Bow', 279, 4.8, 77, 'A cute finishing detail for styling or gifting.', 'Soft sculpted bow work with handcrafted charm.', 'A sweet crochet bow that adds warmth and personality to accessories, gifting sets, and playful styling moments. Lightweight and easy to love.', '["Soft sculpted form","Great for gifting","Playful premium styling"]'::jsonb, 'Kids', false, null, 9);

insert into public.product_media (product_id, media_kind, public_url, alt_text, sort_order, is_primary) values
  ((select id from public.products where slug = 'scrunchies'), 'image', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80', 'Scrunchies primary image', 1, true),
  ((select id from public.products where slug = 'scrunchies'), 'image', 'https://images.unsplash.com/photo-1606138612952-005d9c22e4c2?auto=format&fit=crop&w=900&q=80', 'Scrunchies alternate image', 2, false),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'image', 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=900&q=80', 'Double Color Scrunchies primary image', 1, true),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'image', 'https://images.unsplash.com/photo-1558244402-286dd748c593?auto=format&fit=crop&w=900&q=80', 'Double Color Scrunchies alternate image', 2, false),
  ((select id from public.products where slug = 'keychains'), 'image', 'https://images.unsplash.com/photo-1581452445851-90be5bcbfde8?auto=format&fit=crop&w=900&q=80', 'Keychains primary image', 1, true),
  ((select id from public.products where slug = 'keychains'), 'image', 'https://images.unsplash.com/photo-1610452335198-508b98166c30?auto=format&fit=crop&w=900&q=80', 'Keychains alternate image', 2, false),
  ((select id from public.products where slug = 'flowers'), 'image', 'https://images.unsplash.com/photo-1628313398369-0ebbb7135e80?auto=format&fit=crop&w=900&q=80', 'Flowers primary image', 1, true),
  ((select id from public.products where slug = 'flowers'), 'image', 'https://images.unsplash.com/photo-1632338165039-f9c9918fb70f?auto=format&fit=crop&w=900&q=80', 'Flowers alternate image', 2, false),
  ((select id from public.products where slug = 'hair-clips'), 'image', 'https://images.unsplash.com/photo-1560963385-48b264eef6c8?auto=format&fit=crop&w=900&q=80', 'Hair Clips primary image', 1, true),
  ((select id from public.products where slug = 'hair-clips'), 'image', 'https://images.unsplash.com/photo-1601004664883-9366df4f80c6?auto=format&fit=crop&w=900&q=80', 'Hair Clips alternate image', 2, false),
  ((select id from public.products where slug = 'hair-bands'), 'image', 'https://images.unsplash.com/photo-1601955364468-1bc0dfa5a041?auto=format&fit=crop&w=900&q=80', 'Hair Bands primary image', 1, true),
  ((select id from public.products where slug = 'hair-bands'), 'image', 'https://images.unsplash.com/photo-1523428178873-61fc00d235c5?auto=format&fit=crop&w=900&q=80', 'Hair Bands alternate image', 2, false),
  ((select id from public.products where slug = 'winter-clothes'), 'image', 'https://images.unsplash.com/photo-1605380524021-0e1ceaa96849?auto=format&fit=crop&w=900&q=80', 'Winter Clothes primary image', 1, true),
  ((select id from public.products where slug = 'winter-clothes'), 'image', 'https://images.unsplash.com/photo-1528333857321-729930f1c6de?auto=format&fit=crop&w=900&q=80', 'Winter Clothes alternate image', 2, false),
  ((select id from public.products where slug = 'gifting-products'), 'image', 'https://images.unsplash.com/photo-1584988365893-b6d352c80327?auto=format&fit=crop&w=900&q=80', 'Gifting Products primary image', 1, true),
  ((select id from public.products where slug = 'gifting-products'), 'image', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80', 'Gifting Products alternate image', 2, false),
  ((select id from public.products where slug = 'crochet-bow'), 'image', 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80', 'Crochet Bow primary image', 1, true),
  ((select id from public.products where slug = 'crochet-bow'), 'image', 'https://images.unsplash.com/photo-1616421453412-25e2e8cdd1eb?auto=format&fit=crop&w=900&q=80', 'Crochet Bow alternate image', 2, false);

insert into public.reviews (product_id, reviewer_name, rating, headline, body, is_featured_home, display_order) values
  (null, 'Aanya', 5.0, 'Beautiful finishing', 'The yarn feels soft, the colors look premium, and the packaging made it feel like a thoughtful little gift.', true, 1),
  (null, 'Rohit', 5.0, 'Easy to shop on mobile', 'I found a gift in minutes. The categories are clear and the product cards gave me enough confidence to order quickly.', true, 2),
  (null, 'Mira', 4.9, 'Custom order was smooth', 'I shared a reference image and the team replied with helpful suggestions. The final crochet piece felt truly personal.', true, 3),
  ((select id from public.products where slug = 'scrunchies'), 'Sana', 5.0, 'Soft and polished', 'Feels soft and does not tug at all.', false, 1),
  ((select id from public.products where slug = 'scrunchies'), 'Neha', 4.8, 'Boutique finish', 'Looks boutique and the blush tone is gorgeous.', false, 2),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'Krisha', 4.8, 'Lovely contrast', 'The contrast colors make it stand out immediately.', false, 1),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'Juhi', 5.0, 'Looks better in person', 'Looks even better in person than on the card.', false, 2),
  ((select id from public.products where slug = 'keychains'), 'Pooja', 5.0, 'Sweet little gift', 'Such a sweet little gift, beautifully finished.', false, 1),
  ((select id from public.products where slug = 'keychains'), 'Riya', 5.0, 'Charming detail', 'The handmade feel really comes through.', false, 2),
  ((select id from public.products where slug = 'flowers'), 'Mitali', 5.0, 'Forever bouquet', 'A beautiful alternative to fresh flowers.', false, 1),
  ((select id from public.products where slug = 'flowers'), 'Anvi', 4.8, 'Detailed petals', 'The petals feel detailed and premium.', false, 2),
  ((select id from public.products where slug = 'hair-clips'), 'Tara', 4.8, 'Playful and neat', 'My daughter loved the texture and colors.', false, 1),
  ((select id from public.products where slug = 'hair-clips'), 'Diya', 4.7, 'Very neat stitching', 'Very neat stitching for a small accessory.', false, 2),
  ((select id from public.products where slug = 'hair-bands'), 'Arohi', 4.8, 'Easy to wear', 'Easy to wear and looks very polished.', false, 1),
  ((select id from public.products where slug = 'hair-bands'), 'Megha', 4.9, 'Handcrafted texture', 'The handcrafted texture stands out beautifully.', false, 2),
  ((select id from public.products where slug = 'winter-clothes'), 'Harsh', 5.0, 'Warm right away', 'The weave looks rich and feels warm right away.', false, 1),
  ((select id from public.products where slug = 'winter-clothes'), 'Kian', 4.9, 'Beautiful texture', 'Beautiful texture and neat construction.', false, 2),
  ((select id from public.products where slug = 'gifting-products'), 'Lina', 5.0, 'Solved gifting fast', 'This solved gifting for me in one tap.', false, 1),
  ((select id from public.products where slug = 'gifting-products'), 'Vani', 5.0, 'Thoughtful bundle', 'The bundle looked thoughtful and premium.', false, 2),
  ((select id from public.products where slug = 'crochet-bow'), 'Inaaya', 4.8, 'Adorable look', 'Looks adorable and holds shape really well.', false, 1),
  ((select id from public.products where slug = 'crochet-bow'), 'Misha', 4.9, 'Lovely finishing', 'Sweet design and lovely finishing.', false, 2);



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
