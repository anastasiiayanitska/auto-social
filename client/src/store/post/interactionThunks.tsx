import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Comment,
  CreateCommentData,
  ApiResponse,
} from "../../types/social.types";

const API_URL = "http://localhost:3000/api";

// Like/Unlike posts
export const likePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("interactions/likePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/interactions/posts/${postId}/likes`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to like post");
    }

    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to like post");
  }
});

export const unlikePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("interactions/unlikePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/interactions/posts/${postId}/likes`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to unlike post");
    }

    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to unlike post");
  }
});

export const checkLikeStatus = createAsyncThunk<
  { postId: string; liked: boolean },
  string,
  { rejectValue: string }
>("interactions/checkLikeStatus", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/interactions/posts/${postId}/likes/status`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to check like status"
      );
    }

    const data = await response.json();
    return { postId, liked: data.liked };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to check like status");
  }
});

// Comments
// export const createComment = createAsyncThunk<
//   Comment,
//   CreateCommentData,
//   { rejectValue: string }
// >("interactions/createComment", async (commentData, { rejectWithValue }) => {
//   try {
//     const response = await fetch(
//       `${API_URL}/interactions/posts/${commentData.postId}/comments`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: commentData.content }),
//         credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to create comment");
//     }

//     const data: ApiResponse<Comment> = await response.json();
//     return data.data as Comment;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to create comment");
//   }
// });
export const createComment = createAsyncThunk<
  Comment,
  CreateCommentData,
  { state: RootState; rejectValue: string }
>(
  "interactions/createComment",
  async (commentData, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/interactions/posts/${commentData.postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentData.content }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to create comment");
      }

      const data: ApiResponse<Comment> = await response.json();
      const currentUser = getState().auth.user;

      // Manually add username and userId
      return {
        ...data.data,
        username: currentUser?.username || "Anonymous",
        userId: currentUser?.id,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create comment");
    }
  }
);

export const getPostComments = createAsyncThunk<
  { postId: string; comments: Comment[] },
  string,
  { rejectValue: string }
>("interactions/getPostComments", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/interactions/posts/${postId}/comments`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch comments");
    }

    const data: ApiResponse<Comment[]> = await response.json();
    return { postId, comments: data.data as Comment[] };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch comments");
  }
});

export const deleteComment = createAsyncThunk<
  { postId: string; commentId: string },
  { postId: string; commentId: string },
  { rejectValue: string }
>(
  "interactions/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/interactions/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to delete comment");
      }

      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete comment");
    }
  }
);

// Save/Unsave Posts
export const savePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("interactions/savePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/save`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to save post");
    }

    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to save post");
  }
});

export const unsavePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("interactions/unsavePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/unsave`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to unsave post");
    }

    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to unsave post");
  }
});

export const checkSaveStatus = createAsyncThunk<
  { postId: string; saved: boolean },
  string,
  { rejectValue: string }
>("interactions/checkSaveStatus", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/save-status`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to check save status"
      );
    }

    const data = await response.json();
    return { postId, saved: data.saved };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to check save status");
  }
});

export const getSavedPosts = createAsyncThunk<
  { posts: any[] },
  void,
  { rejectValue: string }
>("interactions/getSavedPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/saved-posts", {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to fetch saved posts"
      );
    }

    const data = await response.json();
    return { posts: data.data };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch saved posts");
  }
});
