import { Request, Response, NextFunction } from 'express';
import Post, { ProductPost, ServicePost, RegularPost } from '../models/Post';
import { PostType } from '../types/post.types';
import fs from 'fs';
import { uploadMultipleImages } from '../config/uploadService';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      content,
      postType = PostType.REGULAR,
      productDetails,
      serviceDetails,
    } = req.body;

    const userId = req.user._id;
    console.log(userId);
    let newPost;
    let images = [];
    console.log(
      'User ID при створенні поста:',
      req.user ? req.user._id : 'немає користувача',
    );
    console.log('ProductPost:', ProductPost);

    let imagesUrl: string[] = [];
    console.log(req.body, req.file);
    if (req.file && Array.isArray(req.files)) {
      try {
        const filePaths = req.files.map(
          (file: Express.Multer.File) => file.path,
        );
        console.log('Завантаження файлу в Cloudinary:', req.file.path);
        imagesUrl = await uploadMultipleImages(filePaths, 'images');
        console.log('Завантажено аватар URL:', imagesUrl);
      } catch (uploadError) {
        console.error('Помилка завантаження аватару:', uploadError);

        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else {
      console.log('Файл не було завантажено');
    }

    switch (postType) {
      case PostType.PRODUCT:
        newPost = await ProductPost.create({
          user: userId,
          content,
          postType,
          images: imagesUrl,
          product: productDetails,
        });
        break;
      case PostType.SERVICE:
        newPost = await ServicePost.create({
          user: userId,
          content,
          postType,
          images: imagesUrl,
          service: serviceDetails,
        });
        break;
      default:
        newPost = await Post.create({
          user: userId,
          content,
          postType,
          images: imagesUrl,
        });
    }
    console.log('Новий пост:', newPost);
    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log(req.params);

  try {
    const userId = req.params.id;

    const posts = await Post.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
