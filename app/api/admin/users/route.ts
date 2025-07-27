import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find(
      {},
      {
        fullname: 1,
        email: 1,
        verified: 1,
        username: 1,
        joinDate: 1,
        online: 1,
        role: 1,
        status: 1,
      }
    ).sort({ joinDate: -1 });

    return NextResponse.json({
      users: users.map((user) => ({
        ...user.toJSON(),
        role: user.role || "user", // Default to 'user' if not set
        status: user.verified ? "active" : "suspended", // Map verified to status
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
