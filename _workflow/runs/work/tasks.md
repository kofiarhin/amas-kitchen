# Task Plan

Spec file used: _workflow/runs/work/spec.md
Planning date: 2026-06-22

## TASK-001: Redesign public customer website and separate ordering flow
Status: Done
Objective: Replace the homepage ordering experience with a premium marketing homepage and move ordering to /menu, cart drawer, /checkout, and /order-confirmation.
Files affected: client/src/App.jsx, client/src/index.css, client/src/App.test.jsx, client/src/lib/api.js, client/src/lib/cart.js, server/tests/notification.test.js, server/tests/seed.test.js.
Checklist:
- [x] Add client routes for required pages.
- [x] Move menu/order UI to /menu.
- [x] Add drawer/bottom-sheet cart.
- [x] Add checkout and confirmation pages.
- [x] Replace Catering language with Services.
- [x] Preserve order API payload.
- [x] Update tests.

Iteration 1 Build: Red tests updated for marketing homepage and menu drawer; implementation added routes and page structure; tests passed after fixes.
Iteration 2 Refine: API calls extracted to lib/api.js and cart quantity reducer added; server tests updated to match current notifier/seed behavior.
Iteration 3 Polish: Premium dark visual system, responsive drawer/bottom sheet, sticky category pills, final lint/build verification.

Acceptance result: all criteria met.
Verification commands: npm test --prefix client; npm test; npm run lint --prefix client; npm run build --prefix client.
