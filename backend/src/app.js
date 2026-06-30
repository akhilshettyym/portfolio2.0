import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import userRoute from "./routes/user.route.js";

const app = express();


app.get("/ping", (req, res) => {
    res.send("pong");
});

// 1. Secure HTTP Headers
app.use(helmet());

// 2. Global Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use("/api", limiter);

// 3. CORS Configuration
app.use(cors({
   origin: (origin, callback) => {
       const allowedOrigins = [
           "http://localhost:3001",
           "http://localhost:3002", 
           process.env.CLIENT_URL
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
}));

app.use(express.json());
app.use(cookieParser());

/* Routes */
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRoute);

export default app;