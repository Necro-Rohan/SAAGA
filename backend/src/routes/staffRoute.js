import { getStaffSchedule, getActiveNotices } from "../controllers/staffController.js";
import express from "express";
import { verifyToken, verifyStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected: Only staff and admin can access
router.get("/schedule", verifyToken, verifyStaff, getStaffSchedule);
router.get("/notices", verifyToken, verifyStaff, getActiveNotices);

export default router;