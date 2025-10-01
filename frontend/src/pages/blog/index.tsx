// Spiritual Wisdom - SantVaani
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/blog/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Heart, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualTracking } from '@/hooks/useAnalytics';
import { blogService } from '@/services/blogService';

const BlogIndex: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLanguage();
  const { trackVisitorCounter } = useSpiritualTracking();

  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await blogService.getPosts({ limit: 3 });

      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.error || 'Failed to load blog posts');
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Track page view
  useEffect(() => {
    trackVisitorCounter && trackVisitorCounter(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <SEOHead
        title="Spiritual Wisdom | SantVaani - Ancient Teachings for Inner Peace"
        description="Find peace and guidance through timeless spiritual teachings. Discover meditation, devotion, and daily practices for a more peaceful and meaningful life."
        keywords={['spiritual wisdom', 'meditation', 'inner peace', 'bhakti', 'devotion', 'daily prayers', 'spiritual guidance', 'ancient teachings']}
        canonicalUrl="https://santvaani.com/blog"
      />
      <Navbar />

      {/* Peaceful Hero Section */}
      <section className="py-16 bg-gradient-to-br from-white via-orange-25 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <span className="text-4xl animate-pulse">🕉️</span>
              <Heart className="w-6 h-6 text-orange-400 animate-pulse" />
              <span className="text-4xl animate-pulse">📿</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-6 text-gray-800">
              Spiritual Wisdom
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Find peace through ancient teachings. Simple wisdom for a calmer, more meaningful life.
            </p>
          </div>
        </div>
      </section>

      {/* Simple, Clean Articles Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            Timeless Teachings
          </h2>
          <div className="w-16 h-0.5 bg-orange-300 mx-auto mb-6"></div>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Discover profound wisdom from ancient traditions that brings peace to modern life
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-sm">
                <div className="h-40 bg-gray-100 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-100 rounded mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Unable to load posts</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchBlogPosts}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
                <div className="h-40 rounded-t-lg flex items-center justify-center" style={{ backgroundColor: post.category?.color + '20' || '#fb923c20' }}>
                  <span className="text-3xl">{post.category?.icon || '💫'}</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: post.category?.color + '20', color: post.category?.color }}>
                      {post.category?.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.readingTime} min read</span>
                    <div className="flex items-center space-x-2">
                      <span>{post.viewCount} views</span>
                      <span className="text-orange-400">🕉️</span>
                    </div>
                  </div>
                  {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs italic text-gray-500 line-clamp-1">
                        "{post.spiritualQuotes[0]}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts available</h3>
            <p className="text-gray-500">Check back soon for new spiritual wisdom</p>
          </div>
        )}

        {/* Peaceful call-to-action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-white via-orange-25 to-white rounded-2xl p-8 border border-orange-100">
            <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-gray-800 mb-3">
              Continue Your Journey
            </h3>
            <p className="text-gray-600 mb-6 font-light">
              Explore more wisdom on our spiritual platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/saints" className="inline-flex items-center justify-center px-6 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-colors text-sm font-light">
                Meet the Saints
              </Link>
              <Link to="/bhajans" className="inline-flex items-center justify-center px-6 py-2 border border-orange-400 text-orange-600 rounded-full hover:bg-orange-50 transition-colors text-sm font-light">
                Listen to Bhajans
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogIndex;