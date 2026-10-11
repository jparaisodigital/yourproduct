# YOUR PRODUCT Roadmap

**Updated:** October 11, 2026  
**Project start:** September 22, 2026  
**Current phase:** Final QA, Supabase migration capture, and launch cleanup  
**Deployment target:** Cloudflare Pages  
**Latest local commits:**
- `feat: add admin points reversal flow`
- `polish: improve membership package dashboard flow`

---

## 1. Project Summary

YOUR PRODUCT is a perfume e-commerce, membership, referral, points, rewards, payout, and admin management system.

The MVP now supports:

- Public perfume storefront
- Customer registration and login
- Free customer pricing
- Approved member/reseller tier pricing
- Manual payment proof checkout
- Admin order payment review
- Product order fulfillment
- Pickup and dropship order support
- Membership package application and purchase flow
- Repeat membership package purchase / upgrade flow
- Admin membership approval and package fulfillment
- Package allocation and inventory deduction
- Direct one-level referral commission
- Member payout request flow
- Admin payout review and payout proof upload
- Member points and rewards page
- Admin points monitoring and manual point reversal
- Sales, inventory, order, membership, referral, payout, and points admin dashboard

**Technology stack:**

- Vite
- Vanilla JavaScript
- Alpine.js
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase RPC
- Cloudflare Pages

---

## 2. Locked Business Rules

### Registration & Auth

- Customers can register with simple passwords.
- Password does not require uppercase, lowercase, or special characters.
- Login no longer blocks 6-character passwords on the frontend.
- Supabase email confirmation should be turned off if client wants instant account activation.
- Email provider must remain enabled.
- Checkout/payment proof submission requires a registered account.
- Admin accounts can view storefront but purchase actions are blocked in admin preview mode.

### Pricing

| Customer Type | Price Rule |
| --- | --- |
| Free customer | PHP 349 per perfume bottle |
| Starter member | PHP 245 per perfume bottle |
| Builder member | PHP 227 per perfume bottle |
| Leader member | PHP 210 per perfume bottle |
| Prestige member | PHP 175 per perfume bottle |
| Tester Kit | Fixed PHP 700 |

- Universal PHP 199 member price is deprecated.
- Logged-in approved members see their active tier price.
- Existing order snapshots are never changed retroactively.
- Tester Kit fixed price is protected in frontend and backend quote logic.

### Product Catalog

Storefront includes:

- 20 perfume products
- 1 standalone Tester Kit product
- 4 membership packages

Standalone Tester Kit:

- SKU: TK01
- Price: PHP 700
- Includes 20 pcs 5ml assorted scents
- Does not activate membership
- Fixed price; reseller discount does not apply
- Earns points only if buyer is already an active member

### Membership Packages

| Package | Price | Discount | Reseller Price | Package Points |
| --- | ---: | ---: | ---: | ---: |
| Starter | PHP 1,000 | 30% | PHP 245 | 20 |
| Builder | PHP 5,000 | 35% | PHP 227 | 125 |
| Leader | PHP 10,000 | 40% | PHP 210 | 250 |
| Prestige | PHP 50,000 | 50% | PHP 175 | 1,200 |

Starter package options:

- Option A: 4 assorted bottles
- Option B: 1 tester kit + 2 assorted bottles

Other package inclusions:

- Builder: 25 assorted bottles + 1 tester kit
- Leader: 50 assorted bottles + 1 tester kit + 1 tarpaulin
- Prestige: 240 assorted bottles + tester kits + tarpaulin + mobile cart / stall support

Fulfillment rules:

- Package bottles are company-assorted.
- Admin allocates the actual perfume mix.
- Stock is deducted once only after package content confirmation.
- Package inclusions such as Tester Kit, tarpaulin, and cart/stall support are tracked separately if supply inventory exists.
- Membership package bottles and package inclusions do not earn separate product-order points.
- Package points are awarded once the membership package payment is approved.

Repeat package purchase / upgrade rules:

- Existing approved members can purchase another package.
- Existing approved members can upgrade to a higher package.
- Lower or repeat package purchase does not downgrade the member’s highest approved tier.
- Full package points are still awarded on approved repeat package purchase.
- Highest approved membership tier remains active.
- Current member discount remains active while another package purchase is under review.

### Points

