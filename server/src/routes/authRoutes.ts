import { Router } from 'express';
import {
  register,
  login,
  updateProfile,
  deleteProfile,
  logout,
  getUserById,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/register', upload.single('avatar'), register);
router.post('/logout', logout);
router.post('/login', login);
// router.get('/me', protect, getMe);
router.put('/update/:id', protect, upload.single('avatar'), updateProfile);
router.delete('/profile/:id', protect, deleteProfile);
router.get('/profile/:id', protect, getUserById);

export default router;
