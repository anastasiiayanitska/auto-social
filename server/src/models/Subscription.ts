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

SubscriptionSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema,
);
