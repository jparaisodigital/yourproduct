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

revoke all on function private.review_membership_application_impl(uuid,text,text,boolean)
  from public, anon, authenticated;
grant execute on function private.review_membership_application_impl(uuid,text,text,boolean)
  to authenticated;

-- The exposed RPC has invoker privileges; the private implementation
-- performs the admin check and the atomic updates.
create or replace function public.admin_review_membership_application(
  p_application_id uuid,
  p_action text,
  p_admin_note text default null,
  p_payment_verified boolean default false
) returns text
language sql
security invoker
set search_path = ''
as $function$
  select private.review_membership_application_impl(
    p_application_id, p_action, p_admin_note, p_payment_verified
  );
$function$;

revoke all on function public.admin_review_membership_application(uuid,text,text,boolean)
  from public, anon, authenticated;
grant execute on function public.admin_review_membership_application(uuid,text,text,boolean)
  to authenticated;

commit;