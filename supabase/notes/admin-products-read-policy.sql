-- Record of the policy already applied to your-product-dev.
-- Admins can read inactive product drafts; other readers see active products only.
create policy "Admins read all products"
on public.products
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