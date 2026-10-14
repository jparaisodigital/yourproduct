create or replace function public.quote_order_cart(cart_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  current_user_id uuid := auth.uid();
  customer_record record;
  active_package_id text;
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

  select
    customer_type,
    membership_status,
    account_status,
    selected_package_id
  into customer_record
  from public.profiles
  where id = current_user_id
    and account_status = 'active';

  if not found then
    raise exception 'Account unavailable.';
  end if;

  if customer_record.customer_type = 'member'
     and customer_record.membership_status = 'active'
     and customer_record.selected_package_id in ('starter', 'builder', 'leader', 'prestige') then
    active_package_id := customer_record.selected_package_id;
    pricing_type := active_package_id;
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
      when active_package_id = 'starter' then 245
      when active_package_id = 'builder' then 227
      when active_package_id = 'leader' then 210
      when active_package_id = 'prestige' then 175
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
