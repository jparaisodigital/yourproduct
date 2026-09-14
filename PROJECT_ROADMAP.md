# YOUR PRODUCT 2026.PH
## Focused Project Roadmap
### Public Website + Member Dashboard + Perfume Ordering + Manual Payout Requests

> Updated: September 14, 2026  
> Source: latest website mechanics sent by the client through Messenger  
> Status: working roadmap pending confirmation of the remaining business rules

---

## 1. Roadmap Rule

This roadmap follows only the features specifically described in the client's latest Messenger message.

Anything not clearly stated is marked as pending or excluded until the client gives written confirmation. Older PDFs, posters, screenshots, reference websites, and previous discussions do not automatically add features to this scope.

---

## 2. Project Objective

Build `YourProduct2026.ph` with two main areas:

1. A public first page presenting Your Product, its community, earning opportunity, vision, mission, and packages.
2. A secure member platform containing a dashboard, perfume information, ordering, order history, wallet information, and payout requests.

The website will use one shared catalog of 20 perfumes:

- 10 men's perfumes
- 10 women's perfumes

The confirmed ordering flow includes a minimum quantity of 10 pieces and dropship shipping details.

---

## 3. Confirmed Public First Page

The public first page will contain:

- Discover
- Packages
- Our Community
- Ways to Earn
- Be Your Own Boss section with one picture
- Vision and Mission section with four pictures
- Explore Package section
- Your Starter
- Your Builder
- Your Leader
- Your Prestige
- Log In
- Sign Up

The exact copy, pictures, package prices, and package inclusions must come from the client.

---

## 4. Confirmed Member Platform

The member platform will have sidebar navigation for:

- Dashboard
- Your Perfumes Information
- Your Order
  - Create Order
  - Order History
- Your Wallet
  - Payout Request
- Log Out

### Dashboard

The dashboard will show:

- Member name or the client label `Your Future`
- `Your People`: number of direct referrals
- `Your Points`: current points
- Reward-progress pictures:
  - Cellphone
  - Laptop
  - Motorcycle
  - Car
- Income amount in Philippine pesos

The exact meaning of `Your Future`, point requirements, reward eligibility, and income computation are pending.

### Your Perfumes Information

Members can choose:

- Your Men â€” 10 perfumes
- Your Women â€” 10 perfumes

Each perfume will contain:

- Product picture
- Product name
- Short description
- Scent profile
- Scent character
- Best for

The same product catalog will be reused for perfume information and Create Order.

### Create Order

The member can:

1. Open Create Order.
2. Choose Your Men or Your Women.
3. View the perfumes in that category.
4. Add products to the cart.
5. Review selected items and subtotal.
6. Continue when the confirmed minimum-order rule is satisfied.
7. Proceed to dropship checkout.
8. Enter shipping details.
9. Submit the order.
10. View it in Order History.

### Shopping Cart

The cart will show:

- Selected products
- Quantity per product
- Selected-items count
- Subtotal
- Minimum-order notice
- Proceed to Checkout button

The client stated `Minimum 10Pcs`.

Pending confirmation: whether this means 10 total pieces across the cart or 10 pieces per perfume.

### Dropship Shipping Details

The checkout form will collect:

- Recipient name
- Phone number
- Province
- City/Municipality
- Barangay
- House number and street
- Landmark

Only dropship was mentioned. Pickup or other fulfillment options are not included unless separately confirmed.

### Order History

The member will have an Order History page. At minimum, it will identify the member's submitted orders.

Exact order statuses, cancellation rules, payment steps, and fulfillment updates are pending.

### Wallet and Payout Request

The wallet will show:

- Available Income
- Funds ready for withdrawal
- Payout Request

Confirmed payout choices:

- All Banks
- BDO
- BPI
- MariBank
- CIMB
- GoTyme
- Maya / PayMaya
- GCash

The website will collect and record the payout request only.

The company will manually:

