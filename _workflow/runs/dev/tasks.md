# Telegram Notification Task Plan

- Spec file used: `_workflow/runs/dev/spec.md`
- Planning date: 2026-06-21
- Progress/summary read before planning: `_workflow/runs/dev/progress.md`, `_workflow/runs/dev/summary.md`
- Spec derivation: Sections 5–22, including affected surfaces, integration/data impact, API/workflow expectations, execution/verification strategy, acceptance criteria, edge cases, risks, assumptions, and task extraction.

## TASK-006: Deliver new-order notifications through Telegram only

- Status: Done
- Lifecycle: Planned -> Ready -> In Progress -> Verified -> Reviewed -> Done
- Objective: Replace SMTP/Nodemailer with required, tested native-fetch Telegram delivery while preserving order creation and failure isolation.
- Files affected: notification/config/tests, env example, package/lock manifests, current docs, workflow artifacts.

### Iteration 1 Build

- Goal: Establish successful Telegram delivery and configuration contracts.
- Changes made: Added notifier/env tests; implemented JSON `sendMessage` and required `config.telegram`.
- Test plan: Exact endpoint/body/message and missing/exposed Telegram config.
- Red phase evidence: 2 suites/4 tests failed against SMTP and absent Telegram config.
- Green phase evidence: 2 suites/4 tests passed after implementation.
- Refactor phase evidence: Endpoint and Telegram values extracted once; same 4 tests passed.
- Test commands run: Focused notifier/env Jest paths.
- Verification result: Passed.
- Review findings: Existing factory/callback interface preserved.
- Acceptance status: Successful delivery/config criteria met.
- Remaining issues: Failure hardening.
- Next action: Iteration 2.

### Iteration 2 Refine

- Goal: Prove network, HTTP, malformed-response, and Telegram API failures reject safely.
- Changes made: Added failure contracts and sanitized/validated handling.
- Test plan: Four explicit failure classes including token-bearing network error input.
- Red phase evidence: 4 new tests failed because raw fetch results/errors escaped.
- Green phase evidence: 2 suites/8 tests passed.
- Refactor phase evidence: Error boundaries reviewed and later separated into transport/response helpers without behavior change.
- Test commands run: Focused notifier/env Jest paths.
- Verification result: Passed.
- Review findings: Application-created errors contain no token.
- Acceptance status: Failure requirements met.
- Remaining issues: Cleanup/docs/full verification.
- Next action: Iteration 3.

### Iteration 3 Polish

- Goal: Remove SMTP/Nodemailer and align docs, lockfile, and verification.
- Changes made: Removed dependency/config/env variables; updated docs/tests/fixtures; separated notifier helpers.
- Test plan: Operations contract prohibits SMTP/Nodemailer and requires Telegram; full regression/Fallow.
- Red phase evidence: Operations test failed on missing Telegram env/stale SMTP; first full run found config fixture missing required values.
- Green phase evidence: Focused 3 suites/9 tests and full 13 suites/37 tests passed after recovery.
- Refactor phase evidence: Transport and response parsing separated; full 37 tests and coverage-aware Fallow passed.
- Test commands run: Full server/client tests, lint, build, audit, reference/diff checks, Fallow.
- Verification result: Passed.
- Review findings: No route/order-service diff, scope creep, secrets, or generated junk.
- Acceptance status: Complete.
- Remaining issues: Live Telegram credential smoke test is operational.
- Next action: Handoff.

### Acceptance Result

- [x] Correct Telegram endpoint/body/message.
- [x] All specified failures reject without token exposure.
- [x] Existing order injection/invocation/catch flow unchanged.
- [x] Required `config.telegram` exists; SMTP config is absent.
- [x] Nodemailer/SMTP removed from implementation, manifests, lockfile, env, tests, and current docs.
- [x] Focused and full verification passes.

### Stop Condition

Not reached.

### Out Of Scope

Bot provisioning, retries, queues, UI work, message expansion/formatting modes, and order-flow changes.
