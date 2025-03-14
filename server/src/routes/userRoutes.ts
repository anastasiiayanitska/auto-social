import { Router } from 'express';
import {
  updateProfile,
  deleteProfile,
  getUserById,
  getAllUser,
  getMe,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.put('/update/:id', protect, upload.single('avatar'), updateProfile);
router.delete('/profile/:id', protect, deleteProfile);
router.get('/profile/:id', protect, getUserById);
router.get('/all-users', protect, getAllUser);
router.get('/me', protect, getMe);

export default router;
