# YOUR PRODUCT Roadmap

Updated: October 1, 2026
Project start: September 22, 2026
Soft launch target: October 1, 2026
Final target: October 5, 2026

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

Technology stack:

- Vite
- Vanilla JavaScript
- Alpine.js
- Tailwind CSS
- Supabase Auth, Database, Storage, RPC

## 2. Locked Business Rules

### Pricing

- Regular/free customer perfume price: PHP 349 per bottle
- Regular customers can buy products through the normal checkout flow
- Approved member/reseller product price depends on approved package tier:
  - Starter / PHP 1,000 package: PHP 245 per bottle
  - Builder / PHP 5,000 package: PHP 227 per bottle
  - Leader / PHP 10,000 package: PHP 210 per bottle
  - Prestige / PHP 50,000 package: PHP 175 per bottle
- Universal PHP 199 member price is deprecated
- Product cards must not advertise PHP 199 as a universal reseller price
- Public product cards may show: reseller tiers from PHP 245 to PHP 175 per bottle
- Logged-in member dashboards may show the member's exact approved tier price
- Existing submitted order snapshots must not be changed retroactively

### Product Points

- Product points are based on perfume bottles only
- Points formula: bottles sold x 5 points
- Points apply only to delivered active-member product orders
- Minimum qualified member product order: 10 perfume bottles
- Example: 10 bottles x 5 points = 50 points
- Membership package bottles do not earn ledger points
- Physical inclusions such as tester kits, tarpaulins, and carts do not count as bottles for points
- Points must be awarded once only per qualified delivered order

### Membership Packages

Confirmed package prices and package math:

| Package | Price | Bottles | Retail Income | Potential Profit | Product Points |
|---|---:|---:|---:|---:|---:|
| Starter | PHP 1,000 | 4 | PHP 1,400 | PHP 400 | 20 |
| Builder | PHP 5,000 | 25 | PHP 8,750 | PHP 3,750 | 125 |
| Leader | PHP 10,000 | 50 | PHP 17,500 | PHP 7,500 | 250 |
| Prestige | PHP 50,000 | 240 | PHP 84,000 | PHP 34,000 | 1,200 |

Package computation:

- Retail income = bottles x PHP 350 SRP
- Potential profit = retail income - package price
- Product points = bottles x 5

Package inclusions:

- Starter: 4 bottles, or 1 tester kit plus 2 bottles
- Builder: 25 bottles, 1 tester kit, 1 roll-up tarpaulin, marketing support
- Leader: 50 bottles, 1 tester kit, 1 tarpaulin, marketing support
- Prestige: 240 bottles, 5 tester kits, official mobile perfume cart, roll-up tarpaulin, business unlock support

Package fulfillment rules:

- Package perfume bottles are company-assorted
- Admin must allocate the actual perfume bottle mix
- Package bottle stock must be deducted once only
- Tester kits, tarpaulins, and carts are physical inclusions and should be tracked if supply inventory is added
- Stickers are removed from package inclusions

### Orders and Payments

- No Cash on Delivery
- Payments are manual via e-wallet or bank transfer
- Customers upload payment proof
- Admin must verify payment before order processing
- Rejected or unverified orders do not deduct stock
- Approved payment moves order to processing
- Product stock is deducted only after admin payment approval
- Refunds remain manual company processing

### Delivery

- Metro Manila standard delivery fee: PHP 120
- Outside Metro Manila: customer can submit the website order and payment proof, then contact the Facebook page to arrange delivery fee and schedule
- Same-day delivery: settled through Facebook Messenger
- Same-day delivery is outside fixed system pricing for now
- Messenger-assisted sales must still be encoded as orders by admin if they need history, stock, and points records
- Prestige / PHP 50,000 package has free delivery and 5-day processing after payment approval

### Referrals and Payouts

