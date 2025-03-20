import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import {
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  VerifyPasswordChangeData,
} from "../../types/auth";

export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordData,
  { rejectValue: string }
>("/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    await authApi.forgotPassword(data);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Password recovery request error"
    );
  }
});

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordData,
  { rejectValue: string }
>("/resetPassword", async (data, { rejectWithValue }) => {
  try {
    await authApi.resetPassword(data);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Password reset error"
    );
  }
});

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordData,
  { rejectValue: string }
>("/changePassword", async (data, { rejectWithValue }) => {
  try {
    await authApi.changePassword(data);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Password change request error"
    );
  }
});

export const verifyPasswordChange = createAsyncThunk<
  void,
  VerifyPasswordChangeData,
  { rejectValue: string }
>("/verifyPasswordChange", async (data, { rejectWithValue }) => {
  try {
    await authApi.verifyPasswordChange(data);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Password change confirmation error"
    );
  }
});
