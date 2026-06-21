# Ama's Kitchen MVP Release Notes

## Request

Implement the complete delivery-ordering MVP in `Amas-Kitchen-PRD.md`.

## User-facing changes

- Responsive customer menu with category grouping, sold-out and closure states, addon selection, cart persistence, live minimum/fee totals, guest delivery checkout, and order confirmation.
- Absolute Sunday closure and manual closure messaging while keeping the menu visible.
- Cash-on-Delivery and active delivery-zone enforcement.
- Single-admin login and operations workspace for order search/filter, legal fulfilment transitions, payment status, menu items, image URLs/addons, delivery zones, and restaurant settings.
- Applied skill: design-taste-frontend.

## Developer changes

- Strict Zod environment/request validation, integer-pence calculations, centralized errors, Helmet/CORS/rate limiting, JWT HttpOnly cookies, SMTP notification boundary, atomic counters, TTL idempotency reservations, insert-only seeding, and automated server/client tests.
- Added operations, architecture, context, and verification documentation.

## New routes/APIs

- `GET /health`, `GET /api/public/bootstrap`, `POST /api/orders`.
- `/api/admin/auth/login|logout|session`.
- `GET/PATCH /api/admin/orders`.
- CRUD `/api/admin/manage/menu`, CRUD `/api/admin/manage/zones`, and `GET/PUT /api/admin/manage/settings`.

## New env vars

`DELIVERY_FEE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `JWT_EXPIRES_IN`, SMTP variables, `ORDER_NOTIFICATION_EMAIL`, and client `VITE_API_URL`; existing Mongo/origin/port variables remain required as documented.

## Database/schema changes

New Orders, FoodItems, DeliveryZones, Settings, Counters, and IdempotencyKeys collections with unique, TTL, sorting, search, and status indexes.

## Dependencies

- Added runtime: bcryptjs, cookie-parser, express-rate-limit, helmet, jsonwebtoken, nodemailer, zod, Phosphor React icons.
- Added dev/test: supertest, nodemon, Vitest, jsdom, React Testing Library/Jest DOM/User Event.
- Removed unused react-router-dom.

## Tests and quality

- Server: 11 suites/29 tests passed.
- Client: 3 files/5 tests passed.
- Client lint and production build passed.
- Production npm audit: zero vulnerabilities. Full audit has 17 moderate Jest-toolchain findings with no safe non-breaking npm remediation.
- Fallow: PARTIAL; no dead code/dependency/cycle/duplication blockers, documented complexity targets remain.

## Known limitations and follow-up

- Live Mongo concurrency/load, SMTP delivery, HTTPS cookies/CORS, Lighthouse/API latency, and 30-day backup restoration require pre-launch infrastructure verification.
- Browser screenshots were unavailable; tested states and code-surface review were used.
- Refactor large public/admin vertical-slice modules when future feature growth makes the change behaviorally useful.

## Suggested commit message

`feat: implement Ama's Kitchen ordering MVP`
