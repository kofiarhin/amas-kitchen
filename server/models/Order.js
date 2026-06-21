const mongoose = require("mongoose");

const addonSnapshotSchema = new mongoose.Schema({
  addonGroupName: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  foodItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 1 },
  quantity: { type: Number, required: true, min: 1, max: 50 },
  selectedAddons: { type: [addonSnapshotSchema], default: [] },
  lineTotal: { type: Number, required: true, min: 1 },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true, index: true },
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  items: { type: [orderItemSchema], validate: [(value) => value.length > 0, "Order needs an item"] },
  subtotal: { type: Number, required: true, min: 1 },
  deliveryFee: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 1 },
  paymentMethod: { type: String, enum: ["Cash on Delivery"], default: "Cash on Delivery" },
  paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  deliveryAddress: {
    line1: { type: String, required: true }, line2: String,
    city: { type: String, required: true }, instructions: { type: String, maxlength: 300 },
  },
  deliveryArea: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Preparing", "Ready", "Out For Delivery", "Delivered", "Cancelled", "Delivery Failed"], default: "Pending", index: true },
  statusHistory: { type: [statusHistorySchema], default: () => [{ status: "Pending" }] },
  notes: { type: String, maxlength: 500, default: "" },
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerName: "text", phone: "text", orderNumber: "text" });

module.exports = mongoose.model("Order", orderSchema);
