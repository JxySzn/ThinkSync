import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // TODO: Replace with actual notifications from database
    // For now, return mock notifications
    const notifications = [
      {
        id: "1",
        type: "like",
        message: "John Doe liked your post",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "2",
        type: "comment",
        message: "Jane Smith commented on your post",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: "3",
        type: "follow",
        message: "Mike Johnson started following you",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
