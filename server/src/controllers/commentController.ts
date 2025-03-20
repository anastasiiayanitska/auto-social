import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comments';
import Notification from '../models/Notification'; // Додали модель сповіщень

export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const comment = await Comment.create({
      user: userId,
      post: postId,
      content,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // **Створюємо сповіщення для автора поста**
    if (post.user.toString() !== userId.toString()) {
      await Notification.create({
        senderId: userId,
        receiverId: post.user, // Власник поста
        type: 'comment',
        postId: postId,
        read: false,
      });
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating comment',
    });
  }
};

// export const createComment = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { content } = req.body;
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

//     const comment = await Comment.create({
//       user: userId,
//       post: postId,
//       content,
//     });

//     await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
//     res.status(201).json({
//       success: true,
//       data: comment,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Error creating comment',
//     });
//   }
// };

export const deleteComment = async (
  req: Request & { comment?: any },
  res: Response,
): Promise<void> => {
  try {
    const commentId = req.params.commentId;
    const comment = req.comment;

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Comment successfully deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting comment',
    });
  }
};

export const getPostComments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving comments',
    });
  }
};
