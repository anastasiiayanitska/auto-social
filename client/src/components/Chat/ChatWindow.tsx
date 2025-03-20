import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../hooks/useSocket";

import { useLocation } from "react-router-dom";
import {
  setMessages,
  addMessage,
  markAsRead,
  setLoading,
  setError,
} from "../../store/features/messageSlice";
import { AppDispatch, RootState } from "../../store/store";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
}) => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  const [message, setMessage] = useState(initialMessage);
  const dispatch = useDispatch<AppDispatch>();

  const { sendMessage } = useSocket();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const conversationId =
    currentUser && [currentUser._id, receiverId].sort().join("-");
  const messages = useSelector(
    (state: RootState) => state.messages.messages[conversationId] || []
  );
  const loading = useSelector((state: RootState) => state.messages.loading);

  // Функція для перетворення тексту з URL на JSX з посиланнями
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if (!text.match(urlRegex)) {
      return <>{text}</>;
    }

    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];

    return (
      <>
        {parts.map((part, i) => {
          // Якщо це частина тексту між URL
          if (i % 2 === 0) {
            return part;
          }
          // Якщо це URL
          const url = matches[Math.floor(i / 2)];
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {url}
            </a>
          );
        })}
      </>
    );
  };

  // Fetch messages when component mounts or receiver changes
  useEffect(() => {
    if (currentUser?._id && receiverId) {
      dispatch(setLoading(true));

      fetch(
        `http://localhost:3000/api/messages/${currentUser._id}/${receiverId}`,
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (conversationId) {
            dispatch(setMessages({ conversationId, messages: data }));
          }
          dispatch(setLoading(false));
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          dispatch(setError("Failed to load messages"));
          dispatch(setLoading(false));
        });

      // Mark messages as read when entering chat
      markMessagesAsRead();
    }
  }, [currentUser?._id, receiverId, dispatch, conversationId]);

  // Mark messages as read function
  const markMessagesAsRead = () => {
    if (!currentUser?._id || !receiverId) return;

    fetch(
      `http://localhost:3000/api/messages/${currentUser._id}/${receiverId}/read-all`,
      {
        method: "PUT",
        credentials: "include",
      }
    )
      .then(() => {
        dispatch(
          markAsRead({ senderId: receiverId, receiverId: currentUser._id })
        );
      })
      .catch((err) => {
        console.error("Error marking messages as read:", err);
      });
  };

  // Also mark messages as read when the chat window is focused
  useEffect(() => {
    // Mark messages as read when user is viewing the messages
    const handleFocus = () => {
      markMessagesAsRead();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [receiverId, currentUser?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !receiverId) return;

    // Send message through socket
    sendMessage(receiverId, message);

    // Optimistically add message to state
    if (conversationId) {
      const newMessage = {
        _id: Date.now().toString(), // Temporary ID
        senderId: currentUser._id,
        receiverId,
        text: message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      dispatch(addMessage({ conversationId, message: newMessage }));
    }

    setMessage("");
  };

  if (!currentUser)
    return (
      <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
        <Typography>Please log in to start chatting.</Typography>
      </Paper>
    );

  // Get first letter of name for avatar
  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Box
      elevation={3}
      sx={{ height: 600, display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "primary.light",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ mr: 2, bgcolor: "primary.dark" }}>
          {getAvatarLetter(receiverName)}
        </Avatar>
        <Typography variant="h6">{receiverName}</Typography>
      </Box>

      <Divider />

      {/* Messages */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {messages.map((msg) => {
              const isSender = msg.senderId === currentUser._id;
              return (
                <Box
                  key={msg._id}
                  sx={{
                    alignSelf: isSender ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    position: "relative",
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isSender
                        ? "primary.main"
                        : "rgb(36, 36, 36)",
                      color: isSender ? "white" : "text.primary",
                    }}
                  >
                    <Typography variant="body1">
                      {linkifyText(msg.text)}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        mt: 0.5,
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isSender
                            ? "rgba(255,255,255,0.7)"
                            : "text.secondary",
                          fontSize: "0.7rem",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      {isSender &&
                        (msg.read ? (
                          <DoneAllIcon
                            sx={{
                              fontSize: 14,
                              color: "rgba(255,255,255,0.7)",
                            }}
                          />
                        ) : (
                          <DoneIcon
                            sx={{
                              fontSize: 14,
                              color: "rgba(255,255,255,0.7)",
                            }}
                          />
                        ))}
                    </Box>
                  </Paper>
                </Box>
              );
            })}
            <div ref={messageEndRef} />
          </>
        )}
      </Box>

      <Divider />

      {/* Message input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ p: 2, display: "flex", gap: 1 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!message.trim()}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
