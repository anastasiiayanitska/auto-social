import { Document, Types } from 'mongoose';
import {
  VehicleType,
  EngineType,
  TransmissionType,
  Condition,
} from './vehicle.types';

export enum PostType {
  REGULAR = 'regular',
  PRODUCT = 'product',
  SERVICE = 'service',
}

export interface IPost extends Document {
  user: Types.ObjectId;
  content: string;
  images: string[];
  postType: PostType;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductPost extends IPost {
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

export interface IServicePost extends IPost {
  postType: PostType.SERVICE;
  service: {
    title: string;
    price?: number;
    priceType?: 'fixed' | 'hourly' | 'negotiable';
    category?: string;
    description: string;
    availability?: string;
    location?: string;
    contactPhone?: string;
    contactEmail?: string;
    experience?: string;
  };
}

export interface IRegularPost extends IPost {
  postType: PostType.REGULAR;
}
