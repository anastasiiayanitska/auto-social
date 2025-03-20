import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import ChatWindow from "../components/Chat/ChatWindow";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllUsers } from "../store/auth/userThunks";
import { selectUnreadCounts } from "../store/features/messageSlice";
import { Box, Container, Grid, CircularProgress } from "@mui/material";
import UserList from "../components/Chat/UserList";
import EmptyChatPlaceholder from "../components/Chat/EmptyChatPlaceholder";

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.auth.users);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const unreadCounts = useSelector(selectUnreadCounts);
  const allMessages = useSelector(
    (state: RootState) => state.messages.messages
  );

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Select user from URL parameter if available
  useEffect(() => {
    if (userId && users.length > 0) {
      const user = users.find((u) => u._id === userId);
      if (user) {
        setSelectedUser({
          id: user._id,
          name:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        });
      }
    }
  }, [userId, users, currentUser]);

  const handleSelectUser = (id: string, name: string) => {
    setSelectedUser({ id, name });
    navigate(`/chat/${id}`);
  };

  // Filter out current user from the users list
  const filteredUsers = currentUser
    ? users.filter((user) => user._id !== currentUser._id)
    : [];

  // Check if there's a conversation with this user
  const hasConversationWith = (userId: string): boolean => {
    if (!currentUser) return false;

    const conversationId = [currentUser._id, userId].sort().join("-");
    return (
      !!allMessages[conversationId] && allMessages[conversationId].length > 0
    );
  };

  // Sort users:
  // 1. Users with conversations (pinned at top)
  // 2. Within each group, sort by unread messages count
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const hasConvoA = hasConversationWith(a._id);
    const hasConvoB = hasConversationWith(b._id);

    // If one has a conversation and the other doesn't, prioritize the one with conversation
    if (hasConvoA && !hasConvoB) return -1;
    if (!hasConvoA && hasConvoB) return 1;

    // If both have or don't have conversations, sort by unread count
    const unreadA = unreadCounts[a._id] || 0;
    const unreadB = unreadCounts[b._id] || 0;
    return unreadB - unreadA;
  });

  // Show loading state until users are loaded
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        {/* Users list */}
        <Grid item xs={12} md={4}>
          <UserList
            users={sortedUsers}
            selectedUserId={selectedUser?.id || null}
            unreadCounts={unreadCounts}
            hasConversationWith={hasConversationWith}
            onSelectUser={handleSelectUser}
          />
        </Grid>

        {/* Chat window */}
        <Grid item xs={12} md={8}>
          {selectedUser ? (
            <ChatWindow
              receiverId={selectedUser.id}
              receiverName={selectedUser.name}
            />
          ) : (
            <EmptyChatPlaceholder />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
