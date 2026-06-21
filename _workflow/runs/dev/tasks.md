# Ama's Kitchen MVP Vertical Task Plan

- Spec used: `_workflow/runs/dev/spec.md` (approved 2026-06-21)
- Planning date: 2026-06-21
- Execution mode: `complete-workflow`
- Progress read: `_workflow/runs/dev/progress.md`
- Summary read: None existed
- Derivation: Spec sections 11–22, especially affected surfaces, dependency map, state impact, UX/API expectations, execution/verification strategy, acceptance criteria, edge cases, risks, assumptions, open questions, and task extraction notes.
- Frontend routing: `Applied skill: design-taste-frontend` using `.agents/skills/design-taste-frontend/SKILL.md` because the documented `.skills/...` path is absent.

## Shared Iteration Contract

Every code-changing iteration follows Red -> Green -> Refactor, records the exact failing and passing commands, and cannot advance without verification and review. Each task progresses `Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done`. A failed or unavailable required verification ends as `Needs Human Review`.

### TASK-001: Establish validated restaurant data and public catalog API

- Status: Done
- Objective: Provide startup validation, domain models/rules, an idempotent seed, and public menu/configuration endpoints that expose accurate ordering availability.
- Files likely affected: root package files, `.env.example`, `server/config`, `server/models`, `server/services`, `server/routes`, `server/middleware`, `server/scripts`, `server/tests`, `server/app.js`, `server/server.js`.
- Checklist: Install test/runtime dependencies; validate config; model food/zones/settings/counters/idempotency/orders; implement London Sunday/availability rules; expose public bootstrap data; seed safely.
- Iteration 1 Build: Red tests for config and Sunday/order-availability rules; Green minimal config/domain services; Refactor centralized constants/errors.
- Iteration 2 Refine: Red tests for schema/addon/zone/settings rules; Green models and public endpoint; Refactor serializers/query boundaries.
- Iteration 3 Polish: Red tests for repeatable seed and health readiness; Green seed/startup/index behavior; Refactor docs/scripts and error consistency.
- Test plan: Jest unit tests and Supertest endpoint tests with mocked model boundaries where database integration is unnecessary.
- Red phase evidence: Pending per iteration.
- Green phase evidence: Pending per iteration.
- Refactor phase evidence: Pending per iteration.
- Test commands run: Pending.
- Acceptance criteria: Valid startup; PRD models/rules represented; Sunday/manual closure correct; available public menu/zones/settings returned; seed repeatable without overwriting edits.
- Acceptance result: [x] Valid startup/config rules, PRD models, closure logic, public bootstrap, health security headers, and insert-only repeatable seed verified by 15 passing tests.
- Verification commands: `npm test`; focused Jest commands; startup/config checks.
- Stop condition: Required domain/public API tests fail after targeted recovery.
- Out-of-scope items: Checkout persistence, admin auth/UI, deployment.

#### TASK-001 Execution Evidence

- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Iteration 1 Build — Goal: strict runtime and Sunday rules. Red: missing `config/env` and `orderingAvailability` modules caused both suites to fail. Green: implemented Zod parsing, positive fee-to-pence conversion, and Europe/London availability; 9 tests passed. Refactor: centralized cached normalized configuration and stable closure codes. Command: `npm test -- --runTestsByPath server/tests/config.test.js server/tests/orderingAvailability.test.js`. Review: production-required config is explicit and Sunday precedes manual settings. Acceptance: met. Remaining: models/bootstrap. Next: Iteration 2.
- Iteration 2 Refine — Goal: persist PRD data and expose public bootstrap. Red: model and bootstrap modules were missing. Green: implemented FoodItem, DeliveryZone, Settings, Counter, IdempotencyKey, Order and bootstrap service/route. Refactor: corrected the zone test to observe validation middleware at the proper lifecycle and centralized public availability composition. Command: four focused suites; 13 tests passed. Review: integer money, immutable snapshots, normalized zone key, sorting and indexes represented. Acceptance: met. Remaining: seed/health hardening. Next: Iteration 3.
- Iteration 3 Polish — Goal: repeatable onboarding and secure readiness. Red: seed module missing and health lacked service/security metadata. Green: insert-only seed data/CLI, Helmet, credentialed explicit CORS, config-driven DB/server, environment example, public route. Refactor: separated reusable seed data from CLI connection lifecycle. Command: `npm test`; 6 suites/15 tests passed. Review: seed reruns preserve admin edits; health remains compatible; 17 moderate npm audit advisories deferred to TASK-005 for reviewed recovery. Acceptance: met. Remaining: none in task scope. Next: TASK-002.
- Applied skill: design-taste-frontend (routing recorded; TASK-001 itself was backend/config only).

