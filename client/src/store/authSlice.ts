import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import {
  AuthState,
  RegisterData,
  LoginData,
  User,
  VerifyEmailData,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  VerifyPasswordChangeData,
} from "../types/auth";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Замініть на ваш бекенд URL

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  verificationSent: false,
  passwordResetSent: false,
  passwordChangeRequested: false,
};

// 🔹 РЕЄСТРАЦІЯ
export const registerUser = createAsyncThunk<
  { user: User }, // тип результату
  RegisterData, // тип аргументу (передані дані)
  { rejectValue: string } // тип відхилення
>("/register", async (formData, { rejectWithValue }) => {
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
>("/login", async (credentials: LoginData, { rejectWithValue }) => {
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
  "/logout",
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
  "/fetchUser",
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
>("/updateUser", async ({ userId, userData }, { rejectWithValue }) => {
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
>("/fetchUserProfileById", async (userId, { rejectWithValue }) => {
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
// 🔹 ПІДТВЕРДЖЕННЯ EMAIL
export const verifyEmail = createAsyncThunk<
  { user: User; token: string },
  VerifyEmailData,
  { rejectValue: string }
>("/verifyEmail", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, data, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка підтвердження електронної пошти"
    );
  }
});

// 🔹 ПОВТОРНА ВІДПРАВКА КОДУ ПІДТВЕРДЖЕННЯ

export const resendVerificationCode = createAsyncThunk<
  void,
  ResendVerificationData,
  { rejectValue: string }
>("/resendVerificationCode", async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/resend-verification-code`, data, {
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка відправки коду підтвердження"
    );
  }
});

// 🔹 ЗАБУЛИ ПАРОЛЬ (ЗАПИТ НА ВІДНОВЛЕННЯ)
export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordData,
  { rejectValue: string }
>("/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/forgot-password`, data, {
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка запиту на відновлення пароля"
    );
  }
});

// 🔹 СКИДАННЯ ПАРОЛЯ
export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordData,
  { rejectValue: string }
>("/resetPassword", async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/reset-password`, data, {
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка скидання пароля"
    );
  }
});

// 🔹 ЗМІНА ПАРОЛЯ (ІНІЦІЮВАННЯ)
export const changePassword = createAsyncThunk<
  void,
  ChangePasswordData,
  { rejectValue: string }
>("/changePassword", async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/change-password`, data, {
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка запиту на зміну пароля"
    );
  }
});

// 🔹 ПІДТВЕРДЖЕННЯ ЗМІНИ ПАРОЛЯ
export const verifyPasswordChange = createAsyncThunk<
  void,
  VerifyPasswordChangeData,
  { rejectValue: string }
>("/verifyPasswordChange", async (data, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/verify-password-change`, data, {
      withCredentials: true,
    });
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Помилка підтвердження зміни пароля"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetAuthStates: (state) => {
      state.verificationSent = false;
      state.passwordResetSent = false;
      state.passwordChangeRequested = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Реєстрація
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.verificationSent = true;
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
        state.token = null;
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
      // 🔹 Оновлення користувача
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      // 🔹 Підтвердження email
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.isAuthenticated = true;
        state.verificationSent = false;
      })
      // 🔹 Повторна відправка коду підтвердження
      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.verificationSent = true;
      })
      // 🔹 Забули пароль
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSent = true;
      })
      // 🔹 Скидання пароля
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSent = false;
      })
      // 🔹 Запит на зміну пароля
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
      })
      // 🔹 Підтвердження зміни пароля
      .addCase(verifyPasswordChange.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = false;
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

export const { clearAuthError, resetAuthStates } = authSlice.actions;
export default authSlice.reducer;
