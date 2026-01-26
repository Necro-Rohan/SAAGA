import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createService,
  updateService,
  deleteService,
  createProduct,
  updateProduct,
  createStaff,
  getStaff,
  blockSlot,
  unblockSlot,
  getDashboardStats,
  getAllBookings,
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Bookings
router.get("/bookings", getAllBookings);

// Services
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService); // Soft Delete

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);

// Staff
router.post("/staff", createStaff);
router.get("/staff", getStaff);

// Blocked Slots
router.post("/blocked-slots", blockSlot);
router.delete("/blocked-slots/:id", unblockSlot);

export default router;
