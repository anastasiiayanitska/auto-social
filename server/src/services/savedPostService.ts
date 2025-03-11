import User from '../models/User';
import Post from '../models/Post';
import SavedPost from '../models/Saved';
import mongoose from 'mongoose';

export const savedPost = async (userId: string, postId: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  const existingSave = await SavedPost.findOne({
    user: userId,
    savedPost: postId,
  });
  if (existingSave) throw new Error('You have already saved this post!');
  return await SavedPost.create({
    user: userId,
    savedPost: postId,
  });
};

export const unsavedPost = async (userId: string, postId: string) => {
  const saved = await SavedPost.findOneAndDelete({
    user: userId,
    savedPost: postId,
  });
  if (!saved) throw new Error('You did not save this post');
};

export const getSavedPosts = async (userId: string) => {
  return await SavedPost.find({ user: userId });
};

export const getUserSavedPosts = async (postId: string) => {
  return await SavedPost.find({ savedPost: postId });
};

export const checkSavedStatus = async (userId: string, postId: string) => {
  const saved = await SavedPost.findOne({ user: userId, savedPost: postId });
  return !!saved;
};
