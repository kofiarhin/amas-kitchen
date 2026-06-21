require("dotenv").config();
const connectDB = require("../config/db");
const FoodItem = require("../models/FoodItem");
const DeliveryZone = require("../models/DeliveryZone");
const Settings = require("../models/Settings");
const { seedRestaurantData } = require("./seedData");

async function run() {
  const connection = await connectDB();
  try {
    await seedRestaurantData({ FoodItem, DeliveryZone, Settings });
    console.log("Ama's Kitchen seed completed.");
  } finally {
    await connection.disconnect();
  }
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
