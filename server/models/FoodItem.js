const mongoose = require("mongoose");

const titleCase = (value) => value?.trim().toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

const addonOptionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
}, { _id: true });

const addonGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  required: { type: Boolean, default: false },
  minSelections: { type: Number, min: 0, default: 0 },
  maxSelections: { type: Number, min: 1, default: 1 },
  options: { type: [addonOptionSchema], validate: [(value) => value.length > 0, "Addon groups need an option"] },
});

addonGroupSchema.path("minSelections").validate(function validateRange(value) {
  return value <= this.maxSelections && (!this.required || value >= 1);
}, "minSelections must satisfy required and maxSelections rules");

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  images: [{ type: String, required: true, trim: true, match: /^https?:\/\//i }],
  basePrice: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, set: titleCase, trim: true, index: true },
  available: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  addonGroups: { type: [addonGroupSchema], default: [] },
}, { timestamps: true });

foodItemSchema.index({ category: 1, sortOrder: 1, name: 1 });

module.exports = mongoose.model("FoodItem", foodItemSchema);
