# Tiered reseller pricing

This SQL change replaces the old universal member price behavior.

Locked pricing rules:

- Free customer: PHP 349 per bottle
- Starter approved member: PHP 245 per bottle
- Builder approved member: PHP 227 per bottle
- Leader approved member: PHP 210 per bottle
- Prestige approved member: PHP 175 per bottle

Important behavior:

- `quote_order_cart(cart_items jsonb)` is the source of truth for checkout pricing.
- The function checks the signed-in customer's latest approved membership application.
- If the customer has no approved active package, regular price is used.
- `submit_order(...)` calls `quote_order_cart(...)`, so saved order item prices follow the server-side quote.
- Frontend cart pricing is only for display/preview. Supabase quote decides the real submitted order amount.

Related app files:

- `src/stores/cart-store.js`
- `src/checkout.js`
- `src/dashboard.js`
- `src/components/product-card.js`
- `src/components/product-drawer.js`

Deprecated:

- Universal PHP 199 member price.
- Using `products.member_price` as the final reseller price for every member.

Current tier map:

```sql
case approved_package_id
  when 'starter' then 245
  when 'builder' then 227
  when 'leader' then 210
  when 'prestige' then 175
  else product_record.regular_price
end

Then second file:

```powershell
@'
# Points ledger and awarding

Locked points rules:

- Points apply only to product orders.
- Membership package bottles do not earn points.
- Physical inclusions such as tester kits, tarpaulins, and carts do not count as bottles.
- Order must be delivered before points can be awarded.
- Customer must be an active member.
- Qualified bottle quantity must be at least 10 bottles in one delivered order.
- Points formula: `qualified_bottle_quantity * 5`.
- Example: 10 bottles = 50 points.
- Points must be awarded once only per order.

Database objects added:

- `public.points_transactions`
- RPC: `public.admin_award_order_points(p_order_id uuid)`

Expected RPC behavior:

- Reject if admin is not signed in / not admin.
- Reject if order is not delivered.
- Reject if customer is not active member.
- Reject if qualified perfume bottle quantity is below 10.
- Reject if points were already awarded for the order.
- Insert confirmed points transaction when valid.

Frontend behavior:

- Admin order drawer shows Award Points only after delivered status.
- Button is guarded and should show helpful messages for below-minimum orders.
- Below 10 bottles is not an error in the business flow. It simply means no points earned.

Related app files:

- `src/admin.js`
- `src/checkout.js`
- `src/components/member-points-page.js`
- `src/components/admin-points-audit-page.js`

Future task:

- Replace preview points pages with real `points_transactions` data.
