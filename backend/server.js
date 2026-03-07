require("dotenv").config();

const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Required for Render, Railway, Heroku and any reverse-proxy deployment.
// Allows express-rate-limit to read the real client IP from X-Forwarded-For
// instead of the proxy IP — which would cause ALL users to share one bucket.
app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://invenx-se.vercel.app")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.options("*", cors());

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // 50 attempts per real client IP per window
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,     // Return rate limit info in RateLimit-* headers
  legacyHeaders: false       // Disable X-RateLimit-* headers
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "InvenX API" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`InvenX API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
