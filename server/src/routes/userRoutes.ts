import { Router } from 'express';
import {
  updateProfile,
  deleteProfile,
  getUserById,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.put('/update/:id', protect, upload.single('avatar'), updateProfile);
router.delete('/profile/:id', protect, deleteProfile);
router.get('/profile/:id', protect, getUserById);

export default router;