- Review the request
- Send the money through the selected bank or e-wallet
- Update the request status

There is no confirmed automatic bank transfer, e-wallet transfer, or payment-gateway integration.

---

## 5. User Roles

### Visitor

Can:

- View the public first page
- Read the public sections
- View package information
- Open Log In
- Open Sign Up

Public storefront purchasing was not explicitly described in the latest mechanics and remains pending.

### Member

Can:

- Log in to the member platform
- View personal dashboard information
- View direct-referral count, points, reward progress, and income
- Browse men's and women's perfume information
- Add perfumes to the order cart
- Submit a dropship order after satisfying the minimum quantity
- View personal order history
- View available income
- Submit a payout request

### Company Operator / Administrator

Manual order and payout processing is necessary, but the client did not explicitly request a custom admin dashboard.

Pending decision:

- Build a simple custom admin interface; or
- Let the company initially manage records through the secured Supabase dashboard.

Do not include a large admin system until confirmed in writing.

---

## 6. Main Screens

### Public Area

- Home / First Page
- Log In
- Sign Up

### Member Area

- Dashboard
- Your Perfumes Information
- Your Men
- Your Women
- Create Order
- Shopping Cart
- Dropship Checkout
- Order History
- Your Wallet
- Payout Request

### Possible Operator Area â€” Pending

- Orders list and details
- Order-status update
- Payout-request list
- Payout-status update
- Member record view
- Manual points or income entry, if required by the final mechanics

---

## 7. Confirmed User Flows

### Public-to-Member Flow

1. Visitor opens `YourProduct2026.ph`.
2. Visitor views the public first-page sections and packages.
3. Visitor selects Log In or Sign Up.
4. Successful login opens the member platform.

### Member Order Flow

1. Member opens Your Order.
2. Member selects Create Order.
3. Member chooses Your Men or Your Women.
4. Member adds perfumes to the cart.
5. Cart calculates item count and subtotal.
6. Checkout remains unavailable until the minimum-order rule is satisfied.
7. Member proceeds to Dropship Checkout.
8. Member enters the recipient's shipping details.
9. Member submits the order.
10. The order appears in the member's Order History.

### Manual Payout Flow

1. Member opens Your Wallet.
2. Member sees Available Income.
3. Member opens Payout Request.
4. Member selects a supported bank or e-wallet.
5. Member enters payout-account information and amount.
6. The website records a pending request.
7. The company processes the transfer manually outside the website.
8. The company updates the request status.
9. The member sees the updated status.

Exact payout statuses, minimum amount, processing fee, and rejection rules are pending.

---

## 8. Technology Stack

### Frontend

- Vite
- Vanilla JavaScript with ES modules
- Alpine.js for interface state
- Tailwind CSS through Vite

### Backend

- Supabase Auth for registration and login
- Supabase PostgreSQL for member, product, order, points, income, and payout records
- Row Level Security for member-data protection
- Supabase Storage only if later required

### Hosting

- Cloudflare Pages for the frontend
- Supabase for authentication and database services
- Final domain: `YourProduct2026.ph`, subject to domain and DNS access

---

## 9. Provisional Data Structure

Final tables must follow the confirmed business rules.

### Profiles

- User ID
- Full name
- Contact information
- Role
- Direct referrer, if applicable
- Created date

### Products

- Product ID
- SKU
- Name
- Category: men or women
- Product picture
- Short description
- Scent profile
- Scent character
- Best for
- Price
- Stock or availability, if required
- Active status

### Packages

- Package ID
- Package name
- Price
- Description
- Inclusions
- Active status

Package prices and inclusions are pending.

### Orders

- Order ID
- Member ID
- Item count
- Subtotal
- Order status
- Shipping details
- Created date
- Updated date

### Order Items

- Order ID
- Product ID
- Product-name snapshot
- Unit-price snapshot
- Quantity
- Line total

### Points Transactions

- Member ID
- Points added or deducted
- Description
- Source/reference
- Created date

