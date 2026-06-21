# Ama's Kitchen MVP Implementation Specification

## 1. Metadata

- Spec filename: `_workflow/runs/dev/spec.md`
- Date: 2026-06-21
- Request ID / slug: `amas-kitchen-mvp`
- Request source: Direct user request and `Amas-Kitchen-PRD.md`
- Execution mode: `complete-workflow`
- Request classification: Full-stack product implementation with frontend UI
- Scope level: Large MVP
- Risk level: High due to authentication, ordering integrity, concurrency, and broad UI/API scope

## 2. Original Request

- Raw user request: `lets implement the prd Amas-Kitchen-PRD.md`
- Normalized request: Implement the complete Ama's Kitchen MVP defined by the PRD using the existing MERN repository and confirmed intake decisions.
- Source prompt / request reference: `_workflow/runs/dev/request.md`

## 3. Questions And Answers

- Questions asked: Notification transport; food-image management; initial data creation; deployment/backup scope.
- Answers received: Configurable SMTP/Nodemailer; validated multiple image URLs without uploads; idempotent editable seed data; deployment-ready code/docs without deployment or infrastructure provisioning.
- Questions skipped: None.
- Remaining open questions: Non-blocking environment values and final production hosting provider.

## 4. Problem Definition

- Problem being solved: The repository contains a static restaurant landing page and minimal Express health service, but lacks the PRD's ordering and administrative product.
- Why it matters: Customers need a reliable delivery-order path and staff need one protected operational interface.
- Current pain point: Menu content is hard-coded, calls to action advertise unsupported reservations, and no order, authentication, persistence, or management workflows exist.
- Expected value: A deployable MVP supporting guest delivery orders and end-to-end staff fulfilment management.

## 5. Current State Analysis

- Existing behavior: React/Vite renders a static image-led landing page. Express exposes `/` and `/health` and connects to MongoDB.
- Existing architecture/components: Root CommonJS Express server; separate React 19/Vite 8 client; Tailwind CSS 4 is installed; Mongoose is connected but no models exist.
- Existing files/modules likely involved: `client/src/*`, `server/*`, root/client package manifests, environment and documentation examples.
- Existing data flow: Client optionally calls API health; no application data flow.
- Existing API/UI/CLI/workflow behavior: Static UI, no routes, state, forms, admin, or seed CLI.
- Existing tests or verification coverage: No repository tests or test scripts beyond an unused root Jest dependency; client has lint/build scripts.

## 6. Desired End State

- Expected final behavior: A responsive public menu/cart/checkout and protected admin application backed by validated REST APIs and MongoDB.
- User-facing outcome: Guests browse available and sold-out food, configure addons, order eligible delivery items for Cash on Delivery, and receive a clear confirmation/order number.
- Developer-facing outcome: Layered, tested modules for models, validation, business rules, controllers, routes, API clients, and UI features.
- System/workflow outcome: Atomic order numbers, idempotent submissions, immutable order snapshots, guarded state transitions, non-blocking email notifications, and documented operations.
- Backward compatibility expectations: Preserve `/health`; replace placeholder reservation behavior. Existing Cloudinary URLs can seed food images.

## 7. Scope

- In scope: All requirements and acceptance criteria in PRD v3.0, including public ordering, admin auth/dashboard, menu/zones/settings management, security controls, tests, seed tooling, and operational documentation.
- Out of scope: Customer accounts, online/mobile payments, collection/scheduling, multi-admin roles, rider tooling, inventory, loyalty, coupons, bulk/catering, mobile app, CMS, media upload/provider administration, deployment, and infrastructure provisioning.
- Non-goals: Building speculative future-enhancement abstractions or a custom backup scheduler.
- Explicit boundaries: Delivery fee remains environment-only; Sunday closure is absolute; customer notification is not added.

## 8. Users And Use Cases

