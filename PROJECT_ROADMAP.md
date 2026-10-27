# YOUR PRODUCT Roadmap

**Updated:** October 19, 2026
**Project start:** September 22, 2026  
**Current phase:** Final full-system QA, deployment verification, and client handoff
**Deployment target:** Netlify (manual `dist` deployment)
**Current branch:** `theme/quiet-luxury-refresh`

---

## 1. Current Project Status

YOUR PRODUCT is a perfume e-commerce, membership, referral, points, rewards, payout, inventory, sales, and admin/staff management system.

The MVP and the client's latest requested revisions are implemented. Development is now at the final QA stage. No major client-requested feature is currently pending.

The remaining work is primarily:

- Full desktop QA with browser console open
- Full mobile QA with browser console open
- Final production/deployment verification
- Final Supabase/live-data verification
- Test-data cleanup decision
- Client handoff notes
- One real payout submission QA during the allowed payout schedule

The production payout schedule remains Saturday, 10:00 AM–8:00 PM Manila time. This rule should not be bypassed just for testing.

---

## 2. Latest Important Commits

Recent locked-in revisions include:

- `ec37b33` — `feat: add staff role with limited admin access and personal referrals`
- `bce9e85` — `feat: add 12 percent payout deduction and net payout display`
- `593bd6c` — `feat: rename Business Center to Your Events`

Earlier completed work includes checkout, membership, points, referral, payout, inventory, sales, fulfillment, saved address, delivery-fee, theme, and UI/UX improvements.

### Current Git note

After commit `593bd6c`, the only remaining unstaged modification was:

- `src/main.js`

This is a pre-existing unrelated modification and was intentionally excluded from the latest client-revision commits.

---

## 3. Technology Stack

- Vite
- Vanilla JavaScript
- Alpine.js
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase RPC
- Netlify for current manual production deployment of built `dist`

---

## 4. Core Business Rules

### Registration & Auth

- Customers can register and log in.
- Checkout/payment proof submission requires a registered account.
- Admin and Staff accounts use the Admin dashboard.
- Admin storefront preview blocks purchase actions.
- Referral codes use `profiles.username`.

### Roles

#### Admin

Admin has full management access, including:

- Overview
- Membership applications
- Orders and payment review
- Fulfillment
- Sales and inventory
- Customers
- Admin-wide referrals and payouts
- Points & Rewards monitoring
- Manual point reversal
- Personal referral link
- Personal referral commission
- Personal payout request

Admin can earn direct referral commission from qualified referred membership purchases but does **not** earn referral points.

#### Staff

Staff is an operational helper role with restricted permissions.

Staff can:

- View Overview
- View/review membership applications
- View/review product orders and payments
- Manage fulfillment
- View customers
- View/update product stock and availability
- Use a personal referral link
- Earn personal referral commission
- Submit a personal payout request

Staff cannot:

- Access Admin-wide Referrals & Payouts
- Approve/reject other users' payouts
- Access Admin Points & Rewards management
- Manually award/reverse points
- View other users' commissions
- View other users' payout requests
- Manage Staff/Admin accounts
- Use full Admin-only controls

Staff can earn referral commission but does **not** earn referral points.

#### Customer / Member

- Free customers can purchase products and Tester Kit.
- Approved members receive tier pricing and qualified member benefits.
- Active members can earn qualified product/package points.
- Eligible members can use personal referrals and payouts.

---

## 5. Pricing

| Customer Type | Price Rule |
| --- | ---: |
| Free customer | PHP 349 per perfume bottle |
| Starter member | PHP 245 per perfume bottle |
| Builder member | PHP 227 per perfume bottle |
| Leader member | PHP 210 per perfume bottle |
| Prestige member | PHP 175 per perfume bottle |
| Tester Kit | Fixed PHP 700 |

Rules:

- Universal PHP 199 member pricing is deprecated.
- Approved members use their highest active approved tier.
- Repeat/lower package purchases do not downgrade the active tier.
- Existing order snapshots are not changed retroactively.
- Tester Kit remains fixed at PHP 700 and is protected by server-side quote logic.

