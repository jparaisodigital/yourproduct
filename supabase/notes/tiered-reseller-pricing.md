# Tiered reseller pricing

This SQL change replaces the old universal member price behavior.

Locked pricing rules:

- Free customer: PHP 349 per bottle
- Starter approved member: PHP 245 per bottle
- Builder approved member: PHP 227 per bottle
- Leader approved member: PHP 210 per bottle
- Prestige approved member: PHP 175 per bottle

Important behavior:

- quote_order_cart(cart_items jsonb) is the source of truth for checkout pricing.
- The function checks the signed-in customer's latest approved membership application.
- If the customer has no approved active package, regular price is used.
- submit_order(...) calls quote_order_cart(...), so saved order item prices follow the server-side quote.
- Frontend cart pricing is only for display/preview. Supabase quote decides the real submitted order amount.

Deprecated:

- Universal PHP 199 member price.
- Using products.member_price as the final reseller price for every member.

Current tier map:

starter = 245
builder = 227
leader = 210
prestige = 175
