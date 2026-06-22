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
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ key: "restaurant" }));
});