- Points are a member-only benefit.
- Free customers can buy products and Tester Kit but do not earn points.
- Active members earn points from qualified approved product orders.
- Package points are awarded after admin approves membership/package payment.
- Product order points are awarded after admin approves eligible product order payment.
- No minimum product order is required to earn product order points.
- Perfume bottle formula: quantity x 5 points.
- Standalone Tester Kit formula: quantity x 10 points.
- Points are awarded once only per qualified order or approved package.
- Duplicate points are guarded.
- Admin can manually reverse points for approved refund/correction cases.
- Point reversal creates a new negative points transaction.
- Original point transaction remains visible for audit trail.
- Reversal requires admin note and confirmation.
- Reversal cannot be reversed again.
- Already reversed original transactions are backend-protected from duplicate reversal.

### Orders & Payments

- No COD.
- Manual payment only.
- Accepted methods: e-wallet or bank transfer.
- Customer uploads payment proof.
- Admin verifies payment before processing.
- Stock is deducted only after payment approval.
- Rejected or unverified orders do not deduct stock.
- Refunds are handled manually through admin/Messenger.
- Same-day delivery and special arrangements are handled through Messenger if needed.

### Delivery & Pickup

- Pickup is open at 1244 Gen. Jacinto St, Makati City, Metro Manila.
- Pickup orders have PHP 0 delivery fee.
- Dropship order flow exists.
- Final delivery fee rules still need client confirmation.
- Metro Manila delivery amount still needs confirmation.
- Outside Metro Manila behavior still needs final confirmation.
- Recommended outside Metro Manila behavior: redirect customer to Messenger before final payment.
- Delivery fee remains separate from package price so referral commission remains based on package amount only.

### Referrals & Payouts

- Direct referral only.
- No downline, binary, pairing, or multi-level commission.
- Commission is 10% of approved referred membership package amount.
- Commission excludes delivery fees.
- Minimum payout request is PHP 500.
- Payout request requires payout method, provider/bank, account name, account number, and QR code screenshot.
- Admin manually reviews and pays payout requests.
- Admin payout proof is stored in Supabase Storage.
- No automatic payout.

---

## 3. Completed Core Features

### Core Foundation

- Responsive storefront
- Product collection
- Product quick view
- Cart drawer
- Checkout
- Login
- Register
- Forgot password
- Reset password
- Customer dashboard
- Admin dashboard
- FAQ page
- Terms page
- University page
- Supabase Auth foundation
- Supabase database foundation
- Supabase Storage foundation
- Supabase RPC foundation
- Customer and admin logout flows cleaned
- Header/sidebar mobile actions cleaned
- Admin storefront preview mode blocks purchase actions

### Storefront, Cart, and Checkout

- Guest browsing works.
- Guest add-to-cart works.
- Account gate blocks final checkout/payment submission until login/register.
- Free customer price is PHP 349.
- Approved member tier pricing works.
- Tester Kit fixed PHP 700 price works.
- Cart blocks inactive/unavailable products.
- Checkout pre-fills customer profile details.
- Payment proof upload works.
- Checkout final confirmation UI is cleaned.
- Pickup checkout works.
- Dropship checkout flow exists.
- Server-side product order quote via `quote_order_cart`.
- Tester Kit fixed price is protected server-side.
- Product images are stored in new order item rows for admin thumbnails.

### Product Orders

- Admin can view orders.
- Admin can view payment proof.
- Admin payment proof image has zoom modal.
- Admin can approve/reject order payment.
- Stock deduction is guarded and happens only after approval.
- Admin can mark approved orders as shipped.
- Admin can mark shipped orders as delivered.
- Admin fulfillment uses inline confirmation panels.
- Admin fulfillment RPC signature mismatch fixed.
- Alpine selected-order refresh bug fixed.
- Order history shows awarded points for eligible orders.
- Recent customer dashboard orders use real Supabase orders.
- Delivered order count is connected.
- Sales summaries use approved/processing/shipped/delivered order data.

### Pickup Flow

- Pickup option is selectable.
- Pickup address is shown during checkout.
- Pickup orders do not require dropship recipient/address fields.
- Pickup orders submit successfully.
- Pickup orders store delivery fee as PHP 0.
- Admin order detail clearly shows pickup method and pickup address.
- Customer/member order history shows pickup address.

### Membership Package Flow

