// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   Post,
//   CreatePostData,
//   UpdatePostData,
//   ApiResponse,
//   PaginatedResponse,
// } from "../../types/social.types";

// // This is a mock implementation for the thunks
// const API_URL = "http://localhost:3000/api";

// export const createPost = createAsyncThunk<
//   Post,
//   CreatePostData,
//   { rejectValue: string }
// >("posts/createPost", async (postData, { rejectWithValue }) => {
//   try {
//     const formData = new FormData();
//     formData.append("content", postData.content);
//     formData.append("postType", postData.postType);

//     if (postData.images) {
//       postData.images.forEach((image) => {
//         formData.append("images", image);
//       });
//     }

//     if (postData.product) {
//       formData.append("product", JSON.stringify(postData.product));
//     }

//     if (postData.service) {
//       formData.append("service", JSON.stringify(postData.service));
//     }

//     const response = await fetch(`${API_URL}/posts/create`, {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(
//         errorData.message || "Не вдалося створити публікацію"
//       );
//     }

//     const data: ApiResponse<Post> = await response.json();
//     return data.data as Post;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Не вдалося створити публікацію");
//   }
// });

// export const getAllPosts = createAsyncThunk<
//   Post[],
//   void,
//   { rejectValue: string }
// >("posts/getAllPosts", async (_, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${API_URL}/posts`, {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to fetch posts");
//     }

//     const data: ApiResponse<Post[]> = await response.json();
//     return data.data as Post[];
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to fetch posts");
//   }
// });

// export const getMyPosts = createAsyncThunk<
//   { posts: Post[]; pagination: any },
//   { page?: number; limit?: number },
//   { rejectValue: string }
// >("posts/getMyPosts", async (params = {}, { rejectWithValue }) => {
//   try {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append("page", params.page.toString());
//     if (params.limit) queryParams.append("limit", params.limit.toString());

//     const response = await fetch(`${API_URL}/posts/user/me`, {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to fetch my posts");
//     }

//     const data = await response.json();
//     return {
//       posts: data.data,
//       pagination: data.pagination,
//     };
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to fetch my posts");
//   }
// });

// export const getUserPosts = createAsyncThunk<
//   Post[],
//   string,
//   { rejectValue: string }
// >("posts/getUserPosts", async (userId, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${API_URL}/posts/user/${userId}`, {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to fetch user posts");
//     }

//     const data: ApiResponse<Post[]> = await response.json();
//     return data.data as Post[];
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to fetch user posts");
//   }
// });

// export const getPostById = createAsyncThunk<
//   Post,
//   string,
//   { rejectValue: string }
// >("posts/getPostById", async (postId, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${API_URL}/posts/${postId}`, {
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to fetch post");
//     }

//     const data: ApiResponse<Post> = await response.json();
//     return data.data as Post;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to fetch post");
//   }
// });

// export const updatePost = createAsyncThunk<
//   Post,
//   UpdatePostData,
//   { rejectValue: string }
// >("posts/updatePost", async (updateData, { rejectWithValue }) => {
//   try {
//     const formData = new FormData();

//     if (updateData.content) {
//       formData.append("content", updateData.content);
//     }

//     if (updateData.postType) {
//       formData.append("postType", updateData.postType);
//     }

//     if (updateData.images) {
//       updateData.images.forEach((image) => {
//         formData.append("images", image);
//       });
//     }

//     if (updateData.product) {
//       formData.append("product", JSON.stringify(updateData.product));
//     }

//     if (updateData.service) {
//       formData.append("service", JSON.stringify(updateData.service));
//     }

//     const response = await fetch(`${API_URL}/posts/${updateData.id}`, {
//       method: "PUT",
//       body: formData,
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to update post");
//     }

//     const data: ApiResponse<Post> = await response.json();
//     return data.data as Post;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to update post");
//   }
// });

// export const deletePost = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: string }
// >("posts/deletePost", async (postId, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${API_URL}/posts/${postId}`, {
//       method: "DELETE",
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to delete post");
//     }

//     return postId;
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to delete post");
//   }
// });

// export const getUserFeed = createAsyncThunk<
//   { posts: Post[]; pagination: any },
//   { page?: number; limit?: number },
//   { rejectValue: string }
// >("posts/getUserFeed", async (params = {}, { rejectWithValue }) => {
//   try {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append("page", params.page.toString());
//     if (params.limit) queryParams.append("limit", params.limit.toString());

//     const response = await fetch(
//       `${API_URL}/subscriptions/feed/${queryParams.toString()}`,
//       {
//         credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       return rejectWithValue(errorData.message || "Failed to fetch feed");
//     }

//     const data = await response.json();
//     return {
//       posts: data.data,
//       pagination: data.pagination,
//     };
//   } catch (error: any) {
//     return rejectWithValue(error.message || "Failed to fetch feed");
//   }
// });
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Post,
  CreatePostData,
  UpdatePostData,
  ApiResponse,
} from "../../types/social.types";

