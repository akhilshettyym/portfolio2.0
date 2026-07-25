import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { createAdmin } from "./src/utils/createAdmin.js";
import mongoose from "mongoose";

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(
    `\nFATAL ERROR: Missing required environment variables:\n${missingVars
      .map((v) => `   - ${v}`)
      .join("\n")}\n\nPlease check your .env file and try again.`,
  );
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn(
    "WARNING: JWT_SECRET is shorter than recommended (32+ characters). Consider using: openssl rand -base64 32",
  );
}

try {
  await connectDB();
  await createAdmin();
} catch (error) {
  console.error("FATAL: System startup failed", error);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("HTTP server closed");
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed cleanly");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection during shutdown:", err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("Forced shutdown after 10 seconds");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("Critical Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
