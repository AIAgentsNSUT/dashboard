import "server-only";
import mongoose from "mongoose";
import AIAgentData from "@/models/AIAgentData";

if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URL is not set");
}

export async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) return;

    AIAgentData.find({});

    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
