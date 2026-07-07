const businessConfig = require("../../shared/businessConfig.json");

const images = {
  jollof: "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005872/amas-kitchen/pexels-jagaba-36707706_ibjjnv.jpg",
  grill: "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005876/amas-kitchen/pexels-kubra-dogu-80605500-8837229_zvzsmp.jpg",
  pasta: "https://res.cloudinary.com/dlsiabgiw/image/upload/v1782005871/amas-kitchen/pexels-hamzaoui-fatma-2153886935-33434010_cwgzlj.jpg",
};

const proteinAddons = () => ({
  name: "Protein",
  required: false,
  minSelections: 0,
  maxSelections: 2,
  options: [
    { name: "Extra Chicken", price: 450, available: true },
    { name: "Extra Goat", price: 600, available: true },
    { name: "Fried Fish", price: 550, available: true },
  ],
});

const sideAddons = () => ({
  name: "Sides",
  required: false,
  minSelections: 0,
  maxSelections: 3,
  options: [
    { name: "Plantain", price: 250, available: true },
    { name: "Shito", price: 150, available: true },
    { name: "Fresh Salad", price: 200, available: true },
  ],
});

const menuItems = [
  {
    name: "Party Jollof & Charcoal Chicken",
    description: "Smoky Ghanaian party jollof with charcoal-grilled chicken, sweet plantain, salad and shito.",
    images: [images.jollof],
    basePrice: 1299,
    category: "Rice Bowls",
    available: true,
    sortOrder: 1,
    addonGroups: [sideAddons(), proteinAddons()],
  },
  {
    name: "Goat Meat Jollof",
    description: "Fragrant Ghanaian jollof rice with tender goat meat, tomato gravy, sweet plantain and pepper sauce.",
    images: [images.jollof],
    basePrice: 1599,
    category: "Rice Bowls",
    available: true,
    sortOrder: 2,
    addonGroups: [sideAddons()],
  },
  {
    name: "Fried Fish Jollof",
    description: "Party jollof served with seasoned fried fish, fresh salad, shito and sweet plantain.",
    images: [images.jollof],
    basePrice: 1499,
    category: "Rice Bowls",
    available: true,
    sortOrder: 3,
    addonGroups: [sideAddons()],
  },
  {
    name: "Waakye Complete",
    description: "Rice and beans with shito, gari, spaghetti, boiled egg, plantain and your choice of protein.",
    images: [images.jollof],
    basePrice: 1399,
    category: "Rice Bowls",
    available: true,
    sortOrder: 4,
    addonGroups: [proteinAddons(), sideAddons()],
  },
  {
    name: "Ghana Fried Rice & Chicken",
    description: "Ghana-style fried rice with vegetables, egg, fried chicken and shito.",
    images: [images.grill],
    basePrice: 1299,
    category: "Rice Bowls",
    available: true,
    sortOrder: 5,
    addonGroups: [sideAddons(), proteinAddons()],
  },
  {
    name: "Shito Fried Rice",
    description: "Spicy fried rice tossed with Ghanaian black pepper shito, vegetables, egg and grilled chicken.",
    images: [images.grill],
    basePrice: 1399,
    category: "Rice Bowls",
    available: true,
    sortOrder: 6,
    addonGroups: [sideAddons(), proteinAddons()],
  },
  {
    name: "Angwa Mo Breakfast Bowl",
    description: "Ghanaian oil rice with fried egg, sardines or salted beef, fresh pepper and sliced avocado.",
    images: [images.jollof],
    basePrice: 1199,
    category: "Rice Bowls",
    available: true,
    sortOrder: 7,
    addonGroups: [
      {
        name: "Topping",
        required: false,
        minSelections: 0,
        maxSelections: 2,
        options: [
          { name: "Fried Egg", price: 150, available: true },
          { name: "Sardines", price: 250, available: true },
          { name: "Salted Beef", price: 350, available: true },
        ],
      },
      sideAddons(),
    ],
  },
  {
    name: "Omo Tuo & Groundnut Soup",
    description: "Soft rice balls served with rich groundnut soup and your choice of chicken or goat.",
    images: [images.jollof],
    basePrice: 1499,
    category: "Soups & Rice",
    available: true,
    sortOrder: 1,
    addonGroups: [
      {
        name: "Protein",
        required: false,
        minSelections: 0,
        maxSelections: 2,
        options: [
          { name: "Chicken", price: 450, available: true },
          { name: "Goat", price: 600, available: true },
        ],
      },
    ],
  },
  {
    name: "Charcoal Grill Plate",
    description: "House-spiced grilled meat with fresh slaw and pepper sauce.",
    images: [images.grill],
    basePrice: 1499,
    category: "From The Grill",
    available: true,
    sortOrder: 1,
    addonGroups: [],
  },
  {
    name: "Creamy Chicken Pasta",
    description: "Silky herb sauce, grilled chicken and seasonal greens.",
    images: [images.pasta],
    basePrice: 1199,
    category: "Pasta",
    available: true,
    sortOrder: 1,
    addonGroups: [],
  },
];

const zones = businessConfig.deliveryAreas.map((name, index) => ({
  name,
  normalizedName: name.toLowerCase(),
  active: true,
  sortOrder: index + 1,
}));

const settings = {
  key: "restaurant",
  orderingEnabled: true,
  minimumOrder: 2000,
  supportPhone: businessConfig.supportPhone,
  supportEmail: businessConfig.supportEmail,
  closureReason: "",
};

async function seedRestaurantData(models) {
  await Promise.all([
    models.FoodItem.deleteMany({}),
    models.DeliveryZone.deleteMany({}),
    models.Settings.deleteMany({}),
  ]);

  await models.FoodItem.insertMany(menuItems);
  await models.DeliveryZone.insertMany(zones);
  await models.Settings.create(settings);
}

module.exports = { seedRestaurantData };
