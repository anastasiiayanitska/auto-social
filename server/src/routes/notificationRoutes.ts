import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Маршрути для сповіщень
router.get('/:userId', protect, getNotifications);
router.put('/:notificationId/read', protect, markNotificationAsRead);
router.put('/:userId/read-all', protect, markAllNotificationsAsRead);
router.post('/', protect, createNotification);

export default router;
