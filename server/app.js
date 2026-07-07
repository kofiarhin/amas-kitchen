const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const publicRoutes = require("./routes/public");
const orderRoutes = require("./routes/orders");
const adminAuthRoutes = require("./routes/adminAuth");
const adminOrderRoutes = require("./routes/adminOrders");
const adminManagementRoutes = require("./routes/adminManagement");
const { getConfig } = require("./config/env");

const app = express();

const { clientOrigins: allowedOrigins } = getConfig();
const clientDistPath = path.resolve(__dirname, "../client/dist");

app.disable("x-powered-by");
app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendFile(path.join(clientDistPath, "index.html"));
  }

  return res.json({ message: "Welcome to Amas Kitchen" });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "amas-kitchen-api",
    message: "Server is healthy",
  });
});

app.get("/deploy-status", (req, res) => {
  return res.status(200).json({
    status: "deployed",
    service: "amas-kitchen-api",
    message: "CI/CD deployment check passed",
  });
});

app.use("/api/public", publicRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/manage", adminManagementRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const duplicate = err.code === 11000;
  return res.status(duplicate ? 409 : (err.status || 500)).json({
    success: false,
    error: {
      code: duplicate ? "DUPLICATE_RECORD" : (err.code || "SERVER_ERROR"),
      message: duplicate ? "A record with that value already exists." : (err.status ? err.message : (process.env.NODE_ENV === "production" ? "Server error" : err.message)),
      details: err.details,
    },
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