- Primary users: Guest customers and one restaurant administrator/staff account.
- Secondary users: Deployment/operator personnel consuming health and setup documentation.
- Main use cases: Browse menu; customize cart items; meet minimum and select active zone; submit order once; administer order fulfilment/payment; manage menu/zones/settings.
- Edge use cases: Sunday browsing, manual closure, sold-out items, changing catalog after cart creation, duplicate submissions, email outage, invalid transition/payment action, unavailable delivery zone.

## 9. Functional Requirements

- Required behaviors: Implement every PRD rule for ordering, delivery zones/fee, payment status, status transitions, cancellation, snapshots, Sunday closure, notifications, search/filter, and CRUD management.
- Inputs: Customer/order fields, configured item/addon selections, quantities, delivery zone, notes, idempotency key, admin credentials, and admin CRUD/update inputs.
- Outputs: Public menu/configuration state, calculated cart/checkout UI, persisted order confirmation, admin datasets/actions, and consistent API errors.
- State changes: Orders and histories; food availability/content; delivery-zone state/order; singleton settings; counter increments; short-lived idempotency records or equivalent unique records.
- Error states: Closed ordering, invalid/changed items or addons, below minimum, unsupported zone, duplicate key, validation failure, unauthorized admin, illegal status/payment transition, SMTP failure, and server/database failure.
- Permissions/auth expectations: Public read/menu/config and rate-limited order creation; all administrative reads/writes protected by JWT in HttpOnly cookie; no customer auth.

## 10. Non-Functional Requirements

- Performance expectations: Standard API responses target under 500 ms; add appropriate indexes and avoid N+1 access; frontend images are responsive/lazy where appropriate; Lighthouse target above 90 is manually audited where tooling permits.
- Reliability expectations: Atomic sequencing and order creation transaction where supported; idempotency keys expire after 10 minutes; email cannot block order creation; graceful startup/shutdown and useful logs.
- Security/privacy expectations: Helmet, explicit credentialed CORS, Zod boundary validation, cookie hardening, login/order rate limits, password hash comparison, secret-free repository, minimized error leakage.
- Accessibility expectations: WCAG AA-oriented semantic landmarks, labels, keyboard/focus support, contrast, status announcements, and accessible dialogs/forms.
- Maintainability expectations: Thin routes, separated services/business rules, centralized errors/config, reusable UI primitives, no duplicated monetary/status logic.
- DX expectations: Environment example, seed command, test/lint/build scripts, setup and operational documentation.

## 11. Affected Surfaces

- Files likely affected: Root/client package manifests and lockfiles; most of `client/src`; most of `server`; documentation and environment example; workflow artifacts.
- Directories likely affected: `client/src/components`, `client/src/features`, `client/src/pages`, `client/src/lib`, `server/config`, `server/models`, `server/routes`, `server/controllers`, `server/services`, `server/middleware`, `server/validation`, `server/tests`, `server/scripts`.
- UI surfaces: Public navigation, ordering-state banner, menu/category sections, item customization, cart, checkout, confirmation, admin login, dashboard/order detail, menu editor, delivery-zone editor, settings editor.
- API routes: Health; public menu/settings/zones/order creation; admin auth/session; admin orders; menu items; zones; settings.
- Components: Routing/layout, forms, dialogs/drawers, status controls, tables/lists, feedback/empty/loading/error states.
- Services: Ordering rules/calculation, counter allocation, idempotency, SMTP notification, auth, closure/time, seed.
- Database/schema: Orders, FoodItems, DeliveryZones, Settings, Counters, and a durable/TTL-backed idempotency mechanism.
- Config/env vars: Mongo, client/API origins, delivery fee, admin auth/JWT/cookies, SMTP sender/recipient/credentials, environment/port/proxy settings.
- Tests: Backend unit/integration tests and frontend component/integration tests for critical behaviors.
- Docs: Project context, architecture, verification/setup/deployment/backup requirements, environment reference.
- Workflow artifacts: All run-scoped evidence plus Fallow audit at the required stage.

## 12. Dependency And Integration Map

