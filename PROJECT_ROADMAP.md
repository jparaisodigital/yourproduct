# YOUR PRODUCT
## Temporary Project Roadmap
### Perfume E-commerce + Membership, Points and Direct Referral System

> Status: Temporary planning document  
> This roadmap is based on the current client questionnaire.  
> Unconfirmed business rules must remain configurable or marked as pending.  
> Do not invent package inclusions, discounts, payouts, or reward mechanics.

---

## 1. Project Objective

Build a responsive perfume e-commerce website where members and non-members can purchase products.

The system will include:

- Customer registration and login
- Membership packages
- Manual payment verification
- Admin payment approval
- Member-specific pricing
- Points and reward redemption
- Direct referral tracking
- Member and admin dashboards
- Basic inventory and order management

This is not a multi-level marketing system.

Only direct referrals are supported. There are no downlines, referral trees, binary systems, pairing bonuses, or multi-level commissions.

---

## 2. Technology Stack

### Frontend

- Vite
- Vanilla JavaScript using ES modules
- Tailwind CSS installed through Vite
- Supabase JavaScript client

### Backend

- Supabase Auth
- PostgreSQL database
- Supabase Storage
- Row Level Security
- PostgreSQL database functions/RPC
- Supabase Edge Functions only when necessary

### Hosting

- Cloudflare Pages for the Vite frontend
- Supabase for authentication, database, storage, and backend logic

---

## 3. Currently Confirmed Business Rules

### Products

- Approximately 20 perfume products
- 10 male scents
- 10 female scents
- Members and non-members may purchase
- Members have separate pricing
- Exact member prices are still pending

### Membership packages

- Starter: PHP 1,000
- Builder: PHP 3,000
- Leader: PHP 10,000
- Prestige: PHP 50,000
- Each package includes perfume bottles
- Exact bottles, quantities, and scents are still pending
- Membership becomes active after payment approval

### Manual payment

- No automated payment gateway
- Customer selects a payment method
- Customer uploads proof of payment
- New payment starts with `pending` status
- Admin manually approves or rejects payment
- Customer must see the current payment status
- Rejected-payment re-upload flow is required

### Points

- Buyer receives 5 points for every qualified bottle
- Bottles included in an approved membership package may receive points
- Points are credited only after payment approval
- Points are deducted when a reward is claimed
- Points are reversed for canceled or refunded orders
- Points do not expire
- Website purchases are recorded automatically
- Offline-sale points are not included until mechanics are confirmed

### Direct referral

- Every member may have a personal referral link/code
- Only direct referrals are qualified
- No multi-level or downline commission
- Referral reward is 10% of the membership package
- Repeat product orders do not earn the 10% referral reward
- Referral reward is recorded after the referred membership payment is approved
- Company handles the actual payout manually
- Website records only the referral reward and payout status
- Payout method and schedule are still pending

### Rewards

- Member can view available rewards
- Member can submit a reward claim
- Required points are deducted through secure backend logic
- Admin reviews and processes reward claims
- Exact reward inventory and fulfillment mechanics are pending

### Raffle

- Company conducts the raffle draw outside the website
- Website does not automatically select winners
- Website may display member qualification or raffle status
- Exact qualifications and milestones are pending

### Fulfillment

- Company packs and delivers customer orders
- Shipping fees, couriers, and delivery areas are still pending

### Your Brand program

- Final workflow is not yet confirmed
- It may require an information/inquiry form
- A request-tracking dashboard was also mentioned
- Do not build the complete Your Brand workflow until clarified

---

## 4. User Roles

### Guest

Can:

- View products
- View membership packages
- Add products to cart
- Checkout as a non-member
- Register or log in

Cannot:

- Access member prices unless allowed by the final pricing rule
- Access member dashboard
- Earn referral rewards

### Member

Can:

- View member pricing
- Purchase products
- View orders and payment status
- Upload or re-upload proof of payment
- View membership status
- View points history
- View current points balance
- View rewards
- Submit reward claims
- View referral code/link
- View direct referral records
- View referral reward and payout status

