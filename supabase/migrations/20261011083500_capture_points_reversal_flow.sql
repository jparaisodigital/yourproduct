alter table public.points_transactions
add column if not exists reversed_transaction_id uuid references public.points_transactions(id),
add column if not exists admin_note text;

create index if not exists points_transactions_reversed_transaction_id_idx
on public.points_transactions(reversed_transaction_id);

drop function if exists public.admin_reverse_points_transaction(uuid, text);

create or replace function public.admin_reverse_points_transaction(
  p_transaction_id uuid,
  p_admin_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_admin_id uuid := auth.uid();
  admin_profile_role text;
  original_transaction public.points_transactions%rowtype;
  existing_reversal_id uuid;
  new_reversal_id uuid;
  clean_note text := nullif(trim(p_admin_note), '');
begin
  if current_admin_id is null then
    raise exception 'Not authenticated.';
  end if;

  select role
  into admin_profile_role
  from public.profiles
  where id = current_admin_id;

  if admin_profile_role <> 'admin' then
    raise exception 'Only admins can reverse points.';
  end if;

  if clean_note is null or length(clean_note) > 300 then
    raise exception 'Admin note is required and must be 1 to 300 characters.';
  end if;

  select *
  into original_transaction
  from public.points_transactions
  where id = p_transaction_id
  for update;

  if not found then
    raise exception 'Points transaction not found.';
  end if;

  if original_transaction.status <> 'confirmed' then
    raise exception 'Only confirmed points can be reversed.';
  end if;

  if original_transaction.points <= 0 then
    raise exception 'Only positive points can be reversed.';
  end if;

  if original_transaction.type = 'reversal' then
    raise exception 'Reversal transactions cannot be reversed.';
  end if;

  select id
  into existing_reversal_id
  from public.points_transactions
  where reversed_transaction_id = original_transaction.id
    and type = 'reversal'
  limit 1;

  if existing_reversal_id is not null then
    raise exception 'This points transaction has already been reversed.';
  end if;

  insert into public.points_transactions (
    customer_id,
    order_id,
    membership_application_id,
    points,
    type,
    status,
    description,
    created_by,
    reversed_transaction_id,
    admin_note
  )
  values (
    original_transaction.customer_id,
    original_transaction.order_id,
    original_transaction.membership_application_id,
    original_transaction.points * -1,
    'reversal',
    'confirmed',
    'Points reversed: ' || coalesce(original_transaction.description, original_transaction.type),
    current_admin_id,
    original_transaction.id,
    clean_note
  )
  returning id into new_reversal_id;

  return new_reversal_id;
end;
$$;

grant execute on function public.admin_reverse_points_transaction(uuid, text)
to authenticated;
