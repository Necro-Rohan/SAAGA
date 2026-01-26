import express from "express";
import { sendOtp, verifyOtp, adminLogin } from "../controllers/authController.js";

const router = express.Router();

// Customer Auth
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Admin Auth
router.post("/admin/login", adminLogin);

export default router;
