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
