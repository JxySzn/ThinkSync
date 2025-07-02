import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const { email, username } = await req.json();
  if (!email || !username)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.verified)
    return NextResponse.json({ error: "Not verified" }, { status: 400 });
  user.username = username;
  await user.save();
  return NextResponse.json({ success: true });
}
