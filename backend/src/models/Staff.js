import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "salon_manager",
        "assistant_manager",
        "casier",
        "receptionist",
        "stylist",
        "beautician",
        "makeup_artist",
        "helper",
      ],
      default: "stylist",
    },
    specialization: {
      type: [String],
      default: [],
    },
    isActive: { type: Boolean, default: true }, // Soft Delete
  },
  { timestamps: true },
);

export default mongoose.model("Staff", staffSchema);
