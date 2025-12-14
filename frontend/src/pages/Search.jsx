import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SearchPage = () => {
   const { PLATFORM_URL } = useAuth();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      if (searchType === 'users') {
        const response = await axios.get(`/search/users?q=${encodeURIComponent(query)}`);
        setUsers(response.data.users);
      } else {
        const response = await axios.get(`/search/posts?q=${encodeURIComponent(query)}`);
        setPosts(response.data.posts);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-0 md:px-4 md:py-6">
      <div className="md:bg-white sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4 sm:mt-4">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded bg-white md:bg-gray-50 focus:outline-none focus:border-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary-pink/90 text-white rounded text-sm font-semibold hover:bg-primary-pink"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSearchType('users')}
              className={`px-4 py-1.5 rounded text-sm font-semibold ${
                searchType === 'users'
                  ? 'bg-primary-pink text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setSearchType('posts')}
              className={`px-4 py-1.5 rounded text-sm font-semibold ${
                searchType === 'posts'
                  ? 'bg-primary-pink text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Posts
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-pink"></div>
        </div>
      )}

      {searchType === 'users' && users.length > 0 && (
        <div className="space-y-0">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4 p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <img
                src={
                  user.profilePhoto
                    ? `${PLATFORM_URL}${user.profilePhoto}`
                    : `https://ui-avatars.com/api/?name=${user.username}&background=random`
                }
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{user.name || user.username}</h3>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-700 mt-1 line-clamp-1">{user.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchType === 'posts' && posts.length > 0 && (
        <div className="space-y-0">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))}
        </div>
      )}

      {!loading && query && users.length === 0 && posts.length === 0 && (
        <div className="text-center text-gray-500 mt-8 py-16">No results found</div>
      )}
    </div>
  );
};

export default SearchPage;
