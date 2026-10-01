# Admin package fulfillment

Purpose:

Approved membership packages need real inventory deduction and fulfillment status history.

Locked fulfillment rules:

- Admin reviews and approves membership payment first.
- Approved package starts as not ready for packing.
- Admin allocates company-assorted perfume bottles.
- Required bottle count depends on package config.
- Tester kit / tarpaulin / cart are physical inclusions, not point bottles.
- Confirming package contents deducts inventory once.
- Package then moves to ready for packing.
- Admin can mark package shipped.
- Admin can mark package completed after delivery.
- Package fulfillment inventory deduction must not run twice.

Database objects / columns added:

- `membership_applications.package_allocation`
- `membership_applications.package_inventory_deducted`
- `membership_applications.package_inventory_deducted_at`
- `membership_applications.fulfillment_confirmed_at`

RPC added:

- `public.admin_confirm_package_allocation(p_application_id uuid, p_allocation jsonb)`

Expected RPC behavior:

- Admin-only.
- Application must be approved.
- Application must not already have deducted package inventory.
- Allocation bottle total must match the package required bottle count.
- Products must have enough available stock.
- Deduct product stock.
- Insert inventory movement rows.
- Save package allocation JSON.
- Mark `package_inventory_deducted = true`.
- Set `fulfillment_status = 'ready-for-packing'`.

Related app files:

- `src/admin.js`
- `src/components/admin-package-fulfillment-panel.js`
- `src/config/packages-config.js`

Important note:

Package fulfillment is separate from customer product orders. Package bottles are startup/package inclusions and do not earn product-order points.
