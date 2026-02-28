import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

// Simple module-level pub/sub so multiple components can call `useSocket` without
// registering duplicate global listeners that perform the same work.
let listenersInitialized = false;
let globalConnected = socket.connected;
let globalDbConnected = true;
const connectedSubscribers: Array<(v: boolean) => void> = [];
const dbSubscribers: Array<(v: boolean) => void> = [];

function notifyConnected(v: boolean) {
  globalConnected = v;
  connectedSubscribers.forEach((s) => s(v));
}

function notifyDb(v: boolean) {
  globalDbConnected = v;
  dbSubscribers.forEach((s) => s(v));
}

function initGlobalListeners() {
  if (listenersInitialized) return;
  listenersInitialized = true;

  const onConnect = () => notifyConnected(true);
  const onDisconnect = () => notifyConnected(false);
  const onError = (err: any) => {
    console.error("Socket connection error", err);
    notifyConnected(false);
  };
  const onServerStatus = (status: { dbConnected: boolean }) => {
    notifyDb(Boolean(status.dbConnected));
  };

  try {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("error", onError);
    socket.on("server_status", onServerStatus);
    if (!socket.connected) socket.connect();
  } catch (e) {
    console.error("Failed to attach global socket listeners", e);
  }
}

export const useSocket = () => {
  const [connected, setConnected] = useState<boolean>(globalConnected);
  const [dbConnected, setDbConnected] = useState<boolean>(globalDbConnected);

  useEffect(() => {
    initGlobalListeners();

    const cSub = (v: boolean) => setConnected(v);
    const dSub = (v: boolean) => setDbConnected(v);

    connectedSubscribers.push(cSub);
    dbSubscribers.push(dSub);

    // Initialize with current values
    setConnected(globalConnected);
    setDbConnected(globalDbConnected);

    return () => {
      const ci = connectedSubscribers.indexOf(cSub);
      if (ci >= 0) connectedSubscribers.splice(ci, 1);
      const di = dbSubscribers.indexOf(dSub);
      if (di >= 0) dbSubscribers.splice(di, 1);
    };
  }, []);

  return { socket, connected, dbConnected };
};