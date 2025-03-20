import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../types/auth";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  fetchAllUsers,
} from "./userThunks";
import { updateUser, deleteProfileThunk } from "./profileThunks";
import { verifyEmail, resendVerificationCode } from "./verificationThunks";
import {
  forgotPassword,
  resetPassword,
  changePassword,
  verifyPasswordChange,
} from "./passwordThunks";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  verificationSent: false,
  passwordResetSent: false,
  passwordChangeRequested: false,
  users: [],
};

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

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.verificationSent = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        console.log("Data:", action.payload);
        state.users = action.payload;
        state.loading = false;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;

        state.loading = false;
        state.isAuthenticated = true;
        state.verificationSent = false;
      })

      .addCase(resendVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.verificationSent = true;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSent = true;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSent = false;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = true;
      });
    builder
      .addCase(deleteProfileThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      .addCase(verifyPasswordChange.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeRequested = false;
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearAuthError, resetAuthStates } = authSlice.actions;
export default authSlice.reducer;
