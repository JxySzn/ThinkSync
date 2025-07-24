import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { username } = await context.params;
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ username })
      .select("-password -otp")
      .populate("followers", "-password -otp")
      .populate("following", "-password -otp");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Fetch user error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
