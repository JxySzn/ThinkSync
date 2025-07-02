import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/sendgrid";
import { generateOtp, hashPassword } from "@/lib/authUtils";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { fullname, email, password } = await req.json();
  if (!fullname || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 200 } // Always return 200 so frontend can show toast
    );
  }
  const hashed = await hashPassword(password);
  const otp = generateOtp();
  // Send OTP email
  await sendVerificationEmail(email, otp);
  // Store signup info and otp in a JWT (not in DB yet)
  const signupToken = jwt.sign(
    { fullname, email, password: hashed, otp, otpVerified: false },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  // Send token to client (client will send it back for OTP verification)
  return NextResponse.json({ success: true, signupToken });
}
