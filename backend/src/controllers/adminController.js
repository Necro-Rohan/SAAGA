import Service from "../models/Service.js";
import Product from "../models/Product.js";
import Staff from "../models/Staff.js";
import BlockedSlot from "../models/BlockedSlot.js";
import Appointment from "../models/Appointment.js";
import Category from "../models/Category.js";

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
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { date, timeSlot, reason } = req.body;
    const blocked = await BlockedSlot.create({ date, timeSlot, reason });
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
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
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

