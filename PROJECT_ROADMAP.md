# YOUR PRODUCT Roadmap

**Updated:** October 7, 2026
**Project start:** September 22, 2026
**Current phase:** Dry run QA and launch cleanup
**Deployment target:** Cloudflare Pages
**Latest code commit:** `08d9c3b Polish checkout orders and member dashboard QA`

## 1. Project Summary

YOUR PRODUCT is a perfume e-commerce and membership system with:

- Public storefront
- Customer registration and login
- Free customer and approved member/reseller pricing
- Product checkout with manual payment proof
- Pickup and dropship order fulfillment
- Admin payment review for orders
- Membership application and admin approval
- Personal one-level referral links
- Member-only points system
- Member rewards catalog
- Manual payout request flow
- Admin inventory, sales, order, payout, and points monitoring

**Technology stack:**

- Vite + Vanilla JavaScript + Alpine.js + Tailwind CSS
- Supabase Auth, Database, Storage, and RPC
- Cloudflare Pages deployment target

## 2. Locked Business Rules

### Registration & Auth

- Customers can register with simple passwords.
- Password does not require uppercase, lowercase, or special characters.
- Login no longer blocks 6-character passwords on the frontend.
- Supabase email confirmation should be turned off so accounts are active after registration.
- Email provider must remain enabled.
- Checkout/payment proof submission requires a registered account.
- Admin accounts can view storefront but storefront purchase CTAs are blocked for admin preview mode.

### Pricing

- Free customer: **PHP 349** per bottle.
- Approved member/reseller tier pricing is based on approved package:

| Package | Package Price | Discount | Reseller Bottle Price |
| --- | ---: | ---: | ---: |
| Starter | PHP 1,000 | 30% | PHP 245 |
| Builder | PHP 5,000 | 35% | PHP 227 |
| Leader | PHP 10,000 | 40% | PHP 210 |
| Prestige | PHP 50,000 | 50% | PHP 175 |

- Universal PHP 199 member price is **deprecated**.
- Public product cards may show reseller tiers from PHP 245 to PHP 175.
- Logged-in approved members see their exact approved tier price.
- Existing order snapshots are never changed retroactively.

### Product Catalog

- Storefront has:
  - 1 standalone Tester Kit product
  - 20 perfume products
  - 4 membership packages

**Standalone Tester Kit:**

- SKU: TK01
- Price: **PHP 700**
- Includes 20 pcs 5ml assorted scents
- Fixed price product
- Reseller tier pricing does not apply
- Buying the Tester Kit does **not** activate membership
- Tester Kit is prioritized in admin product lists

### Membership Packages

| Package | Price | Discount | Reseller Price | Package Points |
| --- | ---: | ---: | ---: | ---: |
| Starter | PHP 1,000 | 30% | PHP 245 | 20 |
| Builder | PHP 5,000 | 35% | PHP 227 | 125 |
| Leader | PHP 10,000 | 40% | PHP 210 | 250 |
| Prestige | PHP 50,000 | 50% | PHP 175 | 1,200 |

**Starter package options:**

- Option A: 4 assorted bottles
- Option B: 1 tester kit + 2 assorted bottles

**Other package inclusions:**

- Builder: 25 assorted bottles + 1 tester kit
- Leader: 50 assorted bottles + 1 tester kit + 1 tarpaulin
- Prestige: 240 assorted bottles + tester kits + tarpaulin + mobile cart / stall support
- Stickers removed from inclusions

**Fulfillment rules:**

- Package bottles are company-assorted.
- Admin allocates actual perfume mix.
- Stock is deducted once only after allocation confirmation.
- Tester kits, tarpaulins, carts/stalls are tracked separately if supply inventory exists.
- Membership package bottles and package inclusions do **not** earn separate product-order points.

### Points

- Points are a **member-only benefit**.
- Free customers can buy products and Tester Kit, but they do **not** earn points.
- A customer becomes eligible for points only after approved membership package activation.
- Package points are awarded once admin approves the membership package payment:
  - Starter: 20 points
  - Builder: 125 points
  - Leader: 250 points
  - Prestige: 1,200 points
