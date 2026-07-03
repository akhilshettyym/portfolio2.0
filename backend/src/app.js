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

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api", limiter);

app.use(
  cors({
    origin: (origin, callback) => {
      const isProduction = process.env.NODE_ENV === "production";

      const allowedOrigins = isProduction
        ? [process.env.CLIENT_URL]
        : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          process.env.CLIENT_URL,
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
  }),
);

app.use(express.json());

app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRoute);

app.use((err, req, res) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred";

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
  });
});

export default app;