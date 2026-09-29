-- Applied to the dev project on 2026-09-30.
-- Adds guarded admin review for order payment proofs.
-- Approval deducts stock only after admin confirms actual payment.

alter table public.orders
  add column if not exists admin_note text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists payment_approved_at timestamptz,
  add column if not exists payment_rejected_at timestamptz;

create or replace function public.admin_review_order_payment(
  p_order_id uuid,
  p_action text,
  p_admin_note text default null,
  p_payment_verified boolean default false
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_id uuid := auth.uid();
  order_record public.orders%rowtype;
  order_line record;
begin
  if admin_id is null then
    raise exception 'Sign in required.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = admin_id
      and role = 'admin'
      and account_status = 'active'
  ) then
    raise exception 'Admin access required.';
  end if;

  if p_action not in ('approve', 'reject') then
    raise exception 'Invalid review action.';
  end if;

  if p_admin_note is not null and length(trim(p_admin_note)) > 300 then
    raise exception 'Admin note is too long.';
  end if;

  if p_action = 'reject'
     and length(coalesce(trim(p_admin_note), '')) < 3 then
    raise exception 'Admin note is required when rejecting payment.';
  end if;

  if p_action = 'approve' and p_payment_verified is not true then
    raise exception 'Confirm the actual payment before approval.';
  end if;

  select *
  into order_record
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if order_record.status <> 'pending_verification' then
    raise exception 'Only pending verification orders can be reviewed.';
  end if;

  if order_record.payment_proof_path is null
     or not exists (
       select 1
       from storage.objects
       where bucket_id = 'payment-proofs'
         and name = order_record.payment_proof_path
     ) then
    raise exception 'Payment proof is unavailable.';
  end if;

  if p_action = 'reject' then
    update public.orders
    set status = 'rejected',
        admin_note = trim(p_admin_note),
        reviewed_at = now(),
        reviewed_by = admin_id,
        payment_rejected_at = now()
    where id = p_order_id;

    return 'rejected';
  end if;

  for order_line in
    select oi.product_id, oi.quantity, pr.stock_quantity, pr.is_active
    from public.order_items oi
    left join public.products pr on pr.id = oi.product_id
    where oi.order_id = p_order_id
    for update of pr
  loop
    if order_line.product_id is null
       or order_line.is_active is distinct from true
       or order_line.stock_quantity is null
       or order_line.stock_quantity < order_line.quantity then
      raise exception 'A product is unavailable or out of stock.';
    end if;
  end loop;

  update public.products pr
  set stock_quantity = pr.stock_quantity - oi.quantity,
      updated_at = now()
  from public.order_items oi
  where oi.order_id = p_order_id
    and oi.product_id = pr.id;

  update public.orders
  set status = 'processing',
      admin_note = nullif(trim(coalesce(p_admin_note, '')), ''),
      reviewed_at = now(),
      reviewed_by = admin_id,
      payment_approved_at = now()
  where id = p_order_id;

  return 'processing';
end;
$$;

revoke all on function public.admin_review_order_payment(uuid, text, text, boolean)
from public;

grant execute on function public.admin_review_order_payment(uuid, text, text, boolean)
to authenticated;