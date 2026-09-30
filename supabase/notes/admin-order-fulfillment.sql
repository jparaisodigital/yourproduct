-- Applied to the dev project on 2026-10-01.
-- Adds guarded admin-only fulfillment transitions for paid product orders.
-- Allowed transitions:
-- processing -> shipped
-- shipped -> delivered

create or replace function public.admin_update_order_fulfillment(
  p_order_id uuid,
  p_next_status text,
  p_admin_note text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid := auth.uid();
  v_admin_profile public.profiles%rowtype;
  v_order public.orders%rowtype;
  v_clean_note text := nullif(trim(coalesce(p_admin_note, '')), '');
begin
  if v_admin_id is null then
    raise exception 'Admin authentication is required.';
  end if;

  select *
  into v_admin_profile
  from public.profiles
  where id = v_admin_id;

  if (
    v_admin_profile.id is null or
    v_admin_profile.role <> 'admin' or
    v_admin_profile.account_status <> 'active'
  ) then
    raise exception 'Only active admins can update order fulfillment.';
  end if;

  if p_next_status not in ('shipped', 'delivered') then
    raise exception 'Invalid fulfillment status.';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception 'Order not found.';
  end if;

  if p_next_status = 'shipped' and v_order.status <> 'processing' then
    raise exception 'Only processing orders can be marked shipped.';
  end if;

  if p_next_status = 'delivered' and v_order.status <> 'shipped' then
    raise exception 'Only shipped orders can be marked delivered.';
  end if;

  update public.orders
  set
    status = p_next_status,
    admin_note = coalesce(v_clean_note, admin_note),
    reviewed_by = v_admin_id,
    reviewed_at = now()
  where id = p_order_id;

  return p_next_status;
end;
$$;

revoke all on function public.admin_update_order_fulfillment(uuid, text, text)
from public;

grant execute on function public.admin_update_order_fulfillment(uuid, text, text)
to authenticated;