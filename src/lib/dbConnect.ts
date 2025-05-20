// src/lib/dbConnect.ts
import mongoose from "mongoose";
import { loadEnv } from "@/lib/env";
loadEnv();

export default async function dbConnect(): Promise<void> {
  // Return if already connected
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10, // Maintain up to 10 connections
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
