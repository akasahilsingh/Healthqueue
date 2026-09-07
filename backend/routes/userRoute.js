import express, { Router } from "express";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  listAppointment,
  loginUser,
  paymentRazorPay,
  registerUser,
  updateProfile,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import createRateLimiter from "../middlewares/rateLimiter.js";

const userRouter = Router();

const loginLimiter = createRateLimiter({
  keyGenerator: (req) => req.ip,
  prefix: "login",
  windowSeconds: 15 * 60,
  maxRequests: 5,
});

const bookAppointmentLimiter = createRateLimiter({
  keyGenerator: (req) => req.user?.id,
  prefix: "booking",
  windowSeconds: 60,
  maxRequests: 10,
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginLimiter, loginUser);
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
