import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

import authRoutes from "./src/routes/authRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("SAAGA Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
