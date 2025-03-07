import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReduсer from "./postSlice";

export const store = configureStore({
  reducer: { auth: authReducer, posts: postReduсer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
