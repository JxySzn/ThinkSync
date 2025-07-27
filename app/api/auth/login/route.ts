import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import { comparePassword } from "@/lib/authUtils";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.verified)
    return NextResponse.json({ error: "Not verified" }, { status: 400 });

  // Check if this is an OAuth user (no password in database)
  if (!user.password) {
    return NextResponse.json({
      error:
        "This account was created with Google or GitHub. Please use the corresponding sign-in button.",
      status: 400,
    });
  }

  const valid = await comparePassword(password, user.password);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, path: "/" });
  return res;
}
