import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendWhatsappOtp } from "../utils/WhatsApp.js";

// Helper: Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 1. Send OTP (Customer)
export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save/Update in DB
    await Otp.findOneAndUpdate(
      { phone },
      { code: otpCode, createdAt: Date.now() },
      { upsert: true }, // Create if doesn't exist
    );

    // Trigger WhatsApp API
    await sendWhatsappOtp(phone, otpCode);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// 2. Verify OTP & Login (Customer)
export const verifyOtp = async (req, res) => {
  const { phone, otp, name } = req.body;
  try {
    const validOtp = await Otp.findOne({ phone, code: otp });
    if (!validOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired OTP" });
    }

    // Check if User exists, else create
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name, role: "user" });
    } else if (name) {
      // Optional: Update name if provided and missing? Or always update?
      // Let's update `name` if user doesn't have one, or maybe even if they do (to correct typo).
      user.name = name;
      await user.save();
    }

    const token = generateToken(user._id);

    // Clean up OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Admin Login (Email/Pass)
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check Email & Role
    if (!user || user.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
