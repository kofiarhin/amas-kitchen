const { z } = require("zod");
const AppError = require("../utils/AppError");
const { getOrderingAvailability } = require("./orderingAvailability");

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const orderInputSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  items: z.array(z.object({ foodItemId: objectId, quantity: z.number().int().min(1).max(50), selectedAddonIds: z.array(objectId).default([]) })).min(1),
  deliveryAddress: z.object({ line1: z.string().trim().min(1), line2: z.string().trim().optional(), city: z.string().trim().min(1), instructions: z.string().trim().max(300).optional() }),
  deliveryArea: z.string().trim().min(1),
  notes: z.string().trim().max(500).optional(),
});

function formatOrderNumber(sequence) {
  return `AK-${String(sequence).padStart(6, "0")}`;
}

function fail(message, code, status = 400, details) {
  throw new AppError(message, status, code, details);
}

function snapshotItem(requested, foodItem) {
  if (!foodItem?.available) fail("A selected item is unavailable.", "ITEM_UNAVAILABLE", 409);
  const chosen = new Set(requested.selectedAddonIds);
  const selectedAddons = [];

  for (const group of foodItem.addonGroups || []) {
    const groupOptions = (group.options || []).filter((option) => chosen.has(String(option._id)));
    if (groupOptions.some((option) => !option.available)) fail("A selected addon is unavailable.", "INVALID_ADDONS", 409);
    if (groupOptions.length < group.minSelections || groupOptions.length > group.maxSelections) fail(`Choose ${group.minSelections}-${group.maxSelections} options for ${group.name}.`, "INVALID_ADDONS");
    for (const option of groupOptions) selectedAddons.push({ addonGroupName: group.name, name: option.name, price: option.price });
  }

  const knownIds = new Set((foodItem.addonGroups || []).flatMap((group) => group.options.map((option) => String(option._id))));
  if ([...chosen].some((id) => !knownIds.has(id))) fail("An addon selection is invalid.", "INVALID_ADDONS");
  const unitPrice = foodItem.basePrice + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  return { foodItemId: foodItem._id, name: foodItem.name, basePrice: foodItem.basePrice, quantity: requested.quantity, selectedAddons, lineTotal: unitPrice * requested.quantity };
}

async function findExisting(IdempotencyKey, key) {
  const query = IdempotencyKey.findOne({ key });
  return typeof query?.populate === "function" ? query.populate("orderId") : query;
}

async function createOrder(input, idempotencyKey, deps) {
  if (!idempotencyKey || idempotencyKey.length < 12 || idempotencyKey.length > 200) fail("A valid Idempotency-Key header is required.", "INVALID_IDEMPOTENCY_KEY");
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) fail("Order details are invalid.", "VALIDATION_ERROR", 400, parsed.error.flatten());
  const existing = await findExisting(deps.IdempotencyKey, idempotencyKey);
  if (existing?.orderId) return existing.orderId;

  const [settings, zone, foodItems] = await Promise.all([
    deps.Settings.findOne({ key: "restaurant" }),
    deps.DeliveryZone.findOne({ normalizedName: parsed.data.deliveryArea.toLowerCase(), active: true }),
    deps.FoodItem.find({ _id: { $in: parsed.data.items.map((entry) => entry.foodItemId) } }),
  ]);
  const availability = getOrderingAvailability(settings, deps.now || new Date());
  if (!availability.canOrder) fail(availability.reason, availability.code, 409);
  if (!zone) fail("The selected delivery area is unavailable.", "INVALID_DELIVERY_AREA", 409);
  const byId = new Map(foodItems.map((foodItem) => [String(foodItem._id), foodItem]));
  const items = parsed.data.items.map((requested) => snapshotItem(requested, byId.get(requested.foodItemId)));
  const subtotal = items.reduce((sum, entry) => sum + entry.lineTotal, 0);
  if (subtotal < settings.minimumOrder) fail("The order does not meet the minimum subtotal.", "MINIMUM_ORDER", 409);
  try {
    await deps.IdempotencyKey.create({ key: idempotencyKey });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicate = await findExisting(deps.IdempotencyKey, idempotencyKey);
      if (duplicate?.orderId) return duplicate.orderId;
      fail("This checkout is already being processed.", "ORDER_IN_PROGRESS", 409);
    }
    throw error;
  }
  const counter = await deps.Counter.findOneAndUpdate({ key: "order" }, { $inc: { sequence: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  try {
    const order = await deps.Order.create({ ...parsed.data, items, deliveryArea: zone.name, orderNumber: formatOrderNumber(counter.sequence), subtotal, deliveryFee: deps.config.deliveryFeePence, total: subtotal + deps.config.deliveryFeePence });
    await deps.IdempotencyKey.updateOne({ key: idempotencyKey }, { $set: { orderId: order._id } });
    Promise.resolve(deps.notify(order)).catch((error) => console.error("Order notification failed:", error.message));
    return order;
  } catch (error) {
    if (deps.IdempotencyKey.deleteOne) await deps.IdempotencyKey.deleteOne({ key: idempotencyKey, orderId: { $exists: false } });
    throw error;
  }
}

module.exports = { createOrder, formatOrderNumber };
