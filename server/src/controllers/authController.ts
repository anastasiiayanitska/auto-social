import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, generateVerificationCode } from '../utils/authUtils';
import {
  sendEmail,
  getRegistrationEmailTemplate,
} from '../services/emailService';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate new code
      const verificationCode = generateVerificationCode();

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      await user.save();

      await sendEmail(
        user.email,
        'Email Verification',
        getRegistrationEmailTemplate(user.username, verificationCode),
      );

      res.status(403).json({
        success: false,
        message:
          'Please verify your email. A new verification code has been sent.',
        emailVerified: false,
      });
      return;
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
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
    console.error('Login error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error during user authentication' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token');
    res
      .status(200)
      .json({ success: true, message: 'You have successfully logged out' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Error during logout' });
  }
};
