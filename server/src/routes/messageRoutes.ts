import express from 'express';
import {
  getMessages,
  sendMessage,
  markAsRead,
  markAllAsRead,
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Маршрути для повідомлень
router.get('/:userId1/:userId2', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:messageId/read', protect, markAsRead);
router.put('/:userId/:senderId/read-all', protect, markAllAsRead);

export default router;
