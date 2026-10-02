# YOUR PRODUCT Roadmap

**Updated:** October 2, 2026  
**Project start:** September 22, 2026  
**Soft launch target:** October 1, 2026  
**Final target:** October 5, 2026

## 1. Project Summary

YOUR PRODUCT is a perfume e-commerce and membership system with:

- Public storefront
- Customer registration and login
- Free customer and approved member/reseller pricing
- Product checkout with manual payment proof
- Admin payment review for orders
- Membership application and admin approval
- Personal one-level referral links
- Points system for qualified member repeat purchases
- Manual payout request flow
- Admin inventory and sales monitoring

**Technology stack:**
- Vite + Vanilla JavaScript + Alpine.js + Tailwind CSS
- Supabase Auth, Database, Storage, and RPC

## 2. Locked Business Rules

### Pricing

- Free customer: **PHP 349** per bottle
- Approved member/reseller tier pricing:
  - Starter (PHP 1,000 package) → **PHP 245**
  - Builder (PHP 5,000 package) → **PHP 227**
  - Leader (PHP 10,000 package) → **PHP 210**
  - Prestige (PHP 50,000 package) → **PHP 175**
- Universal PHP 199 member price is **deprecated**
- Public product cards may show reseller tiers from PHP 245 to PHP 175
- Logged-in members see their exact approved tier price
- Existing order snapshots are never changed retroactively

### Membership Packages

| Package | Price | Bottles | Reseller Price |
|---|---:|---:|---:|
| Starter | PHP 1,000 | 5 | PHP 245 |
| Builder | PHP 5,000 | 25 | PHP 227 |
| Leader | PHP 10,000 | 55 | PHP 210 |
| Prestige | PHP 50,000 | 240 | PHP 175 |

**Inclusions:**
- Starter: 5 assorted bottles
- Builder: 25 assorted bottles + 1 tester kit
- Leader: 55 assorted bottles + 1 tester kit + 1 tarpaulin
- Prestige: 240 assorted bottles + 2 tester kits + 1 tarpaulin + 1 mini stall
- Stickers removed from inclusions

**Fulfillment rules:**
- Package bottles are company-assorted
- Admin allocates actual perfume mix
- Stock is deducted once only after allocation confirmation
- Tester kits, tarpaulins, and mini stalls are tracked separately if supply inventory exists
- Membership package bottles do **not** earn product-order points

### Product Points

- Points are awarded once admin approves the payment/order.
- Product order points apply only to perfume bottles and approved standalone tester kit orders.
- Perfume bottle formula: bottles × 5 points.
- Minimum qualified perfume bottle order: 10 bottles.
- Standalone Tester Kit: +10 points when approved by admin.
- Membership package points are awarded once admin approves the package payment:
  - Starter: 20 points
  - Builder: 125 points
  - Leader: 250 points
  - Prestige: 1,200 points
- Points are awarded once only per qualified order or approved package.
- Cancelled/refunded orders require point reversal once only.
- Tester kits and bottles included inside membership packages are covered by package points and do not earn separate product-order points.

### Orders & Payments

- No COD
- Manual payment only
- Accepted methods: e-wallet or bank transfer
- Customer uploads payment proof
- Admin verifies payment before processing
- Stock deducted only after payment approval
- Rejected or unverified orders do not deduct stock
- Refunds are manual

### Delivery

- Metro Manila: PHP 120
- Outside Metro Manila: pending final client flow
- Recommended outside Metro Manila flow: redirect customer to Facebook Messenger before payment
- Same-day delivery: arranged via Messenger
- Membership delivery rule pending final client confirmation:
  - Starter / Builder / Leader may add PHP 120
  - Prestige may include free delivery
- Delivery fee must stay separate from package price so referral commission remains based on package amount only

### Referrals & Payouts

- Direct referral only
- No downline, binary, pairing, or multi-level commissions
- Commission: 10% of approved referred membership package amount
- Commission excludes delivery fees
- Minimum payout request: PHP 500
- Payout request requires payout method, provider/bank, account name, account number, and QR code screenshot
- Admin manually reviews and pays payout requests
- Admin payment proof is stored in Supabase Storage
- No automatic payout

## 3. Completed Features as of Oct 2, 2026

### Core Foundation

- Responsive storefront, product collection, quick view, cart, and checkout
- Login, register, forgot password, and reset password
- Customer dashboard
- Admin dashboard
- FAQ, Terms, University, and supporting pages
- Supabase Auth, profiles, products, storage, and RPC foundation

### Product & Pricing

- 20 products seeded
- Regular customer PHP 349 pricing implemented
- Tiered reseller pricing implemented
- Checkout and dashboard use approved package tier pricing
- Universal PHP 199 member price removed from active pricing behavior
- Cart blocks inactive or unavailable products
- Server-side product order quote via `quote_order_cart`

