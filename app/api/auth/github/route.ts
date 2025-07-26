import { NextResponse } from "next/server";
import { githubConfig } from "@/lib/githubAuth";

export async function GET() {
  if (!githubConfig.clientId) {
    console.error("GitHub Client ID is not configured");
    return NextResponse.redirect("/sign_up?error=github_config_missing");
  }

  const state = Math.random().toString(36).substring(7);

  // Build the GitHub authorization URL
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.append("client_id", githubConfig.clientId);
  authUrl.searchParams.append("redirect_uri", githubConfig.redirectUri);
  authUrl.searchParams.append("scope", "read:user user:email");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("allow_signup", "true");

  console.log("GitHub Auth URL:", authUrl.toString()); // Debug log

  const response = NextResponse.redirect(authUrl.toString());

  // Set state cookie for security
  response.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5, // 5 minutes
  });

  return response;
}
