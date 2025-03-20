import { createSlice } from "@reduxjs/toolkit";
import {
  likePost,
  unlikePost,
  checkLikeStatus,
  savePost,
  unsavePost,
  checkSaveStatus,
  getSavedPosts,
  createComment,
  getPostComments,
  deleteComment,
} from "./interactionThunks";

import { InteractionsState } from "../../types/social.types";

const initialState: InteractionsState = {
  likeStatus: [],
  saveStatus: [],
  comments: {},
  loadingComments: false,
  savedPosts: [],
  loadingSavedPosts: false,
};
const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(checkLikeStatus.fulfilled, (state, action) => {
        const existing = state.likeStatus.find(
          (status) => status.postId === action.payload.postId
        );
        if (existing) {
          existing.liked = action.payload.liked;
        } else {
          state.likeStatus.push(action.payload);
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const status = state.likeStatus.find(
          (s) => s.postId === action.payload
        );
        if (status) status.liked = true;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const status = state.likeStatus.find(
          (s) => s.postId === action.payload
        );
        if (status) status.liked = false;
      })

      .addCase(checkSaveStatus.fulfilled, (state, action) => {
        const existing = state.saveStatus.find(
          (status) => status.postId === action.payload.postId
        );
        if (existing) {
          existing.saved = action.payload.saved;
        } else {
          state.saveStatus.push(action.payload);
        }
      })
      .addCase(savePost.fulfilled, (state, action) => {
        const status = state.saveStatus.find(
          (s) => s.postId === action.payload
        );
        if (status) status.saved = true;
        else state.saveStatus.push({ postId: action.payload, saved: true });
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        const status = state.saveStatus.find(
          (s) => s.postId === action.payload
        );
        if (status) status.saved = false;
      })

      .addCase(getPostComments.pending, (state) => {
        state.loadingComments = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
        state.loadingComments = false;
      })
      .addCase(getPostComments.rejected, (state) => {
        state.loadingComments = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (!state.comments[action.payload.post]) {
          state.comments[action.payload.post] = [];
        }
        state.comments[action.payload.post].unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = state.comments[
          action.payload.postId
        ].filter((comment) => comment._id !== action.payload.commentId);
      })
      .addCase(getSavedPosts.pending, (state) => {
        state.loadingSavedPosts = true;
      })
      .addCase(getSavedPosts.fulfilled, (state, action) => {
        state.savedPosts = action.payload.posts;
        state.loadingSavedPosts = false;
      })
      .addCase(getSavedPosts.rejected, (state) => {
        state.loadingSavedPosts = false;
      });
  },
});

export default interactionsSlice.reducer;
