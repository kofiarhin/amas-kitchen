# Amas Kitchen Technical Specification

## 1. Scope

This document defines the technical baseline for Amas Kitchen, a MERN-style food ordering application with a React/Vite frontend, an Express/MongoDB backend, protected administration routes, and optional Telegram order notifications.

## 2. Architecture

```text
Browser
  |
  v
React + Vite client
  |
  v
Express API
  |--------> MongoDB
  |--------> Telegram Bot API
  |
  +--------> compiled client/dist in production
```

The backend is the authority for authentication, menu availability, order validation, price calculation, persistence, and administrative authorization.

## 3. Runtime and dependencies

### Server

- Node.js 22.x and npm 10.x
- Express 5
- Mongoose 9
- JWT authentication
- bcrypt password hashing
- Zod validation
- Helmet, CORS, cookie-parser, and express-rate-limit
- Jest and Supertest

### Client

- React frontend built with Vite
- Production output written to `client/dist`

## 4. Repository layout

```text
client/                         frontend source and build configuration
server/
  server.js                     backend entrypoint
  models/                       Mongoose models
  routes/                       public, order, authentication, and admin routes
  controllers/                  request handlers where present
  middleware/                   authentication, errors, validation, and security
  scripts/seed.js               seed workflow
  tests/                        Jest/Supertest tests
docs/                           product and operational documentation
```

The exact folders may evolve, but route handling, validation, persistence, and external integrations should remain separated.

## 5. Configuration

Required environment variables must be validated during startup. Typical configuration includes:

| Variable | Purpose |
| --- | --- |
| `PORT` | API listening port. |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET` | Token-signing secret. |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram bot credential. |
| `TELEGRAM_CHAT_ID` | Optional destination for order notifications. |
| `CLIENT_ORIGIN` or equivalent | Approved browser origin for production CORS. |
| `NODE_ENV` | Runtime mode. |

The implementation is authoritative for exact names. Startup should fail clearly when mandatory values are absent.

## 6. API domains

### Public/bootstrap API

Provides menu and application bootstrap data. Responses should omit internal-only fields and expose only currently available content.

### Order API

Accepts customer and cart data, validates current menu records, recalculates totals, creates an order snapshot, persists the order, and then attempts notification delivery.

### Authentication API

Authenticates administrators and issues the configured session or token mechanism. Authentication responses must not expose password hashes or secrets.

### Administration API

Supports protected menu and order management. Every route must enforce both authentication and authorization.

## 7. Canonical request lifecycle

1. Security middleware applies headers, CORS, body limits, and rate limiting.
2. Authentication middleware resolves the acting administrator where required.
3. Zod schemas validate route params, query values, and body data.
4. Controller or service logic applies business rules.
5. Mongoose persists or queries data.
6. A consistent response or error envelope is returned.
7. Side effects such as Telegram notification occur only after durable order creation.

## 8. Data model requirements

### Menu item

Recommended fields:

```text
_id
name
description
category
priceMinor or decimal-safe price representation
isAvailable
imageUrl or media reference
createdAt
updatedAt
```

Money must not rely on unbounded binary floating-point arithmetic. Store minor currency units or use a validated decimal representation.

### Order

Recommended fields:

```text
_id
customer
fulfillment
items[]
  menuItemId
  nameSnapshot
  unitPriceSnapshot
  quantity
