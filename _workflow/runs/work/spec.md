# Design Progress Spec: Ama's Kitchen Client-Review Draft

## 1. Metadata
- Spec filename: `_workflow/runs/work/spec.md`
- Date: 2026-07-01
- Request ID / slug: amas-kitchen-design-progress
- Request source: Latest direct user prompt synced to `_workflow/runs/work/request.md`
- Execution mode: complete-workflow, paused at required spec approval gate before implementation
- Request classification: Frontend UI/design planning
- Scope level: Small focused design planning block
- Risk level: Low for planning; medium for later homepage implementation because it touches the public conversion path

## 2. Original Request
- Raw user request: Move Ama's Kitchen design work forward by reviewing context, identifying the next highest-impact design section, and producing a first draft, design brief, or implementation plan for client review.
- Normalized request: Produce a reviewable design brief and next implementation plan for the Ama's Kitchen redesign without touching user data or unrelated code.
- Source prompt / `<artifact-root>/request.md` reference: `_workflow/runs/work/request.md`

## 3. Questions And Answers
- Questions asked: None. The repository already contains enough context to produce a useful design brief.
- Answers received: Not applicable.
- Questions skipped: No explicit skip; intake completed by inspecting existing project context and active UI files.
- Remaining open questions: Final brand assets, approved photography, exact client tone, and preferred conversion priority still need client confirmation.

## 4. Problem Definition
- Problem being solved: The redesign has active momentum but needs a concrete next design direction suitable for review before another implementation block.
- Why it matters: The public homepage is the primary conversion surface for ordering and service inquiries.
- Current pain point: The interface already has polished sections, but the next decision should focus implementation effort on the area with the highest visual and commercial impact instead of spreading changes thinly.
- Expected value: A client-review-ready design direction that defines what to build next, what evidence is missing, and how to verify quality.

## 5. Current State Analysis
- Existing behavior: The public app is a React/Vite single-page experience with routes for home, menu, services, about, contact, checkout, and confirmation.
- Existing architecture/components: `client/src/App.jsx` owns public page composition; `client/src/sections.css` contains recent homepage section styling; Tailwind CSS 4 and Phosphor icons are available.
- Existing files/modules likely involved: `client/src/App.jsx`, `client/src/sections.css`, `client/src/index.css`, `client/src/App.test.jsx`, and possibly `docs/ACTIVE_TASK.md` for durable design notes.
- Existing data flow: Public bootstrap data supplies menu, delivery fee, business data, ordering status, and support phone. Cart state stays local to the client.
- Existing API/UI/CLI/workflow behavior: The homepage currently includes a hero carousel, signature dishes, story split, compact gallery, services, testimonials, and final CTA.
- Existing tests or verification coverage: Client Vitest, ESLint, and Vite build scripts exist. Current request is planning-only until spec approval, so code tests are not required before the implementation block.

## 6. Desired End State
- Expected final behavior: A clear next redesign block is approved for implementation: a client-review-ready homepage hero plus conversion strip concept, or an implementation plan if approval is pending.
- User-facing outcome: Visitors immediately understand Ama's Kitchen as premium Ghanaian food for delivery and catered moments, with clear pathways to order, explore signature dishes, or request catering.
- Developer-facing outcome: The next implementation block has scoped files, acceptance criteria, missing assets, and verification steps.
- System/workflow outcome: No backend, database, order, or cart behavior changes are required for the design block.
- Backward compatibility expectations: Existing routes, ordering behavior, cart persistence, checkout behavior, admin behavior, and data contracts remain unchanged.

## 7. Scope
- In scope:
  - Review current project context and UI structure.
  - Identify the next highest-impact design section.
  - Produce a client-review design brief and implementation plan.
  - Note missing assets and decisions.
- Out of scope:
  - Backend changes.
  - Database/schema changes.
  - Checkout/order logic changes.
  - Admin UI changes.
  - Unrelated refactors.
- Non-goals: Full redesign completion in this planning gate.
- Explicit boundaries: Implementation must wait for explicit spec approval per repository workflow.

## 8. Users And Use Cases
- Primary users: Ama's Kitchen prospective customers browsing and ordering public menu items.
- Secondary users: Catering/private dining prospects and the client reviewing the redesign direction.
- Main use cases:
  - Decide whether the food feels premium and trustworthy.
  - Start an order quickly.
  - Understand signature dishes and service options.
  - Request quote/contact for larger occasions.
- Edge use cases:
  - Ordering is closed but browsing still needs to feel worthwhile.
  - Menu bootstrap is loading or temporarily unavailable.
  - User lands on mobile with limited time and expects a clear CTA.

