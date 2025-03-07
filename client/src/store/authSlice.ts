import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, RegisterData, LoginData, User } from "../types/auth";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Замініть на ваш бекенд URL

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// 🔹 РЕЄСТРАЦІЯ
export const registerUser = createAsyncThunk<
  { user: User }, // тип результату
  RegisterData, // тип аргументу (передані дані)
  { rejectValue: string } // тип відхилення
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, // Важливо для отримання cookies
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка реєстрації"
    );
  }
});

// 🔹 ЛОГІН
export const loginUser = createAsyncThunk<
  { user: User },
  LoginData,
  { rejectValue: string }
>("auth/login", async (credentials: LoginData, { rejectWithValue }) => {
  try {
    console.log(credentials);

    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true, // Важливо для отримання cookies
    });
    console.log(response.data);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Помилка входу");
  }
});

// 🔹 ВИХІД
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка виходу з системи"
      );
    }
  }
);

// 🔹 ОТРИМАННЯ КОРИСТУВАЧА
export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Не вдалося отримати дані користувача"
      );
    }
  }
);

// 🔹 ОНОВЛЕННЯ ПРОФІЛЮ
export const updateUser = createAsyncThunk<
  { user: User },
  { userId: string; userData: RegisterData },
  { rejectValue: string }
>("auth/updateUser", async ({ userId, userData }, { rejectWithValue }) => {
  try {
    // Створюємо FormData для відправки файлів
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("bio", userData.bio);
    formData.append("location", userData.location);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("website", userData.website);

    // Додаємо пароль тільки якщо він був введений
    if (userData.password) {
      formData.append("password", userData.password);
    }

    // Додаємо файл аватара, якщо він є
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    const response = await axios.put(`${API_URL}/update/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
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
>("auth/fetchUserProfileById", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося отримати профіль користувача"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Реєстрація
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
      })
      // 🔹 Логін
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
      })
      // 🔹 Вихід
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      // 🔹 Отримання користувача
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 🔹 Ловимо всі pending-запити
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // 🔹 Ловимо всі помилки
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export default authSlice.reducer;
