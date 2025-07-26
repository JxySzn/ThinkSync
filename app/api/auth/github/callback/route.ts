import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { getGithubAccessToken, getGithubUserData } from "@/lib/githubAuth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("github_oauth_state")?.value;

  // Validate state parameter to prevent CSRF attacks
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect("/sign_in?error=invalid_oauth_state");
  }

  try {
    // Get access token from GitHub
    const accessToken = await getGithubAccessToken(code);

    // Get user data from GitHub
    const githubUser = await getGithubUserData(accessToken);

    await connectToDatabase();

    // First check if there's a pending registration for this email
    const pendingUser = await PendingUser.findOne({ email: githubUser.email });
    if (pendingUser) {
      // If there's a pending registration, delete it since they're now using GitHub
      await PendingUser.deleteOne({ email: githubUser.email });
    }

    // Look for existing user
    let user = await User.findOne({
      $or: [{ githubId: githubUser.githubId }, { email: githubUser.email }],
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        fullname: githubUser.fullname,
        email: githubUser.email,
        githubId: githubUser.githubId,
        githubUsername: githubUser.githubUsername,
        avatar: githubUser.avatar,
        bio: githubUser.bio,
        website: githubUser.website,
        location: githubUser.location,
        verified: true, // GitHub users are automatically verified
        githubAccessToken: accessToken,
      });
    } else {
      // Update existing user with latest GitHub data
      user = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            githubId: githubUser.githubId,
            githubUsername: githubUser.githubUsername,
            githubAccessToken: accessToken,
            avatar: githubUser.avatar || user.avatar,
            bio: githubUser.bio || user.bio,
            website: githubUser.website || user.website,
            location: githubUser.location || user.location,
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
    const response = NextResponse.redirect("/home");

    // Set auth cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    // Clear the state cookie
    response.cookies.set("github_oauth_state", "", {
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    return NextResponse.redirect("/sign_in?error=github_auth_failed");
  }
}
