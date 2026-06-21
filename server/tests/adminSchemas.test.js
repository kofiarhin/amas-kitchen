const { foodItemInput, settingsInput, zoneInput } = require("../validation/adminSchemas");

test("food input accepts multiple URLs and constrained addon groups", () => {
  const result = foodItemInput.parse({ name: "Waakye", description: "Rice and beans", images: ["https://example.com/one.jpg", "https://example.com/two.jpg"], basePrice: 1250, category: "rice bowls", available: true, sortOrder: 2, addonGroups: [{ name: "Protein", required: true, minSelections: 1, maxSelections: 1, options: [{ name: "Chicken", price: 300, available: true }] }] });
  expect(result.images).toHaveLength(2);
});

test("food input rejects non-URL images and impossible addon ranges", () => {
  expect(() => foodItemInput.parse({ name: "Waakye", description: "Rice", images: ["not-a-url"], basePrice: 1, category: "Rice", addonGroups: [{ name: "Protein", required: true, minSelections: 2, maxSelections: 1, options: [{ name: "Chicken", price: 0 }] }] })).toThrow();
});

test("settings cannot contain delivery fee", () => {
  expect(() => settingsInput.strict().parse({ orderingEnabled: true, minimumOrder: 2000, supportPhone: "020 7946 0182", supportEmail: "hello@amaskitchen.co.uk", closureReason: "", deliveryFee: 0 })).toThrow();
  expect(zoneInput.parse({ name: "Hackney", active: true, sortOrder: 1 }).name).toBe("Hackney");
});
