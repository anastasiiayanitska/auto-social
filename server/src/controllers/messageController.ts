import { Request, Response } from 'express';
import Message, { IMessage } from '../models/Message';
import mongoose from 'mongoose';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;

    // Перевірка валідності ID
    if (
      !mongoose.Types.ObjectId.isValid(userId1) ||
      !mongoose.Types.ObjectId.isValid(userId2)
    ) {
      res.status(400).json({ message: 'Invalid user IDs' });
      return;
    }

    // Отримуємо повідомлення між двома користувачами
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
    return;
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // Перевірка валідності ID
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      res.status(400).json({ message: 'Invalid user IDs' });
      return;
    }

    // Створення нового повідомлення
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      read: false,
    });

    // Збереження в базі даних
    await newMessage.save();

    res.status(201).json(newMessage);
    return;
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    // Перевірка валідності ID
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      res.status(400).json({ message: 'Invalid message ID' });
      return;
    }

    // Позначення повідомлення як прочитаного
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true },
    );

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    res.status(200).json(message);
    return;
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId, senderId } = req.params;

    // Перевірка валідності ID
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      res.status(400).json({ message: 'Invalid user IDs' });
      return;
    }

    // Позначення всіх повідомлень як прочитаних
    await Message.updateMany(
      { senderId, receiverId: userId, read: false },
      { read: true },
    );

    res.status(200).json({ message: 'All messages marked as read' });
    return;
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};