- Product order points are awarded once admin approves the product order payment, if buyer is already an active member.
- No minimum product order is required to earn points.
- Perfume product formula: **quantity x 5 points**.
- Standalone Tester Kit formula: **quantity x 10 points**.
- Points are awarded once only per qualified order or approved package.
- Cancelled/refunded orders require point reversal once only.

### Orders & Payments

- No COD.
- Manual payment only.
- Accepted methods: e-wallet or bank transfer.
- Customer uploads payment proof.
- Admin verifies payment before processing.
- Stock is deducted only after payment approval.
- Points are awarded automatically after approved eligible payment.
- Rejected or unverified orders do not deduct stock.
- Refunds are manual.

### Customer Purchase Flow

- Guests can browse and add items to cart.
- Account is required before checkout/payment proof submission.
- Registered free customers can buy:
  - Perfume products at PHP 349
  - Standalone Tester Kit at PHP 700
- Approved members can buy:
  - Perfume products at their approved tier price
  - Standalone Tester Kit at fixed PHP 700
- Membership is activated only through approved Starter, Builder, Leader, or Prestige package.

### Delivery & Pickup

- Pickup is open at **1244 Gen. Jacinto St, Makati City, Metro Manila**.
- Pickup orders have **PHP 0 delivery fee**.
- Dropship orders are accepted, but final delivery fee rules are still pending client confirmation.
- Metro Manila delivery is not locked because client still needs to confirm whether it is PHP 120 or PHP 150.
- Outside Metro Manila flow is pending final client confirmation.
- Recommended outside Metro Manila flow: redirect customer to Facebook Messenger before final payment.
- Same-day delivery: arranged via Messenger.
- Membership delivery rule pending final client confirmation:
  - Starter / Builder / Leader may add delivery fee
  - Prestige may include free delivery
- Delivery fee must stay separate from package price so referral commission remains based on package amount only.

### Referrals & Payouts

- Direct referral only.
- No downline, binary, pairing, or multi-level commissions.
- Commission: 10% of approved referred membership package amount.
- Commission excludes delivery fees.
- Minimum payout request: PHP 500.
- Payout request requires payout method, provider/bank, account name, account number, and QR code screenshot.
- Admin manually reviews and pays payout requests.
- Admin payment proof is stored in Supabase Storage.
- No automatic payout.

## 3. Completed Core Features

### Core Foundation

- Responsive storefront, product collection, quick view, cart, and checkout.
- Login, register, forgot password, and reset password.
- Customer dashboard.
- Admin dashboard.
- FAQ, Terms, University, and supporting pages.
- Supabase Auth, profiles, products, storage, and RPC foundation.
- Customer and admin logout flows cleaned.
- Header/sidebar actions cleaned for mobile.
- Admin storefront preview mode blocks purchase actions.

### Product & Pricing

- 20 perfume products configured with official names and scent descriptions.
- Standalone Tester Kit product added.
- Regular customer PHP 349 pricing implemented.
- Tester Kit fixed PHP 700 pricing implemented.
- Tiered reseller pricing implemented.
- Checkout and dashboard use approved package tier pricing.
- Universal PHP 199 member price removed from active pricing behavior.
- Cart blocks inactive or unavailable products.
- Server-side product order quote via `quote_order_cart`.
- Tester Kit fixed price is protected in checkout and server-side quote logic.
- Admin product pricing labels updated to show reseller price range instead of old member PHP 199 pricing.
- Tester Kit prioritized in admin product lists.

### Product Order Flow

- Guests can prepare cart.
- Checkout requires registered account.
- Free customers and members can place product orders.
- Checkout pre-fills customer profile details.
- Payment proof upload works.
- Admin can view payment proof.
- Admin payment proof image can be zoomed in a modal with close button, background click, and Escape key.
- Admin can approve or reject order payments.
- Stock deduction is guarded and happens only after approval.
- Order fulfillment statuses are connected.
- Admin can mark orders as shipped and delivered.
- Admin fulfillment now uses inline confirm/cancel panels instead of old browser confirm popups.
- Admin fulfillment RPC signature mismatch fixed.
- Alpine selected-order refresh bug fixed.
- Checkout final confirmation UI clarified.
- Order history shows awarded points for eligible orders.
- Admin item rows now support `product_image_url` for product thumbnails on new orders.

### Pickup Flow

