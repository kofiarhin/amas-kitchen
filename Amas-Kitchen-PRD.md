# Ama's Kitchen Website & Ordering Platform (PRD)

**Version:** 3.0  
**Prepared By:** Kofi Arhin  
**Date:** June 2026  
**Status:** Draft

# Goals

Build an MVP website and ordering platform for Ama's Kitchen that allows customers to:

- Browse the menu
- Place food orders for delivery
- Pay with Cash on Delivery
- Enable staff to manage orders through an admin dashboard

# Non Goals

- Dispatch rider management
- Online payments
- Customer accounts
- Loyalty programmes
- Multiple branches
- Inventory management
- Coupons or discounts
- Multiple admin accounts or roles
- Bulk office orders
- Catering requests
- Collection orders
- Scheduled orders

# Assumptions

- Single restaurant location
- Single admin account
- Delivery only
- Cash on Delivery only
- No customer accounts
- Orders are managed manually by staff
- Restaurant is closed every Sunday

# Business Rules

## Business Context

- Single restaurant location.
- All dates and times use the Europe/London timezone.

## Ordering

- Guest checkout only.
- Immediate delivery orders only.
- Scheduled orders are not supported.
- Menu remains visible when ordering is disabled.

### Sunday Closure

- Restaurant is closed every Sunday.
- Sunday closure is absolute for MVP.
- Admin users cannot override Sunday closure.
- Menu remains visible.
- Customers cannot add items to cart.
- Checkout is disabled.
- New orders cannot be created.
- Admin users can still access the dashboard.
- Sunday closure takes precedence over `orderingEnabled`. If `orderingEnabled = true` on a Sunday, ordering is still disabled.

## Fulfilment

- Delivery only.
- Collection is not supported.
- Dispatch riders are managed outside the system.

## Delivery Areas

- Orders are accepted only for configured delivery zones.
- Delivery zones are configured using delivery area names rather than customer postcodes for MVP.
- Customers must select a supported delivery area during checkout.
- Orders outside supported delivery areas are rejected before checkout submission.

## Delivery Fee

- Single flat delivery fee for all orders.
- Configured via environment variables.
- Added to subtotal to calculate total.
- Not editable from the admin dashboard.

```env
DELIVERY_FEE=3.00
```

Rules:

- Application must fail to start if `DELIVERY_FEE` is missing.
- Application must fail to start if `DELIVERY_FEE` is not a positive number.

## Payments

- Cash on Delivery only.
- Payment collected upon successful delivery.

## Administration

- Single admin account only.

## Data Integrity

- Sequential order numbers.
- Numbers are never reused.
- Gaps are acceptable.
- Order number generation must be atomic.
- Historical orders preserve original item names and prices.

# Authentication

## Customer Authentication

Not supported.

## Admin Authentication

- Login
- Logout
- Protected dashboard routes
- JWT authentication
- HttpOnly secure cookies
- Login rate limiting

```env
ADMIN_EMAIL=admin@amaskitchen.co.uk
ADMIN_PASSWORD_HASH=
JWT_SECRET=
JWT_EXPIRES_IN=7d
```

# Database Collections

- Orders
- FoodItems
- DeliveryZones
- Settings
- Counters

No collections:

- Users
- Customers
- BulkOrders
- CateringRequests
- Notifications
- Content

# FoodItem Model

```ts
{
  _id,
  name,
  description,
  images,
  basePrice,
  category,
  available,
  sortOrder,
  addonGroups: [
    {
      name,
      required,
      minSelections,
      maxSelections,
      options: [
        {
          name,
          price,
          available
        }
      ]
    }
  ]
}
```

## Rules

- Category is required.
- Categories are free text.
- Category matching is case-insensitive.
- Categories are stored in Title Case.
- Addons are organised into addon groups.
- Each addon group may contain one or more addon options.
- Multiple addon selections are allowed only when `maxSelections > 1`.
- Addon groups are optional unless `required = true`.
- Required addon groups must satisfy `minSelections`.
- No nested addons.
- Sold out items remain visible but cannot be added to cart.

# Order Model

```ts
{
  _id,
  orderNumber,
  customerName,
  phone,
  email,
  items: [
    {
      foodItemId,
      name,
      basePrice,
      quantity,
      selectedAddons: [
        {
          addonGroupName,
          name,
          price
        }
      ],
      lineTotal
    }
  ],
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  paymentStatus,
  deliveryAddress: {
    line1,
    line2,
    city,
    instructions
  },
  deliveryArea,
  status,
  statusHistory,
  notes,
  createdAt,
  updatedAt
}
```

## Order Item Snapshot Rules

- Order items must store the original food item name and base price at the time of order.
- Selected addons must store the original addon group name, addon name, and price at the time of order.
- Historical orders must not change if menu item names, addon names, or prices are later edited.
- `lineTotal = (basePrice + selected addon prices) * quantity`.

# Payment Status

- Unpaid
- Paid

Rules:

- New orders default to `Unpaid`.
- Admin can mark an order as `Paid` while the order status is `Pending`, `Confirmed`, `Preparing`, `Ready`, `Out For Delivery`, or `Delivered`.
- Delivered orders may remain `Unpaid`.
- Cancelled orders cannot be marked `Paid`.
- Delivery Failed orders cannot be marked `Paid`.

# Order Number Format

```text
AK-000001
AK-000002
AK-000003
```

## Order Number Rules

