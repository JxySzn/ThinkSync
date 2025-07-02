import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/sendgrid";
import { generateOtp } from "@/lib/authUtils";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { signupToken } = await req.json();
  if (!signupToken)
    return NextResponse.json({ error: "Missing signupToken" }, { status: 400 });
  try {
    const payload = jwt.verify(signupToken, JWT_SECRET) as any;
    if (!payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    const otp = generateOtp();
    await sendVerificationEmail(payload.email, otp);
    // Issue new token with new OTP
    const newToken = jwt.sign(
      { ...payload, otp, otpVerified: false },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    return NextResponse.json({ success: true, signupToken: newToken });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
