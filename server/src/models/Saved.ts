import mongoose, { Schema } from 'mongoose';
import { ISavedPost } from '../types/user.types';

const SavedPostSchema = new Schema<ISavedPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    savedPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
SavedPostSchema.index({ user: 1, savedPost: 1 }, { unique: true });

export default mongoose.model<ISavedPost>('SavedPost', SavedPostSchema);
