import { Router } from 'express';
import { createPost, getUserPosts } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';
import { uploadMultiple } from '../middleware/uploadMiddleware';

const router = Router();
router.post('/posts', protect, uploadMultiple, createPost);
router.get('/posts/:id', protect, getUserPosts);

export default router;
