import mongoose, { Schema } from 'mongoose';
import { ILike } from '../types/interaction.types';

const LikeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
