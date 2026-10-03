alter table public.points_transactions
add column if not exists membership_application_id uuid
references public.membership_applications(id);

create unique index if not exists points_transactions_order_award_once
on public.points_transactions(order_id, type)
where order_id is not null and type = 'order_award';

create unique index if not exists points_transactions_membership_award_once
on public.points_transactions(membership_application_id, type)
where membership_application_id is not null and type = 'membership_award';

create or replace function private.award_order_points_if_eligible(
  p_order_id uuid,
  p_admin_id uuid
)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  order_record record;
  earned_points integer := 0;
begin
  select
    o.id,
    o.user_id,
    o.status,
    p.customer_type,
    p.membership_status,
    p.account_status
  into order_record
  from public.orders o
  join public.profiles p
    on p.id = o.user_id
  where o.id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if order_record.status not in ('processing', 'shipped', 'delivered') then
    raise exception 'Only approved orders can earn points.';
  end if;

  if order_record.customer_type <> 'member'
     or order_record.membership_status <> 'active'
     or order_record.account_status <> 'active' then
    return 0;
  end if;

  if exists (
    select 1
    from public.points_transactions pt
    where pt.order_id = p_order_id
      and pt.type = 'order_award'
  ) then
    return 0;
  end if;

  select coalesce(
    sum(
      oi.quantity *
      case
        when oi.product_id = 'tester-kit' then 10
        else 5
      end
    ),
    0
  )
  into earned_points
  from public.order_items oi
  where oi.order_id = p_order_id;

  if earned_points <= 0 then
    return 0;
  end if;

  insert into public.points_transactions (
    customer_id,
    order_id,
    points,
    type,
    status,
    description,
    created_by
  )
  values (
    order_record.user_id,
    p_order_id,
    earned_points,
    'order_award',
    'confirmed',
    'Approved member product order points',
    p_admin_id
  );

  return earned_points;
end;
$function$;

create or replace function public.admin_award_order_points(p_order_id uuid)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  current_admin_id uuid := auth.uid();
begin
  if current_admin_id is null then
    raise exception 'Authentication required.';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = current_admin_id
      and p.role = 'admin'
      and p.account_status = 'active'
  ) then
    raise exception 'Admin access required.';
  end if;

  return private.award_order_points_if_eligible(
    p_order_id,
    current_admin_id
  );
end;
$function$;

create or replace function public.admin_review_order_payment(
  p_order_id uuid,
  p_action text,
  p_admin_note text default null::text,
  p_payment_verified boolean default false
)
returns text
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_admin_id uuid := auth.uid();
  v_admin_profile public.profiles%rowtype;
  v_order public.orders%rowtype;
  v_order_item record;
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
    raise exception 'Only active admins can review order payments.';
  end if;

  if p_action not in ('approve', 'reject') then
    raise exception 'Invalid order review action.';
  end if;

  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if v_order.id is null then
    raise exception 'Order not found.';
  end if;

  if v_order.status <> 'pending_verification' then
    raise exception 'Only pending verification orders can be reviewed.';
  end if;

  if v_order.payment_proof_path is null or trim(v_order.payment_proof_path) = '' then
    raise exception 'Payment proof is required before approval.';
  end if;

  if p_action = 'reject' then
    if v_clean_note is null then
      raise exception 'A rejection note is required.';
    end if;

    update public.orders
    set
      status = 'rejected',
      admin_note = v_clean_note,
      reviewed_by = v_admin_id,
      reviewed_at = now(),
      payment_rejected_at = now()
    where id = p_order_id;

    return 'rejected';
  end if;

  if p_payment_verified is not true then
    raise exception 'Payment verification confirmation is required.';
  end if;

  for v_order_item in
    select
      oi.product_id,
      oi.quantity,
      p.stock_quantity
    from public.order_items oi
    join public.products p on p.id = oi.product_id
    where oi.order_id = p_order_id
    for update of p
  loop
    if v_order_item.stock_quantity < v_order_item.quantity then
      raise exception 'Insufficient stock for one or more products.';
    end if;

    update public.products
    set stock_quantity = stock_quantity - v_order_item.quantity
    where id = v_order_item.product_id;
  end loop;

  update public.orders
  set
    status = 'processing',
    admin_note = v_clean_note,
    reviewed_by = v_admin_id,
    reviewed_at = now(),
    payment_approved_at = now()
  where id = p_order_id;

  perform private.award_order_points_if_eligible(
    p_order_id,
    v_admin_id
  );

  return 'processing';
