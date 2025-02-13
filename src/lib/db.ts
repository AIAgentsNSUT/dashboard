import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URL is not set");
}

export async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
