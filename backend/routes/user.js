import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Get user profile
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'username name profilePhoto')
      .populate('following', 'username name profilePhoto');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile photo
router.post(
  '/profile-photo',
  authenticate,
  upload.single('photo'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const photoUrl = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: photoUrl },
        { new: true }
      ).select('-password');

      res.json({ message: 'Profile photo uploaded successfully', user });
    } catch (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 10MB' });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// Upload cover photo
router.post(
  '/cover-photo',
  authenticate,
  upload.single('photo'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const photoUrl = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { coverPhoto: photoUrl },
        { new: true }
      ).select('-password');

      res.json({ message: 'Cover photo uploaded successfully', user });
    } catch (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 10MB' });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// Add work experience
router.post('/work-experience', authenticate, async (req, res) => {
  try {
    const { company, position, startDate, endDate, current, description } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          workExperience: {
            company,
            position,
            startDate,
            endDate,
            current: current || false,
            description,
          },
        },
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Work experience added successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update work experience
router.put('/work-experience/:expId', authenticate, async (req, res) => {
  try {
    const { company, position, startDate, endDate, current, description } = req.body;

    const user = await User.findById(req.user._id);
    const experience = user.workExperience.id(req.params.expId);

    if (!experience) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    Object.assign(experience, {
      company,
      position,
      startDate,
      endDate,
      current: current || false,
      description,
    });

    await user.save();

    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json({ message: 'Work experience updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete work experience
router.delete('/work-experience/:expId', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { workExperience: { _id: req.params.expId } },
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Work experience deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add education
router.post('/education', authenticate, async (req, res) => {
  try {
    const { school, degree, field, startDate, endDate, current } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          education: {
            school,
            degree,
            field,
            startDate,
            endDate,
            current: current || false,
          },
        },
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Education added successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update education
router.put('/education/:eduId', authenticate, async (req, res) => {
  try {
    const { school, degree, field, startDate, endDate, current } = req.body;

    const user = await User.findById(req.user._id);
    const education = user.education.id(req.params.eduId);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    Object.assign(education, {
      school,
      degree,
      field,
      startDate,
      endDate,
      current: current || false,
    });

    await user.save();

    const updatedUser = await User.findById(req.user._id).select('-password');
    res.json({ message: 'Education updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete education
router.delete('/education/:eduId', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { education: { _id: req.params.eduId } },
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Education deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

