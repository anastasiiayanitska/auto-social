import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, Subscription, ApiResponse } from "../../types/social.types";

const API_URL = "http://localhost:3000/api";

export const followUser = createAsyncThunk<
  Subscription,
  string,
  { rejectValue: string }
>("subscriptions/followUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/subscriptions/users/${userId}/follow`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to follow user");
    }

    const data: ApiResponse<Subscription> = await response.json();
    return data.data as Subscription;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to follow user");
  }
});

export const unfollowUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("subscriptions/unfollowUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/subscriptions/users/${userId}/follow`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to unfollow user");
    }

    return userId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to unfollow user");
  }
});

export const getFollowers = createAsyncThunk<
  { userId: string; followers: User[] },
  string,
  { rejectValue: string }
>("subscriptions/getFollowers", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/subscriptions/users/${userId}/followers`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch followers");
    }

    const data: ApiResponse<User[]> = await response.json();
    return {
      userId,
      followers: data.data as User[],
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch followers");
  }
});

export const getFollowing = createAsyncThunk<
  { userId: string; following: User[] },
  string,
  { rejectValue: string }
>("subscriptions/getFollowing", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/subscriptions/users/${userId}/following`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to fetch following users"
      );
    }

    const data: ApiResponse<User[]> = await response.json();
    return {
      userId,
      following: data.data as User[],
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch following users");
  }
});

export const checkFollowStatus = createAsyncThunk<
  { userId: string; following: boolean },
  string,
  { rejectValue: string }
>("subscriptions/checkFollowStatus", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/subscriptions/users/${userId}/follow-status`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to check follow status"
      );
    }

    const data = await response.json();
    return {
      userId,
      following: data.following,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to check follow status");
  }
});