- Customer can apply for membership package.
- Starter package supports Option A / Option B.
- Customer can upload membership payment proof.
- Admin can approve or reject membership applications.
- Approved application activates member account.
- Approved package tier controls reseller pricing.
- Existing members can purchase another package or upgrade.
- Repeat/lower package purchase does not downgrade highest approved tier.
- Current membership remains active while package purchase is under review.
- Package payment page wording is dynamic for new applicant vs existing member.
- Package purchase confirmation uses custom modal.
- Package payment proof submission uses custom confirmation modal.
- Customer can cancel unpaid package/application.
- Cancel flow has dynamic wording for application vs package purchase.
- Cancel action uses safe backend RPC.
- Package dashboard section is visible for approved members.
- Package image preview works separately from inclusions modal.
- Package cards have clickable image preview and separate View Inclusions CTA.
- Package application/purchase page has cleaned copy.
- Membership/package reward popup exists after admin approval.
- Reward popup is one-time per approved package using localStorage.
- Reward popup handles first membership, upgrade, repeat, and lower package purchase.

### Package Fulfillment

- Admin package fulfillment panel exists after membership approval.
- Admin can allocate package perfume contents.
- Admin can confirm package contents.
- Package inventory deducts once only.
- Package can move to ready for packing.
- Package can be marked shipped.
- Package can be completed.
- Admin fulfillment copy was cleaned for clarity.
- Fixed package inclusions such as Tester Kit and tarpaulin are displayed separately.

### Referrals & Payouts

- Active members have personal referral links.
- Referral code uses `profiles.username`.
- Registration validates referral links against active member profiles.
- Direct referral commission is created after approved referred membership package.
- Commission creation is duplicate-protected.
- Member earnings page loads real referral commission rows.
- Member payout request uses Supabase RPC.
- Payout request collects provider/bank and QR code screenshot.
- Admin referrals and payouts page loads real referral and payout data.
- Admin can approve payout.
- Admin can reject payout.
- Admin can mark payout as paid.
- Admin payout proof uploads use Supabase Storage.
- Member payout request UI cleaned for MVP clarity.

### Points & Rewards

- `points_transactions` table exists.
- Member points page loads real Supabase transactions.
- Admin points audit page loads real Supabase transactions.
- Package points awarding is connected to membership approval.
- Product order points awarding is connected to order payment approval.
- Product order points support:
  - 5 points per perfume bottle
  - 10 points per Tester Kit
  - no minimum order
  - active members only
- Duplicate point awards are guarded.
- Member order history shows points earned per order.
- Admin order detail shows points awarded.
- Member dashboard `Your Points` uses real confirmed points balance.
- Member Points & Rewards page shows:
  - available points
  - pending points
  - reversed points
  - points history
  - reward journey
  - rewards catalog
- Admin Points & Rewards page shows:
  - confirmed points
  - pending points
  - reversed points
  - searchable/filterable points history
  - clickable transaction details modal
  - safe point reversal flow
- Admin point reversal now works:
  - requires admin note
  - requires Yes/No confirmation
  - creates negative reversal transaction
  - links to original transaction
  - blocks duplicate reversal in backend
- Member and admin reversed point totals now count negative reversal rows.
- Member point labels are cleaned:
  - `membership_award` → Membership Package Points
  - `order_award` → Product Order Points
  - `reversal` → Reversal

### Inventory

- Admin product inventory management exists.
- Inventory movement history exists.
- Add stock / deduct stock / set stock flow exists.
- Stock is deducted safely on approved product orders.
- Package allocation deducts inventory once only.
- Sales & Inventory page shows product stock from database.
- Package fixed supplies are tracked separately where inventory exists.

### Reports

- Admin sales summary cards exist.
- Daily / weekly / monthly sales totals use real approved order data.
- Sales detail CSV export exists.
- Sales summary CSV export exists.
- Sales reports are based on approved, processing, shipped, or delivered product orders.
- Delivered free-customer orders appear in daily sales.

### UI / UX Polish

- Landing page loader is active.
- Dashboard package purchase loader works.
- Dashboard cancel package flow works.
- Confirmation modals replaced browser confirms in important flows.
- Admin package fulfillment wording cleaned.
- Customer package application/purchase wording cleaned.
- Package cards and modal interactions cleaned.
- Points audit rows are clickable.
- Points reversal modal scroll works on mobile.
- Admin and customer points labels are more readable.
- Membership reward popup uses custom SVG icon, not emoji.
- Customer support chat remains available.
- Mobile sidebar/dashboard layout cleaned.

---

## 4. Supabase / Database Status

### Important Tables

`profiles`

- id
- email
- role
- customer_type
- membership_status
- account_status
- selected_package_id
- username

`orders`

- id
- user_id
- status
- customer_details
- delivery_details
- payment_method
- payment_proof_path
- subtotal
- delivery_fee
- reviewed_at
- payment_approved_at
- payment_rejected_at
- shipped_at
- delivered_at

