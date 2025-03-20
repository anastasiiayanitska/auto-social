import { Request, Response } from 'express';
import User from '../models/User';
import fs from 'fs';
import { uploadSingleImage } from '../config/uploadService';
import { generateToken, generateVerificationCode } from '../utils/authUtils';
import {
  sendEmail,
  getRegistrationEmailTemplate,
} from '../services/emailService';

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
      return;
    }

    let avatarUrl = '';
    if (req.file) {
      try {
        avatarUrl = await uploadSingleImage(req.file.path, 'avatars');
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        if (req.file.path && fs.existsSync(req.file.path))
          fs.unlinkSync(req.file.path);
      }
    }

    const verificationCode = generateVerificationCode();

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
      emailVerified: false,
      verificationCode,
      verificationCodeExpires: Date.now() + 30 * 60 * 1000,
    });

    await sendEmail(
      email,
      'Registration Confirmation',
      getRegistrationEmailTemplate(username, verificationCode),
    );

    res.status(201).json({
      success: true,
      message: 'Please check your email for a verification code',
      data: {
        user: {
          _id: newUser._id,
          username,
          email,
          avatar: avatarUrl,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (req.file?.path && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ success: false, message: 'Error during user registration' });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and verification code',
      });
      return;
    }

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
      return;
    }

    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Email successfully verified',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during email verification',
    });
  }
};

export const resendVerificationCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
      return;
    }

    const user = await User.findOne({ email, emailVerified: false });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found or email already verified',
      });
      return;
    }

    const verificationCode = generateVerificationCode();

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    await sendEmail(
      email,
      'New Verification Code',
      getRegistrationEmailTemplate(user.username, verificationCode),
    );

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email',
    });
  } catch (error: any) {
    console.error('Code sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending new verification code',
    });
  }
};