### Admin

Can:

- View all orders
- View uploaded payment proofs
- Approve or reject payments
- Add a rejection reason
- Update fulfillment/order status
- View members and membership status
- View points transactions
- Review reward claims
- Record referral payout status
- Update products and inventory
- Update raffle qualification/status
- View administrative audit history

Admin access must be enforced by the database, not only by hiding frontend pages.

---

## 5. Main Website Pages

### Public pages

- Home
- Products
- Product details
- Membership packages
- Cart
- Checkout
- Login
- Registration
- About/FAQ
- Payment instructions

### Member pages

- Dashboard overview
- My membership
- My orders
- Payment status
- Points history
- Rewards
- Reward claims
- My referral link
- Direct referrals
- Referral rewards
- Account settings

### Admin pages

- Dashboard summary
- Pending payments
- Orders
- Payment details and proof viewer
- Members
- Products and inventory
- Points transactions
- Reward claims
- Referral rewards and payouts
- Raffle qualification/status
- Audit logs

---

## 6. Proposed Database Tables

The table names may change during implementation.

### Profiles

- id
- full_name
- contact_number
- role: `member` or `admin`
- referral_code
- referred_by
- created_at
- updated_at

### Products

- id
- name
- description
- category
- regular_price
- member_price
- stock_quantity
- image_url
- is_active
- created_at
- updated_at

### MembershipPackages

- id
- name
- price
- description
- is_active

Package inclusions must use a separate table after the client confirms the exact bottles.

### MembershipPackageItems

- id
- package_id
- product_id
- quantity

### Memberships

- id
- user_id
- package_id
- status: `pending`, `active`, `expired`, or `canceled`
- activated_at
- created_at

### Orders

- id
- user_id
- customer_type: `guest` or `member`
- order_type: `product` or `membership`
- subtotal
- shipping_fee
- total_amount
- payment_status
- order_status
- referral_code_used
- created_at
- updated_at

### OrderItems

- id
- order_id
- product_id
- product_name_snapshot
- unit_price
- quantity
- points_per_item
- line_total

Prices must be saved as order-time snapshots.

### Payments

- id
- order_id
- payment_method
- reference_number
- proof_path
- status: `pending`, `approved`, or `rejected`
- rejection_reason
- submitted_at
- reviewed_by
- reviewed_at

### PointsTransactions

- id
- user_id
- order_id
- reward_claim_id
- transaction_type: `credit`, `debit`, or `reversal`
- points
- description
- created_at

Points balance should be calculated from the transaction ledger.

Do not allow the frontend to directly edit a member’s points balance.

### Rewards

- id
- name
- description
- required_points
- image_url
- stock_quantity
- is_active

### RewardClaims

- id
- user_id
- reward_id
- points_used
- status: `pending`, `approved`, `completed`, `rejected`, or `canceled`
- reviewed_by
- reviewed_at
- created_at

### Referrals

- id
- referrer_user_id
- referred_user_id
- membership_order_id
- package_amount
- reward_percentage
- reward_amount
- status: `pending`, `earned`, `paid`, `reversed`, or `rejected`
- paid_at
- created_at

Only one referrer may be assigned to a member.

### RaffleStatuses

- id
- user_id
- raffle_name
- qualification_status
- notes
- updated_by
- updated_at

### AdminAuditLogs

- id
- admin_user_id
- action
- entity_type
- entity_id
- previous_data
- new_data
- created_at

---

## 7. Critical Backend Rules

### Payment approval

Payment approval must be processed through one secure database function or backend operation.

The approval must:

1. Confirm that the payment is still pending.
2. Prevent duplicate approval.
3. Mark the payment as approved.
4. Mark the order as confirmed/paid.
5. Activate membership if it is a membership order.
6. Credit qualified product points.
7. Create the direct-referral reward if applicable.
8. Update inventory.
9. Save an admin audit log.

The browser must not directly perform these database updates separately.

### Idempotency

- Repeated clicks must not create duplicate points.
- Repeated approval requests must not create duplicate referral rewards.
- Each order may be processed only once.
- Database uniqueness constraints must be used where appropriate.

