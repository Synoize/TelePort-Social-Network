# Code Flow Documentation

## Application Flow

### 1. Authentication Flow

**Signup:**
1. User fills signup form (email, username, password)
2. Frontend sends POST request to `/api/auth/signup`
3. Backend validates input, checks for existing user
4. Password is hashed using bcrypt
5. User document created in MongoDB
6. JWT token generated and returned
7. Token stored in localStorage
8. User redirected to feed

**Login:**
1. User enters email and password
2. Frontend sends POST request to `/api/auth/login`
3. Backend finds user by email
4. Password compared using bcrypt
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to feed

**Logout:**
1. Token removed from localStorage
2. User state cleared
3. Redirected to login page

### 2. Profile Management Flow

**View Profile:**
1. User navigates to `/profile/:userId`
2. Frontend fetches user data from `/api/user/:userId`
3. Profile displayed with all information
4. If own profile, "Edit Profile" button shown

**Edit Profile:**
1. User clicks "Edit Profile"
2. Form pre-filled with current data
3. User updates name, bio, skills
4. Changes saved to `/api/user/profile`
5. Profile updated in database
6. User redirected to profile page

**Upload Photos:**
1. User selects image file
2. FormData created with file
3. POST request to `/api/user/profile-photo` or `/api/user/cover-photo`
4. Multer middleware handles file upload
5. File saved to `uploads/` directory
6. File path stored in user document
7. UI updated with new photo

**Work Experience/Education:**
1. User clicks "Add" button
2. Form appears for input
3. Data sent to `/api/user/work-experience` or `/api/user/education`
4. New entry added to user's array
5. List updated in UI
6. Delete button removes entry via DELETE request

### 3. Post Creation Flow

**Create Post:**
1. User types text and/or selects media file
2. FormData created with text and optional media
3. POST request to `/api/posts`
4. Multer middleware handles media upload
5. Post document created in MongoDB
6. Post populated with user data
7. New post added to feed

**Update Post:**
1. User clicks "Edit" on own post
2. Text field becomes editable
3. Changes saved via PUT `/api/posts/:postId`
4. Post updated in database
5. UI updated with new text

**Delete Post:**
1. User clicks "Delete" on own post
2. Confirmation dialog shown
3. DELETE request to `/api/posts/:postId`
4. Post removed from database
5. Post removed from UI

### 4. Like/Comment Flow

**Like Post:**
1. User clicks like button
2. POST request to `/api/posts/:postId/like`
3. Backend checks if user already liked
4. If liked, remove from likes array
5. If not liked, add to likes array
6. Updated likes count returned
7. UI updated with new like state

**Comment on Post:**
1. User types comment and submits
2. POST request to `/api/posts/:postId/comment`
3. Comment added to post's comments array
4. Comment populated with user data
5. New comment displayed in UI

### 5. Feed Flow

**Load Feed:**
1. User navigates to `/feed`
2. Frontend fetches posts from `/api/feed?page=1&limit=10`
3. Backend gets current user's following list
4. Posts from followed users (and own posts) fetched
5. Posts sorted by creation date (newest first)
6. Posts displayed in feed

**Infinite Scroll:**
1. Intersection Observer watches last post
2. When last post visible, next page loaded
3. New posts appended to existing list
4. Continues until no more posts

### 6. Follow System Flow

**Follow User:**
1. User clicks "Follow" on another user's profile
2. POST request to `/api/follow/:userId`
3. Backend adds userId to current user's following array
4. Backend adds current user to target user's followers array
5. Both users updated in database
6. Button changes to "Unfollow"
7. Followers count updated

**Unfollow User:**
1. User clicks "Unfollow"
2. DELETE request to `/api/follow/:userId`
3. User removed from both arrays
4. Button changes to "Follow"
5. Followers count updated

### 7. Search Flow

**Search Users:**
1. User enters search query
2. Selects "Users" tab
3. GET request to `/api/search/users?q=query`
4. Backend searches users by name/username/email
5. Results returned with pagination
6. Users displayed in list
7. Clicking user navigates to their profile

**Search Posts:**
1. User enters search query
2. Selects "Posts" tab
3. GET request to `/api/search/posts?q=query`
4. Backend searches posts by text content
5. Results returned with pagination
6. Posts displayed using PostCard component

### 8. Explore Flow

**Load Explore:**
1. User navigates to `/explore`
2. GET request to `/api/explore?limit=20`
3. Backend uses MongoDB aggregation to get random posts
4. Posts populated with user data
5. Posts displayed in grid layout
6. Each post shows media preview and basic info

## Data Models

### User Model
```javascript
{
  email: String (unique, required)
  username: String (unique, required)
  password: String (hashed, required)
  name: String
  bio: String (max 500 chars)
  skills: [String]
  profilePhoto: String (URL)
  coverPhoto: String (URL)
  workExperience: [{
    company: String
    position: String
    startDate: Date
    endDate: Date
    current: Boolean
    description: String
  }]
  education: [{
    school: String
    degree: String
    field: String
    startDate: Date
    endDate: Date
    current: Boolean
  }]
  followers: [ObjectId] (ref: User)
  following: [ObjectId] (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```javascript
{
  user: ObjectId (ref: User, required)
  text: String (max 2000 chars)
  media: String (URL)
  mediaType: String (enum: 'image', 'video', '')
  likes: [ObjectId] (ref: User)
  comments: [{
    user: ObjectId (ref: User)
    text: String (max 1000 chars)
    createdAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing**: All passwords hashed using bcrypt before storage
2. **JWT Authentication**: Protected routes require valid JWT token
3. **Input Validation**: Express-validator used for request validation
4. **File Upload Limits**: Multer configured with file size and type limits
5. **Authorization Checks**: Users can only edit/delete their own posts

## Tools Used

### Backend Tools
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation/verification
- **multer**: File upload handling
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing

### Frontend Tools
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **TailwindCSS**: Utility-first CSS framework
- **Sonner**: Toast notifications
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

## State Management

- **AuthContext**: Global authentication state
  - User data
  - Login/logout functions
  - Token management

- **Component State**: Local state for:
  - Form inputs
  - UI toggles (menus, modals)
  - Loading states
  - Post lists

## API Communication

- Axios configured with base URL
- Interceptor adds JWT token to all requests
- Error handling with toast notifications
- Loading states for better UX

