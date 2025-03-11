import { Router } from 'express';
import {
  createPost,
  getUserPosts,
  getPostById,
  getAllPosts,
  deletePost,
  updatePost,
} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';
import { uploadMultiple } from '../middleware/uploadMiddleware';
import {
  validateCreatePost,
  validateUpdatePost,
} from '../middleware/postValidation';
import {
  savedNewPost,
  unSavedPost,
  allSavedPosts,
  allUserSavedPosts,
  statusSaved,
} from '../controllers/savedPostController';

const router = Router();
router.post('/:postId/save', protect, savedNewPost);
router.delete('/:postId/unsave', protect, unSavedPost);
router.get('/:userId/all-saved-post', allSavedPosts);
router.get('/:postId/saved-user', allUserSavedPosts);
router.get('/:postId/save-status', protect, statusSaved);
router.post('/create', protect, uploadMultiple, validateCreatePost, createPost);
router.get('/user/:id', protect, getUserPosts);
router.get('/:id', protect, getPostById);
router.get('/', protect, getAllPosts);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, validateUpdatePost, updatePost);

export default router;
