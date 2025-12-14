import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Follow user
router.post('/:userId', authenticate, async (req, res) => {
  try {
    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);

    if (currentUser.following.some((id) => id.toString() === req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following list
    currentUser.following.push(req.params.userId);
    await currentUser.save();

    // Add to followers list
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow user
router.delete('/:userId', authenticate, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.userId
    );
    await currentUser.save();

    // Remove from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get followers list
router.get('/:userId/followers', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username name profilePhoto')
      .select('followers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get following list
router.get('/:userId/following', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username name profilePhoto')
      .select('following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

