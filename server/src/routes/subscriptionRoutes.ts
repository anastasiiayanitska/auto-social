import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getUserFeed,
} from '../controllers/subscriptionController';

const router = express.Router();
router.post('/users/:userId/follow', protect, followUser);
router.delete('/users/:userId/follow', protect, unfollowUser);
router.get('/users/:userId/followers', getFollowers);
router.get('/users/:userId/following', getFollowing);
router.get('/users/:userId/follow-status', protect, checkFollowStatus);
router.get('/feed', protect, getUserFeed);

export default router;
