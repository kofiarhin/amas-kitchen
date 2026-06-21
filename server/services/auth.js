const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

async function authenticateAdmin(email, password, config) {
  const emailMatches = String(email || "").toLowerCase() === config.adminEmail;
  const passwordMatches = await bcrypt.compare(String(password || ""), config.adminPasswordHash);
  if (!emailMatches || !passwordMatches) throw new AppError("Email or password is incorrect.", 401, "INVALID_CREDENTIALS");
  return { email: config.adminEmail };
}

const signAdminToken = (config) => jwt.sign({ sub: config.adminEmail, role: "admin" }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
const verifyAdminToken = (token, config) => jwt.verify(token, config.jwtSecret);
const cookieOptions = (config) => ({ httpOnly: true, secure: config.nodeEnv === "production", sameSite: config.nodeEnv === "production" ? "none" : "lax", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" });

module.exports = { authenticateAdmin, cookieOptions, signAdminToken, verifyAdminToken };
