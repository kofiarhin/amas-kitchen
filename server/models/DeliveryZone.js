const mongoose = require("mongoose");

const deliveryZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  normalizedName: { type: String, unique: true, index: true },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

deliveryZoneSchema.pre("validate", function normalizeName() {
  if (this.name) this.normalizedName = this.name.trim().toLowerCase();
});

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);
