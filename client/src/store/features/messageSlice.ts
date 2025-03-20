import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

interface MessagesState {
  messages: Record<string, Message[]>;
  unreadCount: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: {},
  unreadCount: {},
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);

      // Update unread count if message is for current user
      if (!message.read && message.receiverId) {
        state.unreadCount[message.senderId] =
          (state.unreadCount[message.senderId] || 0) + 1;
      }
    },
    markAsRead: (
      state,
      action: PayloadAction<{ senderId: string; receiverId: string }>
    ) => {
      const { senderId, receiverId } = action.payload;
      const conversationId = [senderId, receiverId].sort().join("-");

      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(
          (message) => {
            if (
              message.senderId === senderId &&
              message.receiverId === receiverId
            ) {
              return { ...message, read: true };
            }
            return message;
          }
        );
      }

      // Reset unread count
      state.unreadCount[senderId] = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMessages, addMessage, markAsRead, setLoading, setError } =
  messageSlice.actions;
export default messageSlice.reducer;

// Add a new selector to get sorted chats
export const selectUnreadCounts = (state: RootState) =>
  state.messages.unreadCount;

// Add a function to sort conversation IDs by unread count
export const selectSortedConversations = (state: RootState) => {
  const unreadCounts = state.messages.unreadCount;
  const conversations = Object.keys(state.messages.messages);

  // Sort conversations by unread count (highest first)
  return conversations.sort((a, b) => {
    const unreadA = Object.values(unreadCounts).filter((id) =>
      a.includes(id)
    ).length;
    const unreadB = Object.values(unreadCounts).filter((id) =>
      b.includes(id)
    ).length;
    return unreadB - unreadA;
  });
};
