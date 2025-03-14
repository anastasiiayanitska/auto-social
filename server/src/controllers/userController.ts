import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import { uploadSingleImage, deleteImage } from '../config/uploadService';
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;

    console.log('Update profile request body:', req.body);
    console.log('Uploaded file:', req.file);

    if (req.user.id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Ви не маєте прав для оновлення цього профілю',
      });
      return;
    }

    const {
      username,
      email,
      firstName,
      lastName,
      bio,
      location,
      phoneNumber,
      website,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено',
      });
      return;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        res.status(400).json({
          success: false,
          message: 'Цей username вже використовується',
        });
        return;
      }
    }

    let avatarUrl = user.avatar;

    if (req.file) {
      try {
        console.log('Завантаження нового аватару:', req.file.path);

        if (user.avatar) {
          await deleteImage(user.avatar);
        }

        avatarUrl = await uploadSingleImage(req.file.path, 'avatars');
        console.log('Новий аватар URL:', avatarUrl);
      } catch (uploadError) {
        console.error('Помилка завантаження нового аватару:', uploadError);

        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        email: email || user.email,
        firstName: firstName !== undefined ? firstName : user.firstName,
        lastName: lastName !== undefined ? lastName : user.lastName,
        bio: bio !== undefined ? bio : user.bio,
        location: location !== undefined ? location : user.location,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
        website: website !== undefined ? website : user.website,
        avatar: avatarUrl,
      },
      { new: true, runValidators: true },
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Помилка оновлення профілю:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при оновленні профілю користувача',
    });
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (req.user.id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Ви не маєте прав для видалення цього профілю',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено',
      });
      return;
    }

    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }
      } catch (deleteError) {
        console.error('Помилка видалення аватару з Cloudinary:', deleteError);
      }
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Профіль успішно видалено',
    });
  } catch (error: any) {
    console.error('Помилка видалення профілю:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при видаленні профілю користувача',
    });
  }
};
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Помилка отримання профілю:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні даних користувача',
    });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Помилка отримання:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні',
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const isOwnProfile = req.user.id === userId;

    const selectFields = isOwnProfile
      ? '-password'
      : '-password -email -phoneNumber';

    const user = await User.findById(userId).select(selectFields);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Помилка отримання профілю користувача:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні профілю користувача',
    });
  }
};
