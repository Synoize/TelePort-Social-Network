import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { UserPlus, UserMinus, Grid3x3, Settings } from 'lucide-react';
import PostCard from '../components/PostCard.jsx';
import ContentLoader from '../components/ContentLoader.jsx';
import ConfirmLogout from '../components/ConfirmLogout.jsx';

const Profile = () => {
  const { userId } = useParams();
  const { user, fetchUser, PLATFORM_URL } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    if (profileUser && user) {
      setIsFollowing(
        user.following?.some((_id) => _id.toString() === profileUser._id.toString())
      );
    }
  }, [profileUser, user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/user/${userId}`);
      setProfileUser(response.data.user);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/posts/user/${userId}`);
      setUserPosts(response.data.posts || []);
    } catch (error) {
      // If endpoint doesn't exist, we'll handle it gracefully
      setUserPosts([]);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/follow/${userId}`);
        toast.success('Unfollowed');
      } else {
        await axios.post(`/follow/${userId}`);
        toast.success('Followed');
      }
      setIsFollowing(!isFollowing);
      fetchProfile();
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader />
      </div>
    );
  }

  if (!profileUser) {
    return <div className="text-center mt-8 text-gray-500">User not found</div>;
  }

  const isOwnProfile = user?._id === profileUser._id;

  return (
    <div className="max-w-4xl mx-auto w-full px-0 md:px-4 md:py-6">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4 sm:mt-4">
        <div className="px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <img
                src={
                  profileUser?.profilePhoto
                    ? `${PLATFORM_URL}${profileUser.profilePhoto}`
                    : `https://ui-avatars.com/api/?name=${profileUser.username}&background=random`
                }
                alt={profileUser.username}
                className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-light">{profileUser.username}</h1>
                <div className='w-full flex justify-center md:justify-end items-center gap-4'>
                  <div className="flex gap-2">
                    {!isOwnProfile ? (
                      <button
                        onClick={handleFollow}
                        className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors flex items-center gap-2 ${isFollowing
                          ? 'bg-gray-200 text-black hover:bg-gray-300'
                          : 'bg-[#0095f6] text-white hover:bg-[#1877f2]'
                          }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        to="/edit-profile"
                        className="px-4 py-1.5 rounded text-sm font-semibold border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-nowrap"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setConfirmLogout(true);
                    }}
                    className="px-4 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Logout
                  </button>
                </div>
                {confirmLogout && <ConfirmLogout trigger={{ setConfirmLogout }} />}
              </div>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-6 sm:gap-8 mb-4">
                <div className="text-center sm:text-left">
                  <span className="font-semibold block">{userPosts.length}</span>
                  <span className="text-gray-500 text-sm">posts</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-semibold block">{profileUser.followers?.length || 0}</span>
                  <span className="text-gray-500 text-sm">followers</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-semibold block">{profileUser.following?.length || 0}</span>
                  <span className="text-gray-500 text-sm">following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-center sm:text-left">
                {profileUser.name && (
                  <p className="font-semibold text-sm mb-1">{profileUser.name}</p>
                )}
                {profileUser.bio && (
                  <p className="text-sm text-gray-900 mb-2">{profileUser.bio}</p>
                )}
                {profileUser.skills && profileUser.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                    {profileUser.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4">
        <div className="flex justify-center border-t border-gray-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold border-t-2 transition-colors ${activeTab === 'posts'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
              }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="hidden sm:inline">POSTS</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="aspect-square bg-gray-100 relative group overflow-hidden"
              >
                {post.media ? (
                  post.mediaType === 'image' ? (
                    <img
                      src={`${PLATFORM_URL}${post.media}`}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <video
                        src={`${PLATFORM_URL}${post.media}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs">{post.text?.substring(0, 50)}...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="font-semibold">❤️ {post.likes?.length || 0}</span>
                  <span className="font-semibold">💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-gray-500 text-sm">
              No posts yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
