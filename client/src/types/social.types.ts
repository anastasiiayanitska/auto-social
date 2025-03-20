import { VehicleType, EngineType, TransmissionType } from "./vehicle.types";

export interface User {
  _id: string;
  username: string;
  avatar?: string;
}

export enum PostType {
  REGULAR = "regular",
  PRODUCT = "product",
  SERVICE = "service",
}

export interface Post {
  _id: string;
  title: String;
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

export interface Comment {
  _id: string;
  user: string | User;
  post: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikeStatus {
  postId: string;
  liked: boolean;
}

export interface SaveStatus {
  postId: string;
  saved: boolean;
}
export interface InteractionsState {
  likeStatus: LikeStatus[];
  saveStatus: SaveStatus[];
  comments: {
    [postId: string]: Comment[];
  };
  loadingComments: boolean;
  savedPosts: any[];
  loadingSavedPosts: boolean;
}
export interface Subscription {
  _id: string;
  follower: string | User;
  following: string | User;
  createdAt: string;
}

export interface SavedPost {
  _id: string;
  user: string | User;
  post: string | Post;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

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