- Order numbers are sequential.
- Order numbers are never reused.
- Gaps are acceptable if an order creation attempt fails after number allocation.
- A `Counters` collection stores the next order sequence value.
- Order number generation must use an atomic database operation such as `findOneAndUpdate` with increment semantics.

# Order Statuses

- Pending
- Confirmed
- Preparing
- Ready
- Out For Delivery
- Delivered
- Cancelled
- Delivery Failed

## Status Transition Rules

Allowed transitions:

```text
Pending -> Confirmed | Cancelled
Confirmed -> Preparing | Cancelled
Preparing -> Ready | Cancelled
Ready -> Out For Delivery
Out For Delivery -> Delivered | Delivery Failed
```

Terminal statuses:

```text
Delivered
Cancelled
Delivery Failed
```

- Terminal statuses cannot transition to another status.
- Admin users cannot skip intermediate statuses.
- Admin users cannot revert an order to a previous status.

## Cancellation Rules

- Customers cannot cancel orders.
- Only admin users can cancel orders.
- Orders cannot be cancelled once they reach `Out For Delivery`.

# Delivery Zones

```ts
{
  name,
  active,
  sortOrder
}
```

## Delivery Zone Rules

- `name` is required.
- `name` must be unique case-insensitively.
- Only active delivery zones are available during checkout.
- Customers select one active delivery zone during checkout.

# Settings Model

```ts
{
  orderingEnabled,
  minimumOrder,
  supportPhone,
  supportEmail,
  closureReason
}
```

## Settings Rules

- `minimumOrder` applies to subtotal only.
- Delivery fee is not counted toward minimum order.
- Checkout is disabled until `subtotal >= minimumOrder`.
- `orderingEnabled = false` disables add-to-cart, checkout, and order creation.
- Menu remains visible when ordering is disabled.
- `closureReason` is shown to customers when ordering is disabled manually.

# Validation Rules

- customerName: required, max 100 chars
- phone: required
- email: optional, valid email
- notes: max 500 chars
- quantity: min 1, max 50
- deliveryAddress.line1: required
- deliveryAddress.city: required
- deliveryAddress.instructions: optional, max 300 chars
- deliveryArea: required, must match an active configured delivery zone

# Order Calculation

```text
lineTotal = (basePrice + selected addon prices) * quantity
subtotal = sum of all line totals
total = subtotal + deliveryFee
```

# Notifications

- Notifications never block order creation.
- Admin receives an email for every new order.
- Customer notifications are not supported in MVP.
- If admin email notification fails, the failure is logged.
- Notification retries are not supported in MVP.

# Admin Dashboard Features

- Login
- View orders
- Search orders by order number, customer name, and phone number
- Filter orders by status
- Update order status
- Mark order as paid
- Manage menu items
- Manage delivery zones
- Manage settings

# Security Requirements

- Helmet
- Rate limiting
- Zod validation
- Secure cookies
- Admin login throttling
- CORS configuration

Rate limits:

- Admin login: 5 attempts per 15 minutes per IP
- Public order creation: 30 requests per minute per IP

# Non-Functional Requirements

## Performance

- Mobile-first experience
- Lighthouse score above 90
- API response target under 500ms

## Accessibility

- WCAG AA compliance

## Reliability

- Error logging
- Daily database backups retained for 30 days

# Duplicate Order Handling

- Frontend must generate an idempotency key for each checkout attempt.
- Backend must reject repeated submissions using the same idempotency key.
- Idempotency keys expire after 10 minutes.
- Duplicate submissions must not create duplicate orders.

# Edge Cases

- Restaurant is closed on Sunday.
- Notification service is unavailable.
- Duplicate order submissions.
- Customer is unreachable.
- Payment cannot be collected.
- Invalid delivery address.

# Acceptance Criteria

## Customer

- Customer can browse the menu on mobile and desktop.
- Customer can add available menu items to cart when ordering is enabled.
- Customer cannot add items to cart on Sunday.
- Customer cannot checkout on Sunday.
- Customer cannot checkout when `orderingEnabled = false`.
- Customer can checkout as a guest without creating an account.
- Customer must select an active delivery zone.
- Customer cannot submit an order without meeting the minimum order subtotal.
- Customer can submit an immediate delivery order with Cash on Delivery.

## Admin

- Admin can log in and log out.
- Admin dashboard routes are protected.
- Admin can view, search, and filter orders.
- Admin can update order status only through allowed transitions.
- Admin can mark eligible orders as paid.
- Admin cannot mark Cancelled or Delivery Failed orders as paid.
- Admin can manage menu items.
- Admin can manage delivery zones.
- Admin can manage settings.
- Admin cannot override Sunday closure.

## System

- Order numbers are unique and sequential.
- Order number generation is atomic.
- Historical order item names and prices are preserved.
- Duplicate checkout submissions do not create duplicate orders.
- Notification failures do not block order creation.
- API validation rejects invalid payloads.
- API response target is under 500ms for standard requests.

# Future Enhancements

- Online card payments
- Mobile Money payments
- Customer accounts
- Collection orders
- Scheduled orders
- Multiple admins
- Role management
- Inventory management
- Loyalty system
- Coupons and discounts
- Delivery fee calculations by zone

# Out of Scope (MVP)

- Customer accounts
- Customer authentication
- Online payments
- Mobile Money payments
- Loyalty system
- Coupon system
- Inventory management
- Delivery driver dashboard
- Mobile app
- CMS
- Multiple admin accounts
- Role management
- Bulk office orders
- Catering requests
- Scheduled orders
- Collection orders
