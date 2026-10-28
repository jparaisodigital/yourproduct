-- Payment proof retention
-- Keeps order and membership payment proofs for 15 days,
-- then removes the Storage object through the cleanup Edge Function.

alter table public.orders
add column if not exists payment_proof_uploaded_at timestamptz,
add column if not exists payment_proof_deleted_at timestamptz;

alter table public.membership_applications
add column if not exists payment_proof_uploaded_at timestamptz,
add column if not exists payment_proof_deleted_at timestamptz;


create or replace function private.sync_payment_proof_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.payment_proof_path is not null then
      new.payment_proof_uploaded_at :=
        coalesce(new.payment_proof_uploaded_at, now());
      new.payment_proof_deleted_at := null;
    end if;

    return new;
  end if;

  if new.payment_proof_path is distinct from old.payment_proof_path then
    if new.payment_proof_path is not null then
      new.payment_proof_uploaded_at := now();
      new.payment_proof_deleted_at := null;
    elsif old.payment_proof_path is not null then
      new.payment_proof_deleted_at :=
        coalesce(new.payment_proof_deleted_at, now());
    end if;
  end if;

  return new;
end;
$$;


drop trigger if exists sync_order_payment_proof_timestamps
on public.orders;

create trigger sync_order_payment_proof_timestamps
before insert or update of payment_proof_path
on public.orders
for each row
execute function private.sync_payment_proof_timestamps();


drop trigger if exists sync_membership_payment_proof_timestamps
on public.membership_applications;

create trigger sync_membership_payment_proof_timestamps
before insert or update of payment_proof_path
on public.membership_applications
for each row
execute function private.sync_payment_proof_timestamps();


update public.orders
set
  payment_proof_uploaded_at = now(),
  payment_proof_deleted_at = null
where payment_proof_path is not null
  and payment_proof_uploaded_at is null;


update public.membership_applications
set
  payment_proof_uploaded_at = now(),
  payment_proof_deleted_at = null
where payment_proof_path is not null
  and payment_proof_uploaded_at is null;


grant select, update
on table public.membership_applications
to service_role;


create extension if not exists pg_cron
with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create extension if not exists pg_net;


do $$
begin
  if exists (
    select 1
    from vault.decrypted_secrets
    where name = 'cleanup_cron_secret'
  ) then
    perform cron.schedule(
      'cleanup-payment-proofs-daily',
      '30 18 * * *',
      $cron$
      select net.http_post(
        url := 'https://scxjhcepcoooylbjiqzh.supabase.co/functions/v1/cleanup-payment-proofs',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cleanup-secret',
          (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'cleanup_cron_secret'
            limit 1
          )
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 10000
      );
      $cron$
    );
  else
    raise notice
      'cleanup_cron_secret is not configured in Vault; cron job was not scheduled.';
  end if;
end;
$$;