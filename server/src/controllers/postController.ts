import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/postsService';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user._id;
    const newPost = await postService.createPost(
      userId,
      req.body,
      req.files as Express.Multer.File[],
    );

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
  try {
    const userId = req.params.id;
    const posts = await postService.getUserPosts(userId);

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

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const post = await postService.getPostById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Пост не знайдено',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні поста',
    });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await postService.getAllPosts(page, limit);

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні постів',
    });
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const result = await postService.deletePost(postId, userId);

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при видаленні поста',
    });
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const result = await postService.updatePost(
      postId,
      userId,
      req.body,
      req.files as Express.Multer.File[],
    );

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при редагуванні поста',
    });
  }
};
