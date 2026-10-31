# BXStay

Stay listings app. Browse verified vacation stays, open a listing, pick dates, request a booking.

**Version:** 1.15.0 | **Domain:** [stay.bixbyapps.com](https://stay.bixbyapps.com)

## Tech Stack

- React 19, Vite 8, skateboard 5.6.0, skateboard-ui 5.11.0
- Zero-crate Rust backend, SQLite (auth + a separate read-only listings catalog)
- Tailwind CSS v4

## Setup

```bash
npm install
npm run start          # Frontend :5173
cd backend && cargo run   # Backend :8000
```

Seed the listings catalog (once, from `backend/seed/listings.json`):

```bash
node backend/scripts/seed-listings.mjs
```

## Scripts

- `npm run start` — Frontend dev server
- `npm run build` — Production frontend build
- `cd backend && cargo test --locked` — Backend tests
- `npm run test` — Frontend typecheck + script tests

## Routes

**Public:** `/`, `/terms`, `/privacy`, `/subs`, `/eula`
**Protected:** `/app/home` (listings grid), `/app/r/:id` (listing detail)

## API

- `GET /api/listings` — public catalog, newest first
- `GET /api/listings/:id` — single listing; signed-in only. Free users get `FREE_USAGE_LIMIT` (default 20) listing views per 30 days, then 402 and an upgrade prompt. Premium Host ($19/mo, `bxstay_premium`) is unlimited

---

<div align="center">
  Made with <a href="https://github.com/stevederico/skateboard">Skateboard</a> — a React boilerplate with auth and payments
</div>
