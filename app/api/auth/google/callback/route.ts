import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { getGoogleAccessToken, getGoogleUserData } from "@/lib/googleAuth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("google_oauth_state")?.value;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Validate state parameter to prevent CSRF attacks
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/sign_in?error=invalid_oauth_state", baseUrl)
    );
  }

  try {
    // Get access token from Google
    const accessToken = await getGoogleAccessToken(code);

    // Get user data from Google
    const googleUser = await getGoogleUserData(accessToken);

    await connectToDatabase();

    // First check if there's a pending registration for this email
    const pendingUser = await PendingUser.findOne({ email: googleUser.email });
    if (pendingUser) {
      // If there's a pending registration, delete it since they're now using Google
      await PendingUser.deleteOne({ email: googleUser.email });
    }

    // Check if a user with this email already exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user if they don't exist
      // Generate a random username based on the email
      const baseUsername = googleUser.email.split("@")[0];
      let username = baseUsername;
      let counter = 1;

      // Keep trying new usernames until we find one that's not taken
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        email: googleUser.email,
        fullname: googleUser.fullname,
        username,
        avatar: googleUser.avatar,
        verified: googleUser.verified,
        // No password needed for OAuth users
      });
    } else {
      // Update existing user with latest Google info
      user = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            fullname: googleUser.fullname || user.fullname,
            avatar: googleUser.avatar || user.avatar,
            verified: true, // Ensure the user is marked as verified
          },
        },
        { new: true }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create response with success redirect
    const response = NextResponse.redirect(new URL("/home", baseUrl));

    // Set auth cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Clear the state cookie
    response.cookies.set("google_oauth_state", "", {
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.redirect(
      new URL("/sign_in?error=google_auth_failed", baseUrl)
    );
  }
}
