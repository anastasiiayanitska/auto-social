import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/social.types";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getUserPosts,
  getPostById,
  deletePost,
  getUserFeed,
  updatePost,
} from "./postsThunks.tsx";

interface PostsState {
  posts: Post[];
  userPosts: Record<string, Post[]>;
  singlePost: Post | null;
  myPosts: Post[];
  feed: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  userPosts: {},
  singlePost: null,
  myPosts: [],
  feed: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },
    clearSinglePost: (state) => {
      state.singlePost = null;
    },
    resetPosts: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.myPosts = [action.payload, ...state.myPosts];
      state.loading = false;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create post";
    });

    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch posts";
    });

    builder.addCase(getMyPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyPosts.fulfilled, (state, action) => {
      state.myPosts = action.payload;
      state.loading = false;
    });
    builder.addCase(getMyPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch my posts";
    });

    builder.addCase(getUserPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.userPosts[action.meta.arg] = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch user posts";
    });

    builder.addCase(getPostById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPostById.fulfilled, (state, action) => {
      state.singlePost = action.payload;
      state.loading = false;
    });
    builder.addCase(getPostById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch post";
    });

    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const deletedPostId = action.payload;

      state.posts = state.posts.filter((post) => post._id !== deletedPostId);
      state.myPosts = state.myPosts.filter(
        (post) => post._id !== deletedPostId
      );

      Object.keys(state.userPosts).forEach((userId) => {
        state.userPosts[userId] = state.userPosts[userId].filter(
          (post) => post._id !== deletedPostId
        );
      });

      if (state.singlePost && state.singlePost._id === deletedPostId) {
        state.singlePost = null;
      }

      state.feed = state.feed.filter((post) => post._id !== deletedPostId);

      state.loading = false;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete post";
    });

    builder.addCase(getUserFeed.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserFeed.fulfilled, (state, action) => {
      state.feed = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch feed";
    });

    // Handle updatePost actions
    builder.addCase(updatePost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const updatedPost = action.payload;
      // Update post in all relevant arrays
      state.posts = state.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      state.myPosts = state.myPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      // Update post in userPosts if it exists
      Object.keys(state.userPosts).forEach((userId) => {
        state.userPosts[userId] = state.userPosts[userId].map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
      });

      // Update singlePost if it matches
      if (state.singlePost && state.singlePost._id === updatedPost._id) {
        state.singlePost = updatedPost;
      }

      // Update feed if it contains the post
      state.feed = state.feed.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      state.loading = false;
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update post";
    });
  },
});

export const { clearPostsError, clearSinglePost, resetPosts } =
  postsSlice.actions;
export default postsSlice.reducer;
