import mongoose from "mongoose";
import { loadEnv } from "@/lib/env";
loadEnv();

export default async function dbConnect(): Promise<void> {
  // Return if already connected
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB connected to:", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
