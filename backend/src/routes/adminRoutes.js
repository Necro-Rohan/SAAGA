import express from "express";
import { verifyToken, verifyAdmin, verifyStaff } from "../middleware/authMiddleware.js";
import {
  createService,
  updateService,
  deleteService,
  getAllServices,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  createStaff,
  getStaff,
  updateStaff,
  blockSlot,
  unblockSlot,
  getDashboardStats,
  createBooking,
  editBooking,
  cancelBooking,
  getAllBookings,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  promoteUser,
  demoteUser,
  searchImages,
  updateProfile,
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
router.post("/promote-user", promoteUser);
router.post("/bookings", createBooking); // Walk-in / Override
router.put("/bookings/:id", editBooking); // Reschedule / Reassign
router.post("/demote-user", demoteUser);

router.patch("/profile", updateProfile); // Admin Profile Update

// Image Search Proxy (Pixabay)
router.get("/search-images", searchImages);

export default router;
