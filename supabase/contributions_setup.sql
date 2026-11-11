-- Run manually in Supabase SQL Editor after reviewing this file.
-- This creates separate pending queues. It does NOT change or write to public.martyrs.

create table if not exists public.martyr_contributions (
  id bigint generated always as identity primary key,
  name_ar text not null check (char_length(trim(name_ar)) between 2 and 180),
  name_en text,
  martyrdom_date date,
  notes text check (notes is null or char_length(notes) <= 1500),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.photo_contributions (
  id bigint generated always as identity primary key,
  martyr_id bigint not null check (martyr_id > 0),
  photo_path text not null check (photo_path like 'suggestions/%'),
  notes text check (notes is null or char_length(notes) <= 1500),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.martyr_contributions enable row level security;
alter table public.photo_contributions enable row level security;

revoke all on public.martyr_contributions from anon, authenticated;
revoke all on public.photo_contributions from anon, authenticated;
grant insert (name_ar, name_en, martyrdom_date, notes) on public.martyr_contributions to anon, authenticated;
grant insert (martyr_id, photo_path, notes) on public.photo_contributions to anon, authenticated;

drop policy if exists "Public can submit martyr suggestions" on public.martyr_contributions;
create policy "Public can submit martyr suggestions"
  on public.martyr_contributions for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Public can submit photo suggestions" on public.photo_contributions;
create policy "Public can submit photo suggestions"
  on public.photo_contributions for insert to anon, authenticated
  with check (status = 'pending');

-- Private quarantine bucket: public users may upload new files but cannot list/read them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pending-martyr-photos', 'pending-martyr-photos', false, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can upload pending martyr photos" on storage.objects;
create policy "Public can upload pending martyr photos"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'pending-martyr-photos'
    and name like 'suggestions/%'
    and lower(coalesce(metadata->>'mimetype', '')) in ('image/jpeg','image/png','image/webp')
  );

-- No public SELECT, UPDATE, DELETE, or approval policy is granted.
-- Review submissions in the Supabase dashboard. Approvals should be performed only by an admin.
