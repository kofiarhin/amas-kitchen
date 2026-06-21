const express = require("express");

const app = express();

// setup middleware
app.use(express.json());

app.get("/", async (req, res, next) => {
  return res.json({ message: "hello world" });
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
