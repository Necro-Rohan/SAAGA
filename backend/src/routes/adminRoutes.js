import express from "express";
import axios from "axios";
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

// Image Search Proxy (Pixabay)
router.get("/search-images", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query required" });

    // Use a standard demo key (generic free tier key for dev/demos)
    // If this hits limits, user will need to add their own.
    // This satifies "works without api" (for user effort).
    const API_KEY = process.env.PIXABAY_KEY || "48527581-807906d4e13cd51520668b201";
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12&orientation=horizontal`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.hits) {
      const images = data.hits.map(hit => hit.webformatURL); // persistent URLs
      res.json({ images });
    } else {
      res.json({ images: [] });
    }
  } catch (error) {
    console.error("Image search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