---

## 6. Product Catalog & Membership Packages

### Catalog

- 20 perfume products
- 1 standalone Tester Kit
- 4 membership packages

### Tester Kit

- SKU: `TK01`
- Price: PHP 700
- Includes 20 pcs 5ml assorted scents
- Does not activate membership
- Member discount does not apply
- Earns points only when purchased by an already active member

### Membership Packages

| Package | Price | Discount | Reseller Price | Package Points |
| --- | ---: | ---: | ---: | ---: |
| Starter | PHP 1,000 | 30% | PHP 245 | 20 |
| Builder | PHP 5,000 | 35% | PHP 227 | 125 |
| Leader | PHP 10,000 | 40% | PHP 210 | 250 |
| Prestige | PHP 50,000 | 50% | PHP 175 | 1,200 |

Starter options:

- Option A: 4 assorted bottles
- Option B: 1 tester kit + 2 assorted bottles

Other inclusions:

- Builder: 25 assorted bottles + 1 tester kit
- Leader: 50 assorted bottles + 1 tester kit + 1 tarpaulin
- Prestige: 240 assorted bottles + tester kits + tarpaulin + mobile cart/stall support

Fulfillment rules:

- Package bottles are company-assorted.
- Admin/authorized Staff allocates the actual perfume mix.
- Inventory deducts once only after package content confirmation.
- Fixed inclusions are tracked separately where inventory exists.
- Package contents do not earn separate product-order points.
- Package points are awarded once after approved membership/package payment.

Repeat purchase rules:

- Approved members can buy another package or upgrade.
- Lower/repeat purchases do not downgrade the highest approved tier.
- Full package points are still awarded for an approved repeat purchase.
- Current member pricing remains active while another package is under review.

---

## 7. Points & Rewards

- Points are primarily a member benefit.
- Free customers do not earn product-order points.
- Active members earn points from qualified approved product orders.
- Package points are awarded after membership/package payment approval.
- Perfume bottle formula: quantity × 5 points.
- Standalone Tester Kit formula: quantity × 10 points.
- No minimum product order is required for points.
- Duplicate point awards are backend-protected.
- Admin can reverse eligible confirmed points for refunds/corrections.
- Reversal requires an admin note and confirmation.
- Reversal creates a negative transaction and preserves the original transaction for audit history.
- Duplicate reversal is backend-protected.
- Admin and Staff referral commissions do not award referral points.

---

## 8. Orders, Payments, Delivery & Fulfillment

### Product Orders

- No COD.
- Manual payment only.
- E-wallet/bank transfer supported.
- Payment proof is required.
- Admin/authorized Staff reviews payment.
- Stock deducts only after approval.
- Rejected/unverified orders do not deduct stock.
- Rejection notes are visible to customers/members.
- Approved orders can move through fulfillment to shipped/delivered.

### Delivery

Pickup:

- Pickup address: 1244 Gen. Jacinto St, Makati City, Metro Manila
- Pickup delivery fee: PHP 0

Current product checkout delivery rules:

- Pickup: PHP 0
- Metro Manila SPX/standard: PHP 120
- Metro Manila same-day: PHP 150
- Outside Metro Manila: manual/Messenger arrangement

Delivery fees remain separate from membership package price so referral commission is based on the package amount only.

---

## 9. Referral System

### Locked Referral Rules

- Direct one-level referral only.
- No MLM, binary, pairing, downline, or multi-level commission.
- Referral commission is 10% of the approved referred membership package amount.
- Delivery fees are excluded from referral commission.
- Referral commission is duplicate-protected.
- Referral codes use `profiles.username`.

Eligible referrers include:

- Active approved Customer Members
- Active Admin
- Active Staff

Admin and Staff receive commission only; they do not receive referral points.

### Verified Admin Referral QA

A real test was completed using Admin referral code `test`:

- Referred account: `test16@gmail.com`
- Referred purchase: PHP 50,000 Prestige membership
- Referred member received: 1,200 package points
- Admin referral commission: PHP 5,000 (10%)
- Admin referral points: none
- Admin personal earnings displayed the PHP 5,000 available commission correctly

