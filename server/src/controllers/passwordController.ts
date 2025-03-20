import { Request, Response } from 'express';
import User from '../models/User';
import { generateVerificationCode } from '../utils/authUtils';
import {
  sendEmail,
  getPasswordResetEmailTemplate,
  getPasswordChangeEmailTemplate,
} from '../services/emailService';

export const forgotPassword = async (
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

    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If this email exists, a password reset code will be sent',
      });
      return;
    }

    const resetCode = generateVerificationCode();

    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const emailSent = await sendEmail(
      user.email,
      'Password Recovery',
      getPasswordResetEmailTemplate(user.username, resetCode),
    );

    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: 'Error sending email',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset code has been sent to your email',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error requesting password reset',
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email, code, and new password',
      });
      return;
    }

    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset code',
      });
      return;
    }

    user.password = password;
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    await sendEmail(
      user.email,
      'Password Successfully Changed',
      getPasswordChangeEmailTemplate(user.username),
    );

    res.status(200).json({
      success: true,
      message:
        'Password successfully reset. You can now login with your new password',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password',
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    const verificationCode = generateVerificationCode();

    user.passwordChangeCode = verificationCode;
    user.passwordChangeCodeExpires = Date.now() + 30 * 60 * 1000;
    user.pendingPasswordChange = newPassword;
    await user.save();

    await sendEmail(
      user.email,
      'Password Change Confirmation',
      getPasswordChangeEmailTemplate(user.username, verificationCode),
    );

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password',
    });
  }
};

export const verifyPasswordChange = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Please provide verification code',
      });
      return;
    }

    const user = await User.findOne({
      _id: userId,
      passwordChangeCode: code,
      passwordChangeCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
      return;
    }

    if (user.pendingPasswordChange) {
      user.password = user.pendingPasswordChange;
    }
    user.passwordChangeCode = null;
    user.passwordChangeCodeExpires = null;
    user.pendingPasswordChange = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password successfully changed',
    });
  } catch (error: any) {
    console.error('Password change verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming password change',
    });
  }
};
