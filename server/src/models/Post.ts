import mongoose, { Schema } from 'mongoose';
import {
  PostType,
  IPost,
  IProductPost,
  IServicePost,
} from '../types/post.types';
import {
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from '../types/vehicle.types';

const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    postType: {
      type: String,
      enum: Object.values(PostType),
      default: PostType.REGULAR,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'postType',
  },
);

const PostModel = mongoose.model<IPost>('Post', PostSchema);

const ProductPostSchema = new Schema<IProductPost>(
  {
    product: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      condition: {
        type: String,
        required: true,
        enum: Object.values(Condition),
      },
      brand: {
        type: String,
        required: true,
        trim: true,
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
      year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
      color: {
        type: String,
        // required: true,
        trim: true,
      },
      vehicleType: {
        type: String,
        // required: true,
        enum: Object.values(VehicleType),
      },
      mileage: {
        type: Number,
        min: 0,
      },
      engineType: {
        type: String,
        enum: Object.values(EngineType),
      },
      transmission: {
        type: String,
        enum: Object.values(TransmissionType),
      },
      features: [String],
      location: String,
      contactPhone: String,
      contactEmail: String,
    },
  },
  {
    _id: false,
  },
);

ProductPostSchema.index({ 'product.brand': 1 });
ProductPostSchema.index({ 'product.model': 1 });
ProductPostSchema.index({ 'product.year': 1 });
ProductPostSchema.index({ 'product.color': 1 });
ProductPostSchema.index({ 'product.vehicleType': 1 });
ProductPostSchema.index({ 'product.price': 1 });

const ServicePostSchema = new Schema<IServicePost>(
  {
    service: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        min: 0,
      },
      priceType: {
        type: String,
        enum: ['fixed', 'hourly', 'negotiable'],
        default: 'fixed',
      },
      category: String,
      description: {
        type: String,
        required: true,
      },
      availability: String,
      location: String,
      contactPhone: String,
      contactEmail: String,
      experience: String,
    },
  },
  {
    _id: false,
  },
);
export const RegularPost = PostModel.discriminator(
  PostType.REGULAR,
  new Schema({}, { _id: false }),
);

export const ProductPost = PostModel.discriminator<IProductPost>(
  PostType.PRODUCT,
  ProductPostSchema,
);

export const ServicePost = PostModel.discriminator<IServicePost>(
  PostType.SERVICE,
  ServicePostSchema,
);

export default PostModel;