### Staff Referral QA

- Staff account can access its personal referral/payout page.
- Staff referral link is accepted during registration.
- Backend referral eligibility includes active Staff.
- Staff is isolated from Admin-wide referral and payout management.

---

## 10. Payout System

### Eligibility & Schedule

Eligible payout users include qualified active Members, Admin, and Staff for their own referral earnings.

Current live rules:

- Minimum payout request: **PHP 100 gross**
- Payout request schedule: **Saturday, 10:00 AM–8:00 PM Manila time**
- Required payout details include payment method/provider, account name/number, and QR screenshot as applicable.
- Admin manually reviews and releases payouts.
- No automatic payout.

### 12% Payout Deduction

New payout requests use:

- `amount` = gross/requested amount
- `deduction_rate` = 12%
- `deduction_amount` = gross × 12%
- `net_amount` = gross − deduction

Example:

- Gross request: PHP 1,000
- 12% deduction: PHP 120
- Net payout to send: PHP 880

Important accounting rule:

- The full gross amount is reserved/deducted from available referral earnings.
- Admin sends the `net_amount`.
- Historical payouts are not retroactively charged the new 12% deduction.
- Legacy payout rows with no `net_amount` are displayed using their original gross amount.

### Payout UI

Member and Admin/Staff personal payout forms display live:

- Requested Amount
- 12% Deduction
- Net Payout

Admin payout review also displays:

- Gross Request
- 12% Deduction
- Net Payout / Amount to Send

The mark-paid flow emphasizes that Admin should send the net payout amount before marking a request as paid.

### Remaining Payout QA

The actual new payout submission under the 12% system still needs one end-to-end test during the allowed Saturday 10:00 AM–8:00 PM Manila window. The production schedule was intentionally not bypassed.

---

## 11. Admin & Staff Permission Architecture

### Strict Admin-only backend controls

Sensitive controls remain Admin-only, including:

- `admin_award_order_points`
- `admin_reverse_points_transaction`
- `admin_update_payout_request`
- Admin-wide payout/referral visibility
- Admin-wide points visibility/management

### Admin-or-Staff operational controls

Operational functions allow active Admin or Staff where appropriate, including:

- Membership review
- Product order payment review
- Order fulfillment
- Membership package fulfillment
- Package allocation confirmation
- Product stock/availability updates

The helper `private.is_active_admin_or_staff()` is used for authorized operational access while the strict `private.is_active_admin()` helper remains unchanged for sensitive Admin-only actions.

### RLS

Additive Staff SELECT policies exist for operational data such as:

- Orders
- Order items
- Membership applications
- Profiles
- Products
- Payment proofs
- Inventory movements

Sensitive broad payout, referral commission, and points visibility remains Admin-only. Staff personal payout/referral access is restricted to own rows through `auth.uid()`-based policies.

---

## 12. Completed Core Features

### Foundation

- Responsive storefront
- Product collection and quick view
- Cart drawer
- Checkout
- Login/register
- Forgot/reset password
- Customer/member dashboard
- Admin dashboard
- Staff dashboard access through restricted Admin UI
- FAQ
- Terms
- University
- Your Events page
- Supabase Auth/Database/Storage/RPC foundation
- Customer/Admin logout flows
- Mobile navigation cleanup
- Admin storefront preview purchase blocking

### Storefront & Checkout

- Guest browsing/add-to-cart
- Login/register gate before final checkout
- Correct free/member tier pricing
- Tester Kit fixed pricing
- Inactive product protection
- Saved profile/default-address checkout prefill
- Payment proof upload
- Pickup and dropship flows
- Server-side order quote
- Product images in order-item snapshots
- Delivery-fee persistence
- Correct dashboard navigation after checkout

### Product Orders

- Admin/Staff operational order visibility
- Payment proof preview
- Payment approval/rejection
- Rejection notes
- Safe stock deduction
- Shipped/delivered fulfillment
- Order history
- Points display
- Sales integration

### Membership

