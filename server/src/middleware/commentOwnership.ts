import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comments';

// Extend Request interface properly
interface RequestWithComment extends Request {
  comment?: any;
  user?: {
    _id: string;
    // Інші властивості користувача
  };
}

// Check comment ownership middleware
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
        message: 'Потрібна авторизація',
      });
      return;
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Коментар не знайдено',
      });
      return;
    }

    // Check if the user is the owner of the comment
    if (comment.user.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: 'Ви не маєте прав для видалення цього коментаря',
      });
      return;
    }

    // Add comment to request object for use in controller
    (req as RequestWithComment).comment = comment;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при перевірці власності коментаря',
    });
  }
};
