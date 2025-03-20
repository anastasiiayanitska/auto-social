import { Request, Response } from 'express';
import Notification, { INotification } from '../models/Notification';
import mongoose from 'mongoose';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Перевірка валідності ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // Отримання сповіщень користувача з інформацією про відправника
    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'username avatar')
      .populate('postId', 'title')
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    // Перевірка валідності ID
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }

    // Позначення сповіщення як прочитаного
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    // Перевірка валідності ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // Позначення всіх сповіщень як прочитаних
    await Notification.updateMany(
      { receiverId: userId, read: false },
      { read: true },
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, senderId, receiverId, postId, commentId, commentText } =
      req.body;

    // Перевірка валідності ID
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      res.status(400).json({ message: 'Invalid user IDs' });
      return;
    }

    // Створення нового сповіщення
    const newNotification = new Notification({
      type,
      senderId,
      receiverId,
      postId,
      commentId,
      commentText,
      read: false,
    });

    // Збереження в базі даних
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
