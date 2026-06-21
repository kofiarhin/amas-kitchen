const express = require("express");
const FoodItem = require("../models/FoodItem");
const DeliveryZone = require("../models/DeliveryZone");
const Settings = require("../models/Settings");
const { getConfig } = require("../config/env");
const { buildPublicBootstrap } = require("../services/publicBootstrap");

const router = express.Router();

router.get("/bootstrap", async (req, res, next) => {
  try {
    const data = await buildPublicBootstrap({ FoodItem, DeliveryZone, Settings }, getConfig());
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
