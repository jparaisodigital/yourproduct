revoke execute on function private.award_order_points_if_eligible(uuid, uuid)
from public;

revoke execute on function private.award_order_points_if_eligible(uuid, uuid)
from anon;

revoke execute on function private.award_order_points_if_eligible(uuid, uuid)
from authenticated;

drop function if exists public.admin_update_order_fulfillment(
  uuid,
  text,
  text
);

drop function if exists public.customer_create_payout_request(
  numeric,
  text,
  text,
  text,
  text
);

create or replace function public.customer_create_payout_request(
  p_amount numeric,
  p_payment_method text,
  p_payment_provider text,
  p_account_name text,
  p_account_number text,
  p_qr_code_path text,
  p_qr_code_file_name text,
  p_note text default null::text
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $function$
declare
  current_user_id uuid := auth.uid();
  available_amount numeric(12, 2) := 0;
  new_payout_request_id uuid;
begin
  if current_user_id is null then
    raise exception 'Sign in required.';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = current_user_id
      and p.role = 'customer'
      and p.customer_type = 'member'
      and p.membership_status = 'active'
      and p.account_status = 'active'
  ) then
    raise exception 'Only active members can request payout.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Enter a valid payout amount.';
  end if;

  if p_payment_method is null
     or p_payment_method not in ('bank', 'gcash', 'maya')
  then
    raise exception 'Choose a valid payout method.';
  end if;

  if p_payment_provider is null
     or length(trim(p_payment_provider)) not between 2 and 80
  then
    raise exception 'Choose a payout provider.';
  end if;

  if p_account_name is null
     or length(trim(p_account_name)) not between 2 and 120
  then
    raise exception 'Enter a valid account name.';
  end if;

  if p_account_number is null
     or length(trim(p_account_number)) not between 5 and 80
  then
    raise exception 'Enter a valid account or mobile number.';
  end if;

  if p_qr_code_file_name is null
     or length(trim(p_qr_code_file_name)) not between 3 and 255
  then
    raise exception 'Upload a valid payout QR code.';
  end if;

  if p_note is not null
     and length(trim(p_note)) > 250
  then
    raise exception 'Payout note is too long.';
  end if;

  if p_qr_code_path is null
     or length(p_qr_code_path) > 255
     or left(p_qr_code_path, length(current_user_id::text) + 1)
        <> current_user_id::text || '/'
     or position('..' in p_qr_code_path) > 0
     or p_qr_code_path ~ '[[:cntrl:]]'
     or not exists (
       select 1
       from storage.objects
       where bucket_id = 'payout-qr-codes'
         and name = p_qr_code_path
     )
  then
    raise exception 'Upload a valid payout QR code.';
  end if;

  select coalesce(sum(commission_amount), 0)
  into available_amount
  from public.referral_commissions
  where referrer_customer_id = current_user_id
    and status = 'earned';

  available_amount := available_amount - coalesce((
    select sum(amount)
    from public.payout_requests
    where customer_id = current_user_id
      and status in ('pending', 'approved', 'paid')
  ), 0);

  if p_amount > available_amount then
    raise exception 'Payout amount exceeds available income.';
  end if;

  insert into public.payout_requests (
    customer_id,
    amount,
    payment_method,
    payment_provider,
    account_name,
    account_number,
    qr_code_path,
    qr_code_file_name,
    note,
    status
  )
  values (
    current_user_id,
    p_amount,
    p_payment_method,
    trim(p_payment_provider),
    trim(p_account_name),
    trim(p_account_number),
    p_qr_code_path,
    trim(p_qr_code_file_name),
    nullif(trim(coalesce(p_note, '')), ''),
    'pending'
  )
  returning id into new_payout_request_id;

  update public.referral_commissions
  set status = 'requested'
  where referrer_customer_id = current_user_id
    and status = 'earned';

  return new_payout_request_id;
end;
$function$;

update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
where id in ('payout-proofs', 'payout-qr-codes');