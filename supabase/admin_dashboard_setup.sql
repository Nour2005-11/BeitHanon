-- Admin dashboard setup for Memory of Beit Hanoun.
-- Run in Supabase SQL Editor after reviewing. This is additive; it does not delete archive records.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.site_admins a
    where a.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

-- Admins can read pending queues. Public visitors retain insert-only access.
drop policy if exists "Admins can read martyr contributions" on public.martyr_contributions;
create policy "Admins can read martyr contributions"
  on public.martyr_contributions for select to authenticated
  using ((select public.is_site_admin()));
drop policy if exists "Admins can read photo contributions" on public.photo_contributions;
create policy "Admins can read photo contributions"
  on public.photo_contributions for select to authenticated
  using ((select public.is_site_admin()));

grant select on public.martyr_contributions, public.photo_contributions to authenticated;

-- The public submit form stores the image path in image_path.
alter table public.martyr_contributions add column if not exists image_path text;
grant insert (name_ar, name_en, martyrdom_date, image_path, notes)
  on public.martyr_contributions to anon, authenticated;

-- Only an authenticated admin can approve a new martyr. The function inserts the archive row
-- and updates the queue status in one transaction; duplicate names are rejected, not merged.
create or replace function public.admin_approve_martyr_contribution(
  p_contribution_id bigint,
  p_image_url text default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare c public.martyr_contributions%rowtype; new_id bigint;
begin
  if not public.is_site_admin() then raise exception 'Not authorized'; end if;
  select * into c from public.martyr_contributions where id = p_contribution_id for update;
  if not found then raise exception 'Contribution not found'; end if;
  if c.status <> 'pending' then raise exception 'Contribution is not pending'; end if;
  if exists (select 1 from public.martyrs m where lower(trim(m.name_ar)) = lower(trim(c.name_ar))
             or (c.name_en is not null and lower(trim(m.name_en)) = lower(trim(c.name_en)))) then
    raise exception 'A martyr with the same Arabic or English name already exists; review manually';
  end if;
  insert into public.martyrs (name_ar, name_en, martyrdom_date, image_url, source, date_status)
  values (c.name_ar, c.name_en, c.martyrdom_date, p_image_url,
          'مساهمة زائر — بانتظار التحقق', case when c.martyrdom_date is null then 'review' else 'review' end)
  returning id into new_id;
  update public.martyr_contributions set status = 'approved' where id = p_contribution_id;
  return new_id;
end;
$$;
revoke all on function public.admin_approve_martyr_contribution(bigint, text) from public, anon;
grant execute on function public.admin_approve_martyr_contribution(bigint, text) to authenticated;

create or replace function public.admin_reject_contribution(p_kind text, p_contribution_id bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer;
begin
  if not public.is_site_admin() then raise exception 'Not authorized'; end if;
  if p_kind = 'martyr' then
    update public.martyr_contributions set status = 'rejected'
      where id = p_contribution_id and status = 'pending';
  elsif p_kind = 'photo' then
    update public.photo_contributions set status = 'rejected'
      where id = p_contribution_id and status = 'pending';
  else raise exception 'Invalid contribution kind';
  end if;
  get diagnostics affected = row_count;
  if affected = 0 then raise exception 'Pending contribution not found'; end if;
  return true;
end;
$$;
revoke all on function public.admin_reject_contribution(text, bigint) from public, anon;
grant execute on function public.admin_reject_contribution(text, bigint) to authenticated;

-- Storage policies: only admins can read quarantine files or upload approved archive copies.
drop policy if exists "Admins can read pending martyr photos" on storage.objects;
create policy "Admins can read pending martyr photos" on storage.objects
  for select to authenticated using (bucket_id = 'pending-martyr-photos' and (select public.is_site_admin()));
drop policy if exists "Admins can upload archive martyr photos" on storage.objects;
create policy "Admins can upload archive martyr photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'martyr-photos' and (select public.is_site_admin()));