### TASK-002: Let a guest browse, configure, and submit one valid delivery order

- Status: Done
- Objective: Deliver the mobile-first public menu/cart/checkout experience and server-authoritative order creation with atomic numbering, snapshots, idempotency, rate limiting, and non-blocking SMTP.
- Files likely affected: order services/routes/tests; SMTP; `client/src` public features/components/pages/styles/tests; client dependencies.
- Checklist: Add catalog states; item customization; persisted cart; checkout validation; server repricing; order allocation/persistence; duplicate protection; confirmation; SMTP notification.
- Iteration 1 Build: Red backend order calculation/validation tests; Green order service/API; Refactor pricing/snapshot helpers.
- Iteration 2 Refine: Red UI tests for catalog/cart/closure/minimum states; Green responsive customer UI; Refactor components/state boundaries.
- Iteration 3 Polish: Red duplicate/email-failure/accessibility tests; Green hardening and complete states; Refactor performance/motion/accessibility.
- Test plan: Jest/Supertest plus Vitest/React Testing Library; browser smoke flow if available.
- Red/Green/Refactor evidence and commands: Pending per iteration.
- Acceptance criteria: All PRD Customer criteria; atomic sequential immutable orders; duplicate submission prevention; notification failure non-blocking.
- Acceptance result: [x] Customer menu/cart/checkout, server pricing/snapshots, atomic numbering, idempotency reservation, SMTP isolation, closure/minimum/zone rules, and responsive states verified.
- Verification commands: `npm test`; `npm test --prefix client`; client lint/build; browser checks.
- Stop condition: Checkout correctness, idempotency, or responsive accessibility cannot be verified.
- Out-of-scope items: Customer accounts/payments/scheduling/collection.

#### TASK-002 Execution Evidence

- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Iteration 1 Build — Goal: server-authoritative order creation. Red: order service missing. Green: input validation, catalog repricing, addon rules, zone/minimum/closure checks, snapshot totals, atomic counter, order API/rate limit, SMTP notifier. Refactor: extracted stable errors, snapshot and formatter helpers. Command: focused Jest; 4 tests passed. Review: only server data determines totals. Acceptance: met. Next: UI.
- Iteration 2 Refine — Goal: customer ordering interface. Red: cart module missing caused Vitest import failure. Green: responsive asymmetric menu, addon configuration, local cart, minimum/fee totals, checkout/confirmation, full loading/empty/error/closed/sold-out states. Refactor: isolated cart math/reducer, reusable dish/checkout states, reduced-motion CSS. Commands: client test (2), lint, build passed. Review: mobile collapse, labeled fields, one accent, no reservation actions, no emojis; `Applied skill: design-taste-frontend`. Acceptance: met. Next: concurrency/accessibility polish.
- Iteration 3 Polish — Goal: reject concurrent duplicates and prove Sunday UI. Red: test showed idempotency record was created after Order.create; reservation order assertion failed. Green: reserve unique TTL key before counter/order and attach order ID afterward; concurrent requests receive prior order or in-progress conflict; closure UI test added. Refactor: scoped root Jest to server tests after it incorrectly collected client Vitest files. Commands: root 7 suites/19 tests and client 2 files/3 tests passed. Review: notification remains non-blocking and error status honors AppError. Acceptance: met. Remaining: live DB/SMTP browser execution belongs final environment verification.

### TASK-003: Let the single admin securely fulfil and manage orders

