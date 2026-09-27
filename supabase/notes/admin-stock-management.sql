-- Record of stock management objects already applied to your-product-dev.
-- This is a reference file, not an automatic migration.

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  actor_user_id uuid not null references auth.users(id),
  previous_quantity integer not null check (previous_quantity >= 0),
  new_quantity integer not null check (new_quantity >= 0),
  created_at timestamptz not null default now()
);

alter table public.inventory_movements enable row level security;

revoke all on public.inventory_movements from anon, authenticated;
grant select on public.inventory_movements to authenticated;

create policy "Admins read inventory movements"
on public.inventory_movements
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
      and profiles.account_status = 'active'
  )
);

create function public.admin_set_product_stock(
  p_product_id text,
  p_new_stock integer
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old_stock integer;
begin
  if (select auth.uid()) is null
    or not exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and role = 'admin'
        and account_status = 'active'
    )
  then
    raise exception 'Not authorized.' using errcode = '42501';
  end if;

  if p_new_stock is null or p_new_stock < 0 then
    raise exception 'Invalid stock quantity.' using errcode = '22023';
  end if;

  select stock_quantity
  into v_old_stock
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Product not found.' using errcode = 'P0002';
  end if;

  if v_old_stock = p_new_stock then
    return v_old_stock;
  end if;

  update public.products
  set stock_quantity = p_new_stock
  where id = p_product_id;

  insert into public.inventory_movements (
    product_id,
    actor_user_id,
    previous_quantity,
    new_quantity
  )
  values (
    p_product_id,
    (select auth.uid()),
    v_old_stock,
    p_new_stock
  );

  return p_new_stock;
end;
$$;

revoke all
on function public.admin_set_product_stock(text, integer)
from public, anon;

grant execute
on function public.admin_set_product_stock(text, integer)
to authenticated;