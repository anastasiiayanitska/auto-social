// src/components/SocketInitializer.tsx
import React, { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket, getSocket, disconnectSocket } from "../utils/socket";
import { addMessage } from "../store/features/messageSlice";
import { addNotification } from "../store/features/notificationSlice";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

interface SocketInitializerProps {
  children: ReactNode;
}

const SocketInitializer: React.FC<SocketInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Initialize socket when user is logged in
    if (user?._id) {
      const socket = initializeSocket(user._id);

      // Handle receiving messages
      socket.on("receiveMessage", (message) => {
        const conversationId = [message.senderId, message.receiverId]
          .sort()
          .join("-");
        dispatch(addMessage({ conversationId, message }));
      });

      // Handle like notifications
      socket.on("receiveLike", (notification) => {
        dispatch(
          addNotification({
            ...notification,
            read: false,
            receiverId: user._id,
          })
        );
      });

      // Handle comment notifications
      socket.on("receiveComment", (notification) => {
        dispatch(
          addNotification({
            ...notification,
            read: false,
            receiverId: user._id,
          })
        );
      });

      // Handle follow notifications
      socket.on("receiveFollow", (notification) => {
        dispatch(
          addNotification({
            ...notification,
            read: false,
            receiverId: user._id,
          })
        );
      });

      // Handle online users list update
      socket.on("onlineUsers", (onlineUserIds: string[]) => {
        // You can add this to your state if needed
        console.log("Online users:", onlineUserIds);
      });
    }

    // Cleanup function
    return () => {
      disconnectSocket();
    };
  }, [dispatch, user?._id]);

  return <>{children}</>; // This component doesn't render anything
};

export default SocketInitializer;
