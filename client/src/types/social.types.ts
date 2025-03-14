import {
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from "./vehicle.types";
import { Types } from "mongoose";

// User types
export interface User {
  _id: string;
  username: string;
  avatar?: string;
}

// Post types
export enum PostType {
  REGULAR = "regular",
  PRODUCT = "product",
  SERVICE = "service",
}

export interface Post {
  _id: string;
  user: string | User;
  content: string;
  images: string[];
  postType: PostType;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPost extends Post {
  postType: PostType.PRODUCT;
  product: {
    title: string;
    price: number;
    condition: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    vehicleType: VehicleType;
    mileage?: number;
    engineType?: EngineType;
    transmission?: TransmissionType;
    features?: string[];
    location?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
}

export interface ServicePost extends Post {
  postType: PostType.SERVICE;
  service: {
    title: string;
    price?: number;
    priceType?: "fixed" | "hourly" | "negotiable";
    category?: string;
    description: string;
    availability?: string;
    location?: string;
    contactPhone?: string;
    contactEmail?: string;
    experience?: string;
  };
}

export interface RegularPost extends Post {
  postType: PostType.REGULAR;
}

// Comment type
export interface Comment {
  _id: string;
  user: string | User;
  post: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  _id: string;
  follower: string | User;
  following: string | User;
  createdAt: string;
}

// SavedPost type
export interface SavedPost {
  _id: string;
  user: string | User;
  post: string | Post;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Form data types for creating/updating
export interface CreatePostData {
  content: string;
  postType: PostType;
  images?: File[];
  product?: ProductPost["product"];
  service?: ServicePost["service"];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
}
