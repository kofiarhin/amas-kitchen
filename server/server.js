require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const { getConfig } = require("./config/env");

const { port } = getConfig();

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log("server started on port:", port);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
