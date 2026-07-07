const { seedRestaurantData } = require("../scripts/seedData");

test("seed clears and recreates restaurant defaults", async () => {
  const deleteMany = jest.fn().mockResolvedValue({ acknowledged: true });
  const insertMany = jest.fn().mockResolvedValue([]);
  const create = jest.fn().mockResolvedValue({});
  const models = {
    FoodItem: { deleteMany, insertMany },
    DeliveryZone: { deleteMany, insertMany },
    Settings: { deleteMany, create },
  };

  await seedRestaurantData(models);

  expect(deleteMany).toHaveBeenCalledTimes(3);
  expect(insertMany).toHaveBeenCalledTimes(2);
  expect(models.FoodItem.insertMany).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({ name: "Party Jollof & Charcoal Chicken", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Goat Meat Jollof", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Fried Fish Jollof", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Waakye Complete", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Ghana Fried Rice & Chicken", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Shito Fried Rice", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Angwa Mo Breakfast Bowl", category: "Rice Bowls" }),
      expect.objectContaining({ name: "Omo Tuo & Groundnut Soup", category: "Soups & Rice" }),
    ]),
  );
  expect(models.FoodItem.insertMany.mock.calls[0][0]).toHaveLength(10);
  for (const item of models.FoodItem.insertMany.mock.calls[0][0]) {
    expect(item).toEqual(expect.objectContaining({
      name: expect.any(String),
      description: expect.any(String),
      images: expect.arrayContaining([expect.stringMatching(/^https?:\/\//)]),
      basePrice: expect.any(Number),
      category: expect.any(String),
      available: expect.any(Boolean),
      sortOrder: expect.any(Number),
      addonGroups: expect.any(Array),
    }));
  }
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ key: "restaurant" }));
});