`order_items`

- id
- order_id
- product_id
- product_name
- quantity
- unit_price
- product_image_url

`membership_applications`

- id
- customer_id
- package_id
- selected_package_option_id
- status
- payment_proof_path
- package_allocation
- package_inventory_deducted
- fulfillment_status
- submitted_at
- approved_at
- membership_activated_at
- updated_at

`points_transactions`

- id
- customer_id
- order_id
- membership_application_id
- points
- type
- status
- description
- created_by
- created_at
- reversed_transaction_id
- admin_note

### Existing Important RPC Functions

- `quote_order_cart`
- `submit_order`
- `admin_review_order_payment`
- `admin_update_order_fulfillment`
- `admin_review_membership_application`
- `customer_submit_membership_payment`
- `customer_cancel_membership_application`
- `admin_award_order_points`
- `admin_reverse_points_transaction`
- `customer_create_payout_request`
- `admin_update_payout_request`

### Live Supabase Changes That Need Migration Capture

These were applied/tested in live Supabase and should be captured in migrations before final handoff:

- Add `product_image_url` to `public.order_items`.
- Update `quote_order_cart(cart_items jsonb)` to support item image data.
- Update `submit_order(...)` to support dropship/pickup and `product_image_url`.
- Update membership package application/payment rules to allow existing active members to purchase another package.
- Update membership approval logic to allow repeat/lower/upgrade package purchase without downgrading highest tier.
- Ensure package points are awarded for approved repeat package purchase.
- Add `reversed_transaction_id` and `admin_note` to `points_transactions`.
- Add `admin_reverse_points_transaction(p_transaction_id uuid, p_admin_note text)`.
- Update points type check to include `membership_award` and `reversal` if not already captured.
- Add indexes for reversal lookup if not yet in migration:
  - `points_transactions_reversed_transaction_id_idx`

---

## 5. QA Passed / Verified

### Build & Git

- `npm run build` passed.
- Working tree was clean after commits.
- Recent local commits created:
  - `feat: add admin points reversal flow`
  - `polish: improve membership package dashboard flow`

### Auth QA

- Free customer registration works.
- Free customer login works with simple password.
- Approved member login works.
- Admin login works.
- Customer logout works.
- Admin logout works.

### Storefront / Checkout QA

- Free customer product price is PHP 349.
- Member product price follows approved tier.
- Tester Kit remains PHP 700.
- Payment proof upload works.
- Checkout final confirmation works.
- Pickup order flow works.
- Product order submission works.
- Admin proof preview zoom works.

### Product Order QA

- Admin payment approval works.
- Product stock deducts after approval.
- Admin mark as shipped works.
- Admin mark as delivered works.
- Delivered orders appear in sales reporting.
- Member order history shows order status.
- Member order history shows awarded points.

### Membership Package QA

- Package selection works.
- Package inclusions modal works.
- Package image preview works.
- Existing members can start another package purchase.
- Package payment page loads with selected package.
- Package proof upload works.
- Custom submit confirmation modal works.
- Admin approval works.
- Package points are awarded.
- Reward popup appears after approval.
- Reward popup does not show again after being closed.
- Cancel unpaid package purchase works.
- Cancel wording is dynamic for package/application.

### Package Fulfillment QA

- Admin package fulfillment panel appears after approval.
- Admin can allocate package contents.
- Admin can confirm package contents.
- Inventory deduction works once.
- Ready to ship / shipped / completed flow works.
- Package fulfillment wording is clearer.

### Points QA

- Free customer product order earns 0 points.
- Active member perfume bottle earns 5 points each.
- Active member Tester Kit earns 10 points each.
- Package points are awarded after admin approval.
- Points balance updates from real `points_transactions`.
- Admin points audit loads real transactions.
- Member points history loads real transactions.
- Admin can open point transaction details.
- Admin can reverse positive confirmed points.
- Reversal creates negative points transaction.
- Reversal requires admin note.
- Duplicate reversal is backend-protected.
- Member dashboard shows reversal rows.
- Available points are calculated after reversals.
- Reversed points total counts negative reversal rows.

### Referrals / Payouts QA

- Referral link structure exists.
- Referral validation exists during registration.
- Referral commission creation is connected to approved membership package.
- Member earnings page loads real commission data.
- Payout request flow exists.
- Admin payout approval/rejection/paid status exists.
- Admin payout proof upload works through Supabase Storage.

