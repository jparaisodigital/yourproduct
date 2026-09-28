  if not exists (
    select 1
    from private.membership_payment_control control
    where control.singleton = true and control.enabled = true
  ) then
    raise exception 'Membership payment submission is not open yet.';
  end if;

  select a.id, a.status, a.payment_proof_path, a.package_id, a.amount
    into application_record
  from public.membership_applications a
  where a.id = p_application_id
    and a.customer_id = current_customer_id
  for update;

  if not found then
    raise exception 'Application unavailable.';
  end if;

  if application_record.status = 'pending-verification'
     and application_record.payment_proof_path = p_proof_path then
    return 'pending-verification';
  end if;

  if application_record.status <> 'awaiting-payment'
     or application_record.payment_proof_path is not null then
    raise exception 'Application is not awaiting payment.';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = current_customer_id
      and p.role = 'customer'
      and p.account_status = 'active'
      and p.customer_type = 'regular'
      and p.membership_status = 'none'
  ) then
    raise exception 'Customer account is not eligible.';
  end if;

  if application_record.amount is distinct from (
    case application_record.package_id
      when 'starter' then 1000
      when 'builder' then 5000
      when 'leader' then 10000
      when 'prestige' then 50000
      else null
    end
  ) then
    raise exception 'Application amount is invalid.';
  end if;

  if p_payment_method not in ('e-wallet', 'bank-transfer')
     or p_payment_method is null then
    raise exception 'Select a valid payment method.';
  end if;

  if nullif(btrim(p_sender_name), '') is null
     or char_length(btrim(p_sender_name)) > 120 then
    raise exception 'Sender name must be 1 to 120 characters.';
  end if;

  if nullif(btrim(p_reference_number), '') is null
     or char_length(btrim(p_reference_number)) > 120 then
    raise exception 'Reference number must be 1 to 120 characters.';
  end if;

  if nullif(btrim(p_proof_file_name), '') is null
     or char_length(btrim(p_proof_file_name)) > 255 then
    raise exception 'Invalid proof file name.';
  end if;

  if p_proof_path is null
     or char_length(p_proof_path) > 500
     or storage.foldername(p_proof_path) <> array[
       current_customer_id::text, p_application_id::text
     ] then
    raise exception 'Invalid payment proof path.';
  end if;

  if not exists (
    select 1
    from storage.objects o
    where o.bucket_id = 'payment-proofs'
      and o.name = p_proof_path
      and o.metadata ->> 'mimetype' in (
        'image/jpeg', 'image/png', 'image/webp'
      )
  ) then
    raise exception 'Payment proof image not found.';
  end if;

  update public.membership_applications
  set status = 'pending-verification',
      payment_method = p_payment_method,
      sender_name = btrim(p_sender_name),
      reference_number = btrim(p_reference_number),
      payment_proof_path = p_proof_path,
      payment_proof_file_name = btrim(p_proof_file_name),
      updated_at = now()
  where id = application_record.id;

  return 'pending-verification';
end;
$function$;

revoke execute on function public.customer_submit_membership_payment(
  uuid, text, text, text, text, text
) from public, anon;
grant execute on function public.customer_submit_membership_payment(
  uuid, text, text, text, text, text
) to authenticated;
