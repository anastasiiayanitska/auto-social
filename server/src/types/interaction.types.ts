import { Document, Types } from 'mongoose';

export interface IComment extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILike extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}
