const FoodItem = require("../models/FoodItem");
const DeliveryZone = require("../models/DeliveryZone");
const Settings = require("../models/Settings");

describe("restaurant models", () => {
  test("normalizes food category and rejects an impossible addon range", async () => {
    const item = new FoodItem({
      name: "jollof rice",
      description: "Smoky party jollof",
      images: ["https://example.com/jollof.jpg"],
      basePrice: 1299,
      category: "rice bowls",
      addonGroups: [{
        name: "Protein",
        required: true,
        minSelections: 2,
        maxSelections: 1,
        options: [{ name: "Chicken", price: 300, available: true }],
      }],
    });

    await expect(item.validate()).rejects.toThrow(/minSelections/);
    expect(item.category).toBe("Rice Bowls");
  });

  test("normalizes a delivery zone key for case-insensitive uniqueness", async () => {
    const zone = new DeliveryZone({ name: "  East London  " });
    await zone.validate();
    expect(zone.name).toBe("East London");
    expect(zone.normalizedName).toBe("east london");
  });

  test("uses safe default settings", () => {
    const settings = new Settings();
    expect(settings.orderingEnabled).toBe(true);
    expect(settings.minimumOrder).toBeGreaterThan(0);
  });
});
