import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Comment,
  CreateCommentData,
  ApiResponse,
  User,
} from "../../types/social.types";
import { RootState } from "../store";
import { getSocket } from "../../utils/socket";
import { API_URL } from "../../utils/url";

export const likePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>("interactions/likePost", async (postId, { rejectWithValue, getState }) => {
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

    // Отримати дані відповіді, якщо вони містять додаткову інформацію
    const data = await response.json();

    // Отримати автора поста з відповіді API
    // Якщо API не повертає автора, цю частину потрібно буде змінити
    const authorId = data.authorId || null;
    console.log(authorId);
    // Відправити сповіщення через сокет, якщо є authorId
    if (authorId) {
      const currentUser = getState().auth.user;
      if (currentUser) {
        const socket = getSocket();
        if (socket) {
          socket.emit("sendLike", {
            senderId: currentUser._id,
            receiverId: authorId,
            postId: postId,
            type: "like",
          });
        }
      }
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

export const createComment = createAsyncThunk<
  Comment,
  CreateCommentData & { authorId: string },
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

      // Send notification if the post is not our own
      if (currentUser && commentData.authorId !== currentUser._id) {
        const socket = getSocket();
        if (socket) {
          socket.emit("sendComment", {
            senderId: currentUser._id,
            receiverId: commentData.authorId,
            postId: commentData.postId,
            commentId: data.data._id,
            commentText: commentData.content,
          });
        }
      }

      return {
        ...data.data,
        username: currentUser?.username || "Anonymous",
        userId: currentUser?._id,
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

    const data = await response.json();

    return data.data;
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
  { rejectValue: string; state: RootState }
>("interactions/getSavedPosts", async (_, { rejectWithValue, getState }) => {
  try {
    const userId = getState().auth.user?._id;

    if (!userId) {
      return rejectWithValue("User not authenticated");
    }

    const response = await fetch(`${API_URL}/posts/${userId}/all-saved-post`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to fetch saved posts"
      );
    }

    const data = await response.json();
    return { posts: data.data || [] };
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch saved posts");
  }
});
