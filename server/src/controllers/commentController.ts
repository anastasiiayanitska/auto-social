import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comments';

// Create a comment
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { content } = req.body;
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

    const comment = await Comment.create({
      user: userId,
      post: postId,
      content,
    });

    // Increment the comment count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating comment',
    });
  }
};

// Delete a comment (owner only)
export const deleteComment = async (
  req: Request & { comment?: any },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const commentId = req.params.commentId;

    // We assume the middleware has already verified ownership
    const comment = req.comment;

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Decrement the comment count on the post
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

// Get comments for a post
export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