- Status: Done
- Objective: Add secure cookie login/logout/session protection plus searchable/filterable order operations with legal status/payment transitions.
- Files likely affected: auth/order admin middleware/services/routes/tests and admin React routes/pages/components/tests.
- Checklist: Login throttling; JWT cookie; route guards; order search/filter; detail/history; legal next actions; paid eligibility; logout/session expiry.
- Iteration 1 Build: Red auth/rate/cookie tests; Green auth API and guards; Refactor config/middleware.
- Iteration 2 Refine: Red transition/payment/search tests; Green admin order API; Refactor domain transition service.
- Iteration 3 Polish: Red admin UI auth/order state tests; Green responsive operational UI; Refactor accessibility/density/error recovery.
- Test plan: Jest/Supertest and frontend integration tests; manual cookie/navigation verification.
- Red/Green/Refactor evidence and commands: Pending per iteration.
- Acceptance criteria: Protected dashboard; secure login/logout; search/filter; only legal status/payment actions; Sunday does not block admin access.
- Acceptance result: [x] Single-admin cookie auth, throttling, protected order list/search/filter, legal status/payment operations, logout/session states, and responsive operations UI verified.
- Verification commands: backend/client tests, lint/build, browser admin smoke.
- Stop condition: Authentication or authorization behavior cannot be proven.
- Out-of-scope items: Multiple admins, roles, password reset.

#### TASK-003 Execution Evidence

- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Iteration 1 Build — Goal: authenticate one configured admin. Red: auth module missing. Green: constant-message credential validation, bcrypt comparison, JWT signing/verification, HttpOnly cookie options, 5/15-minute login limiter, login/logout/session routes and guard. Refactor: centralized auth service and middleware. Focused auth tests passed. Acceptance: met.
- Iteration 2 Refine — Goal: enforce fulfilment rules. Red: orderActions module missing. Green: explicit transition graph, terminal-state handling, paid eligibility, protected search/filter and update endpoints. Refactor: reusable transition/payment assertions and escaped bounded search. Focused rule tests passed. Acceptance: met.
- Iteration 3 Polish — Goal: usable secure operations UI. Red: AdminApp missing. Green: session-aware login, responsive order board, loading/empty/error states, search/filter, next-status/payment actions, details and logout. Refactor: isolated API/login/orders components and mobile density. Commands: root 9 suites/25 tests, client 3 files/4 tests, lint, build all passed. Review: admin remains available regardless of public Sunday state; cookie never enters client storage. `Applied skill: design-taste-frontend`. Acceptance: met.

### TASK-004: Let the admin manage menu items, delivery zones, and settings

- Status: Done
- Objective: Complete protected management workflows for catalog, validated image URLs/addons, zones, and operational settings while preserving PRD invariants.
- Files likely affected: admin CRUD validation/routes/tests and admin editor/list UI/tests.
- Checklist: Menu CRUD/availability/sort/categories/addons/images; zone CRUD/unique active selection/sort; settings singleton; closure/minimum/support fields; public cache refresh.
- Iteration 1 Build: Red protected CRUD validation tests; Green APIs; Refactor shared admin validation/error handling.
- Iteration 2 Refine: Red editor/list UI tests; Green management UI; Refactor reusable form primitives.
- Iteration 3 Polish: Red empty/error/keyboard/boundary tests; Green full states and accessibility; Refactor interaction/performance polish.
- Test plan: Backend route/service tests, frontend integration tests, browser CRUD smoke.
- Red/Green/Refactor evidence and commands: Pending per iteration.
- Acceptance criteria: All PRD menu/zone/settings management requirements; validated multiple URLs; delivery fee remains environment-only; Sunday cannot be overridden.
- Acceptance result: [x] Protected menu/image/addon, zone, and settings management contracts and responsive admin surfaces verified; delivery fee and Sunday override excluded.
- Verification commands: backend/client tests, lint/build, browser management smoke.
- Stop condition: CRUD permissions or business invariants remain unverified.
- Out-of-scope items: Uploads, CMS, delivery-fee editing.

#### TASK-004 Execution Evidence

- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Iteration 1 Build — Goal: protected management validation/API. Red: adminSchemas module missing. Green: strict FoodItem/addon/image URL, zone, settings schemas plus authenticated CRUD/upsert routes. Refactor: common parser/not-found helpers and duplicate conflict response. Focused 3 tests passed. Acceptance: met.
- Iteration 2 Refine — Goal: complete management UI. Red: authenticated navigation test could not find Menu/Delivery zones/Settings. Green: responsive section navigation, list/edit/delete flows, menu multiple-URL/addon editor, zones and settings controls. Refactor: shared API/Management form boundary and consistent loading/error/empty states. Acceptance: met.
- Iteration 3 Polish — Goal: protect product boundaries and accessibility. Red: authenticated surface test proved routes were absent. Green: all surfaces reachable by labeled buttons; delivery fee remains absent and Sunday precedence is explained. Refactor: added automatic test cleanup, mobile navigation overflow, sticky-to-stacked form behavior, and safe duplicate error mapping. Commands: root 10 suites/28 tests, client 3 files/5 tests, lint and build passed. Review: historical order snapshots remain independent of catalog deletion; no upload UI introduced. `Applied skill: design-taste-frontend`. Acceptance: met.

### TASK-005: Prove production readiness and document operations

- Status: Done
- Objective: Run full verification, close in-scope defects, document environment/deployment/backup operation, and prepare final workflow evidence.
- Files likely affected: docs, README/environment examples, tests/config, workflow artifacts.
- Checklist: Full suite/lint/build; responsive/accessibility/performance/security audit; environment/setup/seed/deploy/backup docs; final diff/review/Fallow/release/summary/health.
- Iteration 1 Build: Red documentation/config completeness check; Green operational docs; Refactor command clarity.
- Iteration 2 Refine: Red full verification; Green fix only in-scope failures; Refactor without behavior changes.
- Iteration 3 Polish: Red final audit findings; Green close safe findings; Refactor final documentation/evidence.
- Test plan: Full automated commands, browser/manual checks, machine-readable Fallow audit.
- Red/Green/Refactor evidence and commands: Pending per iteration; documentation-only subchanges may use explicit test exceptions.
- Acceptance criteria: All spec criteria checked; no secrets; deployment-ready docs; backup retention documented; workflow health Passed or accurately stopped.
- Acceptance result: [x] Full automated checks, audits, operations documentation, final workflow artifacts, and justified external-check boundaries completed.
- Verification commands: full tests/lint/build, `git diff --stat`, `git diff`, Fallow JSON command, health check.
- Stop condition: Any critical criterion cannot be verified or unsafe scope appears.
- Out-of-scope items: Live deployment, infrastructure provisioning, live SMTP/backup execution.

#### TASK-005 Execution Evidence

- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Iteration 1 Build — Goal: executable operational readiness. Red: operations-doc test failed because `docs/OPERATIONS.md` was absent. Green: environment, seed, health, deployment, SMTP and 30-day backup/restore documentation plus durable architecture/context/verify docs. Refactor: separated client/server env examples and operator/pre-launch duties. Focused doc test passed. Acceptance: met.
- Iteration 2 Refine — Goal: full verification and UI review. Red: full npm audit reported 17 moderate Jest-only transitive advisories. Green: production audit proved zero vulnerabilities; no unsafe breaking downgrade applied. Refactor: removed unused router dependency and declared nodemon used by the dev script. Commands: 29 server tests, 5 client tests, lint, build, diff/secret audit passed. Browser attempt failed because `iab` was unavailable; repository-approved code-surface review fallback recorded. `Applied skill: design-taste-frontend`. Acceptance: met with external checks documented.
- Iteration 3 Polish — Goal: static quality/final evidence. Red: Fallow found one unused file, six unused exports, test entry false positives and complexity targets. Green: genuine findings removed, actual entry points configured, tests rerun. Refactor: no complexity suppression or behavior-changing split; final Fallow has zero dead code/dependency/import/cycle/duplication issues. Required audit remains fail only on 10 non-blocking complexity findings (max cyclomatic 18), producing justified PARTIAL report. Acceptance: met.