- Direct referral only
- No binary, pairing, downline, team, or multi-level commission
- Direct membership referral commission: 10% of approved referred package fee
- Minimum payout request: PHP 500
- Company deducts 10% from every payout request
- Net payout is 90% of requested amount
- Payout request schedule: once per week, Friday 6:00 AM to 6:00 PM Philippine time
- Payout release target: following Wednesday or Thursday
- No automatic payout is included

## 3. Completed and Tested

### Frontend Foundation

- Responsive storefront
- Product collection UI
- Product quick view
- Cart UI
- Checkout UI
- Login page
- Register page
- Customer dashboard
- Admin dashboard
- FAQ page
- Terms page
- University page as coming soon / content page
- Footer links for University and Events
- Mobile and desktop layout builds pass

### Supabase Foundation

- Supabase project connected
- Auth login/register working
- Customer/admin route checks working
- Logout working for customer and admin
- Password reset flow present
- Profiles table used for roles and account status
- Products table used for live product availability, pricing, and stock
- Private payment proof upload flow working

### Product and Cart

- 20 product records seeded
- Regular product price locked at PHP 349
- Fixed universal member price PHP 199 is deprecated
- Tiered reseller pricing is active:
  - Starter: PHP 245
  - Builder: PHP 227
  - Leader: PHP 210
  - Prestige: PHP 175
- Cart blocks inactive products
- Checkout reads live product availability
- Checkout quote uses server-side tier pricing from `quote_order_cart`
- Dashboard/storefront use live product status
- M01 activated for testing with stock
### Customer Order Flow

Tested September 30 to October 1:

- Free customer can create order
- Customer can upload dummy payment screenshot
- Order appears in customer Order History
- Admin can view submitted payment proof
- Admin can reject payment
- Rejected order appears as Payment Rejected in customer dashboard
- Admin can approve payment
- Approved order moves to Processing
- Product stock deduction works after payment approval
- Admin can mark Processing order as Shipped
- Admin can mark Shipped order as Delivered
- Customer dashboard reflects updated order status after refresh

### Admin Review

- Admin membership review backend prepared and tested
- Admin membership approval/rejection UI connected
- Admin order payment review backend connected
- Admin order approve/reject UI connected
- Admin order review has payment verification checkbox
- Rejection requires admin note
- Approval requires payment proof and confirmation checkbox
- Admin order fulfillment RPC added: `admin_update_order_fulfillment`
- Allowed fulfillment transitions:
  - `processing` to `shipped`
  - `shipped` to `delivered`
- Fulfillment actions are admin-only and guarded server-side

### Inventory

- Admin can view products and inventory
- Admin can set stock
- Stock movement history exists
- Approved order deducts stock
- Rejected order does not deduct stock

## 4. Done but Needs UI Polish

Functional and already improved:

- Customer order status badges added
- Admin order status badges added
- Payment Rejected uses red badge
- Pending Verification uses amber/gold badge
- Processing uses blue/sky badge
- Shipped uses blue badge
- Delivered/Completed uses emerald badge

Still needs polish:

- Admin order drawer layout can still be cleaned up
- Delivery fee text can be clearer for pending/custom delivery
- Product inventory button label can become Add Stock / Update Stock if client prefers
- Admin dashboard still shows In Development label in some places

## 5. Pending MVP Tasks

### A. Order Fulfillment

Status: Core fulfillment flow is connected and committed.

Completed:

- Admin action: Processing to Shipped
- Admin action: Shipped to Delivered
- Customer dashboard shows latest status after refresh
- Delivered status is now available as the future trigger for points awarding

Still pending:

- Optional tracking/reference note
- Optional cancellation/refund flow
- Points awarding after delivered status

### B. Order Cancellation and Refund Handling

Needed after fulfillment:

- Decide cancellation rules per status
- Admin cancellation action
- Refund status notes
- If stock was already deducted, restore stock once only
- Prevent duplicate restore/deduct actions

### C. Points Ledger

Still pending:

- Create points transaction records
- Award 5 points per qualified delivered member bottle
- Award 10 points for delivered member Tester Kit
- Reverse points after cancellation/refund
- Show member points history
- Admin view of points history