Points balance should come from transaction records, not a browser-editable number. Earning and deduction rules are pending.

### Income Transactions

- Member ID
- Amount credited or deducted
- Description
- Source/reference
- Status
- Created date

Available Income should come from transaction records. Its source and computation are pending.

### Payout Requests

- Request ID
- Member ID
- Requested amount
- Payout method
- Account name
- Account number
- Status
- Company note
- Requested date
- Processed date

A payout request must never trigger an automatic transfer unless a separate integration is approved.

---

## 10. Security and Data Rules

- Members may access only their own dashboard, orders, points, income, and payout requests.
- Members cannot directly edit their points or income from the browser.
- Order totals must be recalculated using official product prices before saving.
- Orders must save product-name and price snapshots.
- A payout request cannot exceed the confirmed available balance.
- Repeated clicks must not create duplicate orders or payout requests.
- Admin access must be protected by role and database rules if included.
- Supabase secret or service-role keys must never be placed in frontend code.
- Row Level Security must be enabled on member-related tables.

These implementation-safety rules do not add new business mechanics.

---

## 11. Current Development Status

### Completed

- Vite project and modular structure
- Tailwind CSS through Vite
- Alpine.js installation and initialization
- Git repository and checkpoints
- Brand design foundation
- Header, footer, and homepage hero
- Supabase package and environment setup
- Successful Supabase connection test
- Shared sample product configuration
- Men's and women's sample products
- Product cards and category filters
- Persistent local cart store
- Add-to-cart quantity feedback

### Paused / Not Yet Integrated

- Cart drawer integration
- Final public-page sections
- Official 20 perfume products
- Authentication
- Member platform
- Database-backed products and orders
- Order History
- Points and income records
- Wallet and payout requests

Resume Supabase feature development only after the mechanics needed by that module are confirmed.

---

## 12. Updated Development Stages

### Stage 1: Confirm and Freeze Scope

- Send the focused summary to the client
- Confirm the pending questions in Section 14
- Confirm inclusions under the PHP 20,000 agreement
- Confirm whether a custom operator/admin interface is included
- Freeze Phase 1 before creating database migrations

### Stage 2: Complete the Public First Page

- Discover
- Packages
- Our Community
- Ways to Earn
- Be Your Own Boss with one image
- Vision and Mission with four images
- Explore Package cards
- Log In and Sign Up calls to action
- Responsive mobile and desktop layout

### Stage 3: Complete the Shared Perfume Catalog

- Add 10 men's perfumes
- Add 10 women's perfumes
- Add official pictures and product information
- Reuse one catalog across information and Create Order
- Complete filters and cart drawer
- Add minimum-order notice and validation

### Stage 4: Authentication and Member Shell

- Registration
- Login and logout
- Session restoration
- Protected member routes
- Member sidebar navigation
- Dashboard layout

Registration fields and activation rules must be confirmed.

### Stage 5: Member Dashboard Data

- Member name / Your Future
- Direct referrals / Your People
- Points / Your Points
- Four reward-progress pictures
- Income in PHP
- Loading, empty, and error states

Do not implement points, rewards, or income calculations until the rules are confirmed.

### Stage 6: Dropship Ordering

- Database-backed products
- Create Order categories
- Cart quantities and subtotal
- Minimum-order validation
- Dropship shipping form
- Secure order creation
- Member Order History
- Agreed company processing method

Payment collection is not included until the client confirms how orders are paid.

### Stage 7: Wallet and Manual Payouts

- Available Income
- Funds ready for withdrawal
- Bank/e-wallet selection
- Payout-account form
- Payout amount validation
- Pending request creation
- Manual company review
- Status display and history

No automatic transfer will be implemented.

### Stage 8: Testing and Launch

