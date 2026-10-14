drop function if exists public.restart_membership_application(text, text, numeric);

create or replace function public.restart_membership_application(
  p_package_id text,
  p_selected_package_option_id text,
  p_amount numeric
)
returns table (
  package_id text,
  selected_package_option_id text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
begin
  v_customer_id := auth.uid();

  if v_customer_id is null then
    raise exception 'Not authenticated.';
  end if;

  update public.membership_applications as ma
  set
    status = 'cancelled',
    updated_at = now()
  where ma.customer_id = v_customer_id
    and ma.status = 'cancellation-requested';

  return query
  with created as (
    insert into public.membership_applications (
      customer_id,
      package_id,
      selected_package_option_id,
      amount,
      status
    )
    values (
      v_customer_id,
      p_package_id,
      p_selected_package_option_id,
      p_amount,
      'awaiting-payment'
    )
    returning
      membership_applications.package_id,
      membership_applications.selected_package_option_id,
      membership_applications.status
  )
  select
    created.package_id::text,
    created.selected_package_option_id::text,
    created.status::text
  from created;
end;
$$;

grant execute on function public.restart_membership_application(text, text, numeric) to authenticated;
