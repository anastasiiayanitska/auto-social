import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createComment,
  deleteComment,
  getPostComments,
} from '../controllers/commentController';
import {
  likePost,
  unlikePost,
  checkLikeStatus,
} from '../controllers/likeController';
import { checkCommentOwnership } from '../middleware/commentOwnership';

const router = express.Router();
// Comments
router.post('/posts/:postId/comments', protect, createComment);
router.get('/posts/:postId/comments', getPostComments);
router.delete(
  '/comments/:commentId',
  protect,
  checkCommentOwnership,
  deleteComment,
);

// Likes
router.post('/posts/:postId/likes', protect, likePost);
router.delete('/posts/:postId/likes', protect, unlikePost);
router.get('/posts/:postId/likes/status', protect, checkLikeStatus);

export default router;