end;
$function$;

create or replace function private.review_membership_application_impl(
  p_application_id uuid,
  p_action text,
  p_admin_note text,
  p_payment_verified boolean
)
returns text
language plpgsql
security definer
set search_path to ''
as $function$
declare
  reviewer_id uuid := auth.uid();
  application_record record;
  customer_record record;
  expected_amount numeric;
  package_points integer;
  clean_note text := nullif(btrim(p_admin_note), '');
begin
  if reviewer_id is null or not private.is_active_admin() then
    raise exception 'Active admin access required.';
  end if;

  if p_application_id is null or p_action not in ('approve', 'reject')
     or p_action is null then
    raise exception 'Invalid review request.';
  end if;

  if char_length(coalesce(clean_note, '')) > 300 then
    raise exception 'Admin note must not exceed 300 characters.';
  end if;

  if p_action = 'reject' and clean_note is null then
    raise exception 'A rejection reason is required.';
  end if;

  if p_action = 'approve' and p_payment_verified is distinct from true then
    raise exception 'Confirm the actual payment before approval.';
  end if;

  select id, customer_id, package_id, amount, status, payment_method,
         sender_name, reference_number, payment_proof_path
    into application_record
  from public.membership_applications
  where id = p_application_id
  for update;

  if not found or application_record.status <> 'pending-verification' then
    raise exception 'Application is not pending verification.';
  end if;

  expected_amount := case application_record.package_id
    when 'starter' then 1000
    when 'builder' then 5000
    when 'leader' then 10000
    when 'prestige' then 50000
    else null
  end;

  package_points := case application_record.package_id
    when 'starter' then 20
    when 'builder' then 125
    when 'leader' then 250
    when 'prestige' then 1200
    else null
  end;

  if expected_amount is null or application_record.amount is distinct from expected_amount then
    raise exception 'Application package or amount is invalid.';
  end if;

  select id, role, account_status, customer_type, membership_status
    into customer_record
  from public.profiles
  where id = application_record.customer_id
  for update;

  if not found or customer_record.role <> 'customer'
     or customer_record.account_status <> 'active' then
    raise exception 'Customer account is not eligible for review.';
  end if;

  if p_action = 'approve' then
    if customer_record.customer_type <> 'regular'
       or customer_record.membership_status <> 'none' then
      raise exception 'Customer already has membership.';
    end if;

    if application_record.payment_method not in ('e-wallet', 'bank-transfer')
       or nullif(btrim(application_record.sender_name), '') is null
       or nullif(btrim(application_record.reference_number), '') is null
       or application_record.payment_proof_path is null
       or storage.foldername(application_record.payment_proof_path)
          <> array[application_record.customer_id::text, application_record.id::text]
       or not exists (
         select 1 from storage.objects o
         where o.bucket_id = 'payment-proofs'
           and o.name = application_record.payment_proof_path
       ) then
      raise exception 'Payment details or proof are incomplete.';
    end if;

    update public.profiles
       set customer_type = 'member',
           membership_status = 'active',
           selected_package_id = application_record.package_id
     where id = customer_record.id;

    update public.membership_applications
       set status = 'approved',
           approved_at = now(),
           membership_activated_at = now(),
           reviewed_by = reviewer_id,
           reviewed_at = now(),
           admin_note = clean_note,
           updated_at = now()
     where id = application_record.id;

    insert into public.points_transactions (
      customer_id,
      membership_application_id,
      points,
      type,
      status,
      description,
      created_by
    )
    values (
      application_record.customer_id,
      application_record.id,
      package_points,
      'membership_award',
      'confirmed',
      'Approved ' || application_record.package_id || ' membership package points',
      reviewer_id
    )
    on conflict do nothing;

    return 'approved';
  end if;

  update public.membership_applications
     set status = 'rejected',
         reviewed_by = reviewer_id,
         reviewed_at = now(),
         admin_note = clean_note,
         updated_at = now()
   where id = application_record.id;

  return 'rejected';
end;
$function$;