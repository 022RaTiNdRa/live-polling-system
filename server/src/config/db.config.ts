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

      
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }

      _isConnected = true;
      console.log("Database connected to", uri);
      return true;
    } catch (err: any) {
      console.error("DB ERROR connecting to", uri, err.message || err);
      _isConnected = false;
      return false;
    }
  };

  const atlasUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/livepoll";

  if (atlasUri) {
    const ok = await tryConnect(atlasUri);
    if (ok) return;
    console.log("Falling back to local MongoDB...");
  } else {
    console.log("MONGO_URI not set, using local MongoDB");
  }

  
  await tryConnect(localUri);

  if (!_isConnected && process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};