// src/hooks/useSocket.ts
import { getSocket } from "../utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useSocket = () => {
  const socket = getSocket();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const sendMessage = (receiverId: string, text: string) => {
    if (socket && currentUser?._id) {
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId,
        text,
      });
    }
  };

  const sendLikeNotification = (receiverId: string, postId: string) => {
    if (socket && currentUser?._id) {
      socket.emit("sendLike", {
        senderId: currentUser._id,
        receiverId,
        postId,
      });
    }
  };

  const sendCommentNotification = (
    receiverId: string,
    postId: string,
    commentId: string,
    commentText: string
  ) => {
    if (socket && currentUser?._id) {
      socket.emit("sendComment", {
        senderId: currentUser._id,
        receiverId,
        postId,
        commentId,
        commentText,
      });
    }
  };

  const sendFollowNotification = (receiverId: string) => {
    if (socket && currentUser?._id) {
      socket.emit("sendFollow", {
        senderId: currentUser._id,
        receiverId,
      });
    }
  };

  return {
    sendMessage,
    sendLikeNotification,
    sendCommentNotification,
    sendFollowNotification,
  };
};
