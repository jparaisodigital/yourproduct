create or replace function public.submit_order(
  cart_items jsonb,
  delivery_details jsonb,
  payment_method text,
  payment_proof_path text
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $function$
declare
  customer_id uuid := auth.uid();
  customer_record public.profiles%rowtype;
  quote jsonb;
  line jsonb;
  new_order_id uuid;
  required_field text;
  fulfillment_type text;
  order_delivery_fee numeric := null;
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

  if jsonb_typeof(delivery_details) is distinct from 'object' then
    raise exception 'Invalid delivery details.';
  end if;

  fulfillment_type := delivery_details ->> 'fulfillmentType';

  if fulfillment_type not in ('dropship', 'pickup') then
    raise exception 'Invalid delivery details.';
  end if;

  if fulfillment_type = 'dropship' then
    foreach required_field in array array[
      'region',
      'recipientFirstName',
      'recipientLastName',
      'recipientMobile',
      'province',
      'city',
      'barangay',
      'houseStreet'
    ] loop
      if jsonb_typeof(delivery_details -> required_field) is distinct from 'string'
         or length(trim(delivery_details ->> required_field)) not between 1 and 200
      then
        raise exception 'Missing or invalid delivery field: %.', required_field;
      end if;
    end loop;
  end if;

  if fulfillment_type = 'pickup' then
    order_delivery_fee := 0;
  elsif fulfillment_type = 'dropship'
     and delivery_details ->> 'region' = 'ncr'
     and delivery_details ->> 'deliveryMethod' = 'spx' then
    order_delivery_fee := 120;
  elsif fulfillment_type = 'dropship'
     and delivery_details ->> 'region' = 'ncr'
     and delivery_details ->> 'deliveryMethod' = 'same-day' then
    order_delivery_fee := 150;
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
      'mobileNumber', customer_record.mobile_number,
      'emailAddress', customer_record.email
    ),
    delivery_details,
    payment_method,
    payment_proof_path,
    (quote ->> 'subtotal')::numeric,
    order_delivery_fee
  )
  returning id into new_order_id;

  for line in
    select value from jsonb_array_elements(quote -> 'items')
  loop
    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      product_image_url
    )
    values (
      new_order_id,
      line ->> 'productId',
      line ->> 'name',
      (line ->> 'quantity')::integer,
      (line ->> 'unitPrice')::numeric,
      line ->> 'image'
    );
  end loop;

  return new_order_id;
end;
$function$;
