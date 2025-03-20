import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Post,
  CreatePostData,
  UpdatePostData,
  ApiResponse,
} from "../../types/social.types";

import { API_URL } from "../../utils/url";

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
      return rejectWithValue(errorData.message || "Failed to create post.");
    }

    const data: ApiResponse<Post> = await response.json();
    return data.data as Post;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create post.");
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
  { postId: string; updateData: UpdatePostData },
  { rejectValue: string }
>("posts/updatePost", async ({ postId, updateData }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("content", updateData.content);

    if (updateData.images) {
      updateData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Handle product details for product post type
    if (updateData.product) {
      formData.append("productDetails[title]", updateData.product.title);
      formData.append("productDetails[price]", updateData.product.price);
      formData.append(
        "productDetails[condition]",
        updateData.product.condition || "used"
      );
      formData.append("productDetails[year]", updateData.product.year);
      formData.append("productDetails[model]", updateData.product.model);
      formData.append("productDetails[brand]", updateData.product.brand);
      formData.append("productDetails[color]", updateData.product.color);
      formData.append(
        "productDetails[vehicleType]",
        updateData.product.vehicleType || ""
      );
      formData.append(
        "productDetails[mileage]",
        updateData.product.mileage || ""
      );
      formData.append(
        "productDetails[engineType]",
        updateData.product.engineType || ""
      );
      formData.append(
        "productDetails[transmission]",
        updateData.product.transmission || ""
      );
      formData.append(
        "productDetails[features]",
        updateData.product.features ? updateData.product.features.join(",") : ""
      );
      formData.append(
        "productDetails[location]",
        updateData.product.location || ""
      );
      formData.append(
        "productDetails[contactPhone]",
        updateData.product.contactPhone || ""
      );
      formData.append(
        "productDetails[contactEmail]",
        updateData.product.contactEmail || ""
      );
    }

    // Handle service details for service post type
    if (updateData.service) {
      formData.append("serviceDetails[title]", updateData.service.title);
      if (updateData.service.price) {
        formData.append(
          "serviceDetails[price]",
          updateData.service.price.toString()
        );
      }
      formData.append(
        "serviceDetails[priceType]",
        updateData.service.priceType || "fixed"
      );
      formData.append(
        "serviceDetails[category]",
        updateData.service.category || ""
      );
      formData.append(
        "serviceDetails[description]",
        updateData.service.description || ""
      );
      formData.append(
        "serviceDetails[availability]",
        updateData.service.availability || ""
      );
      formData.append(
        "serviceDetails[location]",
        updateData.service.location || ""
      );
      formData.append(
        "serviceDetails[contactPhone]",
        updateData.service.contactPhone || ""
      );
      formData.append(
        "serviceDetails[contactEmail]",
        updateData.service.contactEmail || ""
      );
      formData.append(
        "serviceDetails[experience]",
        updateData.service.experience || ""
      );
    }
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to update post.");
    }

    const data: ApiResponse<Post> = await response.json();
    return data.data as Post;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update post.");
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

    const response = await fetch(`${API_URL}/subscriptions/feed`, {
      credentials: "include",
    });

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
