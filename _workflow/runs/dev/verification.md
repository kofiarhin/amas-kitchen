# Verification Record

## Automated checks

- `npm test`: Passed — 11 suites, 29 tests.
- `npm test --prefix client`: Passed — 3 files, 5 tests.
- `npm run lint --prefix client`: Passed with no findings.
- `npm run build --prefix client`: Passed — 242.43 kB JS / 20.27 kB CSS before gzip.
- `git diff --check`: Passed; only Windows line-ending notices were emitted by later diff reads.
- `npm audit --omit=dev --json`: Passed — zero production vulnerabilities.
- Full `npm audit --json`: 17 moderate findings, all within the Jest development toolchain through `js-yaml`; npm proposes a breaking Jest downgrade. No unreviewed force-fix was applied.
- Secret-pattern scan: No credential-like values found; `.env.example` contains an explicit placeholder only.

## Functional coverage

- Runtime validation and Europe/London Sunday precedence.
- Food/addon, zone, settings, counter, idempotency and order schemas.
- Public bootstrap availability and insert-only seed behavior.
- Server-authoritative price/addon/zone/minimum validation, snapshots, counter format, and duplicate reservation ordering.
- Non-blocking SMTP boundary and public rate limiting.
- Admin credential validation, transition graph, payment restrictions, management contracts.
- Customer closure/menu/cart and admin login/navigation UI states.

## Manual and UI review

- Applied skill: design-taste-frontend.
- Code-surface review confirmed mobile collapse below 960/640 px, no horizontal flex math, semantic labels/fieldsets, explicit loading/empty/error/success states, visible focus styles, reduced-motion override, a single warm accent, asymmetric public hero, and high-density admin lists without card overuse.
- Browser automation was attempted through the required in-app browser workflow but the `iab` browser was unavailable. Per repository policy, no screenshot was required or fabricated.
- Live database concurrency, real SMTP delivery, production cookie/CORS, Lighthouse score, API latency, and managed backup restoration require deployment/test infrastructure and remain operator pre-launch checks documented in `docs/VERIFY.md` and `docs/OPERATIONS.md`.

## Result

Passed for repository-verifiable scope. External-infrastructure checks are explicitly documented pre-launch obligations.
