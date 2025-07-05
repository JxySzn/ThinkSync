import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  otp: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min TTL
});

export default mongoose.models.PendingUser ||
  mongoose.model("PendingUser", PendingUserSchema);
