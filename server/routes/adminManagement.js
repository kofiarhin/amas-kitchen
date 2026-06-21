const express = require("express");
const FoodItem = require("../models/FoodItem");
const DeliveryZone = require("../models/DeliveryZone");
const Settings = require("../models/Settings");
const requireAdmin = require("../middleware/requireAdmin");
const AppError = require("../utils/AppError");
const { foodItemInput, settingsInput, zoneInput } = require("../validation/adminSchemas");

const router = express.Router(); router.use(requireAdmin);
const parse = (schema, value) => { const result = schema.safeParse(value); if (!result.success) throw new AppError("Submitted data is invalid.", 400, "VALIDATION_ERROR", result.error.flatten()); return result.data; };
const ensure = (value, name) => { if (!value) throw new AppError(`${name} not found.`, 404, "NOT_FOUND"); return value; };

router.get("/menu", async (req, res, next) => { try { res.json({ success: true, data: await FoodItem.find({}).sort({ category: 1, sortOrder: 1 }) }); } catch (error) { next(error); } });
router.post("/menu", async (req, res, next) => { try { res.status(201).json({ success: true, data: await FoodItem.create(parse(foodItemInput, req.body)) }); } catch (error) { next(error); } });
router.put("/menu/:id", async (req, res, next) => { try { res.json({ success: true, data: ensure(await FoodItem.findByIdAndUpdate(req.params.id, parse(foodItemInput, req.body), { new: true, runValidators: true }), "Menu item") }); } catch (error) { next(error); } });
router.delete("/menu/:id", async (req, res, next) => { try { ensure(await FoodItem.findByIdAndDelete(req.params.id), "Menu item"); res.json({ success: true }); } catch (error) { next(error); } });

router.get("/zones", async (req, res, next) => { try { res.json({ success: true, data: await DeliveryZone.find({}).sort({ sortOrder: 1, name: 1 }) }); } catch (error) { next(error); } });
router.post("/zones", async (req, res, next) => { try { res.status(201).json({ success: true, data: await DeliveryZone.create(parse(zoneInput, req.body)) }); } catch (error) { next(error); } });
router.put("/zones/:id", async (req, res, next) => { try { const data = parse(zoneInput, req.body); data.normalizedName = data.name.toLowerCase(); res.json({ success: true, data: ensure(await DeliveryZone.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }), "Delivery zone") }); } catch (error) { next(error); } });
router.delete("/zones/:id", async (req, res, next) => { try { ensure(await DeliveryZone.findByIdAndDelete(req.params.id), "Delivery zone"); res.json({ success: true }); } catch (error) { next(error); } });

router.get("/settings", async (req, res, next) => { try { res.json({ success: true, data: await Settings.findOne({ key: "restaurant" }) }); } catch (error) { next(error); } });
router.put("/settings", async (req, res, next) => { try { const data = parse(settingsInput.strict(), req.body); res.json({ success: true, data: await Settings.findOneAndUpdate({ key: "restaurant" }, { $set: data }, { new: true, upsert: true, runValidators: true }) }); } catch (error) { next(error); } });

module.exports = router;
