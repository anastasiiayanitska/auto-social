import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import {
  VerifyEmailData,
  ResendVerificationData,
  User,
} from "../../types/auth";

export const verifyEmail = createAsyncThunk<
  { user: User; token: string },
  VerifyEmailData,
  { rejectValue: string }
>("/verifyEmail", async (data, { rejectWithValue }) => {
  try {
    return await authApi.verifyEmail(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Email verification error"
    );
  }
});

export const resendVerificationCode = createAsyncThunk<
  void,
  ResendVerificationData,
  { rejectValue: string }
>("/resendVerificationCode", async (data, { rejectWithValue }) => {
  try {
    await authApi.resendVerificationCode(data);
    return;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error sending verification code"
    );
  }
});
