import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Home, Filter } from 'lucide-react';
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
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
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
    setShowCategoryFilter(false);
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-purple-50">
      <Toaster />

      {/* Beautiful Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-orange-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 mb-3 shadow-lg">
              <span className="text-white text-3xl">🕉️</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                {language === 'hi' ? 'संतवाणी स्पेस' : 'SantVaani Space'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm md:text-base mb-4">
              {language === 'hi'
                ? 'आध्यात्मिक ज्ञान, प्रेरणा और शांति का स्रोत'
                : 'Your daily source of spiritual wisdom, inspiration & peace'}
            </p>

            {/* Actions Row */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                title={language === 'hi' ? 'होम पर जाएं' : 'Go Home'}
              >
                <Home className="h-5 w-5 text-gray-600" />
              </button>

              {/* Category Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-orange-500 hover:bg-orange-50 transition-colors text-sm"
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">
                    {selectedCategory === 'All'
                      ? (language === 'hi' ? 'सभी' : 'All')
                      : selectedCategory
                    }
                  </span>
                </button>

                {/* Dropdown */}
                {showCategoryFilter && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-50">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed - Clean & Centered */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="text-7xl mb-6">🌸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'hi' ? 'कोई पोस्ट नहीं' : 'No Posts Yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'hi'
                ? 'जल्द ही आध्यात्मिक सामग्री आ रही है'
                : 'Spiritual content coming soon'}
            </p>
            <div className="text-sm text-gray-400">
              {language === 'hi' ? 'शांति से प्रतीक्षा करें' : 'Stay peaceful, stay connected'}
            </div>
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
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-10 py-3 rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

        {/* Footer Message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-10 py-8">
            <div className="text-4xl mb-3">🙏</div>
            <p className="text-gray-500 text-sm">
              {language === 'hi'
                ? 'आपने सभी पोस्ट देख लिए हैं • शांति बनी रहे'
                : "You've reached the end • Stay blessed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SantVaaniSpace;