- Checkout pickup option is enabled.
- Pickup address is shown during checkout.
- Pickup orders do not require dropship recipient/address fields.
- Pickup orders submit successfully through `submit_order`.
- Pickup orders store `delivery_fee = 0`.
- Admin order detail clearly shows pickup method and pickup address.
- Customer/member order history shows pickup address.

### Membership Flow

- Customer can apply for membership package.
- Starter package now shows Option A / Option B.
- Customer can upload membership payment proof.
- Admin can approve, reject, or manage membership applications.
- Approved applications activate member account.
- Approved package tier controls reseller price.
- Package fulfillment supports allocation, inventory deduction, ready for packing, shipped, and completed.
- Admin package fulfillment copy clearly shows next steps and confirmed contents.
- Membership package points are awarded after approval.

### Referrals & Payouts

- Active members have personal referral links.
- Referral code uses `profiles.username`.
- Registration validates referral links against active member profiles.
- Direct referral commission is created after approved membership package.
- Commission is duplicate-protected.
- Member earnings page loads real referral commission rows.
- Member payout request uses Supabase RPC.
- Payout request collects provider/bank and QR code screenshot.
- Admin referrals and payouts page loads real referral and payout data.
- Admin can approve, reject, and mark payout as paid.
- Admin payout proof uploads use Supabase Storage instead of blob URLs.
- Member payout request UI cleaned for MVP clarity.

### Points & Rewards

- Points transaction table exists.
- Points pages load Supabase data.
- Admin points audit page exists.
- Package points awarding is connected to admin membership approval.
- Product order points awarding is connected to admin order payment approval.
- Product order points support 5 points per perfume bottle, 10 points per Tester Kit, no minimum order, and active members only.
- Duplicate point awards are guarded.
- Member order history shows points earned per order.
- Admin order detail shows points awarded.
- Member dashboard `Your Points` now uses real confirmed `points_transactions`.
- Member dashboard recent orders now uses real Supabase orders.
- Member dashboard completed count now counts `delivered` orders.
- Member `Points & Rewards` page shows points history after the points summary cards, before reward journey/catalog.
- Rewards catalog added using client reward images.
- Reward images are shown fully without cropping.
- Admin points/rewards monitoring placeholder exists for future reward request workflow.

### Inventory

- Admin product inventory management exists.
- Inventory movement history exists.
- Add stock / deduct stock / set stock flow exists.
- Stock is deducted safely on approved product orders.
- Package allocation deducts inventory once only.
- Sales & Inventory page shows product stock from database.

### Reports

- Admin sales summary cards exist.
- Daily / weekly / monthly sales totals use real approved order data.
- Sales detail CSV export exists.
- Sales summary CSV export exists.
- Sales reports are based on approved, processing, shipped, or delivered product orders.
- Delivered free-customer orders appear in daily sales.

## 4. QA Passed on October 6-7, 2026

### Auth QA

- Free customer registration works with simple password.
- Free customer login works with 6-character password after removing frontend `minlength="8"` block.
- Approved member login works.
- Admin login works.

### Free Customer QA

- Free customer profile verified with `role = customer`, `customer_type = regular`, `membership_status = none`, `account_status = active`, and `selected_package_id = null`.
- Free customer sees PHP 349 product price.
- Cart stays PHP 349.
- Checkout stays PHP 349.
- Payment proof upload works.
- Order submit works.
- Admin approval/delivery works.
- Free customer does not earn points.

### Member QA

- Approved member profile verified with `customer_type = member`, `membership_status = active`, and `selected_package_id = builder`.
- Member perfume price shows PHP 227.
- Tester Kit stays PHP 700.
- Member order submit works.
- Admin approval awards order points.
- Perfume bottle earns +5 points.
- Tester Kit earns +10 points.
- Points are awarded once only per order.
- Member dashboard and Points & Rewards totals reflect confirmed point transactions.

### Admin Order QA

- Pending order count now derives from live order statuses and no longer stays stale.
- Delivered/rejected orders no longer appear as pending.
- Admin payment review works.
- Admin fulfillment flow works from approval to processing, shipped, and delivered.
- Inline confirm/cancel panels work for shipped and delivered actions.
- Delivered orders appear in sales reporting.
- Admin proof preview zoom works.

