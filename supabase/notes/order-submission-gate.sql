-- Applied to the dev project on 2026-09-28.
-- Keep order submission closed until payment details and the full flow are approved.
revoke execute on function public.submit_order(jsonb, jsonb, text, text)
from authenticated;

-- Only after the payment flow is ready and tested:
-- grant execute on function public.submit_order(jsonb, jsonb, text, text)
-- to authenticated;