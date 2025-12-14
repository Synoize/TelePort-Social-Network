# TelePort - Social Network Application

A full-stack social networking application combining LinkedIn-style professional profiles with Instagram-style media posts.

## 🛠 Tech Stack

- **Frontend**: React.js, TailwindCSS, Sonner, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## 📁 Project Structure

```
atives-world/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── feed.js
│   │   ├── follow.js
│   │   ├── search.js
│   │   └── explore.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── PostCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Feed.jsx
    |   |   ├── ViewPosts.jsx
    │   │   ├── Profile.jsx
    │   │   ├── EditProfile.jsx
    │   │   ├── Explore.jsx
    │   │   └── Search.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/atives-world
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📌 Features

### Authentication
- ✅ User Signup (email, username, password)
- ✅ Login using JWT
- ✅ Logout

### User Profile
- ✅ View & Edit profile
- ✅ Name, Username, Bio, Skills
- ✅ Upload profile photo & cover photo
- ✅ Manage Work Experience (Add/Update/Delete)
- ✅ Manage Education (Add/Update/Delete)

### Posts
- ✅ Create post (text + optional image/video)
- ✅ Update and Delete own posts
- ✅ Like/Unlike posts
- ✅ Comment on posts

### Feed
- ✅ Show posts from followed users
- ✅ Infinite scroll pagination
- ✅ Display likes & comments count

### Follow System
- ✅ Follow / Unfollow users
- ✅ View followers list

### Search
- ✅ Search users by name/username
- ✅ Search posts by text/caption

### Explore Page
- ✅ Grid layout
- ✅ Show random posts

## 📡 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoints.

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

Make sure to set environment variables in your deployment platform.

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

## 🔒 Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

### Frontend
- `VITE_API_URL`: Backend API URL

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as an assignment project.

