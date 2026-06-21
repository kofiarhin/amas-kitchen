const mongoose = require("mongoose");

const idempotencyKeySchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true, index: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

module.exports = mongoose.model("IdempotencyKey", idempotencyKeySchema);
