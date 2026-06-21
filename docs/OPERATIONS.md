# Ama's Kitchen Operations

## Local setup

1. Use Node.js 20 or newer and a MongoDB replica set/service compatible with Mongoose 9.
2. Copy `.env.example` to `.env` and replace every security, database, origin, and SMTP value.
3. Generate the admin password hash without storing the plaintext password:

   ```powershell
   node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "replace-this-password"
   ```

4. Install dependencies with `npm ci` and `npm ci --prefix client`.
5. Initialize missing sample data with `npm run seed`. The command uses insert-only upserts: rerunning it does not overwrite menu, zone, or settings edits.
6. Start both applications with `npm run dev`. The public site is `/`; staff use `/admin`.

## Required configuration

- `MONGO_URI`: production MongoDB connection string.
- `CLIENT_URL`: comma-separated allowed browser origins. Production must contain only trusted HTTPS origins.
- `DELIVERY_FEE`: positive GBP amount with at most two decimal places. Startup fails when invalid.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`: the single admin identity and bcrypt hash.
- `JWT_SECRET`: a long, randomly generated secret; rotate by redeploying and forcing sessions to expire.
- `JWT_EXPIRES_IN`: token duration, normally `7d`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: SMTP relay details.
- `ORDER_NOTIFICATION_EMAIL`: recipient for every new-order email.
- Client: set `VITE_API_URL` to the public HTTPS API origin before `npm run build --prefix client`.

Never commit `.env`. Restrict production environment access and rotate any exposed value immediately.

## Deployment readiness

- Run `npm test`, `npm test --prefix client`, `npm run lint --prefix client`, and `npm run build --prefix client`.
- Run `npm run seed` once against the intended database and replace example content in the admin dashboard.
- Serve the API behind a trusted TLS proxy. The production cookie is `Secure`, `HttpOnly`, and `SameSite=None`; configure the proxy to preserve HTTPS and allow credentials only from `CLIENT_URL`.
- Route the built client to `client/dist` with SPA fallback so `/admin` loads the application entrypoint.
- Configure process restart, centralized error logs, and alerting.

## Health and monitoring

- `GET /health` returns HTTP 200 with `status: ok` and `service: amas-kitchen-api` when the process is serving requests.
- A platform health check should call it every 30–60 seconds and alert after repeated failures.
- Monitor API latency against the PRD's under-500 ms target, database errors, HTTP 5xx rate, login throttling, and the `Order notification failed` log.
- SMTP failure does not fail an order. Staff must use the dashboard as the authoritative order queue.

## Database backups

Use the managed MongoDB provider's automated daily backup/snapshot facility. Retain daily backups for at least 30 days. This repository does not provision backup infrastructure.

Before launch and quarterly thereafter:

1. Confirm the backup policy is enabled for the production cluster and retains 30 days.
2. Restore the newest snapshot into an isolated non-production project.
3. Verify orders, counters, food items, delivery zones, settings, and idempotency indexes.
4. Record the restore time and any corrective action in the operator's incident/runbook system.

Never test a restore over the live production database.

## Operational rules

- The Europe/London Sunday closure cannot be overridden. Admin access remains available.
- Delivery fee changes require a configuration update and restart; it is intentionally absent from Settings.
- Order numbers can have gaps and must never be manually reused or reset.
- Do not modify historical order item names/prices; they are immutable checkout snapshots.
- To close ordering Monday–Saturday, disable it under Admin → Settings and provide a customer-facing reason.
