import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    await connectToDatabase();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme") as {
      id: string;
    };
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
