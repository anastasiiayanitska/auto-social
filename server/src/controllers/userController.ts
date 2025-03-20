import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import Post from '../models/Post';
import { uploadSingleImage, deleteImage } from '../config/uploadService';
export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;

    console.log('Update profile request body:', req.body);
    console.log('Uploaded file:', req.file);

    if (req.user.id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to update this profile.',
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
        message: 'User not found',
      });
      return;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        res.status(400).json({
          success: false,
          message: 'This username is already in use.',
        });
        return;
      }
    }

    let avatarUrl = user.avatar;

    if (req.file) {
      try {
        if (user.avatar) {
          await deleteImage(user.avatar);
        }

        avatarUrl = await uploadSingleImage(req.file.path, 'avatars');
      } catch (uploadError) {
        console.error('Error loading new avatar:', uploadError);

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
    console.error('Profile update error:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user profile',
    });
  }
};
export const deleteProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (req.user.id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this profile.',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User noz found',
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
        console.error('Error deleting avatar from Cloudinary:', deleteError);
      }
    }

    try {
      await Post.deleteMany({ user: userId });
      console.log(`All users post ${userId} deleted.`);
    } catch (postDeleteError) {
      console.error('Error deleting user posts:', postDeleteError);
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'The profile and all its posts have been successfully deleted.',
    });
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user profile',
    });
  }
};
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error retrieving profile', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user data',
    });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Error retrieving:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error while receiving',
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
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
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user profile',
    });
  }
};
