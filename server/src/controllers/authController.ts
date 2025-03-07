import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import cloudinary from '../config/cloudinary';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.types';
import fs from 'fs';
import { uploadSingleImage, deleteImage } from '../config/uploadService';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' },
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      bio,
      location,
      phoneNumber,
      website,
    } = req.body;

    console.log('Register request body:', req.body);
    console.log('Uploaded file:', req.file);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Користувач з таким email або username вже існує',
      });
      return;
    }

    let avatarUrl = '';

    if (req.file) {
      console.log(req.file);
      try {
        console.log('Завантаження файлу в Cloudinary:', req.file.path);
        avatarUrl = await uploadSingleImage(req.file.path, 'avatars');
        console.log('Завантажено аватар URL:', avatarUrl);
      } catch (uploadError) {
        console.error('Помилка завантаження аватару:', uploadError);

        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    } else {
      console.log('Файл не було завантажено');
    }

    const newUser = await User.create({
      username,
      email,
      password,
      avatar: avatarUrl,
      firstName,
      lastName,
      bio,
      location,
      phoneNumber,
      website,
    });

    console.log('Створено користувача:', newUser);

    const token = generateToken(newUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Тільки для HTTPS в production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          bio: newUser.bio,
          location: newUser.location,
          phoneNumber: newUser.phoneNumber,
          website: newUser.website,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Помилка реєстрації:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при реєстрації користувача',
    });
  }
};

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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Будь ласка, надайте email та пароль',
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Невірний email або пароль',
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Невірний email або пароль',
      });
      return;
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Тільки для HTTPS в production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          location: user.location,
          phoneNumber: user.phoneNumber,
          website: user.website,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Помилка логіну:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при авторизації користувача',
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Видаляємо cookie при виході
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Ви успішно вийшли з системи',
    });
  } catch (error: any) {
    console.error('Помилка виходу:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при виході з системи',
    });
  }
};

// export const getMe = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');

//     if (!user) {
//       res.status(404).json({
//         success: false,
//         message: 'Користувача не знайдено',
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error: any) {
//     console.error('Помилка отримання профілю:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Помилка при отриманні даних користувача',
//     });
//   }
// };

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
