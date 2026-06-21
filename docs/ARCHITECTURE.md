# Ama's Kitchen Architecture

The React client serves two surfaces from one Vite application: the public ordering experience at `/` and staff operations at `/admin`. Both consume an Express REST API under `/api`. MongoDB persists orders, catalog, zones, settings, counters, and short-lived idempotency reservations.

## Critical flows

Public bootstrap reads sorted menu items, active zones, settings, environment delivery fee, and Europe/London closure state. Checkout submits a generated idempotency key. The server re-reads every selected record, validates addon limits and availability, calculates integer-pence snapshots, reserves the key, atomically increments the order counter, persists the order, and starts a non-blocking Telegram notification.

Admin login compares the configured bcrypt hash and sends a JWT only in an HttpOnly cookie. Protected routes enforce the status-transition graph and payment eligibility. Menu, zones, and settings use strict Zod contracts; delivery fee has no admin write route.

## API surface

- `GET /health`
- `GET /api/public/bootstrap`
- `POST /api/orders`
- `/api/admin/auth/{login,logout,session}`
- `GET/PATCH /api/admin/orders`
- CRUD `/api/admin/manage/menu` and `/api/admin/manage/zones`
- `GET/PUT /api/admin/manage/settings`

## Reliability and security

Helmet, explicit credentialed CORS, rate limiting, Zod validation, secure cookies, centralized errors, TTL idempotency records, unique indexes, and atomic counters are applied. Telegram failures are logged without rolling back orders. Managed daily backups retained for 30 days are an operational prerequisite documented in `docs/OPERATIONS.md`.
