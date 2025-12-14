import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { Heart, MessageCircle, MoreVertical, Trash2, Edit, Send, Bookmark } from 'lucide-react';

const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user, PLATFORM_URL } = useAuth();

  const [isLiked, setIsLiked] = useState(
    post.likes?.some((like) => like._id?.toString() === user?._id?.toString()) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const isOwnPost = user?._id?.toString() === post.user?._id?.toString();

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setComments([...comments, response.data.comment]);
      setCommentText('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/posts/${post._id}`);
      toast.success('Post deleted!');
      onPostDeleted(post._id);
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/posts/${post._id}`, { text: editText });
      toast.success('Post updated!');
      setIsEditing(false);
      onPostUpdated(response.data.post);
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user?._id}`}>
            <img
              src={
                post.user?.profilePhoto
                  ? `${PLATFORM_URL}${post.user.profilePhoto}`
                  : `https://ui-avatars.com/api/?name=${post.user?.username}&background=random`
              }
              alt={post.user?.username}
              className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-gray-200 hover:ring-gray-300 transition-all"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.user?._id}`}
              className="font-semibold text-sm text-black hover:opacity-70 block"
            >
              {post.user?.username}
            </Link>
            {post.user?.name && post.user.name !== post.user.username && (
              <p className="text-xs text-gray-500">{post.user.name}</p>
            )}
          </div>
        </div>

        {isOwnPost && (
          <div className="relative menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:opacity-70"
            >
              <MoreVertical className="w-5 h-5 text-black" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && (
        <div className="w-full">
          {post.mediaType === 'image' ? (
            <img
              src={`${PLATFORM_URL}${post.media}`}
              alt="Post"
              className="w-full object-cover"
            />
          ) : (
            <video
              src={`${PLATFORM_URL}${post.media}`}
              controls
              className="w-full"
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`transition-transform active:scale-95 ${
                isLiked ? 'text-red-500' : 'text-black'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-black transition-transform active:scale-95"
            >
              <MessageCircle className={`w-6 h-6 ${showComments ? 'fill-current' : ''}`} />
            </button>
            <button className="text-black transition-transform active:scale-95">
              <Send className="w-6 h-6 rotate-12" />
            </button>
          </div>
          <button className="text-black transition-transform active:scale-95">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <p className="text-sm font-semibold mb-1">{likesCount.toLocaleString()} likes</p>
        )}

        {/* Caption */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full px-0 py-2 border-b border-gray-300 focus:outline-none focus:border-black resize-none text-sm"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(post.text);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          post.text && (
            <div className="mb-1">
              <span className="text-sm">
                <Link
                  to={`/profile/${post.user?._id}`}
                  className="font-semibold text-black hover:opacity-70"
                >
                  {post.user?.username}
                </Link>{' '}
                <span className="text-black">{post.text}</span>
              </span>
            </div>
          )
        )}

        {/* View Comments */}
        {comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-gray-500 mb-2 hover:text-gray-700"
          >
            View all {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-gray-400 uppercase mt-1 mb-2">
          {formatTime(post.createdAt)}
        </p>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
            {comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Link to={`/profile/${comment.user?._id}`}>
                  <img
                    src={
                      comment.user?.profilePhoto
                        ? `${PLATFORM_URL}${comment.user.profilePhoto}`
                        : `https://ui-avatars.com/api/?name=${comment.user?.username}&background=random`
                    }
                    alt={comment.user?.username}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                </Link>
                <div className="flex-1">
                  <p className="text-sm">
                    <Link
                      to={`/profile/${comment.user?._id}`}
                      className="font-semibold text-black hover:opacity-70"
                    >
                      {comment.user?.username}
                    </Link>{' '}
                    <span className="text-black">{comment.text}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatTime(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-sm focus:outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="text-sm font-semibold text-[#0095f6] disabled:text-[#b2dffc] disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
