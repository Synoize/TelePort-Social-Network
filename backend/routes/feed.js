import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get feed (posts from followed users)
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    const followingIds = user.following.map((id) => id.toString());
    followingIds.push(req.user._id.toString()); // Include own posts

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'username name profilePhoto')
      .populate('likes', 'username name profilePhoto')
      .populate('comments.user', 'username name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: { $in: followingIds } });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