### Pickup QA

- Pickup option is selectable.
- Dropship-only address fields no longer block pickup checkout.
- Pickup order submit works.
- Pickup order stores delivery fee as PHP 0.
- Admin order detail clearly identifies pickup orders.
- Customer/member order history clearly identifies pickup orders.

### Build QA

- `npm run build` passed.
- `git diff --check` passed after trailing whitespace cleanup.
- Latest commit created: `08d9c3b Polish checkout orders and member dashboard QA`.

## 5. Database / Supabase Status

### Existing Important Tables

`profiles` key fields:

- `id`
- `email`
- `role`
- `customer_type`
- `membership_status`
- `account_status`
- `selected_package_id`
- `username`

`orders` key fields:

- `id`
- `user_id`
- `status`
- `customer_details`
- `delivery_details`
- `payment_method`
- `payment_proof_path`
- `subtotal`
- `delivery_fee`
- `reviewed_at`
- `payment_approved_at`
- `payment_rejected_at`
- `shipped_at`
- `delivered_at`

`points_transactions` key fields:

- `id`
- `customer_id`
- `order_id`
- `membership_application_id`
- `points`
- `type`
- `status`
- `description`
- `created_at`

`order_items` key fields:

- `id`
- `order_id`
- `product_id`
- `product_name`
- `quantity`
- `unit_price`
- `product_image_url`

### Migrations Already in Repo

- `supabase/migrations/20261003183800_update_points_awarding_rules.sql`
- `supabase/migrations/20261005023500_harden_security_policies.sql`

### Live Supabase Changes That Still Need Migration Capture

These changes were applied/tested during QA and should be captured in a migration before final handoff:

- Add `product_image_url` to `public.order_items`.
- Update `public.quote_order_cart(cart_items jsonb)`:
  - accept optional cart item `image`
  - validate image string length
  - return image inside quoted item JSON
- Update `public.submit_order(cart_items jsonb, delivery_details jsonb, payment_method text, payment_proof_path text)`:
  - allow `fulfillmentType = dropship` or `pickup`
  - validate recipient/address fields only for dropship
  - set pickup `delivery_fee = 0`
  - keep dropship `delivery_fee = null` until final delivery fee rules are confirmed
  - insert `product_image_url` into `order_items`

### Optional Data Backfill

- Old order items have `product_image_url = null`.
- New orders now store image URLs from checkout cart data.
- Optional: backfill older rows manually if admin wants thumbnails on old test orders.

## 6. Pending / Needs Client Confirmation

### Delivery Rules

- Confirm final Metro Manila delivery amount: PHP 120 or PHP 150.
- Confirm outside Metro Manila checkout behavior.
- Decide whether outside Metro Manila should be blocked before payment and redirected to Messenger.
- Confirm same-day delivery flow.
- Confirm membership package delivery fee:
  - Starter / Builder / Leader delivery fee
  - Prestige free delivery or separate delivery
- Add backend storage/validation for final delivery fee if client wants full payment amount displayed before payment.

### Order Cancellation / Refund

- Define cancellation rules per order status.
- Add admin cancel action.
- Restore stock once only if already deducted.
- Prevent duplicate restore or duplicate deduction.
- Add manual refund status tracking.
- Add point reversal once only for cancelled/refunded eligible orders.

### Rewards Request Workflow

- Add member reward request action when eligible.
- Add reward request database table.
- Add admin reward request review page.
- Add reward request statuses: pending, approved, rejected, released / claimed.
- Deduct or reserve points safely once reward request is approved.
- Add point reversal if reward request is cancelled.

### Reports

- Inventory movement CSV export if still needed.
- Payout history CSV export if still needed.
- Reward request CSV export if needed later.

### Manual Admin Order Entry

- Admin-created orders for Messenger, same-day, or offsite sales.
- Create verified order for existing customer.
- Safe stock deduction.
- Points eligibility for active member orders.

### Final Launch Cleanup

- Capture live Supabase SQL changes as a migration.
- Remove test accounts if needed.
- Remove test orders.
- Remove test membership applications.
- Remove test payout requests.
- Remove test commissions.
- Preserve admin account, products, schema, RPC functions, storage buckets, and policies.

