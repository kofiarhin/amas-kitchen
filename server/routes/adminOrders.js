const express = require("express");
const Order = require("../models/Order");
const requireAdmin = require("../middleware/requireAdmin");
const AppError = require("../utils/AppError");
const { assertPaymentAllowed, assertTransitionAllowed, getAllowedTransitions } = require("../services/orderActions");

const router = express.Router();
router.use(requireAdmin);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) { const term = new RegExp(escapeRegex(String(req.query.search).slice(0, 100)), "i"); filter.$or = [{ orderNumber: term }, { customerName: term }, { phone: term }]; }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: orders.map((order) => ({ ...order.toObject(), allowedTransitions: getAllowedTransitions(order.status) })) });
  } catch (error) { next(error); }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id); if (!order) throw new AppError("Order not found.", 404, "NOT_FOUND");
    assertTransitionAllowed(order.status, req.body.status); order.status = req.body.status; order.statusHistory.push({ status: req.body.status }); await order.save();
    res.json({ success: true, data: order });
  } catch (error) { next(error); }
});
router.patch("/:id/payment", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id); if (!order) throw new AppError("Order not found.", 404, "NOT_FOUND");
    assertPaymentAllowed(order.status); order.paymentStatus = "Paid"; await order.save(); res.json({ success: true, data: order });
  } catch (error) { next(error); }
});

module.exports = router;