### Referral protection

- User cannot refer their own account.
- Referral owner cannot be changed after a qualified membership is approved.
- Only the first qualified membership package earns the 10% reward.
- No reward for repeat product orders.
- No downline or multi-level calculations.

### Price protection

- Never trust totals sent by the browser.
- Backend must retrieve official product/package prices.
- Backend must calculate subtotal and final total.
- Member pricing must be checked using the authenticated membership status.

### Points protection

- Points may only be changed through backend/database functions.
- Each points transaction must have a reason and source record.
- Reward deduction must fail if points are insufficient.
- Refund reversal must not be processed twice.
- Negative-balance handling is pending client confirmation.

### Storage protection

- Payment proofs must be stored in a private bucket.
- Customers may access only their own uploads.
- Admins may access payment proofs for review.
- File type and size must be validated.
- Public URLs must not expose payment receipts.

---

## 8. Row Level Security Requirements

RLS must be enabled on every exposed table.

### General rules

- Guests may read active public products and packages only.
- Members may read their own profile, orders, payments, points, claims, and referral records.
- Members cannot modify points, referral rewards, payment approval, or membership status.
- Admin operations require a verified admin role.
- Frontend route protection is not a substitute for database security.
- Supabase service-role key must never be placed in frontend code.
- Only the Supabase publishable/anon key may be used in the Vite frontend.

---

## 9. Recommended Project Structure

```text
src/
├── components/
│   ├── header.js
│   ├── footer.js
│   ├── product-card.js
│   ├── modal.js
│   └── loading-state.js
├── pages/
│   ├── home.js
│   ├── products.js
│   ├── product-details.js
│   ├── cart.js
│   ├── checkout.js
│   ├── login.js
│   ├── register.js
│   ├── member-dashboard.js
│   └── admin-dashboard.js
├── services/
│   ├── supabase.js
│   ├── auth-service.js
│   ├── product-service.js
│   ├── order-service.js
│   ├── payment-service.js
│   ├── points-service.js
│   ├── rewards-service.js
│   └── referral-service.js
├── stores/
│   ├── auth-store.js
│   └── cart-store.js
├── utils/
│   ├── validation.js
│   ├── currency.js
│   ├── errors.js
│   └── constants.js
├── styles/
│   └── main.css
├── app.js
└── main.js

supabase/
├── migrations/
├── functions/
└── seed.sql

public/
└── assets/
```

Alpine.js will handle simple interface state such as menus, modals, tabs, cart display, filters, and loading states.

Vanilla JavaScript service modules will handle Supabase operations and reusable business logic.

Do not place Supabase queries directly throughout the HTML.

---

## 10. Development Phases

### Phase 0: Foundation

- Create the Vite Vanilla project
- Install Tailwind CSS through Vite
- Install and initialize Alpine.js
- Create the modular folder structure
- Add brand colors, typography, spacing, buttons, forms, and status styles
- Create Git repository and first checkpoint
- Confirm that the local development server works
- Do not add Supabase logic yet

### Phase 1: Website shell

- Responsive header
- Mobile navigation
- Footer
- Public page structure
- Member dashboard shell
- Admin dashboard shell
- Loading, empty, success, and error states
- Reusable components
- No fake backend logic

### Phase 2: Supabase foundation

- Create the Supabase project
- Configure environment variables
- Connect the Vite frontend
- Create database migrations
- Create tables and relationships
- Enable Row Level Security
- Create member and admin test accounts
- Create private payment-proof storage bucket
- Test access using separate accounts

### Phase 3: Authentication and roles

- Member registration
- Login and logout
- Session restoration
- Password recovery
- Member role
- Admin role
- Protected member pages
- Protected admin pages
- Referral-code capture during registration
- Prevent self-referral
- Membership purchase must require a registered account

Referral eligibility per membership tier is still pending client confirmation.

### Phase 4: Products and storefront

- Product listing
- Male and female categories
- Product details
- Regular pricing
- Member pricing
- Product filters
- Cart
- Basic stock validation
- Backend price validation
- Responsive storefront

