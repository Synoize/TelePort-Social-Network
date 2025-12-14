import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();
  const loadingRef = useRef();

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

  const loadingElementRef = useCallback(
    (node) => {
      if (loadingRef.current) loadingRef.current.disconnect();
      loadingRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching && page > 1) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.1 }
      );
      if (node) loadingRef.current.observe(node);
    },
    [hasMore, isFetching, page]
  );

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      const response = await axios.get(`/feed?page=${page}&limit=10`);
      
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts((prev) => [...prev, ...response.data.posts]);
      }
      
      setHasMore(response.data.posts.length === 10);
    } catch (error) {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="px-0 md:px-4 md:py-6">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      <div className="space-y-0">
        {posts.length === 0 && !loading && (
          <div className="text-center py-16 bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4">
            <p className="text-gray-500 text-sm">No posts yet. Follow users to see their posts!</p>
          </div>
        )}
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div key={post._id} ref={lastPostElementRef}>
                <PostCard
                  post={post}
                  onPostDeleted={handlePostDeleted}
                  onPostUpdated={handlePostUpdated}
                />
              </div>
            );
          } else {
            return (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            );
          }
        })}
      </div>

      {isFetching && page > 1 && (
        <div ref={loadingElementRef} className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-xs">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
