import express from 'express';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get posts for explore page with pagination
router.get('/', authenticate, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Get posts sorted by creation date (newest first) with pagination
    const posts = await Post.find()
      .populate('user', 'username name profilePhoto')
      .populate('likes', 'username name profilePhoto')
      .populate('comments.user', 'username name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform the data to match the expected format
    const transformedPosts = posts.map((post) => ({
      ...post,
      user: post.user,
      likes: post.likes || [],
      comments: (post.comments || []).map((comment) => ({
        ...comment,
        user: comment.user,
      })),
    }));

    res.json({ posts: transformedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
