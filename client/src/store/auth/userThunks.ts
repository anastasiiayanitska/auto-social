import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { RegisterData, LoginData, User } from "../../types/auth";

export const registerUser = createAsyncThunk<
  { user: User },
  RegisterData,
  { rejectValue: string }
>("/register", async (formData, { rejectWithValue }) => {
  try {
    return await authApi.register(formData);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка реєстрації"
    );
  }
});

export const loginUser = createAsyncThunk<
  { user: User },
  LoginData,
  { rejectValue: string }
>("/login", async (credentials, { rejectWithValue }) => {
  try {
    return await authApi.login(credentials);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Помилка входу");
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка виходу з системи"
      );
    }
  }
);

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.fetchUser();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Не вдалося отримати дані користувача"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    console.log("🔄 Запит на отримання всіх користувачів...");
    const data = await authApi.fetchAllUsers();
    console.log("✅ Дані отримані:", data);
    return data.data;
  } catch (error: any) {
    console.error("❌ Помилка отримання користувачів:", error);
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося отримати список користувачів"
    );
  }
});
