import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { Image, Video, X } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const { user, PLATFORM_URL } = useAuth();
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media) {
      toast.error('Please add text or media');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (media) {
        formData.append('media', media);
      }

      const response = await axios.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Post created!');
      setText('');
      setMedia(null);
      setMediaPreview(null);
      onPostCreated(response.data.post);
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sm:border sm:border-gray-200 sm:rounded-lg sm:mb-4">
      <div className="px-4 py-3">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-3">
            <img
              src={
                user?.profilePhoto
                  ? `${PLATFORM_URL}${user.profilePhoto}`
                  : `https://ui-avatars.com/api/?name=${user?.username}&background=random`
              }
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                maxLength={2000}
                className="w-full text-sm focus:outline-none resize-none placeholder:text-gray-400"
              />

              {mediaPreview && (
                <div className="mt-3 relative rounded-lg overflow-hidden">
                  {mediaPreview.startsWith('data:video') ? (
                    <video src={mediaPreview} controls className="w-full max-h-64" />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMedia(null);
                      setMediaPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex gap-4">
                  <label className="cursor-pointer text-gray-600 hover:text-black transition-colors">
                    <Image className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>
                  <label className="cursor-pointer text-gray-600 hover:text-black transition-colors">
                    <Video className="w-5 h-5" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !media)}
                  className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2] disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
