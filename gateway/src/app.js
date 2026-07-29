import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import userRoute from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

app.set("trust proxy", 1);

const parseOrigins = (value) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || [];

app.use(
  helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use(
  cors({
    origin: (origin, callback) => {
      const isProduction = process.env.NODE_ENV === "production";

      const allowedOrigins = isProduction
        ? [
            process.env.CLIENT_URL,
            process.env.ADMIN_URL,
            ...parseOrigins(process.env.CLIENT_URL),
            ...parseOrigins(process.env.ADMIN_URL),
          ].filter(Boolean)
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            process.env.CLIENT_URL,
            process.env.ADMIN_URL,
            ...parseOrigins(process.env.CLIENT_URL),
            ...parseOrigins(process.env.ADMIN_URL),
          ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS Blocked Request from Origin: "${origin}"`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    status: err.statusCode || 500,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred";

  const responseMessage = process.env.NODE_ENV === "production" ? "Internal Server Error" : message;

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
});

export default app;
