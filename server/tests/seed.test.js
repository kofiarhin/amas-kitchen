const { seedRestaurantData } = require("../scripts/seedData");

test("seed uses insert-only upserts so reruns preserve admin edits", async () => {
  const updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
  const models = {
    FoodItem: { updateOne },
    DeliveryZone: { updateOne },
    Settings: { updateOne },
  };

  await seedRestaurantData(models);

  expect(updateOne).toHaveBeenCalled();
  for (const [, update, options] of updateOne.mock.calls) {
    expect(update).toHaveProperty("$setOnInsert");
    expect(update).not.toHaveProperty("$set");
    expect(options).toEqual({ upsert: true });
  }
});
