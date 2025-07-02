import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { signupToken, otp } = await req.json();
  if (!signupToken || !otp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const payload = jwt.verify(signupToken, JWT_SECRET) as any;
    if (payload.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
    // Mark OTP as verified in a new token
    const verifiedToken = jwt.sign(
      { ...payload, otpVerified: true },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    return NextResponse.json({ success: true, signupToken: verifiedToken });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