### D. Referral Ledger

Still pending:

- Generate/display member referral code/link
- Save direct referral attribution during registration/application
- Create 10% commission record after referred member package is approved
- Prevent duplicate referral commission
- Show referral list and commission status in member dashboard

### E. Payout Requests

Still pending:

- Member payout request form
- Minimum PHP 500 validation
- One request per week, Friday 6 AM to 6 PM Asia/Manila
- 10% company deduction calculation
- Admin approve/reject/mark paid actions
- Payout request/history table
- CSV download for payout history

### F. Sales and Inventory Reports

Still pending:

- Sales totals by day/week/month
- Filter by status/customer type/date
- CSV download for sales
- CSV download for inventory movement history
- Keep this as simple CSV export, not full accounting system

### G. Membership Package Fulfillment

Partially present but still needs end-to-end QA:

- Membership application payment submission
- Admin approval activates member/reseller
- Package allocation status
- Package fulfillment status
- Package inventory/supply deduction
- Rejection/cancellation path
- Member dashboard updates after approval

### Membership QA Update

- Storefront package selection now shows a confirmation modal before continuing
- Logged-in customers are routed to the dashboard package application flow
- Free customer dashboard shows an upgrade prompt when no open membership application exists
- Membership payment proof submission works after enabling the payment control switch
- Admin membership approval works
- Approved customers become active members
- Member pricing PHP 199 reaches checkout correctly
- Admin customer list now has search and filters

### H. Manual Admin Order Entry

Needed for Messenger/same-day/offsite sales:

- Admin can create verified order for existing customer/member
- Admin enters customer, products, payment, delivery notes
- Stock deducts safely
- Order appears in customer/member history
- Delivered member orders can qualify for points
- Prevent duplicate manual entry

## 6. Supabase / Database Notes

Current important tables/functions include:

- `profiles`
- `products`
- `orders`
- `order_items`
- `membership_applications`
- `inventory_movements`
- `admin_review_membership_application`
- `admin_review_order_payment`
- `admin_update_order_fulfillment`
- `submit_order`

Important guards:

- Browser should not directly update protected order/member statuses
- Admin review should happen through RPC functions
- Order approval must require:
  - active admin
  - pending verification order
  - uploaded proof
  - verified payment checkbox
  - enough stock
- Rejection must require admin note
- Stock deduction must happen once only
- Fulfillment status changes must follow:
  - processing to shipped
  - shipped to delivered
- Future cancellation/refund must restore stock once only

## 7. Immediate Next Steps Toward October 5 MVP

The project is now in MVP lock mode. Prioritize only the features needed for the client to operate manually but safely. Avoid new large revisions unless they are required for order, payment, stock, membership, points, or payout correctness.

### Day 1: Finish Core Order Operations

Status: Completed October 1.

Completed:

1. Working order payment review flow committed.
2. Order status labels and badge colors polished.
3. Admin action added: Processing to Shipped.
4. Admin action added: Shipped to Delivered.
5. Customer Order History reflects updated statuses after refresh.
6. Approved orders deduct stock.
7. Rejected orders do not deduct stock.
8. SQL note added for `admin_update_order_fulfillment`.

Next checkpoint:

- Use Delivered status as the trigger for points in Day 3.

### Day 2: Finish Membership Activation and Member Pricing QA

Goal: A real customer can become an approved member/reseller and use member pricing.

1. Re-test membership application submission.
2. Re-test admin membership approval and rejection.
3. Confirm approved member profile updates:
   - `customer_type = member`
   - `membership_status = active`
4. Confirm approved member sees member/reseller pricing.
5. Confirm free customer still sees regular pricing.
6. Test member order checkout.
7. QA membership package allocation:
   - admin selects assorted perfume bottles
   - selected package inventory deducts safely
   - package fulfillment status updates correctly