### Product Order Flow

- Free customers and members can place product orders
- Checkout pre-fills customer profile details
- Payment proof upload works
- Admin can view payment proof
- Admin can approve or reject order payments
- Stock deduction is guarded and happens only after approval
- Order fulfillment statuses are connected
- Admin fulfillment RPC exists for order status updates

### Membership Flow

- Customer can apply for membership package
- Customer can upload membership payment proof
- Admin can approve, reject, or manage membership applications
- Approved applications activate member account
- Approved package tier controls reseller price
- Package fulfillment supports:
  - allocation
  - inventory deduction
  - ready for packing
  - shipped
  - completed
- Admin package fulfillment copy now clearly shows next steps and confirmed contents

### Referrals & Payouts

- Active members have personal referral links
- Referral code uses `profiles.username`
- Registration validates referral links against active member profiles
- Direct referral commission is created after approved membership package
- Commission is duplicate-protected
- Member earnings page loads real referral commission rows
- Member payout request uses Supabase RPC
- Payout request collects provider/bank and QR code screenshot
- Admin referrals and payouts page loads real referral and payout data
- Admin can approve, reject, and mark payout as paid
- Admin payout proof uploads use Supabase Storage instead of blob URLs

### Points

- Points transaction table exists
- Admin guarded order points awarding UI exists
- Points pages load Supabase data
- Points rule remains product-order only
- Final end-to-end points QA still needed before launch

### Inventory

- Admin product inventory management exists
- Inventory movement history exists
- Stock is deducted safely on approved product orders
- Package allocation deducts inventory once only

### Supabase Notes

- Supabase notes created for:
  - tiered reseller pricing
  - points ledger
  - package fulfillment
  - referral commissions and payouts

## 4. Pending / Needs Confirmation

### Delivery Rules

- Final Metro Manila delivery behavior
- Outside Metro Manila checkout behavior
- Whether outside Metro Manila should be blocked before payment and redirected to Messenger
- Membership package delivery fee:
  - Starter / Builder / Leader PHP 120
  - Prestige free delivery
- Backend storage for delivery fee and total due if client wants full payment amount displayed and validated in checkout

### Points QA

- Confirm delivered product order points awarding end-to-end
- Confirm duplicate prevention
- Confirm member points balance/history display
- Confirm admin points audit display

### Order Cancellation / Refund

- Define cancellation rules per order status
- Admin cancel action
- Restore stock once only if already deducted
- Prevent duplicate restore or duplicate deduction
- Manual refund status tracking

### Reports

- Sales CSV export
- Inventory movement CSV export
- Payout history CSV export

### Manual Admin Order Entry

- Admin-created orders for Messenger, same-day, or offsite sales
- Create verified order for existing customer
- Safe stock deduction
- Points eligibility for delivered member orders

### Final Launch Cleanup

- Remove test accounts if needed
- Remove test orders
- Remove test membership applications
- Remove test payout requests
- Remove test commissions
- Preserve admin account, products, schema, RPC functions, storage buckets, and policies

## 5. Launch QA Checklist

- [ ] Register without referral link
- [ ] Register with valid referral link
- [ ] Login / logout
- [ ] Free customer product checkout at PHP 349
- [ ] Active member product checkout with correct tier price
- [ ] Admin product order approval
- [ ] Product stock deduction after approval
- [ ] Product order delivered status
- [ ] Points awarded for qualified delivered member product order
- [ ] Membership application payment proof upload
- [ ] Admin membership approval
- [ ] Approved member tier pricing applied
- [ ] Package allocation and inventory deduction
- [ ] Package ready for packing
- [ ] Package shipped and completed status
- [ ] Referral commission creation
- [ ] Member payout request with QR code
- [ ] Admin payout approve / reject / mark paid
- [ ] Admin payout proof opens correctly
- [ ] No console errors on core flows
- [ ] Mobile final pass
- [ ] Desktop final pass
- [ ] Live Cloudflare deployment check

## 6. Out of Scope Until After Oct 5

- Automatic payment gateway
- Automatic payout
- Full accounting / tax reports
- MLM, multi-level, binary, or pairing logic
- Real courier integration
- Advanced delivery calculator
- Mobile app
- Major UI redesigns beyond clarity fixes
- Complex charts and analytics dashboards

## 7. Immediate Next Steps

1. Confirm final delivery fee and outside Metro Manila checkout rules with client
2. Finish delivery fee UI/backend behavior after confirmation
3. Complete points awarding end-to-end QA
4. Add cancellation/refund + stock restore safeguards
5. Add simple CSV reports
6. Add manual admin order entry if still needed for MVP
7. Clean test data
8. Full live QA
9. Push final deployment
10. Prepare handoff notes