Do not finalize member prices until the client provides the official pricing rules.

### Phase 5: Checkout and manual payment

- Member checkout
- Non-member checkout
- Customer information
- Delivery information
- Order creation
- Order-item snapshots
- Payment-method selection
- Private proof-of-payment upload
- Pending payment status
- Rejected-payment reason
- Proof re-upload
- Customer order tracking

### Phase 6: Admin payment approval

- Pending-payment list
- Payment and order details
- Private proof viewer
- Approve payment
- Reject payment
- Rejection reason
- Secure database approval function
- Duplicate-approval protection
- Membership activation
- Points credit
- Referral reward creation
- Inventory update
- Administrative audit log

Payment approval must be one secure and atomic backend operation.

### Phase 7: Member dashboard

- Dashboard overview
- Membership status
- Orders and payment status
- Points balance
- Points transaction history
- Reward claims
- Referral link/code
- Direct referral records
- Referral reward status
- Referral payout status

### Phase 8: Rewards

- Reward catalog
- Required points
- Reward details
- Reward claim form
- Secure points deduction
- Insufficient-points validation
- Admin claim review
- Claim status
- Cancellation/refund reversal protection

Negative-points handling after refunds is pending client confirmation.

### Phase 9: Referral system

- Personal referral code/link
- Direct-referral tracking
- 10% reward from the first qualified membership package
- No reward for repeat product orders
- No multi-level or downline calculation
- Pending, earned, paid, reversed, and rejected statuses
- Manual payout recording by admin
- Duplicate-referral reward protection

Do not build referral trees, binary systems, pairing bonuses, or automated payouts.

### Phase 10: Raffle and Your Brand placeholder

- Display raffle qualification/status
- Allow admin to update qualification/status
- Company handles the actual raffle draw
- Do not build automated raffle winner selection
- Add temporary Your Brand information/inquiry section
- Do not build a Your Brand dashboard until confirmed

### Phase 11: Testing and launch

- Test guest checkout
- Test member checkout
- Test member and regular pricing
- Test registration and login
- Test referral-code registration
- Test self-referral prevention
- Test payment upload
- Test approval, rejection, and re-upload
- Test repeated approval clicks
- Test membership activation
- Test points credit and deduction
- Test reward claims
- Test cancel/refund reversal
- Test referral reward creation
- Test customer and admin permissions
- Test private payment-proof access
- Test mobile and desktop layouts
- Test loading and error states
- Deploy to Cloudflare Pages
- Configure production environment variables
- Connect the final domain
- Prepare an admin usage guide

---

## 11. Temporarily Out of Scope

Do not build the following without written client confirmation and a separate quotation:

- Automated payment gateway
- Automated referral or commission payouts
- Multi-level or downline commissions
- Binary, pairing, matrix, or unilevel systems
- Referral-tree visualization
- Independent online store for every member
- Complex reseller inventory
- Automated raffle drawing
- Courier API integration
- Accounting or payroll system
- Native Android or iOS application
- Offline-sale point submission
- Complete Your Brand request-tracking system
- Features not listed in the signed final scope

---

## 12. Pending Client Questions

Confirm the following before final implementation:

1. Exact bottles, quantities, and scents in every entry package
2. Exact member price or discount for every product
3. Whether Your Brand packages are separate from entry packages
4. Whether Your Brand needs an inquiry form or complete dashboard
5. Accepted payment methods
6. Payment rejection and proof re-upload rules
7. Exact referral eligibility for each membership tier
8. Referral payout method, minimum amount, and schedule
9. Exact reward inventory and required points
10. Handling when refunded points have already been spent
11. Shipping fees, couriers, and delivery areas
12. Exact raffle qualifications and statuses
13. Whether sellers also earn points
14. Whether offline sales may earn points
15. Number of administrator accounts
16. Stock deduction, cancellation, and restocking rules

Unconfirmed answers must not be invented by the developer or AI assistant.

---

## 13. Temporary Timeline

Assuming the client provides complete content and final mechanics:

