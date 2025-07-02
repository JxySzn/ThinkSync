import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/sendgrid";
import { generateOtp } from "@/lib/authUtils";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.verified)
    return NextResponse.json({ error: "Already verified" }, { status: 400 });
  const otp = generateOtp();
  user.otp = otp;
  await user.save();
  await sendVerificationEmail(email, otp);
  return NextResponse.json({ success: true });
}
