import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createService,
  updateService,
  deleteService,
  getAllServices,
  createProduct,
  updateProduct,
  createStaff,
  getStaff,
  blockSlot,
  unblockSlot,
  getDashboardStats,
  getAllBookings,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Bookings
router.get("/bookings", getAllBookings);

// Services
router.get("/services", getAllServices);
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

// Categories
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;
