import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Subscription } from "../../types/social.types";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
} from "./subscriptionThunks";

interface SubscriptionsState {
  followers: Record<string, User[]>;
  following: Record<string, User[]>;

  followStatus: Record<string, boolean>;

  followerCounts: Record<string, number>;
  followingCounts: Record<string, number>;

  loading: boolean;
  error: string | null;

  lastAction: {
    type: "follow" | "unfollow" | null;
    userId: string | null;
  };
}

const initialState: SubscriptionsState = {
  followers: {},
  following: {},
  followStatus: {},
  followerCounts: {},
  followingCounts: {},
  loading: false,
  error: null,
  lastAction: {
    type: null,
    userId: null,
  },
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },

    updateFollowerCount: (
      state,
      action: PayloadAction<{ userId: string; count: number }>
    ) => {
      const { userId, count } = action.payload;
      state.followerCounts[userId] = count;
    },
    updateFollowingCount: (
      state,
      action: PayloadAction<{ userId: string; count: number }>
    ) => {
      const { userId, count } = action.payload;
      state.followingCounts[userId] = count;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        const userId = action.meta.arg;
        state.followStatus[userId] = true;
        state.lastAction = { type: "follow", userId };

        if (state.followerCounts[userId] !== undefined) {
          state.followerCounts[userId] += 1;
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        if (state.lastAction.type === "follow" && state.lastAction.userId) {
          state.followStatus[state.lastAction.userId] = false;
          if (state.followerCounts[state.lastAction.userId] !== undefined) {
            state.followerCounts[state.lastAction.userId] -= 1;
          }
        }
        state.lastAction = { type: null, userId: null };
      });

    builder
      .addCase(unfollowUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        const userId = action.meta.arg;
        state.followStatus[userId] = false;
        state.lastAction = { type: "unfollow", userId };

        if (
          state.followerCounts[userId] !== undefined &&
          state.followerCounts[userId] > 0
        ) {
          state.followerCounts[userId] -= 1;
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;

        if (state.lastAction.type === "unfollow" && state.lastAction.userId) {
          state.followStatus[state.lastAction.userId] = true;
          if (state.followerCounts[state.lastAction.userId] !== undefined) {
            state.followerCounts[state.lastAction.userId] += 1;
          }
        }
        state.lastAction = { type: null, userId: null };
      });

    builder
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, followers } = action.payload;
        state.followers[userId] = followers;
        state.followerCounts[userId] = followers.length;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, following } = action.payload;
        state.following[userId] = following;
        state.followingCounts[userId] = following.length;
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(checkFollowStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(checkFollowStatus.fulfilled, (state, action) => {
        const { userId, following } = action.payload;
        state.followStatus[userId] = following;
      })
      .addCase(checkFollowStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSubscriptionError,
  updateFollowerCount,
  updateFollowingCount,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
