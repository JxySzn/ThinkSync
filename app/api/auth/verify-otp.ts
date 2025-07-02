import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  if (!email || !otp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.verified)
    return NextResponse.json({ error: "Already verified" }, { status: 400 });
  if (user.otp !== otp)
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  user.verified = true;
  user.otp = undefined;
  await user.save();
  return NextResponse.json({ success: true });
}
