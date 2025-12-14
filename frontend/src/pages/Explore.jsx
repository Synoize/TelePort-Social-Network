import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import ContentLoader from '../components/ContentLoader';
import { useAuth } from '../context/AuthContext';

const Explore = () => {
  const { PLATFORM_URL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching]
  );

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const response = await axios.get(`/explore?limit=20&page=${page}`);
      
      if (page === 1) {
        setPosts(response.data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(response.data.posts || [])]);
      }
      
      setHasMore((response.data.posts || []).length === 20);
    } catch (error) {
      toast.error('Failed to load explore posts');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <ContentLoader/>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-0 md:px-4 md:py-6">
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <Link
                key={post._id}
                ref={lastPostElementRef}
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
                  <div className="w-full h-full flex items-center justify-center text-gray-400 p-4">
                    <span className="text-xs text-center">{post.text?.substring(0, 100)}...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="font-semibold">❤️ {post.likes?.length || 0}</span>
                  <span className="font-semibold">💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            );
          } else {
            return (
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
                  <div className="w-full h-full flex items-center justify-center text-gray-400 p-4">
                    <span className="text-xs text-center">{post.text?.substring(0, 100)}...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="font-semibold">❤️ {post.likes?.length || 0}</span>
                  <span className="font-semibold">💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            );
          }
        })}
      </div>

      {isFetching && page > 1 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-xs">No more posts to explore</p>
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8 py-16">No posts to explore</div>
      )}
    </div>
  );
};

export default Explore;
