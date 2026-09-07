import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import "./config/redis.js";
// import adminRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// ─────────────────────────────────────────────────────────────────
// 1.1 — Process-level crash guards (must be registered before anything)
// These catch anything not caught by a try/catch in a controller.
// process.exit(1) lets the process manager (Docker, PM2, Render) restart us.
// ─────────────────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION — shutting down:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION — shutting down:", reason);
  process.exit(1);
});

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.static("public"));
app.use(express.json({ limit: "10kb" }));           // 1.3-prep: body size limit
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  process.env.ADMIN_FRONTEND_URL?.replace(/\/$/, ""),
  "https://healthqueue-olive.vercel.app",
  "https://healthqueue-admin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
  }),
);

// API endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ─────────────────────────────────────────────────────────────────
// 1.2 — Deep health check
// Returns 503 if MongoDB is disconnected so load balancers / Render
// health checks can route around a broken instance.
// ─────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    db: healthy ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Our API is working fine");
});

// ─────────────────────────────────────────────────────────────────
// 1.3 — Global error handler middleware
// Must be the LAST app.use(). Catches any error passed via next(err)
// or thrown inside an async route (Express 5 auto-catches async throws).
// In production, never leak the stack trace to the client.
// ─────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {   // eslint-disable-line no-unused-vars
  console.error(`Unhandled error [${req.method} ${req.url}]:`, err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"   // never leak stack traces in prod
        : err.message,
  });
});

// ─────────────────────────────────────────────────────────────────
// 1.1 — Graceful shutdown
// When Render / Docker / K8s sends SIGTERM before deploying a new
// version, we stop accepting new connections but finish existing ones.
// Without this, in-flight requests get killed mid-response.
// ─────────────────────────────────────────────────────────────────
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed. Process exiting.");
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
    } finally {
      process.exit(0);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
