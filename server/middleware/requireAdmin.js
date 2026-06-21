const AppError = require("../utils/AppError");
const { getConfig } = require("../config/env");
const { verifyAdminToken } = require("../services/auth");

function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.amas_admin;
    if (!token) throw new AppError("Admin authentication is required.", 401, "UNAUTHORIZED");
    req.admin = verifyAdminToken(token, getConfig());
    next();
  } catch (error) {
    next(error.code === "UNAUTHORIZED" ? error : new AppError("Admin session is invalid or expired.", 401, "UNAUTHORIZED"));
  }
}

module.exports = requireAdmin;
