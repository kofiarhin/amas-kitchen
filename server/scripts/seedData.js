const businessConfig = require("../../shared/businessConfig.json");

const menuItems = [
  { name: "Smoky Jollof & Chicken", description: "Party jollof, flame-grilled chicken and sweet plantain.", images: ["https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005872/amas-kitchen/pexels-jagaba-36707706_ibjjnv.jpg"], basePrice: 1299, category: "Rice Bowls", available: true, sortOrder: 1, addonGroups: [{ name: "Extras", required: false, minSelections: 0, maxSelections: 2, options: [{ name: "Plantain", price: 250, available: true }, { name: "Extra Chicken", price: 450, available: true }] }] },
  { name: "Charcoal Grill Plate", description: "House-spiced grilled meat with fresh slaw and pepper sauce.", images: ["https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005876/amas-kitchen/pexels-kubra-dogu-80605500-8837229_zvzsmp.jpg"], basePrice: 1499, category: "From The Grill", available: true, sortOrder: 1, addonGroups: [] },
  { name: "Creamy Chicken Pasta", description: "Silky herb sauce, grilled chicken and seasonal greens.", images: ["https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005871/amas-kitchen/pexels-hamzaoui-fatma-2153886935-33434010_cwgzlj.jpg"], basePrice: 1199, category: "Pasta", available: true, sortOrder: 1, addonGroups: [] },
];

const zones = businessConfig.deliveryAreas.map((name, index) => ({ name, normalizedName: name.toLowerCase(), active: true, sortOrder: index + 1 }));
const settings = { key: "restaurant", orderingEnabled: true, minimumOrder: 2000, supportPhone: businessConfig.supportPhone, supportEmail: businessConfig.supportEmail, closureReason: "" };

async function seedRestaurantData(models) {
  await Promise.all(menuItems.map((item) => models.FoodItem.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true })));
  await Promise.all(zones.map((zone) => models.DeliveryZone.updateOne({ normalizedName: zone.normalizedName }, { $setOnInsert: zone }, { upsert: true })));
  await models.Settings.updateOne({ key: "restaurant" }, { $setOnInsert: settings }, { upsert: true });
}

module.exports = { seedRestaurantData };
