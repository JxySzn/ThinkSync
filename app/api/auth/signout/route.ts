import { NextResponse } from "next/server";

export async function POST() {
  // Create a new response
  const response = NextResponse.json({ success: true });

  // Clear the auth token cookie by setting it with an expired date
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
