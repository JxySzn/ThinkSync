import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";
import type { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectToDatabase();
    const userToFollow = await User.findOne({ username });
    if (!userToFollow)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (userToFollow._id.equals(decoded.id))
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    // Add to following/followers if not already
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectToDatabase();
    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (userToUnfollow._id.equals(decoded.id))
      return NextResponse.json(
        { error: "Cannot unfollow yourself" },
        { status: 400 }
      );
    // Remove from following/followers if present
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    currentUser.following = currentUser.following.filter(
      (id: Types.ObjectId | string) =>
        typeof id === "object" && "equals" in id
          ? !(id as Types.ObjectId).equals(userToUnfollow._id)
          : id !== String(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id: Types.ObjectId | string) =>
        typeof id === "object" && "equals" in id
          ? !(id as Types.ObjectId).equals(currentUser._id)
          : id !== String(currentUser._id)
    );
    await currentUser.save();
    await userToUnfollow.save();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