- Test sign-up and login
- Test member-only access
- Test separation of member records
- Test men's and women's catalog
- Test cart minimum validation
- Test shipping-form validation
- Test duplicate-order protection
- Test Order History ownership
- Test points and income restrictions
- Test payout amount and duplicate protection
- Test mobile and desktop layouts
- Deploy to Cloudflare Pages
- Configure production environment variables
- Connect the final domain
- Prepare a short company usage guide

---

## 13. Phase 1 Scope Boundaries

Unless separately confirmed and quoted, the following are not included:

- Binary tree
- Pairing or binary bonuses
- Multi-level or downline commissions
- Matrix or unilevel compensation
- Automated commission computation
- Automatic bank or e-wallet transfers
- Payment gateway
- Courier API integration
- Automated reward redemption or delivery
- Automated raffle draw
- Independent storefront for every member
- Complex accounting or payroll
- Native Android or iOS application
- AIConnect features outside the referenced Order flow
- Features shown only in old PDFs, posters, screenshots, or conversations

Reference websites may inspire the design or flow, but their unrequested modules are not automatically included.

---

## 14. Pending Client Questions

1. What does `Your Future` mean?
2. Is `Your People` strictly the number of direct referrals?
3. How are points earned, deducted, reversed, and approved?
4. What points are required for the cellphone, laptop, motorcycle, and car?
5. Are those four items rewards, goals, or display-only milestones?
6. Where does member income come from?
7. Is income manually entered or automatically calculated from a confirmed rule?
8. What makes income available for withdrawal?
9. Is there a minimum payout, fee, or schedule?
10. What payout statuses and rejection rules are required?
11. Does minimum 10 pieces mean total cart quantity or per perfume?
12. How does a member pay for a perfume order?
13. What statuses should appear in Order History?
14. Can members cancel submitted orders?
15. How are shipping fees handled?
16. Are only dropship orders supported?
17. What information is required during Sign Up?
18. Is membership automatically active after Sign Up or company approval?
19. What are the prices and inclusions of the four packages?
20. Can public visitors buy products, or can only members order?
21. Is a custom admin dashboard required, or will Supabase be used initially?

No answer should be invented by the developer or AI assistant.

---

## 15. Definition of Done

The approved Phase 1 is complete when:

- The first page contains the confirmed sections
- Log In and Sign Up follow the approved rules
- Members can access only their own data
- The dashboard displays the approved member information
- The shared 20-perfume catalog is complete
- Every perfume contains the required details
- Create Order enforces the confirmed minimum quantity
- Dropship shipping details are validated and saved
- Orders appear in the correct member's Order History
- Points and income cannot be edited from the browser
- Members can submit payout requests using approved methods
- Payout requests do not automatically send money
- Manual company processing is documented
- Mobile and desktop workflows are tested
- Production works on the approved domain
- All included features match the signed written scope

---

## 16. Coding Guardrails

1. Follow this roadmap and the client's latest written mechanics.
2. Do not reintroduce features removed from the reduced scope.
3. Do not invent package, points, reward, income, payout, payment, or shipping rules.
4. Ask before changing the database structure.
5. Keep one shared source of truth for the perfume catalog.
6. Use Alpine.js for interface state only.
7. Keep backend operations in reusable service modules.
8. Never expose Supabase secret or service-role keys.
9. Do not bypass Row Level Security.
10. Do not trust prices, points, income, or balances sent by the browser.
11. Test one stage before starting the next.
12. Create a Git checkpoint before every major stage.
13. Keep code modular and beginner-readable.
14. Treat pending mechanics as blocked, not permission to guess.

---

## 17. Scope Protection Rule

Only features listed in the final written and approved scope are included in the project fee.

New pages, dashboards, roles, earning mechanics, calculations, integrations, reports, or major redesigns require:

1. Complete written requirements
2. Technical and security assessment
3. Updated timeline
4. Separate quotation when applicable
5. Written client approval
6. Roadmap and agreement update before implementation

The client/company remains responsible for the accuracy and legality of its business, earning, points, reward, payout, product, fulfillment, and financial mechanics.