# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Routes

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "name": ""
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "name": "",
    "profilePhoto": ""
  }
}
```

### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "name": "User Name",
    "bio": "User bio",
    "skills": ["Skill1", "Skill2"],
    "profilePhoto": "/uploads/photo.jpg",
    "coverPhoto": "/uploads/cover.jpg",
    "followers": [],
    "following": []
  }
}
```

## User Routes

### GET /user/:userId
Get user profile by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "username": "username",
    "name": "User Name",
    "bio": "User bio",
    "skills": ["Skill1"],
    "profilePhoto": "/uploads/photo.jpg",
    "coverPhoto": "/uploads/cover.jpg",
    "workExperience": [],
    "education": [],
    "followers": [],
    "following": []
  }
}
```

### PUT /user/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "skills": ["Skill1", "Skill2"]
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### POST /user/profile-photo
Upload profile photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `photo`: Image file

**Response:**
```json
{
  "message": "Profile photo uploaded successfully",
  "user": { ... }
}
```

### POST /user/cover-photo
Upload cover photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `photo`: Image file

**Response:**
```json
{
  "message": "Cover photo uploaded successfully",
  "user": { ... }
}
```

### POST /user/work-experience
Add work experience.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "company": "Company Name",
  "position": "Position",
  "startDate": "2020-01-01",
  "endDate": "2022-12-31",
  "current": false,
  "description": "Job description"
}
```

### PUT /user/work-experience/:expId
Update work experience.

### DELETE /user/work-experience/:expId
Delete work experience.

### POST /user/education
Add education.

**Request Body:**
```json
{
  "school": "School Name",
  "degree": "Degree",
  "field": "Field of Study",
  "startDate": "2016-01-01",
  "endDate": "2020-12-31",
  "current": false
}
```

### PUT /user/education/:eduId
Update education.

### DELETE /user/education/:eduId
Delete education.

## Post Routes

### POST /posts
Create a new post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `text`: Post text (optional)
- `media`: Image or video file (optional)

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "post_id",
    "user": { ... },
    "text": "Post text",
    "media": "/uploads/media.jpg",
    "mediaType": "image",
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /posts/:postId
Get single post by ID.

### PUT /posts/:postId
Update own post.

**Request Body:**
```json
{
  "text": "Updated text"
}
```

### DELETE /posts/:postId
Delete own post.

### POST /posts/:postId/like
Like or unlike a post.

**Response:**
```json
{
  "message": "Post liked",
  "liked": true,
  "likesCount": 5
}
```

### POST /posts/:postId/comment
Add comment to post.

**Request Body:**
```json
{
  "text": "Comment text"
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "comment_id",
    "user": { ... },
    "text": "Comment text",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "commentsCount": 3
}
```

## Feed Routes

### GET /feed
Get feed posts from followed users.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

**Response:**
```json
{
  "posts": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Follow Routes

### POST /follow/:userId
Follow a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User followed successfully"
}
```

### DELETE /follow/:userId
Unfollow a user.

### GET /follow/:userId/followers
Get user's followers list.

### GET /follow/:userId/following
Get user's following list.

## Search Routes

### GET /search/users
Search users by name/username.

**Query Parameters:**
- `q`: Search query
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response:**
```json
{
  "users": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "pages": 2
  }
}
```

### GET /search/posts
Search posts by text.

**Query Parameters:**
- `q`: Search query
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response:**
```json
{
  "posts": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

## Explore Routes

### GET /explore
Get random posts for explore page.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit`: Number of posts (default: 20)

**Response:**
```json
{
  "posts": [ ... ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

