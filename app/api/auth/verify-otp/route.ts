import { NextRequest, NextResponse } from "next/server";
import PendingUser from "@/lib/models/PendingUser";
import { connectToDatabase } from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Connect to database
  await connectToDatabase();

  // Find pending user
  const pending = await PendingUser.findOne({ email });
  if (!pending) {
    return NextResponse.json(
      { error: "Signup session expired or invalid." },
      { status: 400 }
    );
  }
  if (pending.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }
  // Mark OTP as verified, do not create user yet
  pending.otpVerified = true;
  await pending.save();
  // Debug log
  console.log("OTP verified for email:", email, "PendingUser:", pending);
  return NextResponse.json({ success: true });
}
