import { NextResponse } from "next/server";

export async function GET() {
  // Return empty notifications array and 0 unread count
  // This is the most lightweight implementation possible
  return NextResponse.json({
    notifications: [],
    unreadCount: 0,
  });
}
