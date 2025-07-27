import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme") as {
      id: string;
      role: string;
    };

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ isAdmin: false }, { status: 403 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
