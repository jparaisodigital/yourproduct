# Referral commissions and payout requests

Purpose:

Members need a personal referral link. When a new customer registers through that link and later buys an approved membership package, the direct referrer earns 10% commission.

Locked rules:

- Direct referral only.
- No downline, binary, pairing, or multi-level commission.
- Referral code comes from `profiles.username`.
- New customer signup stores the incoming code as `referral_code_entered`.
- Commission is created after membership application approval.
- Commission amount is 10% of the approved package amount.
- Company manually reviews and pays payout requests.

Frontend behavior:

- Active members see their personal referral link in the dashboard General page.
- Link format: `/register/?ref={username}`.
- Register page validates referral code against active member profiles.
- Invalid referral links can be ignored by choosing continue without referral.
- Member Earnings page loads real referral commission rows.
- Member Payout page submits payout requests through Supabase RPC.
- Admin Referrals/Payouts page loads real referral records and payout requests.

Database objects added:

- `public.referral_commissions`
- `public.payout_requests`

RPC added:

- `public.lookup_referral_member(referral_code text)`
- `public.customer_create_payout_request(...)`
- `public.admin_update_payout_request(...)`

Trigger added:

- `create_referral_commission_after_membership_approval`

Expected trigger behavior:

- Runs after membership application update.
- Creates commission only when application becomes approved.
- Looks up referred customer's `profiles.referral_code_entered`.
- Matches it to an active member's `profiles.username`.
- Inserts one 10% commission record.
- Does not create downline commissions.

Related app files:

- `src/register.js`
- `src/dashboard.js`
- `src/components/member-referral-card.js`
- `src/components/member-earnings-page.js`
- `src/components/member-payout-page.js`
- `src/components/admin-referrals-payouts-page.js`

Launch note:

Before launch, test records can be deleted, but keep schema, triggers, RPC functions, products, and admin account.
