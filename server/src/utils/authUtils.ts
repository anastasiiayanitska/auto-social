import { IUser } from '../types/user.types';
import jwt from 'jsonwebtoken';

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' },
  );
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
