import Appointment from "../models/Appointment.js";
import BlockedSlot from "../models/BlockedSlot.js";
import Service from "../models/Service.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import { sendWhatsappOtp } from "../utils/WhatsApp.js"; // We might need a separate template for confirmation
import mongoose from "mongoose";

// Helper: Get Time Slots (10 AM - 8 PM)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 10;
  const endHour = 20; // 8 PM
  for (let i = startHour; i < endHour; i++) {
    const hour = i === 12 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    slots.push(`${hour}:00 ${ampm}`);
    slots.push(`${hour}:30 ${ampm}`);
  }
  return slots;
};

export const getSlots = async (req, res) => {
  const { date, staffId, serviceIds } = req.query; // serviceIds is comma-separated string
  if (!date || !serviceIds)
    return res.status(400).json({ message: "Date and Services required" });

  try {
    // A. Calculate Total Duration
    const services = await Service.find({
      _id: { $in: serviceIds.split(",") },
    });
    const totalDuration = services.reduce(
      (acc, s) => acc + (s.duration || 30),
      0,
    );
    const slotsNeeded = Math.ceil(totalDuration / 30);

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    // B. Get Constraints
    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
      ...(staffId && { staff: staffId }), // Filter by staff if selected
    });

    const blocks = await BlockedSlot.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      $or: [{ staffId: null }, { staffId: staffId }], // Global blocks OR specific staff blocks
    });

    // C. Logic: Find consecutive free slots
    // This requires a loop through your generateTimeSlots() array
    // checking if index [i], [i+1]... [i+slotsNeeded-1] are all free.
    // (Pseudocode implemented in full project)

    // For now, return basic filtered slots to prevent crash
    res.json({
      date,
      slots: [],
      message: "Smart slot logic to be implemented with utility functions",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create Booking
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    const { userId, date, timeSlot, services, products, staffId } = req.body;
    // A. Concurrency Check (Is slot still free?)
    const existing = await Appointment.findOne({
      date: new Date(date),
      timeSlot,
      status: { $nin: ["cancelled", "noshow"] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Slot already booked/Unavailable. Please choose another." });
    }

    const blocked = await BlockedSlot.findOne({
      date: new Date(date),
      timeSlot,
    });
    if (blocked) {
      return res
        .status(409)
        .json({ message: "Slot already booked/Unavailable. Please choose another." });
    }

    // B. Calculate TOTAL Price (Securely from Backend)
    let totalAmount = 0;

    // Services
    if (services && services.length > 0) {
      for (const item of services) {
        const service = await Service.findOne({
          _id: item.serviceId,
          isActive: true,
        });
        if (!service)
          throw new Error(`Service not available: ${item.serviceId}`);

        totalAmount +=
          item.variant === "male" ? service.prices.male : service.prices.female;
      }
    }

    // Products
    if (products && products.length > 0) {
      for (const prodId of products) {
        const product = await Product.findOne({ _id: prodId, isActive: true });
        if (!product) throw new Error(`Product not available: ${prodId}`);
        totalAmount += product.price;

        // Decreasing Stock
        await Product.findByIdAndUpdate(prodId, { $inc: { stock: -1 } }, {session});
      }
    }

    const appointment = await Appointment.create([{
      userId: userId,
      date: new Date(date),
      timeSlot,
      services,
      products,
      staff: staffId,
      totalAmount,
      status: "confirmed",
    }], {session});

    try {
      const user = await User.findById(userId);
      if (user) {
        // TODO: Create a separate 'booking_confirmed' template function in WhatsApp.js
        // await sendWhatsappConfirmation(user.phone, date, timeSlot);
      }
    } catch (notifyError) {
      console.error(
        "Notification Failed (Booking still successful):",
        notifyError.message,
      );
    }
    await session.commitTransaction()
    return res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error("Booking Error:", error);
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};
// 3. Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate("services.serviceId")
      .populate("products")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Cancel Booking
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify ownership
    if (appointment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // Check if already cancelled or completed
    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }
    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed booking" });
    }

    // Update status
    appointment.status = "cancelled";
    await appointment.save();

    // Optionally: Increase product stock back if products were purchased?
    // Current logic decreased stock on booking. We should probably increase it back.
    if (appointment.products && appointment.products.length > 0) {
      for (const prodId of appointment.products) {
        await Product.findByIdAndUpdate(prodId, { $inc: { stock: 1 } });
      }
    }

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).json({ message: error.message });
  }
};
