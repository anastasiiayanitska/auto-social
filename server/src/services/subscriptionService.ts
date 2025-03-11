import User from '../models/User';
import Subscription from '../models/Subscription';
import Post from '../models/Post';
import mongoose from 'mongoose';

export const followUser = async (followerId: string, followingId: string) => {
  const followingUser = await User.findById(followingId);
  if (!followingUser) throw new Error('Користувача не знайдено');
  if (followerId === followingId)
    throw new Error('Ви не можете підписатися на себе');

  const existingSubscription = await Subscription.findOne({
    follower: followerId,
    following: followingId,
  });
  if (existingSubscription) throw new Error('Ви вже підписані');

  return await Subscription.create({
    follower: followerId,
    following: followingId,
  });
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const subscription = await Subscription.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });
  if (!subscription) throw new Error('Ви не були підписані');
};

export const getFollowers = async (userId: string) => {
  return await Subscription.find({ following: userId }).populate(
    'follower',
    'username',
  );
};

export const getFollowing = async (userId: string) => {
  return await Subscription.find({ follower: userId }).populate(
    'following',
    'username',
  );
};

export const checkFollowStatus = async (
  followerId: string,
  followingId: string,
) => {
  const subscription = await Subscription.findOne({
    follower: followerId,
    following: followingId,
  });
  return !!subscription;
};

export const getUserFeed = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const following = await Subscription.find({ follower: userId }).select(
    'following',
  );
  const followingIds = following.map((f) => f.following);
  // followingIds.push(userId);

  const posts = await Post.find({ user: { $in: followingIds } })
    .populate('user', 'username avatar firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments({ user: { $in: followingIds } });
  return {
    success: true,
    data: posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    },
  };
};
