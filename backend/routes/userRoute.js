import express, { Router } from "express";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  listAppointment,
  loginUser,
  logoutUser,
  paymentRazorPay,
  registerUser,
  updateProfile,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import createRateLimiter from "../middlewares/rateLimiter.js";

const userRouter = Router();

// Per-account: blocks targeting one email from many IPs
const loginLimiterByEmail = createRateLimiter({
  keyGenerator: (req) => req.body?.email?.toLowerCase() || req.ip,
  prefix: "login:email",
  windowSeconds: 15 * 60,  // 15 min window
  maxRequests: 10,          // 10 attempts per account
});

// NOTE: IP-based rate limiting belongs at the infrastructure layer
// (Nginx, Cloudflare, AWS WAF) — not in Express app code.
// The email limiter above is sufficient for per-account brute-force protection.

const bookAppointmentLimiter = createRateLimiter({
  keyGenerator: (req) => req.user?.id,
  prefix: "booking",
  windowSeconds: 60,
  maxRequests: 10,
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile,
);
userRouter.post(
  "/book-appointment",
  authUser,
  bookAppointmentLimiter,
  bookAppointment,
);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorPay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);

export default userRouter;
