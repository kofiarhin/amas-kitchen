const { parseConfig } = require("../config/env");

const validEnvironment = {
  NODE_ENV: "test",
  MONGO_URI: "mongodb://127.0.0.1:27017/amas-kitchen-test",
  CLIENT_URL: "http://localhost:5173",
  DELIVERY_FEE: "3.00",
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD_HASH: "hash",
  JWT_SECRET: "at-least-sixteen-characters",
  TELEGRAM_BOT_TOKEN: "bot-token",
  TELEGRAM_CHAT_ID: "-100123",
};

test("exposes required Telegram configuration", () => {
  expect(parseConfig(validEnvironment).telegram).toEqual({ botToken: "bot-token", chatId: "-100123" });
});

test.each(["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"])("requires %s", (variable) => {
  const environment = { ...validEnvironment };
  delete environment[variable];
  expect(() => parseConfig(environment)).toThrow(variable);
});
