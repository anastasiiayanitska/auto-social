import mongoose, { Document } from 'mongoose';
import { IPost } from './post.types';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  emailVerified: boolean;
  verificationCode?: string | null;
  verificationCodeExpires?: number | null;
  resetCode?: string | null;
  resetCodeExpires?: Date | null;
  passwordChangeCode?: string | null;
  passwordChangeCodeExpires?: number | null;
  pendingPasswordChange?: string | null;
}

export interface ISubscription extends Document {
  follower: mongoose.Types.ObjectId | IUser;
  following: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedPost extends Document {
  user: mongoose.Types.ObjectId | IUser;
  savedPost: mongoose.Types.ObjectId | IPost;
  createdAt: Date;
  updatedAt: Date;
}
