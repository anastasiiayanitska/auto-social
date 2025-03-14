import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { RegisterData, User } from "../../types/auth";

export const updateUser = createAsyncThunk<
  { user: User },
  { userId: string; userData: RegisterData },
  { rejectValue: string }
>("/updateUser", async ({ userId, userData }, { rejectWithValue }) => {
  try {
    return await authApi.updateUser(userId, userData);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка оновлення профілю"
    );
  }
});

export const fetchUserProfileById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("/fetchUserProfileById", async (userId, { rejectWithValue }) => {
  try {
    return await authApi.fetchUserProfileById(userId);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося отримати профіль користувача"
    );
  }
});
