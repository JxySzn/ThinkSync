import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  username: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  location: { type: String },
  joinDate: { type: Date, default: Date.now },
  online: { type: Boolean, default: false },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  website: { type: String },
  bio: { type: String },
  birthDate: { type: Date },
  coverPhoto: { type: String },
});

export default models.User || model("User", UserSchema);
