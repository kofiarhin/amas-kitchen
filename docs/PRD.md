# Amas Kitchen Product Requirements Document

## 1. Product summary

Amas Kitchen is a web-based food ordering product for customers and restaurant operators. Customers browse an available menu, submit orders, and receive a clear confirmation. Administrators manage menu content and order state. The system uses MongoDB as the source of record and may send Telegram notifications to operators when new orders arrive.

## 2. Problem statement

Small food businesses often receive orders through fragmented channels such as phone calls, chat messages, and social media. These channels make menu updates, order accuracy, and operational tracking difficult. Amas Kitchen should provide one reliable customer ordering flow and one protected administrative workflow.

## 3. Goals

- Make the current menu easy to browse on mobile and desktop.
- Let customers submit complete, validated orders.
- Give operators a protected view of incoming orders.
- Allow authorized administrators to manage menu items and order states.
- Notify operators of new orders without making notifications the source of truth.
- Support reliable deployment and verification through automated tests and CI.

## 4. Non-goals

The initial product does not require:

- multi-restaurant marketplace support;
- third-party courier dispatch;
- complex inventory forecasting;
- loyalty points or subscriptions;
- accounting-system integration;
- autonomous refunds or chargebacks;
- Telegram as a replacement for the application database.

## 5. Users

### Customers

People who want to view the menu and place an order with minimal friction.

### Administrators

Authorized restaurant operators who maintain menu data and process orders.

## 6. Core user journeys

### Browse and order

1. Customer opens the application.
2. Application loads current public menu data.
3. Customer selects items and quantities.
4. Customer supplies required contact and fulfillment details.
5. Server validates menu references, prices, totals, and required fields.
6. Order is stored in MongoDB.
7. Customer sees confirmation.
8. Operator notification is attempted asynchronously.

### Administer the menu

1. Administrator signs in.
2. Server issues an authenticated session or token.
3. Administrator creates, updates, hides, or removes menu items.
4. Changes are persisted and reflected in the public menu.

### Process an order

1. Administrator opens the protected order view.
2. Administrator reviews order details.
3. Administrator changes the order status through allowed transitions.
4. The server records the updated state and timestamp.

## 7. Functional requirements

### FR-1: Public menu

- The system shall expose current menu items without requiring authentication.
- Menu items shall include a stable identifier, name, description, price, availability, and presentation data where supported.
- Unavailable items shall not be orderable.

### FR-2: Cart

- The client shall allow customers to add, remove, and change quantities.
- The client shall show a running subtotal.
- The server shall independently recalculate all totals.

### FR-3: Order creation

- The server shall validate customer and fulfillment details.
- The server shall validate each menu item against current database data.
- The server shall reject unavailable or invalid items.
- The server shall persist an immutable order snapshot sufficient to understand what was purchased at the time of ordering.
- The server shall return a stable order identifier and confirmation state.

### FR-4: Authentication

- Administrative operations shall require authentication.
- Passwords shall be stored only as secure hashes.
- Authentication failures shall not disclose whether a specific account exists.

### FR-5: Menu administration

- Authorized administrators shall create, edit, enable, disable, and remove menu items.
- Inputs shall be validated before persistence.
- Destructive actions shall require explicit operator intent.

### FR-6: Order administration

- Authorized administrators shall view orders and filter them by status or date where supported.
- Order states shall be constrained to defined values.
- State transitions shall be validated by the server.

### FR-7: Notifications

- A successful order creation shall trigger a best-effort Telegram notification when configured.
- Notification failure shall not delete or invalidate a stored order.
- Notification errors shall be logged without exposing credentials.

### FR-8: Responsive interface

- Primary customer and admin workflows shall be usable on common mobile and desktop widths.
- Loading, empty, success, and failure states shall be visible.

## 8. Non-functional requirements

### Security

- Use Helmet and a restrictive production CORS policy.
- Apply rate limits to authentication and public order endpoints.
- Validate request payloads with Zod or an equivalent schema layer.
- Keep JWT and database credentials in environment variables.
- Authorize every administrative request on the server.
- Prevent client-supplied prices or totals from becoming authoritative.

### Reliability

- Order creation shall be atomic from the customer perspective.
- Stored orders shall remain valid when notification delivery fails.
- API failures shall return consistent error responses.
- Database connection failures shall surface clearly during startup and health checks.

### Performance

- Public menu responses should be suitable for normal mobile connections.
- Large menu images should be optimized outside or before delivery.
- Common menu and order queries should use appropriate database indexes.

### Accessibility

- Interactive controls shall be keyboard accessible.
- Forms shall use labels and clear validation messages.
- Color shall not be the only indicator of state.

### Maintainability

- Business rules shall live in server-side modules rather than only in the client.
- Tests shall cover authentication, order validation, authorization, and totals.
- Documentation shall remain aligned with deployed scripts and environment variables.

## 9. Data requirements

### Menu item

Minimum conceptual fields:

- identifier;
- name;
- description;
- unit price;
- category;
- availability;
- image or presentation reference;
- created and updated timestamps.

### Order

Minimum conceptual fields:

- identifier;
- customer details;
- fulfillment details;
- item snapshots with quantities and unit prices;
- calculated subtotal and total;
- status;
- notes;
- created and updated timestamps.

### Administrator

Minimum conceptual fields:

- identifier;
- login identifier;
- password hash;
- role or permission level;
- active state;
- created and updated timestamps.

## 10. Success metrics

- A customer can complete an order using only the documented user flow.
- Invalid item identifiers, stale prices, and unavailable items are rejected server-side.
- Every administrative mutation requires authentication and authorization.
- New order notification failures do not lose orders.
- Automated tests cover the critical order and authentication paths.
- A new developer can install, test, seed, and run the product from the README.

## 11. Milestones

### Milestone 1: Documented baseline

- Root README.
- PRD and technical specification.
- Verified environment-variable reference.
- Existing architecture, operations, and verification notes linked from the README.

### Milestone 2: Ordering confidence

- Complete server-side total validation.
- Order snapshot persistence.
- Tests for invalid and unavailable items.
- Consistent error schema.

### Milestone 3: Administrative safety

- Explicit role checks.
- Validated order-state transitions.
- Audit metadata for administrative changes.
- Authentication rate limiting and session hardening.

### Milestone 4: Operational readiness

- CI for install, lint, test, and frontend build.
- Health and readiness checks.
- Structured logging and alerting.
- Backup and recovery documentation.

## 12. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Client-submitted prices are trusted. | Incorrect charges or fraud. | Recalculate from current server-side menu data. |
| Notification failure hides an order. | Operational delay. | Store first, notify second, and expose order list as source of truth. |
| Weak admin authorization. | Unauthorized menu or order changes. | Enforce authentication and role checks on every protected route. |
| Stale menu data remains orderable. | Customer dissatisfaction. | Validate availability at order submission time. |
| Deployment configuration diverges from docs. | Failed releases. | Verify scripts and environment variables in CI. |

## 13. Open questions

- Which fulfillment modes are supported: pickup, delivery, or both?
- Is online payment in scope, and which provider should be used?
- Which order-state transitions are valid?
- Should administrators have distinct roles?
- What customer data-retention period is required?
