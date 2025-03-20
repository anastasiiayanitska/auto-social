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
      error.response?.data?.message || "Profile update error"
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
      error.response?.data?.message || "Failed to retrieve user profile"
    );
  }
});

export const deleteProfileThunk = createAsyncThunk(
  "user/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await authApi.deleteProfile(userId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