- Internal dependencies: Checkout depends on public catalog/config/zones; order creation depends on validation, closure/settings, catalog repricing, counter, idempotency, persistence, and notification; admin UI depends on cookie-auth APIs.
- External packages/services: MongoDB/Mongoose; Nodemailer/SMTP; JWT/password hashing; Zod; Helmet/rate limiting; React routing, query/state/form/test tooling selected during planning.
- Integration points: MongoDB, SMTP relay, browser cookie/CORS boundary, Cloudinary-hosted URL assets.
- Ordering constraints: Establish config/errors/models/business-rule tests before route/UI integration; build public order flow before admin fulfilment flow; preserve vertical task slices.
- Migration/setup requirements: Install dependencies, add environment template, seed initial data, ensure TTL/unique/index definitions, document production cookie/proxy/origin configuration.

## 13. Data And State Impact

- Data models: Implement PRD schemas with timestamps, indexes, validation, immutable order snapshots, status history, and singleton settings behavior.
- Database changes: New application collections and indexes; no legacy migration is evident.
- State management changes: Server state through query hooks; local cart persisted in local storage with validation/versioning; transient form/UI state stays local.
- Cache/session/local storage impact: Cart only; JWT remains in HttpOnly cookie and never client storage; server/menu queries invalidate after admin writes.
- Backward compatibility impact: New database required; health endpoint retained; static hard-coded menu becomes seed-managed data.

## 14. UX / API / Workflow Expectations

- UX expectations: Mobile-first, food-led visual hierarchy, clear availability/closure/minimum/fee states, compact cart access, no reservation language, and resilient feedback for every mutation.
- API contract expectations: Consistent JSON success/error shapes; validation errors are actionable but do not expose internals; money returned consistently; credentials included for admin calls.
- CLI/workflow behavior: Provide idempotent seed command and documented start/test/lint/build workflows.
- Error handling expectations: Loading, empty, success, closed, sold-out, validation, conflict/duplicate, unauthorized, and unexpected failure states are explicitly rendered.
- Empty/loading/success/failure states: Required for public menu/checkout and every admin list/editor.

## 15. Execution Strategy

- Recommended implementation approach: Deliver small vertical slices: foundation/config; public catalog/cart; secure checkout/order creation; admin auth/order operations; admin catalog/zones/settings; hardening/docs.
- Suggested sequencing: Establish tests and core domain rules first within each slice, expose API behavior, then integrate the relevant UI and accessibility states.
- Safe rollout/migration approach: Additive schemas/routes, repeatable seeds, explicit startup validation, environment-gated secure cookies, and no destructive seed updates to existing operator-edited records.
- Files to inspect before editing: Saved handoff/progress/spec/tasks, package manifests, current client/server entrypoints, relevant docs, and dirty status.
- Decisions to avoid until more evidence exists: Hosting-specific deployment files, vendor-specific backup automation, media uploads, customer auth, and generalized role systems.

## 16. Verification Strategy

- Required automated checks: Backend unit/integration tests; frontend component/integration tests; root/client lint; production client build; server startup/config validation; focused concurrency/idempotency tests where feasible.
- Required manual checks: Responsive critical flows, keyboard navigation/focus, Sunday/manual closure messaging, cart calculations, admin workflow, cookie behavior, confirmation states, and representative Lighthouse/accessibility audit.
- Test types needed: Pure business-rule unit tests, model/service tests, Supertest API tests using isolated MongoDB, React Testing Library integration tests, and a critical browser smoke path if environment permits.
- Build/lint/typecheck expectations: Lint and build pass; JavaScript project has no separate TypeScript check unless introduced.
- Acceptance evidence required: Each planned task records three Build/Refine/Polish iterations and TDD Red/Green/Refactor evidence before Done.
- Proof of completion: Passing commands, manual/browser evidence, final diff audit, review, verification record, Fallow audit, release notes, summary, and health check.

## 17. Acceptance Criteria

