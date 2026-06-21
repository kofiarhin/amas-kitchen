const express = require("express");
const { rateLimit } = require("express-rate-limit");
const { z } = require("zod");
const { getConfig } = require("../config/env");
const { authenticateAdmin, cookieOptions, signAdminToken } = require("../services/auth");
const requireAdmin = require("../middleware/requireAdmin");
const AppError = require("../utils/AppError");

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(200) });

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("Enter a valid email and password.", 400, "VALIDATION_ERROR");
    const config = getConfig();
    const admin = await authenticateAdmin(parsed.data.email, parsed.data.password, config);
    res.cookie("amas_admin", signAdminToken(config), cookieOptions(config)).json({ success: true, data: admin });
  } catch (error) { next(error); }
});
router.post("/logout", (req, res) => res.clearCookie("amas_admin", { path: "/" }).json({ success: true }));
router.get("/session", requireAdmin, (req, res) => res.json({ success: true, data: { email: req.admin.sub } }));

module.exports = router;
