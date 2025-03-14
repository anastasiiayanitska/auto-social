import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import postReduсer from "./post/postsSlice";
import interactionsReducer from "./post/interactionsSlice";
import subscriptionsReducer from "./subscriptions/subscriptionsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReduсer,
    interactions: interactionsReducer,
    subscriptions: subscriptionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
