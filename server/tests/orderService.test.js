const { createOrder, formatOrderNumber } = require("../services/orderService");

const item = {
  _id: "507f1f77bcf86cd799439011",
  name: "Smoky Jollof",
  basePrice: 1200,
  available: true,
  addonGroups: [{
    name: "Protein",
    required: true,
    minSelections: 1,
    maxSelections: 1,
    options: [{ _id: "507f1f77bcf86cd799439012", name: "Chicken", price: 300, available: true }],
  }],
};

const payload = {
  customerName: "Kofi Mensah",
  phone: "07123 456 789",
  email: "kofi@example.com",
  items: [{ foodItemId: item._id, quantity: 2, selectedAddonIds: ["507f1f77bcf86cd799439012"] }],
  deliveryAddress: { line1: "24 Mare Street", line2: "", city: "London", instructions: "Ring once" },
  deliveryArea: "Hackney",
  notes: "",
};

function dependencies(overrides = {}) {
  return {
    FoodItem: { find: jest.fn().mockResolvedValue([item]) },
    DeliveryZone: { findOne: jest.fn().mockResolvedValue({ name: "Hackney", active: true }) },
    Settings: { findOne: jest.fn().mockResolvedValue({ orderingEnabled: true, minimumOrder: 2000 }) },
    Counter: { findOneAndUpdate: jest.fn().mockResolvedValue({ sequence: 7 }) },
    IdempotencyKey: { findOne: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}), updateOne: jest.fn().mockResolvedValue({}) },
    Order: { create: jest.fn().mockImplementation(async (value) => ({ _id: "order-id", ...value })) },
    config: { deliveryFeePence: 300 },
    notify: jest.fn().mockResolvedValue(undefined),
    now: new Date("2026-06-22T10:00:00Z"),
    ...overrides,
  };
}

describe("createOrder", () => {
  test("calculates immutable snapshots and an atomic formatted sequence", async () => {
    const deps = dependencies();
    const order = await createOrder(payload, "checkout-key-123456", deps);
    expect(order).toMatchObject({ orderNumber: "AK-000007", subtotal: 3000, deliveryFee: 300, total: 3300 });
    expect(order.items[0]).toMatchObject({ name: "Smoky Jollof", basePrice: 1200, quantity: 2, lineTotal: 3000 });
    expect(deps.Counter.findOneAndUpdate).toHaveBeenCalledWith(
      { key: "order" }, { $inc: { sequence: 1 } }, expect.objectContaining({ upsert: true, new: true }),
    );
    expect(deps.IdempotencyKey.create.mock.invocationCallOrder[0]).toBeLessThan(deps.Order.create.mock.invocationCallOrder[0]);
    expect(deps.IdempotencyKey.updateOne).toHaveBeenCalledWith({ key: "checkout-key-123456" }, { $set: { orderId: "order-id" } });
  });

  test("rejects missing required addons", async () => {
    await expect(createOrder({ ...payload, items: [{ ...payload.items[0], selectedAddonIds: [] }] }, "checkout-key-123456", dependencies())).rejects.toMatchObject({ code: "INVALID_ADDONS" });
  });

  test("returns the prior order for a repeated idempotency key", async () => {
    const prior = { orderNumber: "AK-000003" };
    const deps = dependencies({ IdempotencyKey: { findOne: jest.fn().mockResolvedValue({ orderId: prior }) } });
    await expect(createOrder(payload, "checkout-key-123456", deps)).resolves.toBe(prior);
    expect(deps.Order.create).not.toHaveBeenCalled();
  });
});

test("formats order numbers", () => expect(formatOrderNumber(42)).toBe("AK-000042"));
