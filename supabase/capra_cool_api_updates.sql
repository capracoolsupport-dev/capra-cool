-- CAPRA COOL API route support
-- Run this after the base schema if campus custom quote capture is needed.

begin;

create table if not exists public.campus_quote_requests (
  id text primary key,
  quote_number text not null unique,
  institute_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  garment text not null,
  garment_color text,
  front_placement text,
  back_placement text,
  print_color text,
  quantity int not null default 12,
  notes text,
  status text not null default 'new',
  created_at timestamptz default timezone('utc', now())
);

alter table public.campus_quote_requests enable row level security;

drop policy if exists "Allow public campus quote insert" on public.campus_quote_requests;
create policy "Allow public campus quote insert"
  on public.campus_quote_requests
  for insert
  to anon, authenticated
  with check (
    length(trim(institute_name)) between 2 and 120
    and length(trim(contact_name)) between 2 and 120
    and contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'
    and quantity between 12 and 5000
  );

comment on table public.campus_quote_requests is 'CAPRA COOL campus/bulk quote requests captured by the Vercel API.';

commit;
