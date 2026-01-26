import express from "express";
import {
  sendOtp,
  verifyOtp,
  adminLogin,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate Limit: 3 OTPs per hour per IP
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many OTP requests from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Customer Auth
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

// Admin Auth
router.post("/admin/login", adminLogin);

export default router;
