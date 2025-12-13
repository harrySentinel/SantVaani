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
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const CATEGORIES = [
  'All',
  'Daily Wisdom',
  'Bhagavad Gita',
  'Festivals',
  'Stories',
  'Teachings',
  'Meditation',
  'Prayer',
  'Saints',
  'Devotional',
  'General'
];

const SantVaaniSpace = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<SpiritualPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts from backend
  const fetchPosts = async (pageNum: number = 1, category: string = 'All') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/santvaani-space/posts`, {
        params: {
          page: pageNum,
          limit: 10,
          category: category !== 'All' ? category : undefined
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
    fetchPosts(1, selectedCategory);
    setPage(1);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/santvaani-space/${postId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Toaster />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                {language === 'hi' ? 'संतवाणी स्पेस' : 'SantVaani Space'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'hi'
                  ? 'आध्यात्मिक ज्ञान और प्रेरणा'
                  : 'Spiritual Wisdom & Inspiration'}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={language === 'hi' ? 'होम पर जाएं' : 'Go Home'}
            >
              <Home className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex space-x-2 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-600 to-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {language === 'hi'
                ? 'कोई पोस्ट नहीं मिली'
                : 'No posts found'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                  {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                </>
              ) : (
                language === 'hi' ? 'और देखें' : 'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SantVaaniSpace;
