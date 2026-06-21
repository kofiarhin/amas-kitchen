const { getOrderingAvailability } = require("./orderingAvailability");

async function buildPublicBootstrap(models, config, now = new Date()) {
  const [menu, deliveryZones, settings] = await Promise.all([
    models.FoodItem.find({}).sort({ category: 1, sortOrder: 1, name: 1 }),
    models.DeliveryZone.find({ active: true }).sort({ sortOrder: 1, name: 1 }),
    models.Settings.findOne({ key: "restaurant" }),
  ]);
  const effectiveSettings = settings || { orderingEnabled: false, minimumOrder: 1, closureReason: "Ordering is being configured." };
  return {
    menu,
    deliveryZones,
    minimumOrder: effectiveSettings.minimumOrder,
    deliveryFee: config.deliveryFeePence,
    supportPhone: effectiveSettings.supportPhone || "",
    supportEmail: effectiveSettings.supportEmail || "",
    ordering: getOrderingAvailability(effectiveSettings, now),
  };
}

module.exports = { buildPublicBootstrap };
