const express = require("express");
const { rateLimit } = require("express-rate-limit");
const FoodItem = require("../models/FoodItem");
const DeliveryZone = require("../models/DeliveryZone");
const Settings = require("../models/Settings");
const Counter = require("../models/Counter");
const IdempotencyKey = require("../models/IdempotencyKey");
const Order = require("../models/Order");
const { getConfig } = require("../config/env");
const { createOrder } = require("../services/orderService");
const { createNotifier } = require("../services/notification");

const router = express.Router();
const limiter = rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false });

router.post("/", limiter, async (req, res, next) => {
  try {
    const config = getConfig();
    const order = await createOrder(req.body, req.get("Idempotency-Key"), { FoodItem, DeliveryZone, Settings, Counter, IdempotencyKey, Order, config, notify: createNotifier(config) });
    res.status(201).json({ success: true, data: { orderNumber: order.orderNumber, total: order.total, status: order.status, paymentMethod: order.paymentMethod } });
  } catch (error) { next(error); }
});

module.exports = router;
