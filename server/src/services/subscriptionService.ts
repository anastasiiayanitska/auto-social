import User from '../models/User';
import Subscription from '../models/Subscription';
import Post from '../models/Post';
import mongoose from 'mongoose';

export const followUser = async (followerId: string, followingId: string) => {
  const followingUser = await User.findById(followingId);
  if (!followingUser) throw new Error('User not found');
  if (followerId === followingId) throw new Error('You cannot follow yourself');

  const existingSubscription = await Subscription.findOne({
    follower: followerId,
    following: followingId,
  });
  if (existingSubscription)
    throw new Error('You are already following this user');

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
  if (!subscription) throw new Error('You were not following this user');
};

export const getFollowers = async (userId: string) => {
  return await Subscription.find({ following: userId }).populate({
    path: 'follower',
    select:
      'username avatar firstName lastName bio website location phoneNumber',
  });
};

export const getFollowing = async (userId: string) => {
  return await Subscription.find({ follower: userId }).populate({
    path: 'following',
    select:
      'username avatar firstName lastName bio website location phoneNumber',
  });
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

export const getUserFeed = async (userId: string) => {
  const following = await Subscription.find({ follower: userId }).select(
    'following',
  );
  const followingIds = following.map((f) => f.following);

  const posts = await Post.find({ user: { $in: followingIds } })
    .populate('user', 'username avatar firstName lastName')
    .sort({ createdAt: -1 });

  return {
    success: true,
    data: posts,
  };
};
