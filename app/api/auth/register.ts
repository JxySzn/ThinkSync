import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/sendgrid";
import { generateOtp, hashPassword } from "@/lib/authUtils";

export async function POST(req: NextRequest) {
  const { fullname, email, password } = await req.json();
  if (!fullname || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await connectToDatabase();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }
  const hashed = await hashPassword(password);
  const otp = generateOtp();
  const user = await User.create({
    fullname,
    email,
    password: hashed,
    otp,
    verified: false,
  });
  await sendVerificationEmail(email, otp);
  return NextResponse.json({ success: true });
}
