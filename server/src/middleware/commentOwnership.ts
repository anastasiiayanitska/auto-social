import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comments';

interface RequestWithComment extends Request {
  comment?: any;
  user?: {
    _id: string;
  };
}

export const checkCommentOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Authorization required',
      });
      return;
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    if (comment.user.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment.',
      });
      return;
    }

    (req as RequestWithComment).comment = comment;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking comment ownership',
    });
  }
};
