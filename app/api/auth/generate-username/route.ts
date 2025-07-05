import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

function generateUsernameFromEmail(email: string): string {
  // Extract the part before @ from email
  const emailPart = email.split("@")[0];

  // Remove special characters and convert to lowercase
  let username = emailPart.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // If username is empty or too short, use a default
  if (username.length < 3) {
    username = "user";
  }

  // Add random numbers to make it unique
  const randomNum = Math.floor(Math.random() * 9999);
  return `${username}${randomNum}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    let username = generateUsernameFromEmail(email);
    let attempts = 0;
    const maxAttempts = 10;

    // Keep generating until we find an available username
    while (attempts < maxAttempts) {
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        // Username is available
        return NextResponse.json({
          username,
          available: true,
        });
      }

      // Username taken, generate a new one
      username = generateUsernameFromEmail(email);
      attempts++;
    }

    // If we can't find an available username after max attempts
    return NextResponse.json(
      {
        error: "Unable to generate unique username",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error generating username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
