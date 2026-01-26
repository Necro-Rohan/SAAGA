import express from "express";
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

// Dashboard Stats
router.get("/dashboard-stats", getDashboardStats);

// Bookings
router.get("/bookings", getAllBookings);

// Services
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

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
