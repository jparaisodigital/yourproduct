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
  application_tier integer;
  current_tier integer;
  next_selected_package_id text;
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
       payment_proof_path, delivery_details
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

  application_tier := case application_record.package_id
    when 'starter' then 1
    when 'builder' then 2
    when 'leader' then 3
    when 'prestige' then 4
    else null
  end;

  if expected_amount is null
     or package_points is null
     or application_tier is null
     or application_record.amount is distinct from expected_amount then
    raise exception 'Application package or amount is invalid.';
  end if;

  select id, role, account_status, customer_type, membership_status, selected_package_id
    into customer_record
  from public.profiles
  where id = application_record.customer_id
  for update;

  if not found or customer_record.role <> 'customer'
     or customer_record.account_status <> 'active' then
    raise exception 'Customer account is not eligible for review.';
  end if;

  if p_action = 'approve' then
    if not (
      (
        customer_record.customer_type = 'regular'
        and customer_record.membership_status = 'none'
      )
      or (
        customer_record.customer_type = 'member'
        and customer_record.membership_status = 'active'
      )
    ) then
      raise exception 'Customer account is not eligible for package approval.';
    end if;

    if application_record.payment_method not in ('e-wallet', 'bank-transfer')
   or jsonb_typeof(application_record.delivery_details) is distinct from 'object'
   or application_record.payment_proof_path is null
       or storage.foldername(application_record.payment_proof_path)
          <> array[application_record.customer_id::text, application_record.id::text]
       or not exists (
         select 1
         from storage.objects o
         where o.bucket_id = 'payment-proofs'
           and o.name = application_record.payment_proof_path
       ) then
      raise exception 'Payment, proof, or delivery details are incomplete.';
    end if;

    current_tier := case customer_record.selected_package_id
      when 'starter' then 1
      when 'builder' then 2
      when 'leader' then 3
      when 'prestige' then 4
      else 0
    end;

    next_selected_package_id :=
      case
        when application_tier > current_tier then application_record.package_id
        else customer_record.selected_package_id
      end;

    update public.profiles
       set customer_type = 'member',
           membership_status = 'active',
           selected_package_id = next_selected_package_id
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
      'Approved ' || application_record.package_id || ' package points',
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