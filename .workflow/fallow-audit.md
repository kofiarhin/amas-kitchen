# Fallow Audit

## Command Run

`npx fallow audit --format json --quiet --explain 2>/dev/null || true`

Fallback/full-codebase clarification: `npx fallow --format json --quiet --explain 2>/dev/null || true`.

## Summary

- Parsed kind/schema: `audit`, schema 7, Fallow 2.101.0.
- Changed files analyzed: 71.
- Required audit verdict: `fail` from complexity thresholds, not dead code or dependency integrity.
- Final counts: 0 dead-code issues, 0 unused dependencies, 0 unresolved imports, 0 circular dependencies, 0 duplicate groups; 10 complexity findings; maximum cyclomatic complexity 18.

## Findings

- Initial full scan found one genuine unused legacy file (`client/src/App.css`) and six unnecessary production exports.
- Initial scan also misclassified 12 Jest/Vitest/setup entry files as unused; actual package scripts execute them.
- Final changed-code audit identifies complexity in cohesive feature modules, chiefly `client/src/App.jsx`, `client/src/admin/AdminApp.jsx`, and `server/services/orderService.js`.
- No architecture cycle, duplicate block, unresolved import, unused dependency, or production dead-code blocker remains.

## Fixes Applied

- Deleted unused legacy `client/src/App.css`.
- Removed unused exports from seed, ordering availability, order action, and order service modules.
- Added local `.fallowrc.json` entry points for the real Jest/Vitest/setup/config execution surfaces; no remote configuration is used.
- Removed unused `react-router-dom`; added the previously undeclared `nodemon` dev dependency used by `npm run dev`.

## Remaining Exceptions

- Complexity findings are non-blocking for this MVP: critical branches have focused tests, the maximum cyclomatic value is 18, and splitting vertical slices now would add churn without changing behavior. The final review records these as future refactoring targets.
- No complexity suppression comments or relaxed thresholds were added.

## Verification

- After fixes: `npm test` passed 11 suites/29 tests; `npm test --prefix client` passed 3 files/5 tests.
- Final Fallow JSON parsed successfully with zero dead-code errors and zero duplicate groups.

## Verdict

PARTIAL — machine-readable analysis succeeded and no blocking integrity finding remains, but non-blocking complexity targets are intentionally documented for later refactoring.
