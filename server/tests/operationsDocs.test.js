const fs = require("fs");
const path = require("path");

test("operations docs cover required configuration, seeding and 30-day backups", () => {
  const root = path.resolve(__dirname, "../..");
  const env = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  const packageJson = fs.readFileSync(path.join(root, "package.json"), "utf8");
  const operations = fs.readFileSync(path.join(root, "docs/OPERATIONS.md"), "utf8");
  const notificationDocs = ["PROJECT_CONTEXT.md", "ARCHITECTURE.md", "VERIFY.md", "OPERATIONS.md"]
    .map((file) => fs.readFileSync(path.join(root, "docs", file), "utf8"))
    .join("\n");
  for (const variable of ["MONGO_URI", "DELIVERY_FEE", "ADMIN_PASSWORD_HASH", "JWT_SECRET", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"]) expect(env).toContain(`${variable}=`);
  expect(env).not.toMatch(/SMTP_|ORDER_NOTIFICATION_EMAIL/);
  expect(packageJson).not.toMatch(/nodemailer/i);
  expect(notificationDocs).not.toMatch(/SMTP|Nodemailer/);
  expect(operations).toMatch(/TELEGRAM_BOT_TOKEN/);
  expect(operations).toMatch(/TELEGRAM_CHAT_ID/);
  expect(operations).toMatch(/npm run seed/);
  expect(operations).toMatch(/30 days/i);
  expect(operations).toMatch(/health/i);
});
