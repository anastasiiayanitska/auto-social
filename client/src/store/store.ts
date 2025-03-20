import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import postReduсer from "./post/postsSlice";
import interactionsReducer from "./post/interactionsSlice";
import subscriptionsReducer from "./subscriptions/subscriptionsSlice";
import notificationReducer from "./features/notificationSlice";
import messageReducer from "./features/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReduсer,
    interactions: interactionsReducer,
    subscriptions: subscriptionsReducer,
    notifications: notificationReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
