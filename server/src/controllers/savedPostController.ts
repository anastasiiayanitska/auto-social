import { Request, Response } from 'express';
import {
  savedPost,
  unsavedPost,
  getSavedPosts,
  getUserSavedPosts,
  checkSavedStatus,
} from '../services/savedPostService';
import { log } from 'console';

export const savedNewPost = async (req: Request, res: Response) => {
  try {
    const newSavedPost = await savedPost(req.user._id, req.params.postId);
    res.status(201).json({ success: true, data: newSavedPost });
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
    const listUsersSavedPost = await getUserSavedPosts(req.params.postId);
    res.status(200).json({ success: true, data: listUsersSavedPost });
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
