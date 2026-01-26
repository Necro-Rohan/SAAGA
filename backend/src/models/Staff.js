import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["stylist", "manager", "helper"],
      default: "stylist",
    },
    isActive: { type: Boolean, default: true }, // Soft Delete
  },
  { timestamps: true },
);

export default mongoose.model("Staff", staffSchema);
