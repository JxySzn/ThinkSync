import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/sendgrid";
import { generateOtp, hashPassword } from "@/lib/authUtils";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { connectToDatabase } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { fullname, email, password } = await req.json();
  if (!fullname || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Connect to database
  await connectToDatabase();

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 200 } // Always return 200 so frontend can show toast
    );
  }
  // Remove any previous pending user for this email
  await PendingUser.deleteOne({ email });
  const hashed = await hashPassword(password);
  const otp = generateOtp();
  // Send OTP email
  await sendVerificationEmail(email, otp);
  // Store signup info and otp in PendingUser collection
  await PendingUser.create({ fullname, email, password: hashed, otp });
  return NextResponse.json({ success: true });
}
