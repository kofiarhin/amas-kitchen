const { buildPublicBootstrap } = require("../services/publicBootstrap");

test("builds public menu grouped in configured order with availability", async () => {
  const models = {
    FoodItem: { find: jest.fn(() => ({ sort: jest.fn().mockResolvedValue([{ name: "Jollof", category: "Rice", available: true }]) })) },
    DeliveryZone: { find: jest.fn(() => ({ sort: jest.fn().mockResolvedValue([{ name: "Hackney", sortOrder: 1 }]) })) },
    Settings: { findOne: jest.fn().mockResolvedValue({ orderingEnabled: true, minimumOrder: 2000, supportPhone: "020 7946 0182" }) },
  };

  const result = await buildPublicBootstrap(models, { deliveryFeePence: 300 }, new Date("2026-06-22T10:00:00Z"));

  expect(result).toMatchObject({
    ordering: { canOrder: true, code: "ORDERING_OPEN" },
    deliveryFee: 300,
    minimumOrder: 2000,
    deliveryZones: [{ name: "Hackney", sortOrder: 1 }],
  });
  expect(result.menu).toHaveLength(1);
});