- New membership application
- Repeat package purchase
- Upgrade flow
- Lower/repeat purchase tier protection
- Payment proof upload
- Approval/rejection
- Membership activation
- Package points
- Package reward popup
- Unpaid application cancellation
- Package inclusions/image preview
- Metro Manila city dropdown

### Package Fulfillment

- Package allocation
- Content confirmation
- One-time inventory deduction
- Ready for packing/shipping
- Shipped/completed statuses
- Fixed inclusion display

### Referrals & Payouts

- Member referral links
- Admin referral link
- Staff referral link
- Active Admin/Staff referral eligibility
- 10% direct referral commission
- Duplicate commission protection
- Personal earnings pages
- Personal payout request flow
- Admin-wide payout review
- Payout approval/rejection/mark-paid
- Payout proof storage
- 12% payout deduction
- Gross/deduction/net display

### Points & Rewards

- Real `points_transactions`
- Package point awards
- Product order point awards
- Duplicate protection
- Member points history
- Admin points audit
- Point reversal with audit trail
- Correct reversed totals
- Reward journey/catalog UI

### Inventory & Sales

- Product inventory management
- Inventory movement history
- Add/deduct/set stock
- Safe order stock deduction
- Package allocation stock deduction
- Sales summaries
- Daily/weekly/monthly totals
- CSV exports

### UI / UX

- Quiet Luxury Black & Champagne theme
- Landing loader
- Package loaders
- Custom confirmation modals
- Mobile dashboard/sidebar cleanup
- Membership popup
- Package scroll offsets
- Customer support chat
- Business Center visible branding renamed to **Your Events** while retaining the internal `/business-center/` route for stability

---

## 13. Important Supabase / Database Status

### Important Tables

`profiles`

- id
- email
- role (`customer`, `admin`, `staff`)
- customer_type
- membership_status
- account_status
- selected_package_id
- username
- first_name
- last_name
- mobile_number
- saved/default address fields

`orders`

- order/customer/status fields
- customer and delivery details
- payment method/proof
- subtotal/delivery fee
- admin note
- review/payment timestamps
- fulfillment timestamps

`order_items`

- order/product references
- product snapshot/name/image
- quantity
- unit price

`membership_applications`

- customer/package references
- selected option
- status/payment proof
- package allocation
- inventory-deducted flag
- fulfillment status
- approval/activation timestamps

`points_transactions`

- customer/order/membership references
- points/type/status
- description
- created_by
- reversal link
- admin note

`payout_requests`

Important payout fields now include:

- `amount` — gross amount
- `deduction_rate`
- `deduction_amount`
- `net_amount`
- payout/account details
- status/review/payment metadata

### Important RPCs

- `quote_order_cart`
- `submit_order`
- `admin_review_order_payment`
- `admin_update_order_fulfillment`
- `admin_review_membership_application`
- `customer_submit_membership_payment`
- `customer_cancel_membership_application`
- `restart_membership_application`
- `admin_confirm_package_allocation`
- `admin_set_product_active`
- `admin_set_product_stock`
- `admin_update_membership_package_fulfillment`
- `admin_award_order_points`
- `admin_reverse_points_transaction`
- `lookup_referral_member`
- `create_referral_commission_for_application`
- `customer_create_payout_request`
- `admin_update_payout_request`

---

## 14. QA Already Passed / Verified

### Build

Latest production build after the client's final revision:

- Vite 8.3.0
- 171 modules transformed
- Build completed successfully
- No build errors
- Latest measured build time: 496ms

### Auth

- Customer registration/login
- Approved member login
- Admin login
- Staff login/dashboard access
- Customer/Admin logout

### Storefront / Checkout

- Free customer pricing
- Member tier pricing
- Prestige tier preservation
- Tester Kit fixed price
- Payment proof upload
- Checkout confirmation
- Pickup flow
- Product order submission
- Saved profile/address prefill
- Delivery fee saving

### Orders

- Approval/rejection
- Rejection note visibility
- Stock deduction
- Shipped/delivered flow
- Sales reporting
- Order history
- Awarded points display

### Membership

