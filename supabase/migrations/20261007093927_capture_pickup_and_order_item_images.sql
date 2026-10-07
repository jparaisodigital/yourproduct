alter table public.order_items
add column if not exists product_image_url text;

create or replace function public.quote_order_cart(cart_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  current_user_id uuid := auth.uid();
  customer_record record;
  approved_package_id text;
  pricing_type text := 'regular';
  cart_item jsonb;
  product_record public.products%rowtype;
  product_id text;
  quantity_text text;
  quantity_number integer;
  unit_price numeric(12, 2);
  subtotal_amount numeric(12, 2) := 0;
  quoted_items jsonb := '[]'::jsonb;
  seen_ids text[] := array[]::text[];
  product_image text;
begin
  if current_user_id is null then
    raise exception 'Sign in required.';
  end if;

  select customer_type, membership_status, account_status
  into customer_record
  from public.profiles
  where id = current_user_id
    and account_status = 'active';

  if not found then
    raise exception 'Account unavailable.';
  end if;

  if customer_record.customer_type = 'member'
     and customer_record.membership_status = 'active' then
    select ma.package_id
    into approved_package_id
    from public.membership_applications ma
    where ma.customer_id = current_user_id
      and ma.status = 'approved'
      and ma.membership_activated_at is not null
    order by ma.membership_activated_at desc nulls last,
             ma.approved_at desc nulls last,
             ma.submitted_at desc
    limit 1;

    pricing_type := coalesce(approved_package_id, 'member');
  end if;

  if cart_items is null or jsonb_typeof(cart_items) <> 'array' then
    raise exception 'Invalid cart.';
  end if;

  if jsonb_array_length(cart_items) not between 1 and 20 then
    raise exception 'Cart must contain 1 to 20 products.';
  end if;

  for cart_item in
    select value from jsonb_array_elements(cart_items)
  loop
    if jsonb_typeof(cart_item -> 'productId') is distinct from 'string'
      or jsonb_typeof(cart_item -> 'quantity') is distinct from 'number'
    then
      raise exception 'Invalid cart item.';
    end if;

    product_id := cart_item ->> 'productId';
    quantity_text := cart_item ->> 'quantity';
    product_image := nullif(trim(coalesce(cart_item ->> 'image', '')), '');

    if product_image is not null and length(product_image) > 500 then
      raise exception 'Invalid product image.';
    end if;

    if length(product_id) not between 1 and 80
      or quantity_text !~ '^([1-9]|[1-9][0-9]|100)$'
    then
      raise exception 'Invalid product or quantity.';
    end if;

    if product_id = any(seen_ids) then
      raise exception 'Duplicate product in cart.';
    end if;

    seen_ids := array_append(seen_ids, product_id);
    quantity_number := quantity_text::integer;

    select *
    into product_record
    from public.products
    where id = product_id
      and is_active = true;

    if not found or product_record.stock_quantity < quantity_number then
      raise exception 'A product is unavailable.';
    end if;

    unit_price := case
      when product_record.id = 'tester-kit' then product_record.regular_price
      when approved_package_id = 'starter' then 245
      when approved_package_id = 'builder' then 227
      when approved_package_id = 'leader' then 210
      when approved_package_id = 'prestige' then 175
      else product_record.regular_price
    end;

    if unit_price is null then
      raise exception 'A product price is unavailable.';
    end if;

    subtotal_amount := subtotal_amount + (unit_price * quantity_number);

    quoted_items := quoted_items || jsonb_build_array(
      jsonb_build_object(
        'productId', product_record.id,
        'name', product_record.name,
        'quantity', quantity_number,
        'unitPrice', unit_price,
        'image', product_image
      )
    );
  end loop;

  return jsonb_build_object(
    'pricingType', pricing_type,
    'subtotal', subtotal_amount,
    'items', quoted_items
  );
end;
$function$;

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