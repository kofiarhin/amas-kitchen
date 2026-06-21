const { parseConfig } = require("../config/env");

const validEnv = {
  NODE_ENV: "test",
  MONGO_URI: "mongodb://localhost:27017/amas-test",
  CLIENT_URL: "http://localhost:5173",
  DELIVERY_FEE: "3.00",
  ADMIN_EMAIL: "admin@amaskitchen.co.uk",
  ADMIN_PASSWORD_HASH: "$2b$12$example",
  JWT_SECRET: "a-secret-long-enough-for-tests",
  JWT_EXPIRES_IN: "7d",
  TELEGRAM_BOT_TOKEN: "bot-token",
  TELEGRAM_CHAT_ID: "-100123",
};

describe("parseConfig", () => {
  test("normalizes delivery fee to integer pence", () => {
    expect(parseConfig(validEnv).deliveryFeePence).toBe(300);
  });

  test.each([undefined, "0", "-1", "not-money"])(
    "rejects invalid DELIVERY_FEE %p",
    (deliveryFee) => {
      expect(() => parseConfig({ ...validEnv, DELIVERY_FEE: deliveryFee })).toThrow(
        /DELIVERY_FEE/,
      );
    },
  );

  test("requires production security settings", () => {
    expect(() =>
      parseConfig({ ...validEnv, NODE_ENV: "production", JWT_SECRET: "" }),
    ).toThrow(/JWT_SECRET/);
  });
});
