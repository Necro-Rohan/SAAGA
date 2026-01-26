import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true }, // e.g. 20 for 20% or 500 for ₹500 off
    code: { type: String, uppercase: true, unique: true }, // Coupon Code
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Offer", offerSchema);
