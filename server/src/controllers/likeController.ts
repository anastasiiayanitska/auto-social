import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import Like from '../models/Like';

import Notification from '../models/Notification'; // Додайте імпорт моделі сповіщень

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      res
        .status(400)
        .json({ success: false, message: 'You have already liked this post' });
      return;
    }

    await Like.create({ user: userId, post: postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    // Створюємо сповіщення
    if (post.user.toString() !== userId.toString()) {
      await Notification.create({
        senderId: userId,
        receiverId: post.user, // Власник поста
        type: 'like',
        postId: postId,
        read: false,
      });
    }

    res.status(200).json({ success: true, message: 'Like successfully added' });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message || 'Error adding like' });
  }
};
// export const likePost = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const postId = req.params.postId;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       res.status(404).json({
//         success: false,
//         message: 'Post not found',
//       });
//       return;
//     }

//     const existingLike = await Like.findOne({ user: userId, post: postId });
//     if (existingLike) {
//       res.status(400).json({
//         success: false,
//         message: 'You have already liked this post',
//       });
//       return;
//     }

//     await Like.create({
//       user: userId,
//       post: postId,
//     });

//     await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

//     res.status(200).json({
//       success: true,
//       message: 'Like successfully added',
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Error adding like',
//     });
//   }
// };

export const unlikePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const like = await Like.findOne({ user: userId, post: postId });
    if (!like) {
      res.status(404).json({
        success: false,
        message: 'Like not found',
      });
      return;
    }

    await Like.findByIdAndDelete(like._id);

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

export const checkLikeStatus = async (
  req: Request,
  res: Response,
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
