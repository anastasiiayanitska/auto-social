import { Request, Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscriptionService';

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newSubscription = await subscriptionService.followUser(
      req.user._id,
      req.params.userId,
    );
    res.status(201).json({ success: true, data: newSubscription });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await subscriptionService.unfollowUser(req.user._id, req.params.userId);
    res.status(200).json({ success: true, message: 'Відписка успішна' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followers = await subscriptionService.getFollowers(req.params.userId);
    res.status(200).json({ success: true, data: followers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const following = await subscriptionService.getFollowing(req.params.userId);
    res.status(200).json({ success: true, data: following });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkFollowStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userId;
    const status = await subscriptionService.checkFollowStatus(
      followerId,
      followingId,
    );
    res.status(200).json({ success: true, following: status });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при перевірці статусу підписки',
    });
  }
};

export const getUserFeed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const feed = await subscriptionService.getUserFeed(userId, page, limit);
    res.status(200).json(feed);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Помилка при отриманні стрічки новин',
    });
  }
};
