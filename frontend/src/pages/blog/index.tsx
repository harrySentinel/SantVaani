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

const BlogIndex: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const { t } = useLanguage();
  const { trackVisitorCounter } = useSpiritualTracking();

  // Curated spiritual wisdom articles
  const spiritualPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'finding-inner-peace-through-meditation',
      title: 'Finding Inner Peace Through Meditation',
      excerpt: 'Discover simple meditation practices that bring calmness to your daily life and help you connect with your inner self.',
      content: '# Finding Inner Peace Through Meditation\n\nMeditation...',
      category: { id: 'meditation', name: 'Meditation', slug: 'meditation', icon: '🧘', color: '#f97316' },
      tags: ['meditation', 'peace', 'mindfulness'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Sharing spiritual wisdom with love',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-28',
      readingTime: 5,
      featured: true,
      status: 'published',
      spiritualQuotes: ['Peace comes from within'],
      relatedSaints: ['Buddha'],
      viewCount: 1247,
      shareCount: 45
    },
    {
      id: '2',
      slug: 'path-of-devotion-bhakti',
      title: 'The Path of Devotion and Love',
      excerpt: 'Explore the beautiful journey of bhakti - how love and devotion can transform your spiritual life.',
      content: '# The Path of Devotion and Love\n\nBhakti...',
      category: { id: 'wisdom', name: 'Spiritual Wisdom', slug: 'wisdom', icon: '💫', color: '#ea580c' },
      tags: ['bhakti', 'devotion', 'love'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Sharing spiritual wisdom with love',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-25',
      readingTime: 7,
      featured: true,
      status: 'published',
      spiritualQuotes: ['Love is the bridge between hearts'],
      relatedSaints: ['Meera Bai'],
      viewCount: 892,
      shareCount: 32
    },
    {
      id: '3',
      slug: 'simple-daily-prayers',
      title: 'Simple Daily Prayers for Peace',
      excerpt: 'Learn gentle prayers and mantras that can bring serenity and gratitude to your everyday moments.',
      content: '# Simple Daily Prayers for Peace\n\nDaily prayers...',
      category: { id: 'practice', name: 'Daily Practice', slug: 'practice', icon: '🙏', color: '#fb923c' },
      tags: ['prayer', 'mantras', 'daily practice'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Sharing spiritual wisdom with love',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-20',
      readingTime: 4,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Prayer is the key to inner peace'],
      relatedSaints: ['Sant Tulsidas'],
      viewCount: 654,
      shareCount: 28
    }
  ];

  useEffect(() => {
    // Load curated spiritual wisdom
    setTimeout(() => {
      setPosts(spiritualPosts.slice(0, 3)); // Show only 3 peaceful articles
      setIsLoading(false);
    }, 500);
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
                <div className="h-40 bg-gradient-to-br from-orange-50 to-orange-100 rounded-t-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-orange-400" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.readingTime} min read</span>
                    <span className="text-orange-400">🕉️</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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