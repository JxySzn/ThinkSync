import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import User from "./models/User";
import { connectToDatabase } from "./mongo";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ tokens: token }).select(
      "-password -tokens"
    );

    if (!user) {
      return null;
    }

    return { user };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
