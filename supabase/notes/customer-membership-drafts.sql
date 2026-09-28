-- Applied to the development Supabase project on 2026-09-28.
-- Keep this file for setting up a future client database.
-- Do not run it again in the current development project.

create unique index membership_one_open_application_per_customer_idx
on public.membership_applications (customer_id)
where status in (
  'awaiting-payment',
  'pending-verification',
  'cancellation-requested'
);

grant insert (customer_id, package_id, amount)
on public.membership_applications
to authenticated;

create policy "Customers start own membership application"
on public.membership_applications
for insert
to authenticated
with check (
  customer_id = (select auth.uid())
  and status = 'awaiting-payment'
  and amount = case package_id
    when 'starter' then 1000
    when 'builder' then 5000
    when 'leader' then 10000
    when 'prestige' then 50000
    else null
  end
  and exists (
    select 1
    from public.profiles as p
    where p.id = (select auth.uid())
      and p.role = 'customer'
      and p.account_status = 'active'
      and p.customer_type = 'regular'
      and p.membership_status = 'none'
  )
);