subtotal
total
status
notes
createdAt
updatedAt
```

Order items must preserve names and prices at purchase time so later menu edits do not alter historical meaning.

### Administrator

Recommended fields:

```text
_id
email or username
passwordHash
role
isActive
createdAt
updatedAt
```

## 9. Order creation algorithm

1. Validate customer, fulfillment, and cart structure.
2. Reject empty carts and invalid quantities.
3. Fetch all referenced menu items in one query where practical.
4. Reject missing or unavailable items.
5. Build item snapshots from server-side records.
6. Calculate subtotal and total on the server.
7. Persist the complete order.
8. Return confirmation containing a stable order identifier.
9. Attempt Telegram notification without rolling back the stored order when notification fails.

Idempotency support should be added before integrating payment or unreliable client retries.

## 10. Authentication and authorization

- Passwords must be hashed with bcrypt using an appropriate work factor.
- JWTs must use a strong secret and explicit expiration.
- Cookies, when used, should be `HttpOnly`, `Secure` in production, and use an appropriate `SameSite` policy.
- Administrative authorization must be enforced server-side for every mutation.
- Authentication endpoints should have stricter rate limits than general public reads.
- Token or session revocation strategy must be defined for production administration.

## 11. Security controls

- Helmet enabled with reviewed policy.
- Production CORS restricted to approved origins.
- JSON and form body-size limits.
- Zod validation for all untrusted input.
- No trust in client prices, totals, roles, or order states.
- MongoDB queries built from validated values to reduce operator injection risk.
- Secrets held only in environment configuration.
- Logs scrubbed of tokens, passwords, cookies, and customer-sensitive data.
- Dependency and secret scanning in CI.

## 12. Error model

Recommended envelope:

```json
{
  "error": {
    "code": "MENU_ITEM_UNAVAILABLE",
    "message": "One or more selected items are no longer available.",
    "details": {}
  }
}
```

Recommended mapping:

| Status | Meaning |
| --- | --- |
| `400` | Invalid input. |
| `401` | Missing or invalid authentication. |
| `403` | Authenticated but unauthorized. |
| `404` | Resource not found. |
| `409` | State conflict or stale order/menu state. |
| `429` | Rate limit exceeded. |
| `500` | Unexpected server failure. |
| `503` | Database or required dependency unavailable. |

External-notification failure should normally be recorded internally rather than returned as an order-creation failure after persistence succeeds.

## 13. Frontend requirements

- Fetch public menu data from the API.
- Maintain cart state with validated quantities.
- Display totals as estimates until confirmed by the server.
- Prevent accidental duplicate submissions while a request is active.
- Show actionable validation and network errors.
- Provide protected administrative views only as a convenience; server authorization remains mandatory.
- Support mobile-first responsive layouts and accessible form controls.

## 14. Testing strategy

### Unit tests

- order total calculation;
- allowed order-state transitions;
- validation schemas;
- token and authorization helpers;
- notification message formatting.

### API tests

- public menu retrieval;
- successful and failed authentication;
- protected-route enforcement;
- successful order creation;
- rejection of stale prices and unavailable items;
- rate limits on sensitive endpoints;
- menu and order administration;
- stored order survives Telegram failure.

### Frontend tests

- menu loading states;
- cart quantity behavior;
- checkout validation;
- order success and failure states;
- admin authentication and authorization-error handling.

### End-to-end tests

- seed isolated database;
- browse menu;
- place order;
- verify persisted totals and snapshots;
- authenticate administrator;
- update order state.

## 15. CI and deployment

The CI pipeline should:

1. install root and client dependencies;
2. lint server and client code;
3. run Jest/Supertest tests against an isolated database;
4. build the Vite client;
5. scan for secrets and vulnerable dependencies;
6. deploy only after required checks pass.

Heroku production behavior:

- `heroku-postbuild` installs client dependencies and creates `client/dist`;
- `npm start` runs `server/server.js`;
- the server serves the compiled frontend and API;
- environment variables are supplied through platform configuration.

## 16. Observability and operations

- Provide liveness and readiness endpoints.
- Log request correlation IDs, route, status, and duration.
- Log order identifiers for operational tracing without logging unnecessary customer data.
- Record Telegram delivery success or failure separately from order persistence.
- Monitor database connectivity, error rate, order submission failures, and authentication failures.
- Define backup, restore, and retention procedures for MongoDB.

## 17. Acceptance criteria

The documented baseline is satisfied when:

- the README reproduces local installation, test, seed, and start workflows;
- PRD and technical specification are linked from the repository root;
- all protected routes enforce server-side authorization;
- order totals are derived only from server-side menu data;
- order persistence is independent of Telegram availability;
- critical workflows are covered by automated tests and required CI checks.
