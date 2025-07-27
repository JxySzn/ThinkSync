import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Only check during runtime, not during build
if (
  !MONGODB_URI &&
  typeof window === "undefined" &&
  process.env.NODE_ENV === "development"
) {
  console.warn("Please define the MONGODB_URI env variable");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const cached: MongooseCache = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