- [ ] Every Customer acceptance criterion in `Amas-Kitchen-PRD.md` is implemented and verified.
- [ ] Every Admin acceptance criterion in the PRD is implemented and verified behind secure authentication.
- [ ] Every System acceptance criterion is covered, including atomic numbering, immutable snapshots, idempotency, non-blocking notification, validation, and performance-target evidence.
- [ ] Seed, environment, startup, deployment-readiness, and 30-day managed-backup requirements are documented and reproducible.
- [ ] Relevant automated tests, lint, production build, manual responsive/accessibility checks, and workflow quality gates pass or any limitation stops as Needs Human Review.

## 18. Edge Cases And Failure Modes

- Edge cases: London-time Sunday boundary/DST, zero/negative environment fees, addon min/max rules, unavailable catalog between browse/submit, inactive zone, quantity limit, payment on terminal failures, and duplicate concurrent requests.
- Failure modes: Database/transaction unavailable, SMTP timeout, stale cart, expired idempotency record, invalid cookie/origin, startup config missing, and seed rerun.
- Regression risks: Client/server calculation drift, mutable historical data, skipped order statuses, accidental Sunday override, floating-point money errors, and permissive CORS/cookies.
- Recovery expectations: Reject safely with stable errors; preserve successful orders if notification fails; never reuse allocated order number; allow corrected resubmission with a new idempotency key where appropriate.

## 19. Risks And Mitigations

- Technical risks: Large greenfield scope and concurrency correctness. Mitigate with vertical slices, isolated domain services, indexes/transactions, and tests first.
- Product/UX risks: PRD lacks detailed visual system. Mitigate by applying `design-taste-frontend`, retaining appropriate existing food imagery, and testing responsive states.
- Security risks: Single-admin credentials and cookie/CORS configuration. Mitigate with validated startup config, bcrypt hash, JWT verification, HttpOnly/Secure/SameSite cookies, rate limits, Helmet, and no secrets in logs/repo.
- Scope risks: Operational requirements can expand into infrastructure. Mitigate by documenting deployment/backup contracts and explicitly excluding provisioning.
- Mitigation plan: Stop on dirty overlap, unverified critical behavior, missing external access, or any acceptance criterion that cannot be proven.

## 20. Assumptions

- Explicit assumptions: REST `/api`; integer minor-unit money internally; singleton settings; local-storage cart only; evergreen browsers; seed uses editable example values; no live SMTP/deployment credentials required for tests.
- Confidence level: High for product scope; medium for final visual/content details and hosting-specific configuration.
- What to revisit if assumptions are wrong: API contract, money persistence representation, cart persistence, hosting/cookie settings, seed content, and operational docs.

## 21. Open Questions

- Blocking questions: None.
- Non-blocking questions: Final SMTP provider values, production domains/hosting, live menu/zone content, and managed database backup configuration.
- Execution impact: Use provider-neutral environment contracts and documentation; operators supply values before production deployment.

## 22. Task Extraction Notes

- Suggested vertical task boundaries: Runtime/domain foundation; customer catalog/cart; guest checkout/order persistence; admin authentication/order fulfilment; admin menu management; admin zones/settings; production hardening/documentation.
- Suggested first task: Establish validated runtime configuration, domain models/rules, test harness, health behavior, and repeatable seed foundation needed by later slices.
- Suggested task ordering: Follow dependencies above and keep each task independently verifiable end to end.
- Areas that should not become separate tasks: Generic frontend/backend/database layers, cosmetic-only passes disconnected from behavior, or speculative abstractions.
- How the 3-pass Build -> Refine -> Polish loop should apply: Each slice adds a failing behavior test, implements the narrow path, then adds boundary/accessibility/security hardening with fresh failing tests in every iteration.

## 23. Frontend Taste Application

- Applicable: Yes. The work replaces and expands frontend JSX/Tailwind UI across customer and admin surfaces.
- Detection result and reason: Mandatory conditional frontend taste routing applies to UI generation and styling, while backend/API work remains outside that skill.
- Required propagation points: Read and apply `.skills/design-taste-frontend/SKILL.md` before frontend implementation and again for final UI review; record `Applied skill: design-taste-frontend` in tasks, implementation evidence, review, verification, release notes, summary, and health check when applied.
