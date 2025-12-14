import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Home } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import PostCard from '@/components/santvaani-space/PostCard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface SpiritualPost {
  id: string;
  title: string;
  title_hi: string | null;
  content: string;
  content_hi: string | null;
  image_url: string | null;
  profile_photo_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// Categories removed - this is now a personal spiritual social feed

const SantVaaniSpace = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<SpiritualPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from backend
  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/santvaani-space/posts`, {
        params: {
          page: pageNum,
          limit: 10
        }
      });

      const { posts: newPosts, totalPages } = response.data;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(pageNum < totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'पोस्ट लोड करने में विफल' : 'Failed to load posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/santvaani-space/${postId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchPosts(1, selectedCategory)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
          >
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />

      {/* Premium Header - Modern & Clean with Blur Effect */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
                title={language === 'hi' ? 'होम पर जाएं' : 'Go Home'}
              >
                <Home className="h-5 w-5 text-gray-700" />
              </button>

              <h1 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {language === 'hi' ? 'संतवाणी स्पेस' : 'Santvaani Space'}
                </span>
              </h1>
            </div>

            {/* Subtitle on larger screens */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-sm text-gray-600 font-medium">
                {language === 'hi' ? 'आध्यात्मिक सोशल फीड' : 'Spiritual Social Feed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed - Clean & Centered */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100">
            <div className="text-8xl mb-8 animate-bounce">🌸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {language === 'hi' ? 'कोई पोस्ट नहीं' : 'No Posts Yet'}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {language === 'hi'
                ? 'जल्द ही आध्यात्मिक सामग्री आ रही है'
                : 'Spiritual content coming soon'}
            </p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100 to-purple-100 rounded-full">
              <p className="text-sm text-gray-700 font-medium">
                {language === 'hi' ? 'शांति से प्रतीक्षा करें' : 'Stay peaceful, stay connected'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.id)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="group relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-12 py-4 rounded-full font-bold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                    {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                  </>
                ) : (
                  language === 'hi' ? 'और देखें' : 'Load More'
                )}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}

        {/* Footer Message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-12 py-10 bg-white/60 backdrop-blur-sm rounded-2xl">
            <div className="text-5xl mb-4 animate-pulse">🙏</div>
            <p className="text-gray-600 font-medium">
              {language === 'hi'
                ? 'आपने सभी पोस्ट देख लिए हैं'
                : "You've reached the end"}
            </p>
            <p className="text-orange-500 text-sm mt-2 font-semibold">
              {language === 'hi' ? 'शांति बनी रहे' : 'Stay blessed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SantVaaniSpace;