## 9. Functional Requirements
- Required behaviors:
  - Preserve all existing navigation and ordering routes.
  - Keep the hero/order CTA path obvious.
  - Keep services/catering path visible from the homepage.
  - Avoid adding third-party packages unless checked in `package.json` first.
- Inputs: Existing menu/bootstrap data and existing image URLs.
- Outputs: Reviewable brief now; after approval, visible homepage design refinement.
- State changes: None for this planning gate.
- Error states: Not applicable for the brief; later implementation must preserve existing loading/error/closed-order states.
- Permissions/auth expectations: Public-only; no admin/auth changes.

## 10. Non-Functional Requirements
- Performance expectations: Later implementation should rely on CSS transforms/opacity, avoid heavy scroll listeners, and preserve Vite build performance.
- Reliability expectations: No change to API contracts or order placement.
- Security/privacy expectations: No credentials, secrets, or user data changes.
- Accessibility expectations: Preserve semantic links/buttons, useful image alt text, keyboard access, and visible focus states.
- Maintainability expectations: Keep edits local to public UI files and avoid broad component rewrites.
- DX expectations: Verify with client tests/lint/build after implementation.

## 11. Affected Surfaces
- Files likely affected after approval:
  - `client/src/App.jsx`
  - `client/src/sections.css`
  - `client/src/index.css` if global tokens need minor additions
  - `client/src/App.test.jsx` if user-visible copy/structure changes need assertions
- Directories likely affected: `client/src/`
- UI surfaces: Homepage hero, trust/conversion strip, signature dish transition, final CTA.
- API routes: Not applicable.
- Components: HomePage, HeroCarousel, SignatureDishCard, possibly GallerySection.
- Services: Not applicable.
- Database/schema: Not applicable.
- Config/env vars: Not applicable.
- Tests: Frontend Vitest, ESLint, build.
- Docs: Workflow artifacts only for this planning gate.
- Workflow artifacts: `_workflow/runs/work/*`, `.workflow/fallow-audit.md` if full workflow closes.

## 12. Dependency And Integration Map
- Internal dependencies: Homepage uses fallback menu and public bootstrap menu; cart and navigation helpers must remain unchanged.
- External packages/services: Existing `@phosphor-icons/react`; no new dependency required for the recommended block.
- Integration points: Public route `/`, links to `/menu` and `/services` or `/contact`.
- Ordering constraints: Approve this spec, generate task plan, then implement homepage block through TDD-first Build/Refine/Polish.
- Migration/setup requirements: None.

## 13. Data And State Impact
- Data models: None.
- Database changes: None.
- State management changes: None.
- Cache/session/local storage impact: None.
- Backward compatibility impact: None expected.

## 14. UX / API / Workflow Expectations
- UX expectations:
  - Use an asymmetric, editorial homepage hero rather than centered generic restaurant marketing.
  - Keep one warm accent color and avoid purple/blue AI-style gradients.
  - Increase client-review value with a concrete visual story: food quality, delivery confidence, and catering readiness.
  - Avoid emojis in code/markup/content.
- API contract expectations: No changes.
- CLI/workflow behavior: Stop at spec approval before code implementation.
- Error handling expectations: Preserve existing menu error and closed-order messaging after implementation.
- Empty/loading/success/failure states: Preserve existing menu skeleton and error state after implementation.

## 15. Execution Strategy
- Recommended implementation approach:
  1. Treat the homepage hero and immediate post-hero conversion band as the next highest-impact section.
  2. Redesign the hero into a stronger split editorial composition with a richer food image stack, clear primary CTA, secondary catering/contact CTA, and compact proof points.
  3. Add a tight “What to review with client” band below hero: delivery promise, ordering state, service/catering hook, and signature dish preview.
  4. Keep all data and route behavior unchanged.
- Suggested sequencing:
  - Task 1: Add/adjust tests for homepage hero CTAs and reviewable proof points.
  - Task 2: Implement hero/conversion strip markup and CSS.
  - Task 3: Polish responsive behavior, focus states, and build/lint output.
- Safe rollout/migration approach: Pure frontend presentation change with unchanged public routes.
- Files to inspect before editing: `client/src/App.jsx`, `client/src/sections.css`, `client/src/index.css`, `client/src/App.test.jsx`.
- Decisions to avoid until more evidence exists: Full brand typography changes, new paid imagery, new animation libraries, checkout redesign.

## 16. Verification Strategy
- Required automated checks after implementation:
  - `npm run test --prefix client`
  - `npm run lint --prefix client`
  - `npm run build --prefix client`
- Required manual checks:
  - Review homepage at mobile and desktop sizes.
  - Confirm `/menu`, `/services`, and cart navigation still work.
  - Confirm no unrelated admin/backend behavior changed.