### Inventory / Sales QA

- Manual product stock update exists.
- Product stock deducts after approved order.
- Package allocation deducts inventory once.
- Sales summary totals update after approved orders.
- CSV exports exist.

---

## 6. Remaining Before Final Launch

### Must Do

1. Capture live Supabase SQL changes as migrations.
2. Run one full desktop QA pass with console open.
3. Run one full mobile QA pass with console open.
4. Confirm there are no blocking console errors.
5. Confirm Cloudflare Pages environment variables:
   - Supabase URL
   - Supabase public anon key
   - no service role key exposed
6. Push final code to GitHub.
7. Verify Cloudflare production build.
8. Decide whether to clean or keep test data for dry run.
9. Prepare client handoff notes.

### Needs Client Confirmation

- Final Metro Manila delivery fee.
- Outside Metro Manila checkout behavior.
- Same-day delivery flow.
- Membership package delivery fee rules.
- Whether Prestige includes free delivery.
- Whether old test data should be deleted before handoff.
- Final reward redemption mechanics.

### Nice To Have Before Handoff

- Final referral registration QA using a fresh test account.
- Final payout request QA using a fresh payout request.
- Final membership rejection QA.
- Final order rejection QA.
- Final admin preview mode QA.
- Final CSV export QA.

---

## 7. Launch QA Checklist

### Auth

- [x] Register with simple password.
- [x] Login with simple password.
- [x] Customer logout.
- [x] Admin logout.
- [ ] Fresh register without referral link.
- [ ] Fresh register with valid referral link.
- [ ] Confirm final Supabase Auth email confirmation setting.

### Storefront & Checkout

- [x] Free customer product checkout at PHP 349.
- [x] Active member product checkout with correct tier price.
- [x] Active member Tester Kit checkout at PHP 700.
- [x] Checkout payment proof upload.
- [x] Checkout final confirmation.
- [x] Pickup checkout.
- [ ] Guest add-to-cart final pass.
- [ ] Free customer Tester Kit checkout final pass.
- [ ] Admin preview purchase-block final pass.

### Product Orders

- [x] Admin product order approval.
- [ ] Admin product order rejection final pass.
- [x] Product stock deduction after approval.
- [x] Admin mark as shipped.
- [x] Admin mark as delivered.
- [x] Member order history status.
- [x] Member order history points.
- [x] Admin order proof zoom.
- [x] Admin pickup detail display.
- [x] Admin item thumbnails for new orders.

### Membership Packages

- [x] Package selection.
- [x] Package inclusions modal.
- [x] Package image preview.
- [x] Membership/package proof upload.
- [x] Admin membership approval.
- [ ] Admin membership rejection final pass.
- [x] Approved member tier pricing applied.
- [x] Repeat package purchase by existing member.
- [x] Lower package purchase does not downgrade tier.
- [x] Package points awarded after approval.
- [x] Package reward popup.
- [x] Cancel unpaid package purchase.
- [x] Package allocation.
- [x] Package inventory deduction.
- [x] Package ready to ship.
- [x] Package shipped/completed.

### Points

- [x] Free customer earns 0 points.
- [x] Active member perfume order earns 5 points per bottle.
- [x] Active member Tester Kit earns 10 points.
- [x] Package points awarded.
- [x] Duplicate product order points guarded.
- [x] Duplicate package points guarded.
- [x] Admin points audit page shows transactions.
- [x] Member Points & Rewards page shows correct totals.
- [x] Admin can reverse points.
- [x] Reversal requires note.
- [x] Reversal creates negative transaction.
- [x] Reversed totals calculate correctly.
- [x] Member dashboard points card shows real confirmed total.

### Referrals & Payouts

- [ ] Referral commission creation final pass.
- [ ] Duplicate referral commission prevention final pass.
- [ ] Member earnings page final pass.
- [ ] Member payout request with QR code final pass.
- [ ] Admin payout approve final pass.
- [ ] Admin payout reject final pass.
- [ ] Admin mark payout as paid final pass.
- [ ] Admin payout proof opens correctly.

### Inventory & Sales

- [ ] Manual product stock update final pass.
- [x] Product stock deducts after approved order.
- [x] Package stock deducts after confirmed allocation.
- [x] Sales summary totals update after approved orders.
- [ ] Sales detail CSV export final pass.
- [ ] Sales summary CSV export final pass.

### Final QA

