import express from 'express';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import multer from 'multer';

const router = express.Router();

// Create post
router.post('/', authenticate, upload.single('media'), async (req, res, next) => {
  try {
    const { text } = req.body;
    let media = '';
    let mediaType = '';

    if (req.file) {
      media = `/uploads/${req.file.filename}`;
      const ext = req.file.mimetype.split('/')[0];
      mediaType = ext === 'image' ? 'image' : 'video';
    }

    const post = new Post({
      user: req.user._id,
      text: text || '',
      media,
      mediaType,
    });

    await post.save();
    await post.populate('user', 'username name profilePhoto');

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum size is 10MB' });
      }
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get posts by user
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username name profilePhoto')
      .populate('likes', 'username name profilePhoto')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user', 'username name profilePhoto')
      .populate('likes', 'username name profilePhoto')
      .populate('comments.user', 'username name profilePhoto')
      .sort({ createdAt: -1 });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update post
router.put('/:postId', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.text = text || post.text;
    await post.save();
    await post.populate('user', 'username name profilePhoto');

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike post
router.post('/:postId/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ message: 'Post unliked', liked: false, likesCount: post.likes.length });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      res.json({ message: 'Post liked', liked: true, likesCount: post.likes.length });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Comment on post
router.post('/:postId/comment', authenticate, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();
    await post.populate('comments.user', 'username name profilePhoto');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