- Package selection
- Inclusions/image preview
- New/repeat/upgrade purchase
- Proof upload
- Approval
- Package points
- Reward popup
- Cancellation
- Tier preservation
- Package city dropdown
- Package allocation and fulfillment

### Points

- Free customer receives no product points
- Active member perfume points
- Active member Tester Kit points
- Package points
- Real balance/history
- Admin audit
- Point reversal
- Negative reversal transaction
- Duplicate reversal protection

### Referral / Staff / Admin Revision QA

- Admin personal referral link works
- Admin referral registration attribution works
- Admin received correct 10% commission in live test
- Admin received no referral points
- Admin personal earnings UI works
- Staff role access works
- Staff restricted navigation works
- Staff personal referral/payout page works
- Staff referral link is accepted during registration
- Staff cannot access protected Admin-only points/payout management

### 12% Payout Revision QA

- Admin/Staff personal payout preview works
- Member payout preview works
- PHP 1,000 correctly displays PHP 120 deduction and PHP 880 net payout
- Admin-wide payout cards support gross/deduction/net
- Mark-paid modal emphasizes net amount to send
- Legacy payout display is protected
- Build passed after implementation

### Your Events Revision QA

- Site config visible label changed to `Your Events`
- Business Center page title changed to `Your Events`
- Page heading/eyebrow changed to `Your Events`
- Dashboard visible label changed to `Your Events`
- Internal `/business-center/` route intentionally retained
- Source search found no remaining visible `Business Center` / `BUSINESS CENTER` text under `src`
- Production build passed

---

## 15. Final QA Checklist

The system is now in whole-system QA rather than feature development.

### Desktop Core Flow

- [ ] Open full production-like build on desktop
- [ ] Keep browser console open throughout
- [ ] Landing/navigation
- [ ] Register/login/logout
- [ ] Guest cart
- [ ] Free-customer checkout
- [ ] Member checkout and tier pricing
- [ ] Tester Kit
- [ ] Pickup/dropship
- [ ] Payment proof
- [ ] Order approval/rejection
- [ ] Fulfillment
- [ ] Membership new/repeat/upgrade
- [ ] Package fulfillment
- [ ] Points award/reversal
- [ ] Member referral
- [ ] Admin referral
- [ ] Staff referral
- [ ] Personal earnings pages
- [ ] Admin-wide payout management
- [ ] Inventory
- [ ] Sales reports/CSV
- [ ] Your Events navigation
- [ ] Confirm no blocking console errors

### Mobile Core Flow

- [ ] Repeat critical customer/member flows on mobile viewport/device
- [ ] Verify sidebar/navigation
- [ ] Verify modals and scrolling
- [ ] Verify forms and payment-proof uploads
- [ ] Verify order/package cards
- [ ] Verify points/referral/payout pages
- [ ] Verify Your Events navigation
- [ ] Confirm no blocking console errors

### Role QA

- [ ] Admin full-access regression pass
- [ ] Staff operational-access regression pass
- [ ] Confirm Staff cannot access Admin-wide Referrals & Payouts
- [ ] Confirm Staff cannot access Points & Rewards admin management
- [ ] Confirm Staff cannot call sensitive Admin-only actions
- [ ] Customer/member permissions regression pass

### Payout QA

Already UI/backend-reviewed, but one production-schedule test remains:

- [ ] During Saturday 10AM–8PM Manila time, submit a fresh payout request
- [ ] Confirm gross amount stored correctly
- [ ] Confirm 12% deduction stored correctly
- [ ] Confirm net amount stored correctly
- [ ] Confirm full gross amount is reserved from referral earnings
- [ ] Approve payout as Admin
- [ ] Confirm Admin sees correct net amount to send
- [ ] Mark paid and verify commission/payout statuses
- [ ] Verify payout proof/QR behavior

### Production / Handoff

- [ ] Review Supabase production settings
- [ ] Verify no service-role key is exposed in frontend
- [ ] Verify final environment variables
- [ ] Confirm production Site URL / Auth redirects
- [ ] Decide whether test data should be retained or cleaned
- [ ] Confirm live SQL changes are documented/captured for handoff
- [ ] Push final intended source changes to GitHub
- [ ] Deploy latest `dist` to Netlify
- [ ] Run production smoke test
- [ ] Prepare client handoff notes

