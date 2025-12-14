import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import feedRoutes from './routes/feed.js';
import followRoutes from './routes/follow.js';
import searchRoutes from './routes/search.js';
import exploreRoutes from './routes/explore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const clorsOption = {
    origin: ["http://localhost:5173", "https://teleport-social-network.vercel.app"],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

// Middleware
app.use(cors(clorsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/explore', exploreRoutes);

// test server
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Connect to MongoDB
console.log('Database Connecting...');
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telePort')
  .then(() => {
    console.log('Database Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export default app;

