# Project Brain

> Generated projection of `_workflow/project-brain/project.json`; JSON is authoritative.

- Updated: 2026-06-21T07:12:04+01:00
- Workflow: complete (`complete`)
- Next stage: user review

## Active Goal

The Ama's Kitchen MVP now uses Telegram-only new-order notifications.

## Requirements And Constraints

- Existing React/Vite, Express, and MongoDB/Mongoose architecture remains intact.
- Route injection and order-service failure isolation are unchanged.
- Native Node 22 `fetch` is used; no HTTP client was added.
- Operators provide Telegram credentials and perform the live smoke test.

## Decisions

- Telegram Bot API `sendMessage` supersedes SMTP/Nodemailer.
- Plain text includes order number, customer name, total, and phone.
- Network, HTTP, malformed-response, and API failures reject with sanitized errors.

## Verification State

- 37 server tests and 5 client tests pass; client lint/build pass.
- Production dependency audit: zero vulnerabilities.
- Fallow: PASSED with coverage; zero findings.
- Workflow health: Passed.

## Active Artifacts

- Summary: `_workflow/runs/dev/summary.md`
- Verification: `_workflow/runs/dev/verification.md`
- Handoff: `_workflow/runs/dev/handoff.md`
- Fallow: `.workflow/fallow-audit.md`