- Test types needed: Vitest/RTL assertions for visible homepage copy and CTA links if structure changes.
- Build/lint/typecheck expectations: Frontend lint and build pass.
- Acceptance evidence required: Screenshot or code-surface review if browser automation is unavailable.
- Proof of completion: Passing checks plus client-review summary of changed hero/conversion section.

## 17. Acceptance Criteria
- [x] Current project context reviewed.
- [x] Next highest-impact design section identified.
- [x] First draft/design brief/implementation plan produced for review.
- [x] Missing assets and client decisions noted.
- [x] Result verified with the most relevant non-code checks available before implementation.

## 18. Edge Cases And Failure Modes
- Edge cases: Mobile hero image stack may crowd CTAs; closed-order state must not conflict with order CTA; external image URLs may load slowly.
- Failure modes: Over-designing the hero could bury ordering; broad CSS edits could regress menu/admin pages; new assets could be unavailable.
- Regression risks: Homepage route, menu link behavior, visual responsiveness, existing themed styles.
- Recovery expectations: Keep changes isolated and revert only in-scope homepage presentation if checks fail.

## 19. Risks And Mitigations
- Technical risks: CSS overreach into other sections. Mitigation: Use specific class names for new homepage block.
- Product/UX risks: Client may prefer catering-first instead of order-first messaging. Mitigation: Present CTA hierarchy as a decision point.
- Security risks: None expected.
- Scope risks: Full-site redesign temptation. Mitigation: Limit next block to hero plus immediate conversion strip.
- Mitigation plan: Keep implementation small, test visible behavior, and document missing decisions.

## 20. Assumptions
- Explicit assumptions:
  - Homepage hero is the highest-impact next section because it is the first impression and conversion gateway.
  - Current image URLs are acceptable placeholders until client supplies final photography.
  - Existing warm accent palette should remain for brand continuity.
  - No new package is needed for the next design block.
- Confidence level: Medium-high.
- What to revisit if assumptions are wrong: Reprioritize services/catering page if client says catering is the primary commercial target.

## 21. Open Questions
- Blocking questions: Spec approval is required before implementation.
- Non-blocking questions:
  - Should the primary CTA be “Order Now” or “View Menu”?
  - Should catering/private dining be the secondary CTA or a separate homepage band?
  - Does the client have approved food photography, logo, color palette, or brand typography?
  - Should public copy say Accra only or a more specific delivery area?
- Execution impact: Answers influence final copy, imagery, and CTA hierarchy but do not block this brief.

## 22. Task Extraction Notes
- Suggested vertical task boundaries:
  - TASK-001: Draft the homepage hero/conversion strip for client review.
  - TASK-002: Polish responsive and accessibility details for the new homepage block.
- Suggested first task: TASK-001 because it creates the visible client-review draft.
- Suggested task ordering: Hero/conversion strip first, polish second.
- Areas that should not become separate tasks: Backend, menu data, cart, checkout, admin, deployment.
- How the 3-pass Build -> Refine -> Polish loop should apply: Each code-changing task must start with a failing/updated frontend test where practical, implement the smallest visible change, then refine responsiveness and polish accessibility/visual details.

# Client-Review Design Brief

## Recommended next highest-impact section
Homepage hero plus immediate post-hero conversion strip.

## Why this section
This is the first screen most visitors and clients judge. It can quickly communicate premium Ghanaian food, ordering confidence, and catering capability while preserving the existing menu and checkout foundation.

## First draft direction
- Asymmetric split hero:
  - Left: brand promise, concise food-quality copy, primary order CTA, secondary catering/service CTA.
  - Right: layered food photography stack with a subtle status label such as “Fresh prep today” or “Delivery across Accra”.
- Conversion proof strip directly below:
  - “Cooked fresh”
  - “Cash on delivery”
  - “Delivery-first kitchen”
  - “Catering available”
- Signature transition:
  - Keep the existing signature dishes but make the hero visually lead into them with a stronger editorial rhythm.

## Visual inspiration notes
- Warm editorial restaurant landing page rather than generic delivery app.
- Use terracotta/warm brown accent already present in the CSS variables.
- Use restrained motion through CSS opacity/transform only; no new animation package for this block.
- Avoid generic three-card rows; use asymmetric image/copy layout and a compact proof band.

## Missing assets/client decisions
- Approved logo lockup or confirmation that text logo is acceptable.
- Final food photography and whether current Cloudinary/Pexels images are placeholders or approved.
- Exact delivery area language.
- CTA priority: immediate ordering vs catering/private dining lead generation.
- Brand tone: homely/premium, celebratory/catering, or fast delivery convenience.
