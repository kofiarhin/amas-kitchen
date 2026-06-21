const fs = require("fs");
const path = require("path");

test("operations docs cover required configuration, seeding and 30-day backups", () => {
  const root = path.resolve(__dirname, "../..");
  const env = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  const operations = fs.readFileSync(path.join(root, "docs/OPERATIONS.md"), "utf8");
  for (const variable of ["MONGO_URI", "DELIVERY_FEE", "ADMIN_PASSWORD_HASH", "JWT_SECRET", "SMTP_HOST", "ORDER_NOTIFICATION_EMAIL"]) expect(env).toContain(`${variable}=`);
  expect(operations).toMatch(/npm run seed/);
  expect(operations).toMatch(/30 days/i);
  expect(operations).toMatch(/health/i);
});
