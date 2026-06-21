const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "restaurant" },
  orderingEnabled: { type: Boolean, default: true },
  minimumOrder: { type: Number, min: 1, default: 2000 },
  supportPhone: { type: String, required: true, default: "020 7946 0182" },
  supportEmail: { type: String, required: true, lowercase: true, default: "hello@amaskitchen.co.uk" },
  closureReason: { type: String, trim: true, maxlength: 240, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
