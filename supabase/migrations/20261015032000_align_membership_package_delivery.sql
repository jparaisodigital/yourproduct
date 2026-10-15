create or replace function public.customer_submit_membership_payment(
  p_application_id uuid,
  p_payment_method text,
  p_sender_name text,
  p_proof_path text,
  p_proof_file_name text,
  p_delivery_details jsonb
)
returns text
language plpgsql
security definer
set search_path to ''
as $function$
declare
  current_customer_id uuid := auth.uid();
  application_record record;
  required_field text;
  fulfillment_type text;
  delivery_region text;
  delivery_method text;
begin
  if current_customer_id is null then
    raise exception 'Sign in required.';
  end if;

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
      and p.customer_type in ('regular', 'member')
      and p.membership_status in ('none', 'active')
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

  if jsonb_typeof(p_delivery_details) is distinct from 'object' then
    raise exception 'Delivery details are required.';
  end if;

  fulfillment_type := p_delivery_details ->> 'fulfillmentType';
  delivery_region := p_delivery_details ->> 'region';
  delivery_method := p_delivery_details ->> 'deliveryMethod';

  if fulfillment_type not in ('dropship', 'pickup')
     or fulfillment_type is null then
    raise exception 'Select a valid fulfillment method.';
  end if;

  if fulfillment_type = 'dropship' then
    if delivery_region <> 'ncr' or delivery_region is null then
      raise exception 'Shipping outside Metro Manila requires confirmation before payment.';
    end if;

    if delivery_method not in ('spx', 'same-day')
       or delivery_method is null then
      raise exception 'Select a valid delivery method.';
    end if;

    foreach required_field in array array[
      'recipientFirstName',
      'recipientLastName',
      'recipientMobile',
      'province',
      'city',
      'barangay',
      'houseStreet'
    ]
    loop
      if jsonb_typeof(p_delivery_details -> required_field) is distinct from 'string'
         or length(trim(p_delivery_details ->> required_field)) not between 1 and 200 then
        raise exception 'Complete delivery details are required.';
      end if;
    end loop;

    if p_delivery_details ->> 'province' <> 'Metro Manila' then
      raise exception 'Metro Manila province is required for this delivery option.';
    end if;
  else
    if delivery_region is not null
       and nullif(btrim(delivery_region), '') is not null then
      raise exception 'Pickup must not include a delivery region.';
    end if;

    if delivery_method is not null
       and nullif(btrim(delivery_method), '') is not null then
      raise exception 'Pickup must not include a delivery method.';
    end if;
  end if;

  if length(coalesce(p_delivery_details ->> 'landmark', '')) > 200
     or length(p_delivery_details::text) > 4000 then
    raise exception 'Delivery details are invalid.';
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
      reference_number = null,
      payment_proof_path = p_proof_path,
      payment_proof_file_name = btrim(p_proof_file_name),
      delivery_details = p_delivery_details,
      updated_at = now()
  where id = application_record.id;

  return 'pending-verification';
end;
$function$;

grant execute on function public.customer_submit_membership_payment(
  uuid, text, text, text, text, jsonb
) to authenticated;