## 7. Launch QA Checklist

### Auth

- [x] Register with simple password.
- [x] Confirm simple password login works after frontend fix.
- [x] Login / logout as customer.
- [x] Login / logout as admin.
- [ ] Register without referral link.
- [ ] Register with valid referral link.
- [ ] Confirm new account can login without email confirmation on final Supabase Auth settings.

### Storefront & Checkout

- [x] Free customer product checkout at PHP 349.
- [x] Active member product checkout with correct tier price.
- [x] Active member Tester Kit checkout stays PHP 700.
- [x] Checkout payment proof upload.
- [x] Checkout final confirmation flow.
- [x] Pickup checkout flow.
- [ ] Guest add-to-cart flow final pass.
- [ ] Free customer Tester Kit checkout at PHP 700 final pass.
- [ ] Admin preview cannot add products/packages to cart or checkout final pass.

### Product Orders

- [x] Admin product order approval.
- [ ] Admin product order rejection final pass.
- [x] Product stock deduction after approval.
- [x] Admin mark as shipped.
- [x] Admin mark as delivered.
- [x] Member order history shows correct status.
- [x] Member order history shows awarded points.
- [x] Member dashboard recent orders shows real orders.
- [x] Admin order detail shows payment proof zoom.
- [x] Admin order detail shows pickup details.
- [x] Admin order detail shows item thumbnails for new orders.

### Membership

- [ ] Membership application payment proof upload final pass.
- [ ] Starter package Option A / Option B display final pass.
- [ ] Admin membership approval final pass.
- [ ] Admin membership rejection final pass.
- [x] Approved member tier pricing applied.
- [ ] Package points awarded after admin approval final pass.
- [ ] Package allocation and inventory deduction final pass.
- [ ] Package ready for packing final pass.
- [ ] Package shipped and completed status final pass.

### Points

- [x] Free customer product order earns 0 points.
- [x] Active member 1 perfume bottle order earns 5 points.
- [x] Active member Tester Kit order earns 10 points.
- [ ] Active member perfume + Tester Kit order totals correctly.
- [x] Duplicate product order points are prevented in tested fulfillment flow.
- [ ] Duplicate package points are prevented final pass.
- [ ] Admin points audit page shows transactions final pass.
- [x] Member Points & Rewards page shows correct totals.
- [x] Member dashboard points card shows real confirmed total.

### Referrals & Payouts

- [ ] Referral commission creation.
- [ ] Duplicate referral commission prevention.
- [ ] Member earnings page shows referral commissions.
- [ ] Member payout request with QR code.
- [ ] Admin payout approve.
- [ ] Admin payout reject.
- [ ] Admin mark payout as paid.
- [ ] Admin payout proof opens correctly.

### Inventory & Sales

- [ ] Product stock updates manually final pass.
- [x] Product stock deducts after approved order.
- [x] Sales summary totals update after approved orders.
- [ ] Sales detail CSV export.
- [ ] Sales summary CSV export.

### Final QA

- [x] Production build passes.
- [x] `git diff --check` passes.
- [ ] No console errors on full core-flow pass.
- [ ] Mobile final pass.
- [ ] Desktop final pass.
- [ ] Supabase live database final check.
- [ ] Cloudflare deployment check.
- [ ] Test data cleanup.
- [ ] Final handoff notes.

## 8. Out of Scope Until After Dry Run

- Automatic payment gateway.
- Automatic payout.
- Full accounting / tax reports.
- MLM, multi-level, binary, or pairing logic.
- Real courier integration.
- Advanced delivery calculator.
- Full reward redemption backend, unless client requires it before launch.
- Mobile app.
- Major UI redesigns beyond clarity fixes.
- Complex charts and analytics dashboards.
- Individual reseller stores.
- Automated raffle draw.

## 9. Immediate Next Steps

1. Capture the live Supabase SQL updates as a migration.
2. Run final referral + membership package QA.
3. Run payout request/admin payout QA.
4. Confirm delivery fee and outside Metro Manila rules with client.
5. Decide whether to clean or keep current test data for dry run.
6. Run one full desktop QA pass with console open.
7. Run one mobile responsive QA pass.
8. Push final code when ready for Cloudflare deployment.
9. Verify live Cloudflare build and environment variables.
10. Prepare client handoff notes and post-launch backlog.

