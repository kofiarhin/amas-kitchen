const businessConfig = require("../../shared/businessConfig.json");
const { getOrderingAvailability } = require("./orderingAvailability");

async function buildPublicBootstrap(models, config, now = new Date()) {
  const [menu, deliveryZones, settings] = await Promise.all([
    models.FoodItem.find({}).sort({ category: 1, sortOrder: 1, name: 1 }),
    models.DeliveryZone.find({ active: true }).sort({ sortOrder: 1, name: 1 }),
    models.Settings.findOne({ key: "restaurant" }),
  ]);
  const effectiveSettings = settings || { orderingEnabled: false, minimumOrder: 1, closureReason: "Ordering is being configured.", supportPhone: businessConfig.supportPhone, supportEmail: businessConfig.supportEmail };
  return {
    business: businessConfig,
    menu,
    deliveryZones,
    minimumOrder: effectiveSettings.minimumOrder,
    deliveryFee: config.deliveryFeePence,
    supportPhone: effectiveSettings.supportPhone || businessConfig.supportPhone,
    supportEmail: effectiveSettings.supportEmail || businessConfig.supportEmail,
    ordering: getOrderingAvailability(effectiveSettings, now),
  };
}

module.exports = { buildPublicBootstrap };
