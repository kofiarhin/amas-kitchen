const { z } = require("zod");

const option = z.object({ name: z.string().trim().min(1).max(100), price: z.number().int().min(0), available: z.boolean().default(true) });
const addonGroup = z.object({ name: z.string().trim().min(1).max(100), required: z.boolean().default(false), minSelections: z.number().int().min(0), maxSelections: z.number().int().min(1), options: z.array(option).min(1) }).superRefine((group, context) => {
  if (group.minSelections > group.maxSelections || (group.required && group.minSelections < 1) || group.maxSelections > group.options.length) context.addIssue({ code: "custom", message: "Addon selection limits are invalid." });
});

const foodItemInput = z.object({ name: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(500), images: z.array(z.string().url()).min(1).max(10), basePrice: z.number().int().positive(), category: z.string().trim().min(1).max(80), available: z.boolean().default(true), sortOrder: z.number().int().default(0), addonGroups: z.array(addonGroup).default([]) });
const zoneInput = z.object({ name: z.string().trim().min(1).max(120), active: z.boolean().default(true), sortOrder: z.number().int().default(0) });
const settingsInput = z.object({ orderingEnabled: z.boolean(), minimumOrder: z.number().int().positive(), supportPhone: z.string().trim().min(7).max(30), supportEmail: z.string().email(), closureReason: z.string().trim().max(240) });

module.exports = { foodItemInput, settingsInput, zoneInput };
