-- Applied to the your-product-dev database on 2026-09-28.
-- All 20 sample products were changed from:
--   regular_price = 350, member_price = 175
-- to:
--   regular_price = 349, member_price = 199
-- The update was scoped to the 20 sample product IDs.
-- Readback confirmed 20/20 prices; all products remained inactive.
-- Historical order item prices were not changed.
-- Record of the applied change only; do not rerun as a migration.

update public.products
set regular_price = 349,
    member_price = 199
where regular_price = 350
  and member_price = 175
  and (
    id like 'sample-men-%'
    or id like 'sample-women-%'
  );