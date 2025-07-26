import { NextResponse } from "next/server";
import { googleConfig } from "@/lib/googleAuth";

export async function GET() {
  if (!googleConfig.clientId) {
    console.error("Google Client ID is not configured");
    return NextResponse.redirect("/sign_up?error=google_config_missing");
  }

  const state = Math.random().toString(36).substring(7);

  // Build the Google authorization URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", googleConfig.clientId);
  authUrl.searchParams.append("redirect_uri", googleConfig.redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", "profile email");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "consent");

  console.log("Google Auth URL:", authUrl.toString()); // Debug log

  const response = NextResponse.redirect(authUrl.toString());

  // Set state cookie for security
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
