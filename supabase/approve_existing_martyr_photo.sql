-- Allow admins to approve additional photos for a martyr who already has photos.
-- Existing martyr_photos rows and martyrs.image_url are preserved.
-- Run once in Supabase SQL Editor as the project owner.

create or replace function public.admin_approve_photo_contribution(
  p_contribution_id bigint,
  p_image_path text,
  p_image_url text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  contribution public.photo_contributions%rowtype;
  target_martyr public.martyrs%rowtype;
begin
  if not public.is_site_admin() then
    raise exception 'Not authorized';
  end if;

  if coalesce(trim(p_image_path), '') = ''
     or coalesce(trim(p_image_url), '') = '' then
    raise exception 'Approved image path and URL are required';
  end if;

  select *
    into contribution
  from public.photo_contributions
  where id = p_contribution_id
  for update;

  if not found then
    raise exception 'Photo contribution not found';
  end if;

  if contribution.status <> 'pending' then
    raise exception 'Photo contribution is not pending';
  end if;

  if p_image_path not like ('archive/' || contribution.martyr_id::text || '/%') then
    raise exception 'Approved image path does not match the martyr record';
  end if;

  select *
    into target_martyr
  from public.martyrs
  where id = contribution.martyr_id
  for update;

  if not found then
    raise exception 'Linked martyr record not found';
  end if;

  -- Every approved submission gets its own row. Do not replace existing photos.
  insert into public.martyr_photos (martyr_id, image_path, created_at)
  values (contribution.martyr_id, p_image_path, now());

  -- Keep the original cover image. Set image_url only when it is currently empty,
  -- so older parts of the site that still read martyrs.image_url keep working.
  update public.martyrs
  set image_url = case
        when coalesce(trim(image_url), '') = '' then p_image_url
        else image_url
      end,
      updated_at = now()
  where id = contribution.martyr_id;

  update public.photo_contributions
  set status = 'approved'
  where id = p_contribution_id;

  return true;
end;
$$;

revoke all on function public.admin_approve_photo_contribution(bigint, text, text)
  from public, anon;
grant execute on function public.admin_approve_photo_contribution(bigint, text, text)
  to authenticated;

-- Allow admins to remove the quarantine copy after a successful approval.
drop policy if exists "Admins can delete pending martyr photos" on storage.objects;
create policy "Admins can delete pending martyr photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'pending-martyr-photos'
    and (select public.is_site_admin())
  );

-- Allow an administrator to clean up a newly uploaded approved copy if the
-- database approval transaction fails after the Storage upload.
drop policy if exists "Admins can delete approved martyr photos" on storage.objects;
create policy "Admins can delete approved martyr photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'martyr-photos'
    and (select public.is_site_admin())
  );
