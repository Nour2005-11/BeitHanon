-- Enable admin approval for photos submitted for an existing martyr.
-- Additive migration: does not delete or rewrite existing martyr/photo records.

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

  if p_image_path is null or p_image_path not like 'archive/%' then
    raise exception 'Invalid approved image path';
  end if;
  if p_image_url is null or length(trim(p_image_url)) = 0 then
    raise exception 'Approved image URL is required';
  end if;

  select * into contribution
  from public.photo_contributions
  where id = p_contribution_id
  for update;

  if not found then
    raise exception 'Photo contribution not found';
  end if;
  if contribution.status <> 'pending' then
    raise exception 'Photo contribution is not pending';
  end if;

  select * into target_martyr
  from public.martyrs
  where id = contribution.martyr_id
  for update;

  if not found then
    raise exception 'Target martyr not found';
  end if;
  if nullif(trim(coalesce(target_martyr.image_url, '')), '') is not null then
    raise exception 'This martyr already has an image; automatic replacement is blocked';
  end if;

  insert into public.martyr_photos (martyr_id, image_path, created_at)
  values (contribution.martyr_id, p_image_path, now());

  update public.martyrs
  set image_url = p_image_url,
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

-- Allow an authenticated site admin to remove an uploaded archive copy if the
-- database approval RPC fails after the file upload. Existing public read access is unchanged.
drop policy if exists "Admins can delete archive martyr photos" on storage.objects;
create policy "Admins can delete archive martyr photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'martyr-photos'
    and (select public.is_site_admin())
  );
