# Verification

Run before release:

```bash
npm test
npm test --prefix client
npm run lint --prefix client
npm run build --prefix client
```

Manually verify at mobile and desktop widths:

- Menu loading, empty, unavailable, sold-out, addon, minimum, and closure states.
- Guest checkout and confirmation using an isolated database and test SMTP relay.
- Duplicate submission, server-side repricing, invalid zone, and Sunday rejection.
- Admin login/logout/session expiry, order search/filter, every legal transition, terminal-state blocks, and payment eligibility.
- Menu URL/addon editing, case-insensitive zones, settings closure, and public refresh.
- Keyboard focus, labels, contrast, reduced motion, responsive overflow, and representative Lighthouse results.

Deployment verification additionally includes `/health`, production credentialed CORS/cookies, SMTP failure logging, provider backup policy, and a documented restore drill.
