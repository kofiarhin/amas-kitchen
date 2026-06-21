const { z } = require("zod");

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
  DELIVERY_FEE: z.string().min(1, "DELIVERY_FEE is required"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be valid"),
  ADMIN_PASSWORD_HASH: z.string().min(1, "ADMIN_PASSWORD_HASH is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must contain at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  ORDER_NOTIFICATION_EMAIL: z.string().email().optional(),
});

function parseDeliveryFee(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(value || "")) {
    throw new Error("DELIVERY_FEE must be a positive monetary amount");
  }

  const pence = Math.round(Number(value) * 100);
  if (pence <= 0) throw new Error("DELIVERY_FEE must be positive");
  return pence;
}

function parseConfig(environment = process.env) {
  const parsed = baseSchema.parse(environment);
  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    mongoUri: parsed.MONGO_URI,
    clientOrigins: parsed.CLIENT_URL.split(",").map((value) => value.trim()).filter(Boolean),
    deliveryFeePence: parseDeliveryFee(parsed.DELIVERY_FEE),
    adminEmail: parsed.ADMIN_EMAIL.toLowerCase(),
    adminPasswordHash: parsed.ADMIN_PASSWORD_HASH,
    jwtSecret: parsed.JWT_SECRET,
    jwtExpiresIn: parsed.JWT_EXPIRES_IN,
    smtp: {
      host: parsed.SMTP_HOST,
      port: parsed.SMTP_PORT,
      secure: parsed.SMTP_SECURE === "true",
      user: parsed.SMTP_USER,
      pass: parsed.SMTP_PASS,
      from: parsed.SMTP_FROM,
      recipient: parsed.ORDER_NOTIFICATION_EMAIL || parsed.ADMIN_EMAIL,
    },
  };
}

let cachedConfig;
function getConfig() {
  if (!cachedConfig) cachedConfig = parseConfig();
  return cachedConfig;
}

module.exports = { getConfig, parseConfig };
