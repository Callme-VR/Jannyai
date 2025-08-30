import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export default async function ConnectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    global.mongoose = cached;
  } catch (error) {
    console.log("Error in Connecting to DB");
  }
  return cached.conn; 
}
