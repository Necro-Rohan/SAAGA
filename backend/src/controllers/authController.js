import Otp from "../models/Otp.js";
import User from "../models/User.js"; 
import jwt from "jsonwebtoken";
import { sendWhatsappOtp } from "../utils/WhatsApp.js";

// 1. Send OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Make sure my Meta Template name in the dashboard (e.g., auth_otp) matches exactly with this variable name

    // Save to DB (Update if exists, create if new)
    await Otp.findOneAndUpdate(
      { phone },
      { code: otpCode, createdAt: Date.now() },
      { upsert: true },
    );

    // Send via WhatsApp
    await sendWhatsappOtp(phone, otpCode);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify OTP & Login
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ phone, code: otp });
    if (!validOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired OTP" });
    }

    // Find or Create User
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // Generate Token (Valid for 7 days)
    const token = jwt.sign({ id: user._id, phone }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
