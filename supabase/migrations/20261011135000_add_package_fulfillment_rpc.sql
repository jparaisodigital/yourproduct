create or replace function public.admin_update_membership_package_fulfillment(
  p_application_id uuid,
  p_next_status text
)
returns public.membership_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
  admin_profile public.profiles%rowtype;
  target_application public.membership_applications%rowtype;
  updated_application public.membership_applications%rowtype;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select *
  into admin_profile
  from public.profiles
  where id = current_user_id;

  if admin_profile.id is null or admin_profile.role <> 'admin' then
    raise exception 'Only admins can update package fulfillment.';
  end if;

  if p_next_status not in ('ready-for-packing', 'shipped', 'completed') then
    raise exception 'Invalid package fulfillment status.';
  end if;

  select *
  into target_application
  from public.membership_applications
  where id = p_application_id
  for update;

  if target_application.id is null then
    raise exception 'Membership application not found.';
  end if;

  if target_application.status <> 'approved' then
    raise exception 'Only approved membership packages can be updated.';
  end if;

  if target_application.package_inventory_deducted is not true then
    raise exception 'Package contents must be confirmed first.';
  end if;

  if p_next_status = 'shipped'
    and target_application.fulfillment_status <> 'ready-for-packing' then
    raise exception 'Only ready packages can be marked as shipped.';
  end if;

  if p_next_status = 'completed'
    and target_application.fulfillment_status <> 'shipped' then
    raise exception 'Only shipped packages can be marked as completed.';
  end if;

  if p_next_status = 'ready-for-packing'
    and target_application.fulfillment_status <> 'shipped' then
    raise exception 'Only shipped packages can be marked as ready for packing again.';
  end if;

  update public.membership_applications
  set
    fulfillment_status = p_next_status,
    updated_at = now()
  where id = p_application_id
  returning *
  into updated_application;

  return updated_application;
end;
$$;

grant execute on function public.admin_update_membership_package_fulfillment(uuid, text)
to authenticated;
