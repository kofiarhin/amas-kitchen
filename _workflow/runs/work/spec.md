# Detailed Spec: Premium Ama's Kitchen Website Redesign

## 1. Metadata
- Date: 2026-06-22
- Request ID / slug: premium-food-brand-redesign
- Execution mode: complete-workflow
- Request classification: frontend redesign with preserved backend order flow
- Risk level: medium

## 2. Original Request
Redesign Ama's Kitchen into a simple, elegant, premium Ghanaian food brand website and move ordering from the homepage to dedicated menu/cart/checkout/confirmation flows.

## 3. Questions And Answers
- Questions asked: None; request was implementation-ready.
- Questions skipped: Extra intake questions skipped by assumption because all required pages, flows, constraints, and acceptance criteria were provided.

## 4. Problem Definition
The homepage mixed marketing and ordering. The redesigned experience must make the homepage a brand funnel while keeping ordering focused on /menu and /checkout.

## 5. Current State Analysis
The existing React app served public ordering from / with menu, cart, and checkout in one view. Backend public bootstrap and order submission APIs already support menu loading and order placement.

## 6. Desired End State
A premium Ghanaian brand website with Home, Menu, Services, About, Contact, Checkout, and Order Confirmation client routes. Cart is a drawer/bottom sheet, not a permanent homepage sidebar.

## 7. Scope
- In scope: public React UI, routing, cart drawer, checkout separation, tests, styling, API extraction.
- Out of scope: backend schema rewrites, payment integrations, admin redesign.

## 8. Users And Use Cases
- Guests browse the brand, view menu, add items, checkout, and see confirmation.
- Service prospects request quotes for catering-style non-standard orders under Services.

## 9. Functional Requirements
- Homepage has Hero, Signature Dishes, Our Story, Gallery, Services Preview, Testimonials, Final CTA, Footer.
- /menu has menu hero, sticky category pills, food grid, floating cart button.
- Cart uses slide-over/bottom-sheet drawer with quantities, remove, totals, checkout link.
- /checkout submits existing backend order payload.
- /services, /about, /contact, /order-confirmation exist.

## 10. Non-Functional Requirements
Mobile-first responsive layout, Tailwind/CSS-compatible styling, premium warm dark palette, minimal borders, soft shadows, accessible labels, clean forms.

## 11. Affected Surfaces
- client/src/App.jsx
- client/src/index.css
- client/src/App.test.jsx
- client/src/lib/api.js
- client/src/lib/cart.js
- server/tests/notification.test.js
- server/tests/seed.test.js

## 12. Dependency And Integration Map
Uses existing React, Vite, Tailwind, Phosphor icons, public bootstrap API, and orders API. No new packages.

## 13. Data And State Impact
Cart remains localStorage-backed client state. Backend menu/order data contracts are preserved.

## 14. UX / API / Workflow Expectations
Navigation uses client-side pushState. Menu order actions open cart drawer. Checkout remains focused. Confirmation shows order reference when available.

## 15. Execution Strategy
Replace public app shell, extract API calls from components, keep admin entry path intact, preserve existing cart formatting/reducer and add quantity updates.

## 16. Verification Strategy
Run client tests, server tests, client lint, client build, diff audit, and Fallow audit.

## 17. Acceptance Criteria
- [x] Homepage no longer contains full ordering/menu checkout experience.
- [x] Homepage acts as a premium marketing page.
- [x] Menu page is the primary ordering page.
- [x] Cart appears as drawer/bottom sheet, not permanent homepage sidebar.
- [x] Services replaces Catering everywhere.
- [x] Navigation links work.
- [x] Mobile experience is clean and simple.
- [x] Checkout remains separate.
- [x] Existing backend/order flow continues to work.
- [x] Client build passes.
- [x] Tests pass or are updated.

## 18. Edge Cases And Failure Modes
Menu loading error, closed ordering state, empty cart, checkout API error, direct /order-confirmation without in-memory order.

## 19. Risks And Mitigations
- Risk: SPA routing in tests. Mitigation: pushState helper and route tests.
- Risk: backend payload regression. Mitigation: preserved order payload structure and root Jest tests.

## 20. Assumptions
Cash on Delivery remains the only payment option; backend remains unchanged.

## 21. Open Questions
None blocking.

## 22. Task Extraction Notes
One vertical task: redesign public customer flow end-to-end while preserving backend APIs.
