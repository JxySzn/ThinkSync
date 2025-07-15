import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  try {
    await connectToDatabase();
    const user = await User.findOne({ username }).select("-password -otp");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
