import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    const isAvailable = !existingUser;

    return NextResponse.json({
      available: isAvailable,
      username,
    });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
