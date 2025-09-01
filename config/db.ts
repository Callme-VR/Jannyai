import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export default async function ConnectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("❌ MONGODB_URI environment variable is not defined");
    }

    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30s instead of default 10s
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    global.mongoose = cached;
  } catch (error) {
    console.error("❌ Error in Connecting to DB:", error);
    throw error; // rethrow so API route knows it failed
  }

  return cached.conn;
}
