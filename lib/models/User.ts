import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  username: { type: String, unique: true, sparse: true },
});

export default models.User || model("User", UserSchema);
