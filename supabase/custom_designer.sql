-- Additive migration. Existing orders keep their JSONB items column.
begin;
create table if not exists public.custom_studio_assets (
 id uuid primary key, owner_hash text not null check(length(owner_hash)=64),
 path text not null unique, original_path text not null unique,
 name text not null, mime text not null, width int not null, height int not null,
 bytes int not null check(bytes between 1 and 2097152),
 kind text not null check(kind in ('artwork','preview')), created_at timestamptz not null default now()
);
create index if not exists studio_assets_owner on public.custom_studio_assets(owner_hash);
create table if not exists public.custom_studio_designs (
 id uuid primary key, owner_hash text not null check(length(owner_hash)=64),
 document jsonb not null, quote jsonb not null,
 preview_id uuid not null references public.custom_studio_assets(id),
 asset_ids uuid[] not null default '{}', created_at timestamptz not null default now()
);
create index if not exists studio_designs_owner on public.custom_studio_designs(owner_hash);
create table if not exists public.custom_studio_quota (
 owner_hash text primary key, window_started timestamptz not null default now(), requests int not null default 0
);
alter table public.custom_studio_assets enable row level security;
alter table public.custom_studio_designs enable row level security;
alter table public.custom_studio_quota enable row level security;
revoke all on public.custom_studio_assets,public.custom_studio_designs,public.custom_studio_quota from anon,authenticated;
grant all on public.custom_studio_assets,public.custom_studio_designs,public.custom_studio_quota to service_role;
create or replace function public.consume_studio_quota(p_owner text) returns void
language plpgsql security definer set search_path=public as $$
declare used int;
begin
 insert into custom_studio_quota(owner_hash,requests) values(p_owner,1)
 on conflict(owner_hash) do update set
 requests=case when custom_studio_quota.window_started<now()-interval '10 minutes' then 1 else custom_studio_quota.requests+1 end,
 window_started=case when custom_studio_quota.window_started<now()-interval '10 minutes' then now() else custom_studio_quota.window_started end
 returning requests into used;
 if used>45 then raise exception 'studio quota exceeded'; end if;
end $$;
revoke all on function public.consume_studio_quota(text) from public,anon,authenticated;
grant execute on function public.consume_studio_quota(text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('custom-artwork','custom-artwork',false,12582912,array['image/png','image/jpeg','image/webp','image/svg+xml'])
 on conflict(id) do update set public=false,file_size_limit=12582912,allowed_mime_types=excluded.allowed_mime_types;
-- No public Storage policies are added. Assets are served through the ownership-checked API.
commit;
