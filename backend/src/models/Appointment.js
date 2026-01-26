import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The Customer
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      variant: { type: String, enum: ["male", "female"], required: true }, // New field
    },
  ],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // New field for Inventory
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // New field
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // Format: "10:00 AM"
  totalAmount: { type: Number, required: true }, // Server-Calculated
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Appointment", appointmentSchema);
