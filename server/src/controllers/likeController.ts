import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import Like from '../models/Like';

// Like a post
export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      res.status(400).json({
        success: false,
        message: 'You have already liked this post',
      });
      return;
    }

    // Create like
    await Like.create({
      user: userId,
      post: postId,
    });

    // Increment like count on post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    res.status(200).json({
      success: true,
      message: 'Like successfully added',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding like',
    });
  }
};

// Unlike a post
export const unlikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Check if like exists
    const like = await Like.findOne({ user: userId, post: postId });
    if (!like) {
      res.status(404).json({
        success: false,
        message: 'Like not found',
      });
      return;
    }

    // Delete like
    await Like.findByIdAndDelete(like._id);

    // Decrement like count on post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Like successfully removed',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing like',
    });
  }
};

// Check if user liked a post
export const checkLikeStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const like = await Like.findOne({ user: userId, post: postId });

    res.status(200).json({
      success: true,
      liked: !!like,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking like status',
    });
  }
};
