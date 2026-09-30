# YOUR PRODUCT Roadmap

Updated: September 30, 2026  
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

- Regular/free customer perfume price: PHP 350 per bottle
- Approved member/reseller perfume price: PHP 199 per bottle
- Old PHP 175 member price and 50% off claims are deprecated
- Existing submitted order snapshots must not be changed retroactively

### Membership Packages

Confirmed package prices:

- Starter: PHP 1,000
- Builder: PHP 5,000
- Leader: PHP 10,000
- Prestige: PHP 50,000

Package rules:

- Membership package bottles do not earn points
- Package inclusions are company-assorted
- Final inclusion details must follow the latest approved client posters/rules
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

- Metro Manila standard delivery: PHP 150 via J&T
- Outside Metro Manila: customer must contact the Facebook page for delivery arrangement
- Same-day delivery: settled through Facebook Messenger
- Same-day delivery is outside fixed system pricing for now
- Messenger-assisted sales must still be encoded as orders by admin if they need history, stock, and points records
- Prestige / PHP 50,000 package has free delivery and 5-day processing after payment approval

### Points

- Points apply only to approved members/resellers
- Qualified repeat product order: 5 points per bottle
- Tester Kit: 10 fixed points for members only
- Points are awarded after delivered status, not merely payment approval
- Cancelled, rejected, unverified, or refunded orders earn zero points
- Membership package bottles and package upgrades do not earn points

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
- Product prices updated to PHP 349 / PHP 199
- Cart blocks inactive products
- Checkout reads live product availability
- Dashboard/storefront use live product status
- M01 activated for testing with stock

### Customer Order Flow

Tested September 30:

- Free customer can create order
- Customer can upload dummy payment screenshot
- Order appears in customer Order History
- Admin can view submitted payment proof
- Admin can reject payment
- Rejected order appears as rejected in customer dashboard
- Admin can approve payment
- Approved order moves to processing
- Product stock deduction works after refresh

### Admin Review

- Admin membership review backend prepared and tested
- Admin membership approval/rejection UI connected
- Admin order payment review backend connected
- Admin order approve/reject UI connected
- Admin order review has payment verification checkbox
- Rejection requires admin note
- Approval requires payment proof and confirmation checkbox

### Inventory

- Admin can view products and inventory
- Admin can set stock
- Stock movement history exists
- Approved order deducts stock
- Rejected order does not deduct stock

## 4. Done but Needs UI Polish

These are functional but need better presentation before handoff:

- Customer order status badges
- Admin order status badges
- Rejected status should be red and clearer
- Pending verification should be gold/amber
- Processing should be blue or emerald
- Completed/delivered should be green
- Replace raw database words like `rejected` with customer-friendly labels:
  - Payment Rejected
  - Pending Verification
  - Processing
  - Delivered
- Admin order drawer layout can be cleaned up
- Delivery fee text can be clearer for pending/custom delivery
- Product inventory button label should become Add Stock / Update Stock instead of Save Stock if client prefers
- Admin dashboard still shows In Development label in some places

## 5. Pending MVP Tasks

### A. Order Fulfillment

Required next:

- Add admin action to move order from processing to shipped
- Add admin action to move shipped to delivered
- Add admin tracking/reference note if needed
- Customer dashboard should show latest order status clearly
- Delivered status should become the trigger for future points awarding

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
- Future cancellation/refund must restore stock once only

## 7. Immediate Next Steps Toward October 5 MVP

The project is now in MVP lock mode. Prioritize only the features needed for the client to operate manually but safely. Avoid new large revisions unless they are required for order, payment, stock, membership, points, or payout correctness.

### Day 1: Finish Core Order Operations

Goal: Orders can move safely from payment review to fulfillment.

1. Commit the working order payment review flow.
2. Polish order status labels and badge colors:
   - Pending Verification
   - Payment Rejected
   - Processing
   - Shipped
   - Delivered
   - Cancelled / Refunded if available
3. Add admin action: Processing → Shipped.
4. Add admin action: Shipped → Delivered.
5. Show updated status clearly in customer Order History.
6. Confirm approved orders deduct stock once only.
7. Confirm rejected orders do not deduct stock.

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
7. Decide whether to enforce the 10-bottle member repeat-order minimum now or leave it documented for after MVP.

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

Still needs QA:

- Member/reseller order pricing
- 10-bottle member minimum if enforced
- Membership approval to active member
- Package fulfillment
- Shipped/delivered flow
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