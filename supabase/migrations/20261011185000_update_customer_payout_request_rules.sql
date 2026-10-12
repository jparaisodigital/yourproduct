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
  total_commission_amount numeric(12, 2) := 0;
  reserved_payout_amount numeric(12, 2) := 0;
  available_amount numeric(12, 2) := 0;
  minimum_payout_amount numeric(12, 2) := 100;
  manila_day integer := extract(isodow from now() at time zone 'Asia/Manila');
  manila_time time := (now() at time zone 'Asia/Manila')::time;
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

  if manila_day <> 6
     or manila_time < time '10:00'
     or manila_time > time '20:00'
  then
    raise exception 'Payout requests are only accepted every Saturday from 10:00 AM to 8:00 PM.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Enter a valid payout amount.';
  end if;

  if p_amount < minimum_payout_amount then
    raise exception 'Minimum payout request is PHP 100.';
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
  into total_commission_amount
  from public.referral_commissions
  where referrer_customer_id = current_user_id
    and status in ('earned', 'requested', 'approved', 'paid');

  select coalesce(sum(amount), 0)
  into reserved_payout_amount
  from public.payout_requests
  where customer_id = current_user_id
    and status in ('pending', 'approved', 'paid');

  available_amount := total_commission_amount - reserved_payout_amount;

  if available_amount < minimum_payout_amount then
    raise exception 'Minimum payout request is PHP 100.';
  end if;

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

  return new_payout_request_id;
end;
$function$;

grant execute on function public.customer_create_payout_request(
  numeric, text, text, text, text, text, text, text
)
to authenticated;