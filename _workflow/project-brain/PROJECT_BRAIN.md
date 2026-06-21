# Project Brain

> Generated projection of `_workflow/project-brain/project.json`; JSON is authoritative.

- Updated: 2026-06-21T06:05:00+01:00
- Workflow: complete (`complete`)
- Next stage: user review

## Active Goal

The complete Ama's Kitchen delivery-ordering MVP defined in `Amas-Kitchen-PRD.md` is implemented on run `dev`.

## Requirements And Constraints

- PRD v3.0 customer, admin, and system behavior is implemented for repository-verifiable scope.
- Architecture remains React/Vite, Express, and MongoDB/Mongoose.
- Deployment/infrastructure remain excluded; deployment readiness and 30-day managed backups are documented.

## Decisions

- Configurable SMTP through Nodemailer sends admin order notifications.
- Food items use multiple validated image URLs; uploads are excluded.
- Insert-only idempotent seeding preserves admin edits.
- Server-authoritative integer-pence calculations, atomic counters, TTL idempotency reservations, and HttpOnly-cookie admin auth protect critical flows.

## Verification State

- 29 server tests and 5 client tests pass; client lint/build pass.
- Production dependency audit has zero vulnerabilities.
- Fallow: PARTIAL, with no dead code/dependency/import/cycle/duplication blockers and documented complexity targets.
- Workflow health: Passed.

## Active Artifacts

- Summary: `_workflow/runs/dev/summary.md`
- Handoff: `_workflow/runs/dev/handoff.md`
- Release notes: `_workflow/runs/dev/release-notes.md`
- Fallow: `.workflow/fallow-audit.md`
