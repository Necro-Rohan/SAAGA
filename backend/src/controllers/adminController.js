import Service from "../models/service.model.js";
import Product from "../models/product.model.js";
import Staff from "../models/staff.model.js";
import BlockedSlot from "../models/blockedSlot.model.js";
import Appointment from "../models/appointment.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Notice from "../models/natice.model.js";
import axios from "axios";

// --- Services ---
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    // Soft Delete
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: "Service disabled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Products (Inventory) ---
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Staff ---
export const createStaff = async (req, res) => {
  const { name, role, email, password } = req.body;

  // Start a transaction (Best practice: either both succeed or both fail)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create the Staff Profile (The "Job" entity)
    const newStaff = await Staff.create([{ name, role }], { session });
    const staffId = newStaff[0]._id;

    let userId = null;

    // 2. If email/password provided, create a User Login (The "Auth" entity)
    if (email && password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            role: "staff", // Grants access to the portal
            staffProfile: staffId,
          },
        ],
        { session },
      );

      userId = newUser[0]._id;

      // Link Staff back to User
      newStaff[0].userId = userId;
      await newStaff[0].save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({ success: true, staff: newStaff[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Blocked Slots ---
export const blockSlot = async (req, res) => {
  try {
    const { date, timeSlot, reason, staffId } = req.body;
    // staffId can be null (Global) or an ID (Specific)
    const blocked = await BlockedSlot.create({
      date,
      timeSlot,
      reason,
      staffId,
    });
    res.status(201).json(blocked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockSlot = async (req, res) => {
  try {
    await BlockedSlot.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Slot unblocked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Dashboard Stats ---
export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Appointment.countDocuments();
    const todayBookings = await Appointment.countDocuments({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });
    // Calculate total revenue
    const revenueAgg = await Appointment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].total : 0;

    res.json({ totalBookings, todayBookings, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Bookings ---
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Appointment.find()
      .populate("userId", "phone")
      .populate({ path: "services.serviceId", select: "name" })
      .populate("staff", "name")
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Categories ---
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: "Category disabled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const promoteUser = async (req, res) => {
  const { email } = req.body;

  // Super Admin Check
  if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return res
      .status(403)
      .json({ message: "Only Super Admin can promote users." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: `${user.email} is now an Admin.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const demoteUser = async (req, res) => {
  const { email } = req.body;

  // Super Admin Check (Only Super Admin can demote others)
  if (req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return res
      .status(403)
      .json({ message: "Only Super Admin can demote users." });
  }

  // Prevent Demoting the Super Admin (Self-Lockout Protection)
  if (email === process.env.SUPER_ADMIN_EMAIL) {
    return res
      .status(400)
      .json({ message: "You cannot demote the Super Admin." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "user" }, // Reset to basic user
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: `${user.email} has been demoted to User.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { guestDetails, force, ...bookingData } = req.body;
  // guestDetails = { name: "Rk", phone: "12345" }
  // force = true (Ignore all warnings) or false (Respect schedule)

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let userId = bookingData.userId;

    // Handle Walk-ins
    if (!userId && guestDetails) {
      // Check if user exists by phone, else create
      let user = await User.findOne({ phone: guestDetails.phone }).session(
        session,
      );
      if (!user) {
        user = await User.create(
          [
            {
              phone: guestDetails.phone,
              name: guestDetails.name,
              role: "user",
            },
          ],
          { session },
        );
        user = user[0];
      }
      userId = user._id;
    }

    if (!force) {
      const { date, timeSlot, staffId } = bookingData;

      //chekcing if the slot is blocked? (Holiday, Break, etc.)
      const isBlocked = await BlockedSlot.findOne({
        date: new Date(date),
        timeSlot: timeSlot,
        $or: [{ staffId: null }, { staffId: staffId }],
      }).session(session);

      if (isBlocked) {
        throw new Error(
          `Slot is blocked: ${isBlocked.reason}. Use 'Force' to override.`,
        );
      }

      // Is the slot already taken by any oteher user?
      const existingBooking = await Appointment.findOne({
        date: new Date(date),
        timeSlot: timeSlot,
        staff: staffId,
        status: { $ne: "cancelled" },
      }).session(session);

      if (existingBooking) {
        throw new Error("Slot already booked. Use 'Force' to override.");
      }
    }

    // Create Booking ,Bypassing checks if "force" flag is true
    const appointment = await Appointment.create(
      [
        {
          ...bookingData,
          userId,
          status: "confirmed", // Auto confirming for Admin
          paymentStatus: "paid", // Assuming Walk-ins pay at desk
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res.json({ success: true, appointment: appointment[0] });
  } catch (error) {
    await session.abortTransaction();
    const status = error.message.includes("Force") ? 409 : 500;
    res.status(status).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const editBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId, timeSlot, status, staffNotes } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      {
        ...(staffId && { staff: staffId }),
        ...(timeSlot && { timeSlot }),
        ...(status && { status }),
        ...(staffNotes && { staffNotes }),
      },
      { new: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchImages = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query required" });

    const API_KEY =
      process.env.PIXABAY_KEY || "48527581-807906d4e13cd51520668b201";
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12&orientation=horizontal`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.hits) {
      const images = data.hits.map((hit) => hit.webformatURL);
      res.json({ images });
    } else {
      res.json({ images: [] });
    }
  } catch (error) {
    console.error("Image search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Comes from verifyToken middleware
    const { name, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Notices ---
export const createNotice = async (req, res) => {
  try {
    const { message, type } = req.body;
    const notice = await Notice.create({
      message,
      type, // "info", "warning", "urgent", "success", "alert"
      createdBy: req.user._id,
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
