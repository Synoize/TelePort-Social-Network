import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Search users
router.get('/users', authenticate, async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return res.json({ users: [], pagination: { page, limit, total: 0, pages: 0 } });
    }

    const searchRegex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex },
      ],
    })
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex },
      ],
    });

    res.json({
      users,
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

// Search posts
router.get('/posts', authenticate, async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return res.json({ posts: [], pagination: { page, limit, total: 0, pages: 0 } });
    }

    const searchRegex = new RegExp(query, 'i');

    const posts = await Post.find({ text: searchRegex })
      .populate('user', 'username name profilePhoto')
      .populate('likes', 'username name profilePhoto')
      .populate('comments.user', 'username name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ text: searchRegex });

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