- Frontend foundation and storefront: 1–4 working days
- Working backend prototype: 7–12 working days
- Security testing and bug fixing: 5–10 working days
- Practical total allowance: approximately 3–5 weeks

The timeline changes when the client adds features, changes business rules, delays content, or requests major revisions.

---

## 14. Definition of Done

The project is ready for production only when:

- Member and admin authentication works
- Database migrations are documented
- RLS policies have been tested
- Customers cannot access another customer’s information
- Admin access is enforced by the database
- Payment proofs are private
- Payment approval cannot be processed twice
- Official prices are retrieved from the database
- Membership activation works correctly
- Points cannot be manipulated from the browser
- Reward deductions and reversals are recorded
- Referral rewards cannot be duplicated
- Self-referrals are prevented
- Administrative actions have audit records
- Mobile and desktop workflows are tested
- Production deployment works with real environment settings
- Client has received the agreed admin instructions

---

## 15. Cursor AI Guardrails

When generating code for this project:

1. Follow this roadmap and the latest database migrations.
2. Do not invent unconfirmed business rules.
3. Ask before changing the database schema.
4. Do not use mock data inside production logic.
5. Do not expose secret or service-role keys.
6. Do not bypass RLS to make a feature work.
7. Do not calculate trusted prices, points, or referral rewards only in the browser.
8. Use secure database functions for sensitive multi-step operations.
9. Keep the code modular and beginner-readable.
10. Use Alpine.js for interface state only.
11. Keep Supabase calls inside service modules.
12. Do not mix Alpine state and manual DOM manipulation for the same component.
13. Explain every migration and security policy before applying it.
14. Test one phase before starting the next.
15. Create a Git checkpoint before every major phase.
16. Treat this roadmap as temporary until the remaining rules are confirmed.

---

## 16. Critical Scope Warning

The current project covers only the confirmed central e-commerce, membership, points, rewards, direct-referral, and manual-payment system described in this roadmap.

### Stop Development and Request a Separate Quotation

If the client requests any of the following, do not automatically add it to the current project:

- Downline or multi-level commission system
- Binary, pairing, unilevel, matrix, or similar compensation system
- Automated cash or commission payouts
- Independent online store for every member
- Complex reseller or seller inventory
- Automated raffle entry generation or winner selection
- Accounting, payroll, bookkeeping, or tax system
- Native Android or iOS mobile application
- Complex courier or third-party API integrations
- New features outside the written and approved scope
- Unlimited revisions or unlimited post-launch changes

These features require additional planning, database architecture, security testing, development time, and project cost.

### Required Process for Additional Features

Before implementing any item above:

1. Stop the affected development work.
2. Ask the client for complete written requirements.
3. Assess the technical, legal, security, and maintenance impact.
4. Prepare a separate timeline and quotation.
5. Receive written client approval.
6. Collect the required additional payment or down payment.
7. Update the roadmap and signed project scope.
8. Begin development only after all requirements are confirmed.

### Scope Protection Rule

Marketing posters, presentations, conversations, and future ideas do not automatically become included website features.

Only features specifically listed in the final written scope and approved by both parties are included in the current project fee.

Any feature not listed in the approved scope is considered an additional feature and requires a separate quotation.

### Revision Rule

The project includes only the number of revision rounds stated in the final agreement.

The following are not considered minor revisions:

- New pages
- New dashboards
- New user roles
- New earning mechanics
- Changes to points or referral calculations
- New integrations
- Major database changes
- New approval workflows
- New reports
- Redesign of completed sections
- Changes caused by newly introduced business rules

These requests may affect the timeline and require additional payment.

### Developer Responsibility Boundary

The developer is responsible for implementing the approved technical requirements.

The client/company remains responsible for:

- Accuracy of business mechanics
- Product and package information
- Prices and discounts
- Referral and reward policies
- Payout processing
- Fulfillment and delivery
- Customer disputes
- Tax and accounting compliance
- Privacy-policy content
- Legality and regulatory compliance of the business model

The developer does not provide legal, financial, tax, or regulatory advice.