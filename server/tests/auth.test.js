const bcrypt = require("bcryptjs");
const { authenticateAdmin, signAdminToken } = require("../services/auth");

test("authenticates the configured admin without exposing the password hash", async () => {
  const passwordHash = await bcrypt.hash("correct horse battery staple", 4);
  const config = { adminEmail: "admin@amaskitchen.co.uk", adminPasswordHash: passwordHash, jwtSecret: "a-secret-long-enough", jwtExpiresIn: "7d" };
  await expect(authenticateAdmin("ADMIN@amaskitchen.co.uk", "correct horse battery staple", config)).resolves.toEqual({ email: "admin@amaskitchen.co.uk" });
  expect(signAdminToken(config)).toEqual(expect.any(String));
});

test("uses one generic error for invalid credentials", async () => {
  const config = { adminEmail: "admin@amaskitchen.co.uk", adminPasswordHash: await bcrypt.hash("right", 4), jwtSecret: "a-secret-long-enough", jwtExpiresIn: "7d" };
  await expect(authenticateAdmin("unknown@example.com", "wrong", config)).rejects.toMatchObject({ code: "INVALID_CREDENTIALS", status: 401 });
});
