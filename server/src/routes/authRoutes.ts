import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import {
  register,
  verifyEmail,
  resendVerificationCode,
} from '../controllers/registrationController';
import {
  forgotPassword,
  resetPassword,
  changePassword,
  verifyPasswordChange,
} from '../controllers/passwordController';
import { upload } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', upload.single('avatar'), register);
router.post('/logout', logout);
router.post('/login', login);

router.post('/verify-email', verifyEmail);
router.post('/resend-verification-code', resendVerificationCode);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/change-password', protect, changePassword);
router.post('/verify-password-change', protect, verifyPasswordChange);

export default router;
