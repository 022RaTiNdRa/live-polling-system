import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export const useSocket = () => {
  const [connected, setConnected] = useState(socket.connected);
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  useEffect(() => {
    
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: any) => {
      console.error("Socket error", err);
      alert("Connection error: " + err.message || err);
    };
    const onServerStatus = (status: { dbConnected: boolean }) => {
      setDbConnected(status.dbConnected);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("error", onError);
    socket.on("server_status", onServerStatus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("error", onError);
      socket.off("server_status", onServerStatus);
    };
  }, []);

  return { socket, connected, dbConnected };
};