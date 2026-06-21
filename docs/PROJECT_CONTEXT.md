# Project Context

## Project Summary

- Project: Ama's Kitchen
- Purpose: Delivery-only guest ordering and single-admin fulfilment platform.
- Maturity: MVP implementation.

## Stack

- Frontend: React 19, Vite 8, Tailwind CSS 4 plus application CSS, Phosphor icons.
- Backend: Node.js, Express 5, CommonJS.
- Database: MongoDB/Mongoose 9.
- Testing: Jest/Supertest server tests; Vitest/React Testing Library client tests.
- Authentication: Single configured admin, bcrypt password hash, JWT HttpOnly cookie.
- Notification: Provider-neutral SMTP through Nodemailer.

## Commands

```bash
npm ci
npm ci --prefix client
npm run seed
npm run dev
npm test
npm test --prefix client
npm run lint --prefix client
npm run build --prefix client
```

## Architecture rules

- API routes remain thin; validation and business rules live at boundaries/services.
- Prices are integer pence internally and formatted as GBP in the client.
- Public order totals, availability, zones, and addons are revalidated server-side.
- Server state is fetched directly; only the versioned cart persists in local storage. JWTs never do.
- Historical order lines contain immutable item/addon name and price snapshots.
- Project Brain JSON under `_workflow/project-brain/` is authoritative workflow memory.

## Constraints

- One restaurant, one admin, delivery and Cash on Delivery only.
- Europe/London time; Sunday closure is absolute.
- Deployment and backup infrastructure are operator-managed and not provisioned by this repository.
