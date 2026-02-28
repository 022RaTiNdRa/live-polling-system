import mongoose from "mongoose";

let _isConnected = false;

export const isDbConnected = () => _isConnected;

export const connectDB = async () => {
  const tryConnect = async (uri: string) => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        bufferCommands: false,
      });

      // Optional ping check
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }

      _isConnected = true;
      console.log("Database connected successfully");
      return true;
    } catch (err: any) {
      _isConnected = false;
      console.error("Database connection error:", err.message || err);
      return false;
    }
  };

  const atlasUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/livepoll";

  if (atlasUri) {
    const ok = await tryConnect(atlasUri);
    if (ok) return;
    console.log("Atlas connection failed. Falling back to local MongoDB...");
  } else {
    console.log("MONGO_URI not set. Using local MongoDB...");
  }

  await tryConnect(localUri);

  if (!_isConnected && process.env.NODE_ENV === "production") {
    console.error("Database connection failed in production. Exiting...");
    process.exit(1);
  }
};