## 10. Current MVP Status

As of October 7, 2026, the MVP is functionally close to launch and active dry run QA is underway.

Completed core flow:

1. Customer registers.
2. Customer logs in.
3. Customer can buy perfume or Tester Kit.
4. Customer can choose dropship or pickup.
5. Customer uploads payment proof.
6. Admin reviews payment.
7. Approved order deducts stock.
8. Eligible active-member order earns points automatically.
9. Admin can ship and deliver order with inline confirmation.
10. Member can see order history and earned points.
11. Member dashboard shows real points and recent orders.
12. Admin can monitor orders, inventory, sales, points, referrals, and payouts.

Main blockers before final launch:

- Delivery fee confirmation from client.
- Live Supabase SQL migration capture.
- Final referral/membership/payout QA.
- Final mobile/desktop no-console-error QA.
- Test data cleanup decision.
- Live Cloudflare deployment verification after final push.

## 11. Security Hardening Status

### Completed Before Live

- Supabase Row Level Security verified enabled on all important public tables:
  - profiles
  - products
  - orders
  - order_items
  - membership_applications
  - referral_commissions
  - payout_requests
  - points_transactions
  - inventory_movements
- Customer data access verified:
  - customers can read their own profile
  - customers can read their own orders and order items
  - customers can read their own membership applications
  - members can read their own payout requests
  - members can read their own points transactions
  - members can read their own referral commissions
- Profile update permissions verified safe:
  - customers can only update first name, last name, and mobile number
  - customers cannot update role, account status, customer type, membership status, selected package, or referral authority fields
- Admin policies verified for order review, membership review, payout review, points monitoring, inventory movement monitoring, and customer profile reads.
- Product public access verified:
  - anonymous and authenticated users can read active products only
  - product writes remain admin/RPC-controlled
- Storage buckets verified private:
  - payment-proofs
  - payout-proofs
  - payout-qr-codes
- Storage upload restrictions hardened:
  - maximum file size: 5MB
  - allowed types: JPEG, PNG, WebP
- Storage ownership policies verified:
  - customers can upload/read only their own payment proofs
  - members can upload/read only their own payout QR codes
  - admins can read payment proofs, payout proofs, and payout QR codes as needed
- Admin RPC functions verified with active-admin checks:
  - admin_review_order_payment
  - admin_update_order_fulfillment
  - admin_review_membership_application
  - admin_award_order_points
  - admin_update_payout_request
- Server-side RPC rules verified:
  - stock availability
  - server-side product pricing
  - Tester Kit fixed price
  - order status transitions
  - payment proof requirement
  - duplicate point award prevention
  - duplicate referral commission prevention
  - payout status transitions
- Private helper function access hardened:
  - direct execute access removed from anon/authenticated for `private.award_order_points_if_eligible`
- Old duplicate RPC signatures removed:
  - old `admin_update_order_fulfillment` overload removed
  - old `customer_create_payout_request` overload removed
- Payout request RPC hardened:
  - active member check added
  - QR code path ownership validation confirmed
  - available commission balance validation confirmed
- Frontend secret check passed:
  - `.env` and `.env.local` are ignored by git
  - no service role key found in frontend source
  - public Supabase anon key usage remains acceptable
- Security migration added:
  - `supabase/migrations/20261005023500_harden_security_policies.sql`

### Recommended Before Client Handoff

- Run final no-console-error QA on mobile and desktop.
- Review Cloudflare Pages environment variables:
  - correct Supabase URL
  - correct public anon key
  - no secret key exposed
- Review Supabase Auth settings:
  - email confirmation off if client requires instant account creation
  - secure password policy matches client request
  - site URL and redirect URLs are correct for live domain
- Add or confirm clear confirmation prompts for dangerous admin actions:
  - approve payment
  - reject payment
  - mark shipped
  - mark delivered
  - deduct stock
  - approve payout
  - mark payout paid
- Add manual test account cleanup checklist before final deployment.

### Post-Launch Security Backlog

- Add point reversal logic for cancellations/refunds.
- Add reward request approval and points reservation/deduction safeguards.
- Add admin activity logs UI.
- Add exportable audit reports.
