import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import PendingUser from "@/lib/models/PendingUser";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const { email, username } = await req.json();
  if (!email || !username)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Connect to database
  await connectToDatabase();

  // Find pending user with verified OTP
  const pending = await PendingUser.findOne({ email, otpVerified: true });
  if (!pending) {
    return NextResponse.json(
      { error: "OTP not verified or session expired" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 200 }
    );
  }

  // Check if username is already taken
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 400 }
    );
  }

  // Create user in DB
  await User.create({
    fullname: pending.fullname,
    email: pending.email,
    password: pending.password,
    verified: true,
    username,
  });
  // Remove pending user
  await PendingUser.deleteOne({ email });
  return NextResponse.json({ success: true });
}