- [x] Production build passes.
- [x] Working tree clean after commits.
- [ ] No console errors on full desktop core-flow pass.
- [ ] No console errors on full mobile core-flow pass.
- [ ] Supabase live database final check.
- [ ] Cloudflare deployment check.
- [ ] Test data cleanup decision.
- [ ] Client handoff notes.

---

## 8. Security Hardening Status

### Completed

- Supabase Row Level Security verified/enabled on important public tables.
- Customers can read their own profile.
- Customers can read their own orders and order items.
- Customers can read their own membership applications.
- Members can read their own payout requests.
- Members can read their own points transactions.
- Members can read their own referral commissions.
- Customer profile updates are restricted to safe fields.
- Customers cannot update role, account status, customer type, membership status, selected package, or referral authority fields.
- Admin policies exist for order review, membership review, payout review, points monitoring, inventory monitoring, and customer profile reads.
- Anonymous/authenticated users can read active products only.
- Product writes remain admin/RPC-controlled.
- Payment proof, payout proof, and payout QR buckets are private.
- Storage upload restrictions hardened:
  - JPEG
  - PNG
  - WebP
  - 5MB maximum
- Customers can upload/read only their own payment proofs.
- Members can upload/read only their own payout QR codes.
- Admins can read payment proofs, payout proofs, and payout QR codes as needed.
- Admin RPC functions include admin checks.
- Server-side RPC rules protect:
  - stock availability
  - server-side product pricing
  - Tester Kit fixed price
  - order status transitions
  - payment proof requirement
  - duplicate point award prevention
  - duplicate referral commission prevention
  - payout status transitions
  - point reversal
- Frontend secret check passed:
  - `.env` and `.env.local` ignored by git
  - no service role key in frontend source
  - public Supabase anon key usage remains acceptable

### Recommended Before Handoff

- Review Cloudflare environment variables.
- Review Supabase Auth settings.
- Confirm site URL and redirect URLs.
- Run no-console-error QA on mobile and desktop.
- Confirm dangerous admin actions have confirmation:
  - approve payment
  - reject payment
  - mark shipped
  - mark delivered
  - deduct stock
  - approve payout
  - mark payout paid
  - reverse points
- Prepare test data cleanup checklist.

---

## 9. Out of Scope Until After Launch

- Automatic payment gateway
- Automatic payout
- Full accounting / tax reports
- MLM, multi-level, binary, or pairing logic
- Real courier integration
- Advanced delivery calculator
- Full reward redemption backend
- Reward request approval and point reservation/deduction backend
- Mobile app
- Major UI redesigns beyond clarity fixes
- Complex charts and analytics dashboards
- Individual reseller stores
- Automated raffle draw
- Full admin activity log UI
- Exportable full audit report system

---

## 10. Immediate Next Steps

1. Capture live Supabase SQL changes as migrations.
2. Run final referral QA.
3. Run final payout QA.
4. Run final membership rejection QA.
5. Run final order rejection QA.
6. Confirm delivery rules with client.
7. Decide test data cleanup plan.
8. Run full desktop QA with console open.
9. Run full mobile QA with console open.
10. Push final commits to GitHub.
11. Deploy/check Cloudflare build.
12. Prepare client handoff notes.

---

## 11. Current MVP Status

As of October 11, 2026, the MVP is functionally near-finished and is in final QA / launch cleanup.

Completed core flow:

1. Customer registers.
2. Customer logs in.
3. Customer buys perfume or Tester Kit.
4. Customer chooses pickup or dropship.
5. Customer uploads payment proof.
6. Admin reviews payment.
7. Approved product order deducts stock.
8. Eligible active-member order earns points.
9. Admin ships and delivers product order.
10. Customer/member sees order history and earned points.
11. Customer applies for membership package.
12. Existing member purchases or upgrades package.
13. Customer uploads package payment proof.
14. Admin approves package payment.
15. Member tier is activated or preserved.
16. Package points are awarded.
17. Admin allocates package inventory.
18. Admin confirms package contents.
19. Admin ships/completes package fulfillment.
20. Member receives reward popup after approval.
21. Admin can reverse points manually if needed.
22. Member and admin dashboards reflect reversed points.
23. Admin monitors orders, inventory, sales, memberships, referrals, payouts, and points.

Main blockers before launch:

- Capture live Supabase SQL changes into migrations.
- Final client delivery fee confirmation.
- Final referral and payout QA.
- Final rejection flow QA.
- Final mobile/desktop console QA.
- Test data cleanup decision.
- Cloudflare deployment verification.
- Client handoff notes.