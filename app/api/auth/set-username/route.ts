import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { signupToken, username } = await req.json();
  if (!signupToken || !username)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    const payload = jwt.verify(signupToken, JWT_SECRET) as any;
    if (!payload.otpVerified) {
      return NextResponse.json({ error: "OTP not verified" }, { status: 400 });
    }
    await connectToDatabase();
    // Check again if user exists (race condition safety)
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 200 }
      );
    }
    // Create user in DB
    await User.create({
      fullname: payload.fullname,
      email: payload.email,
      password: payload.password,
      verified: true,
      username,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