// This is a mock implementation for the thunks
const API_URL = "http://localhost:3000/api";

export const createPost = createAsyncThunk<
  Post,
  CreatePostData,
  { rejectValue: string }
>("posts/createPost", async (postData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("postType", postData.postType);

    if (postData.images) {
      postData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    if (postData.product) {
      formData.append("productDetails[title]", postData.product.title);
      formData.append("productDetails[price]", postData.product.price);
      formData.append(
        "productDetails[condition]",
        postData.product.condition || "used"
      );
      formData.append("productDetails[year]", postData.product.year);
      formData.append("productDetails[model]", postData.product.model);
      formData.append("productDetails[brand]", postData.product.brand);
      formData.append("productDetails[color]", postData.product.color);
      formData.append(
        "productDetails[vehicleType]",
        postData.product.vehicleType || ""
      );
      formData.append(
        "productDetails[mileage]",
        postData.product.mileage || ""
      );
      formData.append(
        "productDetails[engineType]",
        postData.product.engineType || ""
      );
      formData.append(
        "productDetails[transmission]",
        postData.product.transmission || ""
      );
      formData.append(
        "productDetails[features]",
        postData.product.features || ""
      );
      formData.append(
        "productDetails[location]",
        postData.product.location || ""
      );
      formData.append(
        "productDetails[contactPhone]",
        postData.product.contactPhone || ""
      );
      formData.append(
        "productDetails[contactEmail]",
        postData.product.contactEmail || ""
      );
    }

    if (postData.service) {
      formData.append("serviceDetails[title]", postData.service.title);
      formData.append("serviceDetails[price]", postData.service.price);
      formData.append("serviceDetails[priceType]", postData.service.priceType);
      formData.append(
        "serviceDetails[category]",
        postData.service.category || ""
      );
      formData.append(
        "serviceDetails[description]",
        postData.service.description || ""
      );
      formData.append(
        "serviceDetails[availability]",
        postData.service.availability || ""
      );
      formData.append(
        "serviceDetails[location]",
        postData.service.location || ""
      );
      formData.append(
        "serviceDetails[contactPhone]",
        postData.service.contactPhone || ""
      );
      formData.append(
        "serviceDetails[contactEmail]",
        postData.service.contactEmail || ""
      );
      formData.append(
        "serviceDetails[experience]",
        postData.service.experience || ""
      );
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await fetch(`${API_URL}/posts/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Не вдалося створити публікацію"
      );
    }

    const data: ApiResponse<Post> = await response.json();
    return data.data as Post;
  } catch (error: any) {
    return rejectWithValue(error.message || "Не вдалося створити публікацію");
  }
});

export const getAllPosts = createAsyncThunk<
  Post[],
  void,
  { rejectValue: string }
>("posts/getAllPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch posts");
    }

    const data: ApiResponse<Post[]> = await response.json();
    return data.data as Post[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch posts");
  }
});

export const getMyPosts = createAsyncThunk<
  Post[],
  { page?: number; limit?: number },
  { rejectValue: string }
>("posts/getMyPosts", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/posts/user/me?${queryParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch my posts");
    }

    const data: ApiResponse<Post[]> = await response.json();
    return data.data as Post[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch my posts");
  }
});

export const getUserPosts = createAsyncThunk<
  Post[],
  string,
  { rejectValue: string }
>("posts/getUserPosts", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/user/${userId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch user posts");
    }

    const data: ApiResponse<Post[]> = await response.json();
    return data.data as Post[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch user posts");
  }
});

export const getPostById = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>("posts/getPostById", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch post");
    }

    const data: ApiResponse<Post> = await response.json();
    return data.data as Post;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch post");
  }
});

export const updatePost = createAsyncThunk<
  Post,
  UpdatePostData,
  { rejectValue: string }
>("posts/updatePost", async (updateData, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    if (updateData.content) {
      formData.append("content", updateData.content);
    }

    if (updateData.postType) {
      formData.append("postType", updateData.postType);
    }

    if (updateData.images) {
      updateData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    if (updateData.product) {
      formData.append("product", JSON.stringify(updateData.product));
    }

    if (updateData.service) {
      formData.append("service", JSON.stringify(updateData.service));
    }

    const response = await fetch(`${API_URL}/posts/${updateData.id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to update post");
    }

    const data: ApiResponse<Post> = await response.json();
    return data.data as Post;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update post");
  }
});

export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("posts/deletePost", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to delete post");
    }

    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete post");
  }
});

export const getUserFeed = createAsyncThunk<
  Post[],
  { page?: number; limit?: number },
  { rejectValue: string }
>("posts/getUserFeed", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/subscriptions/feed?${queryParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch feed");
    }

    const data: ApiResponse<Post[]> = await response.json();
    return data.data as Post[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch feed");
  }
});
