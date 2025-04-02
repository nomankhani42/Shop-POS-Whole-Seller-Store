import mongoose from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Global variable to track the connection status
let isConnected: boolean; // Tracks whether the database is connected

const dbConnect = async (): Promise<void> => {
  // Use global `isConnected` to avoid reconnecting in dev or prod
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  // Check the connection state via mongoose
  if (mongoose.connection.readyState === 1) {
    console.log("=> Already connected to the database");
    isConnected = true;
    return;
  }

  try {
    // Connect to the database if not already connected
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1; // Check if the connection is successful
    console.log("=> Successfully connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to the database");
  }
};

export default dbConnect;
