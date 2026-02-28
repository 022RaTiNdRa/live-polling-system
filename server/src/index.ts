import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerPollSocket } from "./sockets/poll.socket";
import { appConfig } from "./config/app.config";
import { connectDB } from "./config/db.config";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: appConfig.corsOrigin,
  },
});

const PORT = appConfig.port;

console.log("URI:", process.env.MONGO_URI);
connectDB();

app.get("/", (_req, res) => {
  res.send("Server running");
});

registerPollSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});