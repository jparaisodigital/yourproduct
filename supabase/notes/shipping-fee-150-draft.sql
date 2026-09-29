-- Draft for YOUR PRODUCT dev database. Do not run until rollback QA is available.
-- Checkout remains closed; null means fee to be arranged, not free delivery.
begin;

CREATE OR REPLACE FUNCTION public.submit_order(cart_items jsonb, delivery_details jsonb, payment_method text, payment_proof_path text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  customer_id uuid := auth.uid();
  customer_record public.profiles%rowtype;
  quote jsonb;
  line jsonb;
  new_order_id uuid;
  required_field text;
begin
  if customer_id is null then
    raise exception 'Sign in required.';
  end if;

  select * into customer_record
  from public.profiles
  where id = customer_id
    and account_status = 'active';

  if not found then
    raise exception 'Account unavailable.';
  end if;

  if jsonb_typeof(delivery_details) is distinct from 'object'
     or delivery_details ->> 'fulfillmentType' is distinct from 'dropship'
  then
    raise exception 'Invalid delivery details.';
  end if;

  foreach required_field in array array[
    'region', 'recipientFirstName', 'recipientLastName',
    'recipientMobile', 'province', 'city', 'barangay', 'houseStreet'
  ] loop
    if jsonb_typeof(delivery_details -> required_field) is distinct from 'string'
       or length(trim(delivery_details ->> required_field)) not between 1 and 200
    then
      raise exception 'Missing or invalid delivery field: %.', required_field;
    end if;
  end loop;

  if delivery_details ->> 'region' not in ('ncr', 'luzon', 'visayas', 'mindanao') then
    raise exception 'Unsupported delivery region.';
  end if;

  if length(delivery_details::text) > 4000 then
    raise exception 'Delivery details are too long.';
  end if;

  if payment_method is null
     or payment_method not in ('e-wallet', 'bank-transfer')
  then
    raise exception 'Invalid payment method.';
  end if;

  if payment_proof_path is null
     or length(payment_proof_path) > 255
     or left(payment_proof_path, length(customer_id::text) + 1)
        <> customer_id::text || '/'
     or position('..' in payment_proof_path) > 0
     or payment_proof_path ~ '[[:cntrl:]]'
     or not exists (
       select 1
       from storage.objects
       where bucket_id = 'payment-proofs'
         and name = payment_proof_path
     )
  then
    raise exception 'Invalid payment proof.';
  end if;

  quote := public.quote_order_cart(cart_items);

  insert into public.orders (
    user_id,
    status,
    customer_details,
    delivery_details,
    payment_method,
    payment_proof_path,
    subtotal,
    delivery_fee
  )
  values (
    customer_id,
    'pending_verification',
    jsonb_build_object(
      'firstName', customer_record.first_name,
      'lastName', customer_record.last_name,