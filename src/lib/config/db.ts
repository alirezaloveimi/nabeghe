import mongoose from "mongoose";

type Cached = {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
};

const MONGO_URI = process.env.MONGO_URI;
const cached: Cached = {};

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  if (cached.connection) {
    console.log("DB connected already");
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }

  try {
    cached.connection = await cached.promise;
    console.log("New DB connected");
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  return cached.connection;
}
