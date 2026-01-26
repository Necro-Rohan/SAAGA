import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true }, // Customer ID
  role: { type: String, enum: ["user", "admin"], default: "user" },
  name: { type: String },
  // Admin Specifics
  email: { type: String }, // For Notifications
  password: { type: String }, 
  notes: { type: String }, // Internal admin notes
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
