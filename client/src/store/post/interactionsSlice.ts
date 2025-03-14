// import { createSlice } from "@reduxjs/toolkit";
// import {
//   likePost,
//   unlikePost,
//   checkLikeStatus,
//   createComment,
//   getPostComments,
//   deleteComment,
// } from "./interactionThunks";

// const initialState = {
//   likeStatus: [],
//   comments: {},
//   loadingComments: false,
// };

// const interactionsSlice = createSlice({
//   name: "interactions",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Like status handlers
//       .addCase(checkLikeStatus.fulfilled, (state, action) => {
//         const existing = state.likeStatus.find(
//           (status) => status.postId === action.payload.postId
//         );
//         if (existing) {
//           existing.liked = action.payload.liked;
//         } else {
//           state.likeStatus.push(action.payload);
//         }
//       })
//       .addCase(likePost.fulfilled, (state, action) => {
//         const status = state.likeStatus.find(
//           (s) => s.postId === action.payload
//         );
//         if (status) status.liked = true;
//       })
//       .addCase(unlikePost.fulfilled, (state, action) => {
//         const status = state.likeStatus.find(
//           (s) => s.postId === action.payload
//         );
//         if (status) status.liked = false;
//       })
//       // Comments handlers
//       .addCase(getPostComments.pending, (state) => {
//         state.loadingComments = true;
//       })
//       .addCase(getPostComments.fulfilled, (state, action) => {
//         state.comments[action.payload.postId] = action.payload.comments;
//         state.loadingComments = false;
//       })
//       .addCase(getPostComments.rejected, (state) => {
//         state.loadingComments = false;
//       })
//       .addCase(createComment.fulfilled, (state, action) => {
//         state.comments[action.payload.postId]?.push(action.payload);
//       })
//       .addCase(deleteComment.fulfilled, (state, action) => {
//         state.comments[action.payload.postId] = state.comments[
//           action.payload.postId
//         ].filter((comment) => comment.id !== action.payload.commentId);
//       });
//   },
// });

// export default interactionsSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import {
  likePost,
  unlikePost,
  checkLikeStatus,
  createComment,
  getPostComments,
  deleteComment,
} from "./interactionThunks";

const initialState = {
  likeStatus: [],
  comments: {},
  loadingComments: false,
};

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Like status handlers
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
      // Comments handlers
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
        if (!state.comments[action.payload.postId]) {
          state.comments[action.payload.postId] = [];
        }
        state.comments[action.payload.postId].unshift(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = state.comments[
          action.payload.postId
        ].filter((comment) => comment.id !== action.payload.commentId);
      });
  },
});

export default interactionsSlice.reducer;
