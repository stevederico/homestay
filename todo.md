# todo

## BXStay Premium ($19, Featured Host) door, Nov 15 2026

Built: nothing new in the product. The unlock already shipped in 1.14.0 (the audit said "unlocks nothing"; it was wrong).
- Free limit: 20 listing-detail views per 30 days (`FREE_USAGE_LIMIT`, shared with `POST /api/usage`). `GET /api/listings/:id` answers 402 when spent.
- Paid (`active` or `trialing`, period end not passed): unlimited views, server-side in `require_listing_access`.
- UI: `DetailView` shows `UpgradeRequired` on 402, which opens the skateboard-ui UpgradeSheet (Subscribe). Manage is in the shell Settings.
- Added this pass: test `signed_checkout_webhook_unlocks_a_blocked_free_user` (signed `checkout.session.completed` flips a 402 user to 200). `cargo test --locked`: 301 passed.
- Browser/HTTP check (local, `FREE_USAGE_LIMIT=2`): views 1-2 gave 200, view 3 gave the 402 upgrade screen with the Upgrade sheet; setting the subscription active gave 200s; canceled gave 402 again. Brave CDP dropped mid-run, so the unlock step was checked over curl.

Left:
- Repo `stevederico/homestay` is PUBLIC (open-sourced ahead of 1.17.0). Brief says private-only pushes, so 1.17.2 is committed locally, not pushed or deployed. No runtime code changed, so prod needs no redeploy.
- Prod health not checked: curl to stay.bixbyapps.com gets a Cloudflare 403.