8. Decide whether to enforce the 10-bottle member repeat-order minimum now or leave it documented for after MVP.

### Day 3: Points Ledger

Goal: Delivered member orders create points safely.

1. Create server-side points transaction flow.
2. Award 5 points per qualified delivered member perfume bottle.
3. Award 10 points for delivered member Tester Kit.
4. Do not award points for:
   - membership packages
   - rejected orders
   - pending orders
   - processing orders
   - cancelled/refunded orders
5. Show points balance in member dashboard.
6. Show points history in member dashboard.
7. Prevent duplicate points for the same delivered order.

### Day 4: Referral Commission and Payout Request

Goal: Member referral and manual payout records are usable.

1. Confirm member referral link display.
2. Save direct referral attribution.
3. Create 10% commission record after referred membership package approval.
4. Prevent duplicate referral commission.
5. Add member payout request form.
6. Enforce minimum PHP 500 payout request.
7. Apply 10% company deduction.
8. Enforce one payout request per week, Friday 6:00 AM to 6:00 PM Asia/Manila.
9. Add admin payout request review:
   - Pending
   - Approved
   - Rejected
   - Paid

### Day 5: Reports, QA, Deployment, and Handoff

Goal: Prepare the system for client demo and controlled launch.

1. Add simple CSV export for sales.
2. Add simple CSV export for payout request/history.
3. Final mobile QA:
   - Storefront
   - Checkout
   - Customer dashboard
   - Admin dashboard
4. Final desktop QA:
   - Storefront
   - Checkout
   - Customer dashboard
   - Admin dashboard
5. Confirm no console errors in core flows.
6. Confirm Supabase rules and admin-only actions are protected.
7. Deploy latest build.
8. Prepare handoff notes:
   - how to add stock
   - how to approve/reject orders
   - how to approve/reject memberships
   - how to mark shipped/delivered
   - how to review points and payouts

## 8. MVP Discipline

Until October 5, defer the following unless they block operations:

- Advanced cancellation automation
- Automatic 48-hour deletion cleanup
- Full accounting reports
- Advanced Excel workbook generation
- Auto payout
- Delivery fee calculator outside Metro Manila
- Real courier integration
- Complex charts
- UI redesigns beyond status clarity and usability
- New membership package revisions unless client marks them final

## 9. Current QA Checklist

Passed:

- Build succeeds
- Customer login works
- Admin login works
- Product live availability works
- Customer order submission works
- Payment proof upload works
- Admin proof viewing works
- Admin reject order works
- Admin approve order works
- Stock deduction works after approval
- Admin can mark order as shipped
- Admin can mark order as delivered
- Customer and admin order status badges render cleaner labels/colors

Still needs QA:

- Member/reseller order pricing
- 10-bottle member minimum if enforced
- Membership approval to active member
- Package fulfillment
- Points awarding
- Point reversal
- Referral commission
- Payout request
- CSV downloads
- Mobile final pass
- Supabase RLS/security review

## 10. Out of Scope / Later

Not included in MVP unless separately quoted:

- Automatic payment gateway
- Automatic payout
- Full accounting system
- Tax reports
- MLM/downline/binary/pairing
- Separate reseller stores
- Mobile app
- Automated raffle draw
- Advanced delivery fee calculator
- Real-time courier integration

## 11. Handoff Summary

Current status as of October 1:

Day 1 order operations are complete. Product orders can be submitted with payment proof, reviewed by admin, rejected or approved, stock deducts after approval, and approved orders can move Processing to Shipped to Delivered. Status badges are polished on customer and admin screens.

Next priority:

Day 2: membership activation, package allocation QA, and member/reseller pricing QA.

### Immediate Next Technical Task

- Build DB-backed package fulfillment:
  - confirm package allocation from admin
  - deduct allocated perfume bottle stock once
  - save package allocation to membership application
  - write inventory movement records
  - move fulfillment status to ready-for-packing
  - optionally track tester kit, tarpaulin, and cart supply stock if supply tables exist