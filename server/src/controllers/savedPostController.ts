import { Request, Response } from 'express';
import {
  savedPost,
  unsavedPost,
  getSavedPosts,
  checkSavedStatus,
} from '../services/savedPostService';

export const savedNewPost = async (req: Request, res: Response) => {
  try {
    const postId = await savedPost(req.user._id, req.params.postId);
    console.log('Saved post ID:', postId);
    res.status(201).json({ success: true, data: postId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const unSavedPost = async (req: Request, res: Response) => {
  try {
    const newSavedPost = await unsavedPost(req.user._id, req.params.postId);
    res.status(200).json({ success: true, message: 'This post is not saved!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allSavedPosts = async (req: Request, res: Response) => {
  try {
    const listSavedPost = await getSavedPosts(req.params.userId);

    res.status(200).json({ success: true, data: listSavedPost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allUserSavedPosts = async (req: Request, res: Response) => {
  try {
    const listSavedPost = await getSavedPosts(req.user._id);
    res.status(200).json({ success: true, data: listSavedPost });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const statusSaved = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const status = await checkSavedStatus(userId, postId);

    res.status(200).json({ success: true, saved: status });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error status!!',
    });
  }
};
