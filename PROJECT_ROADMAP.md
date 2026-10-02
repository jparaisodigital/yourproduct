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
- Member-only points system
- Manual payout request flow
- Admin inventory and sales monitoring

**Technology stack:**
- Vite + Vanilla JavaScript + Alpine.js + Tailwind CSS
- Supabase Auth, Database, Storage, and RPC

## 2. Locked Business Rules

### Pricing

- Free customer: **PHP 349** per bottle
- Approved member/reseller tier pricing is based on approved package:
  - Starter package PHP 1,000 → **30% discount** → **PHP 245** per bottle
  - Builder package PHP 5,000 → **35% discount** → **PHP 227** per bottle
  - Leader package PHP 10,000 → **40% discount** → **PHP 210** per bottle
  - Prestige package PHP 50,000 → **50% discount** → **PHP 175** per bottle
- Universal PHP 199 member price is **deprecated**
- Public product cards may show reseller tiers from PHP 245 to PHP 175
- Logged-in approved members see their exact approved tier price
- Existing order snapshots are never changed retroactively

### Product Catalog

- Storefront has:
  - 1 standalone Tester Kit product
  - 20 perfume products
  - 4 membership packages
- Standalone Tester Kit:
  - Price: **PHP 700**
  - Includes 20 pcs 5ml assorted scents
  - Fixed price product
  - Reseller tier pricing does not apply
  - Buying the Tester Kit does **not** activate membership

### Membership Packages

| Package | Price | Discount | Reseller Price | Package Points |
|---|---:|---:|---:|---:|
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
- Package bottles are company-assorted
- Admin allocates actual perfume mix
- Stock is deducted once only after allocation confirmation
- Tester kits, tarpaulins, carts/stalls are tracked separately if supply inventory exists
- Membership package bottles and package inclusions do **not** earn separate product-order points

### Points

- Points are a **member-only benefit**
- Free customers can buy products and Tester Kit, but they do **not** earn points
- A customer becomes eligible for points only after approved membership package activation
- Package points are awarded once admin approves the membership package payment:
  - Starter: 20 points
  - Builder: 125 points
  - Leader: 250 points
  - Prestige: 1,200 points
- Product order points are awarded once admin approves the product order payment, if buyer is already an active member
- Perfume product formula: bottles × 5 points
- Minimum qualified perfume bottle order: 10 bottles
- Standalone Tester Kit: +10 points only if buyer is already an active member at approval time
- Points are awarded once only per qualified order or approved package
- Cancelled/refunded orders require point reversal once only

### Orders & Payments

- No COD
- Manual payment only
- Accepted methods: e-wallet or bank transfer
- Customer uploads payment proof
- Admin verifies payment before processing
- Stock deducted only after payment approval
- Rejected or unverified orders do not deduct stock
- Refunds are manual

### Customer Purchase Flow

- Guests can browse and add items to cart
- Account is required before checkout/payment proof submission
- Registered free customers can buy:
  - Perfume products at PHP 349
  - Standalone Tester Kit at PHP 700
- Approved members can buy:
  - Perfume products at their approved tier price
  - Standalone Tester Kit at fixed PHP 700
- Membership is activated only through approved Starter, Builder, Leader, or Prestige package

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

- 20 perfume products configured with official names and scent descriptions
- Standalone Tester Kit product added
- Regular customer PHP 349 pricing implemented
- Tester Kit fixed PHP 700 pricing implemented
- Tiered reseller pricing implemented
- Checkout and dashboard use approved package tier pricing
- Universal PHP 199 member price removed from active pricing behavior
- Cart blocks inactive or unavailable products
- Server-side product order quote via `quote_order_cart`

### Product Order Flow

- Guests can prepare cart
- Checkout requires registered account
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
- Starter package now shows Option A / Option B
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
- Points pages load Supabase data
- Admin points audit page exists
- Final points awarding logic must be aligned to new member-only/admin-approved rule

### Inventory

- Admin product inventory management exists
- Inventory movement history exists
- Add stock / deduct stock / set stock flow exists
- Stock is deducted safely on approved product orders
- Package allocation deducts inventory once only

### Reports

- Admin sales summary cards exist
- Sales detail CSV export exists
- Sales summary CSV export exists

## 4. Pending / Needs Confirmation

### Points Ledger Update

- Award package points once admin approves membership package payment
- Award product order points once admin approves qualified active-member product order payment
- Award 5 pts per qualified perfume bottle
- Award +10 pts for approved standalone Tester Kit orders only if buyer is active member
- Prevent duplicate point awards
- Reverse points once only on cancellation/refund

### Delivery Rules

- Final Metro Manila delivery behavior
- Outside Metro Manila checkout behavior
- Whether outside Metro Manila should be blocked before payment and redirected to Messenger
- Membership package delivery fee:
  - Starter / Builder / Leader PHP 120
  - Prestige free delivery
- Backend storage for delivery fee and total due if client wants full payment amount displayed and validated in checkout

### Order Cancellation / Refund

- Define cancellation rules per order status
- Admin cancel action
- Restore stock once only if already deducted
- Prevent duplicate restore or duplicate deduction
- Manual refund status tracking

### Reports

- Inventory movement CSV export if still needed
- Payout history CSV export if still needed

### Manual Admin Order Entry

- Admin-created orders for Messenger, same-day, or offsite sales
- Create verified order for existing customer
- Safe stock deduction
- Points eligibility for active member orders

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
- [ ] Guest add-to-cart flow
- [ ] Free customer product checkout at PHP 349
- [ ] Free customer Tester Kit checkout at PHP 700
- [ ] Active member product checkout with correct tier price
- [ ] Active member Tester Kit checkout stays PHP 700
- [ ] Admin product order approval
- [ ] Product stock deduction after approval
- [ ] Membership application payment proof upload
- [ ] Starter package Option A / Option B display
- [ ] Admin membership approval
- [ ] Approved member tier pricing applied
- [ ] Package points awarded after admin approval
- [ ] Product order points awarded only for active members after admin approval
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

1. Update points awarding logic to member-only/admin-approved rule
2. Confirm final delivery fee and outside Metro Manila checkout rules with client
3. Finish delivery fee UI/backend behavior after confirmation
4. Add cancellation/refund + stock restore safeguards
5. Add manual admin order entry if still needed for MVP
6. Clean test data
7. Full live QA
8. Push final deployment
9. Prepare handoff notes