---

## 16. Security Hardening Status

Completed protections include:

- RLS on important public tables
- Own-row customer/member access
- Restricted profile updates
- Role/account/tier authority fields protected
- Admin-only sensitive controls
- Additive Staff operational policies
- Private payment/payout storage
- Restricted customer/member uploads
- Server-side product pricing
- Server-side stock checks
- Tester Kit fixed-price protection
- Order status transition protection
- Payment-proof requirement
- Duplicate points protection
- Duplicate referral commission protection
- Payout status transition protection
- Point reversal protection
- `.env` / `.env.local` excluded from Git
- No frontend service-role key

Before handoff, run one final security regression pass against Admin, Staff, Member, and unauthenticated users.

---

## 17. Out of Scope Unless Client Requests a New Quotation

- Automatic payment gateway
- Automatic payout
- Full accounting/tax reporting
- MLM / multi-level / binary / pairing logic
- Real courier integration
- Advanced delivery calculator
- Full reward redemption backend
- Reward request approval and points reservation/deduction backend
- Mobile app
- Major post-launch UI redesign
- Complex analytics dashboards
- Individual reseller stores
- Automated raffle draw
- Full Admin activity-log UI
- Exportable full audit-report system
- Any new feature outside the approved current MVP/revision scope

---

## 18. Immediate Next Steps

Recommended order from this point:

1. Run full desktop QA with console open.
2. Run full mobile QA with console open.
3. Run Admin/Staff/Member permission regression QA.
4. Verify Supabase production settings and live SQL state.
5. Perform the scheduled real payout test on Saturday, 10AM–8PM Manila time.
6. Decide on test-data cleanup.
7. Push final intended source changes to GitHub.
8. Deploy latest `dist` to Netlify.
9. Run final production smoke test.
10. Prepare client handoff notes.

No additional feature development should be started unless QA exposes a real regression or the client submits a new scope/revision.

---

## 19. Current MVP Status — October 19, 2026

**Development status: Feature-complete for the current agreed scope and latest client revisions.**

The complete working flow now covers:

1. Customer registration/login.
2. Product/Tester Kit purchase.
3. Pickup/dropship and delivery-fee handling.
4. Payment-proof submission.
5. Admin/Staff operational payment review.
6. Safe stock deduction.
7. Member product points.
8. Order fulfillment.
9. Membership application/package purchase.
10. Repeat/lower/upgrade package handling without tier downgrade.
11. Package points.
12. Package allocation and fulfillment.
13. Direct 10% referral commission.
14. Member personal referral earnings and payout.
15. Admin personal referral earnings and payout.
16. Staff personal referral earnings and payout.
17. Admin-only payout management.
18. 12% payout deduction and net-payout calculation.
19. Member/Admin points audit and Admin reversal controls.
20. Inventory and sales reporting.
21. Restricted Staff operational role.
22. Your Events branding in place of Business Center.

### Current launch blockers

There are no known unfinished client-requested feature blockers at this point.

Remaining launch work is QA/deployment/handoff work:

- Full desktop QA
- Full mobile QA
- Permission regression QA
- One scheduled real payout submission QA
- Production configuration verification
- Test-data decision
- Netlify deployment verification
- Client handoff

---

## 20. Theme Upgrade Safety Notes

### Original Theme Backup

Before the Quiet Luxury Black & Champagne upgrade, the previous working theme was saved in Git using:

`chore: save current theme before luxury refresh`

Keep this rollback point until the current theme and production build are fully accepted.

### Current Theme

`Quiet Luxury Black & Champagne`

Goal:

- Premium perfume-brand presentation
- Less gradient-heavy
- Less template/vibe-coded appearance
- Cleaner editorial hierarchy
- Consistent dark luxury styling across storefront, customer/member dashboard, and Admin/Staff dashboard

### Rollback Rule

If a theme regression appears during final QA, fix the specific regression first. Use the saved pre-refresh commit only if a full theme rollback is actually required.
