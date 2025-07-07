import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectToDatabase();
    const user = await User.findById(decoded.id).select("-password -otp");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectToDatabase();
    const body = await req.json();
    const allowedFields = [
      "fullname",
      "username",
      "avatar",
      "location",
      "website",
      "bio",
      "birthDate",
      "online",
      "coverPhoto",
    ];
    const update: Record<string, string | boolean | Date> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password -otp");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Invalid token or bad request" },
      { status: 401 }
    );
  }
}
