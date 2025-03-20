import { io, Socket } from "socket.io-client";
import { store } from "../store/store";

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    // Connect event
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("userConnected", userId);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
