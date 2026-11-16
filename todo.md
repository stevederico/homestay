# todo

## BXStay Premium ($19, Featured Host) door, Nov 15 2026

Built: nothing new in the product. The unlock already shipped in 1.14.0 (the audit said "unlocks nothing"; it was wrong).
- Free limit: 20 listing-detail views per 30 days (`FREE_USAGE_LIMIT`, shared with `POST /api/usage`). `GET /api/listings/:id` answers 402 when spent.
- Paid (`active` or `trialing`, period end not passed): unlimited views, server-side in `require_listing_access`.
- UI: `DetailView` shows `UpgradeRequired` on 402, which opens the skateboard-ui UpgradeSheet (Subscribe). Manage is in the shell Settings.
- Added this pass: test `signed_checkout_webhook_unlocks_a_blocked_free_user` (signed `checkout.session.completed` flips a 402 user to 200). `cargo test --locked`: 301 passed.
- Browser/HTTP check (local, `FREE_USAGE_LIMIT=2`): views 1-2 gave 200, view 3 gave the 402 upgrade screen with the Upgrade sheet; setting the subscription active gave 200s; canceled gave 402 again. Brave CDP dropped mid-run, so the unlock step was checked over curl.

Live (Nov 15 2026, after deploy of 1.17.2, image a201efd, Dokploy `bxstay`, 1/1):
- `/api/health` 200, catalog 200, anonymous detail 401, bad-signature `POST /api/payment` 400.
- Throwaway free user (`door-check-1115@example.com`): 20 views gave 200, the 21st gave 402 "Upgrade to Featured Host for unlimited listing views" (total 20).
- Unlock was NOT run live: it needs a real Stripe subscription (the webhook re-fetches it from Stripe), and no real money. Covered by the signed-webhook test and the local run above.

Left:
- Delete the throwaway prod user `door-check-1115@example.com` (no delete done; prod DB rows left as is).
- A real $19 purchase end to end is untested by design.
