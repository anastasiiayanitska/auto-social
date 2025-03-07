// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import {
//   IPost,
//   IProductPost,
//   IServicePost,
//   IRegularPost,
//   PostType,
// } from "../types/post.types";

// const API_URL = "http://localhost:3000";

// // Інтерфейс стану постів
// interface PostState {
//   posts: IPost[];
//   loading: boolean;
//   error: string | null;
// }

// // Початковий стан
// const initialState: PostState = {
//   posts: [],
//   loading: false,
//   error: null,
// };

// // 🔹 ОТРИМАННЯ ПОСТІВ КОРИСТУВАЧА
// export const fetchUserPosts = createAsyncThunk<
//   IPost[], // Тип успішної відповіді (масив постів)
//   string, // Тип аргументу (userId)
//   { rejectValue: string } // Тип відхилення
// >("posts/fetchUserPosts", async (userId, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${API_URL}/posts/${userId}`, {
//       withCredentials: true,
//     });
//     return response.data.data;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Не вдалося отримати пости"
//     );
//   }
// });

// // 🔹 СТВОРЕННЯ ПОСТА
// export const createPost = createAsyncThunk<
//   IPost, // Тип успішної відповіді (один пост)
//   IRegularPost | IProductPost | IServicePost, // Тип аргументу (дані поста)
//   { rejectValue: string; state: any } // Тип відхилення + доступ до `getState`
// >("posts/createPost", async (postData, { getState, rejectWithValue }) => {
//   try {
//     const state = getState();
//     const userId = state.user.user?.id; // Отримуємо userId із стану auth
//     console.log(userId);

//     if (!userId) {
//       return rejectWithValue("Користувач не автентифікований");
//     }

//     const response = await axios.post(
//       `${API_URL}/posts/`,
//       { ...postData, user: userId }, // Додаємо userId
//       { withCredentials: true }
//     );

//     return response.data.data;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Не вдалося створити пост"
//     );
//   }
// });

// // 🔹 ВИДАЛЕННЯ ПОСТА
// export const deletePost = createAsyncThunk<
//   string, // Тип успішної відповіді (ID видаленого поста)
//   string, // Тип аргументу (postId)
//   { rejectValue: string }
// >("posts/deletePost", async (postId, { rejectWithValue }) => {
//   try {
//     await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });
//     return postId; // Повертаємо ID видаленого поста
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Не вдалося видалити пост"
//     );
//   }
// });

// // 🔹 СЛАЙС ДЛЯ ПОСТІВ
// const postsSlice = createSlice({
//   name: "posts",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // 🔹 Отримання постів
//       .addCase(fetchUserPosts.fulfilled, (state, action) => {
//         state.posts = action.payload;
//         state.loading = false;
//         state.error = null;
//       })
//       // 🔹 Створення поста
//       .addCase(createPost.fulfilled, (state, action) => {
//         state.posts.unshift(action.payload);
//         state.loading = false;
//         state.error = null;
//       })
//       // 🔹 Видалення поста
//       .addCase(deletePost.fulfilled, (state, action) => {
//         state.posts = state.posts.filter((post) => post._id !== action.payload);
//         state.loading = false;
//         state.error = null;
//       })
//       // 🔹 Ловимо всі pending-запити
//       .addMatcher(
//         (action) => action.type.endsWith("/pending"),
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )
//       // 🔹 Ловимо всі помилки
//       .addMatcher(
//         (action) => action.type.endsWith("/rejected"),
//         (state, action: PayloadAction<unknown>) => {
//           state.loading = false;
//           state.error = action.payload as string;
//         }
//       );
//   },
// });

// export default postsSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  PostType,
  IPost,
  IProductPost,
  IServicePost,
} from "../types/post.types";

// Типи для стану слайса
interface PostsState {
  posts: IPost[];
  userPosts: IPost[];
  currentPost: IPost | null;
  loading: boolean;
  error: string | null;
}

// Початковий стан
const initialState: PostsState = {
  posts: [],
  userPosts: [],
  currentPost: null,
  loading: false,
  error: null,
};

// Базовий URL API
const API_URL = "http://localhost:3000/posts";

// Асинхронний thunk для створення посту
export const createPost = createAsyncThunk<
  IPost, // Тип успішної відповіді
  {
    content: string;
    images: string[];
    postType: PostType;
    product?: IProductPost["product"];
    service?: IServicePost["service"];
  }, // Тип аргументу
  { rejectValue: string }
>("posts/createPost", async (postData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(API_URL, postData, {
      withCredentials: true,
    });

    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося створити пост"
    );
  }
});

// Асинхронний thunk для отримання постів користувача
export const getUserPosts = createAsyncThunk<
  IPost[], // Тип успішної відповіді (масив постів)
  string, // Тип аргументу (userId)
  { rejectValue: string }
>("posts/getUserPosts", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${userId}`, {
      withCredentials: true,
    });
    console.log(data.data);

    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося отримати пости користувача"
    );
  }
});

// Асинхронний thunk для лайку поста
export const likePost = createAsyncThunk<
  IPost, // Тип успішної відповіді (оновлений пост)
  string, // Тип аргументу (postId)
  { rejectValue: string }
>("posts/likePost", async (postId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/${postId}/like`);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Не вдалося лайкнути пост"
    );
  }
});

// Створення слайса
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostsError: (state) => {
      state.error = null;
    },
    resetCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обробка createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.userPosts.unshift(action.payload);
        state.currentPost = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обробка getUserPosts
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обробка likePost
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        // Оновлюємо лайки в усіх списках постів
        const updatedPost = action.payload;

        // Оновлюємо в загальному списку постів
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }

        // Оновлюємо в списку постів користувача
        const userPostIndex = state.userPosts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (userPostIndex !== -1) {
          state.userPosts[userPostIndex] = updatedPost;
        }

        // Оновлюємо поточний пост, якщо він відкритий
        if (state.currentPost && state.currentPost._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Експортуємо actions
export const { clearPostsError, resetCurrentPost } = postsSlice.actions;

// Селектори
export const selectAllPosts = (state: { posts: PostsState }) =>
  state.posts.posts;
export const selectUserPosts = (state: { posts: PostsState }) =>
  state.posts?.userPosts || [];
export const selectCurrentPost = (state: { posts: PostsState }) =>
  state.posts.currentPost;
export const selectPostsLoading = (state: { posts: PostsState }) =>
  state.posts?.loading;
export const selectPostsError = (state: { posts: PostsState }) =>
  state.posts?.error;

// Експортуємо reducer
export default postsSlice.reducer;
