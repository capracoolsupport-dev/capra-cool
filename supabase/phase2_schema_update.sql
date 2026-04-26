-- Phase 2 UI/UX Redesign - Schema Updates

begin;

-- B1: Add image_url to categories table
alter table public.categories add column if not exists image_url text;

-- B3: Add order_status to customer_orders table (tracking fulfillment progress)
alter table public.customer_orders 
add column if not exists order_status text not null default 'pending' 
check (order_status in ('pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled'));

-- B4: Create discounts table
create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  min_order_amount numeric(10, 2) default 0,
  max_uses integer,
  uses_count integer not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

-- B5: Add discount_price to products
alter table public.products 
add column if not exists discount_price numeric(10, 2) check (discount_price >= 0);

-- B6: Add payment_method to customer_orders
alter table public.customer_orders 
add column if not exists payment_method text not null default 'prepaid' 
check (payment_method in ('prepaid', 'cod'));

-- B2: Update rating and review_count based on existing reviews (one-time calculation)
with review_stats as (
  select product_id, count(*) as count, avg(rating) as avg_rating
  from public.reviews
  group by product_id
)
update public.products p
set 
  rating = coalesce((select avg_rating from review_stats rs where rs.product_id = p.id), 0),
  review_count = coalesce((select count from review_stats rs where rs.product_id = p.id), 0);

-- Setup RLS and policies for discounts
alter table public.discounts enable row level security;
create policy "Public read active discounts" on public.discounts for select to public using (is_active = true);
create policy "Admin full access to discounts" on public.discounts to authenticated using (public.is_admin_user());

-- Mock data for categories to match mockups
update public.categories set image_url = 'https://mrwmllxrizujnfqooeck.supabase.co/storage/v1/object/public/product-media/products/1774889981290-sunflower-bag.jpg' where slug = 'bags';

commit;
