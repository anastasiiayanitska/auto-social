import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../types/user.types';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Make sure a user can't follow the same user multiple times
SubscriptionSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema,
);
