// Main Blog Page for SantVaani Spiritual Wisdom
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/blog/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, TrendingUp, Clock, Users, Sparkles } from 'lucide-react';
import { BlogPost, BlogCategory } from '@/types/blog';
import { blogCategories } from '@/data/blog/categories';
import { sampleBlogPosts, getFeaturedPosts } from '@/data/blog/posts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualTracking } from '@/hooks/useAnalytics';

const BlogIndex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useLanguage();
  const { trackSearch } = useSpiritualTracking();

  // Sample blog posts (In production, fetch from API/database)
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      slug: 'finding-inner-peace-through-meditation',
      title: 'Finding Inner Peace Through Ancient Meditation Techniques',
      excerpt: 'Discover timeless meditation practices that have guided spiritual seekers for thousands of years. Learn how to calm your mind and find lasting peace.',
      content: '# Finding Inner Peace Through Ancient Meditation Techniques\n\nMeditation has been...',
      category: blogCategories[2], // Meditation & Practices
      tags: ['meditation', 'inner peace', 'mindfulness', 'spiritual practice'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-28',
      readingTime: 8,
      featured: true,
      status: 'published',
      spiritualQuotes: ['Peace comes from within. Do not seek it without.'],
      relatedSaints: ['Buddha', 'Patanjali'],
      viewCount: 2547,
      shareCount: 89,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '2',
      slug: 'lord-rams-teachings-modern-life',
      title: 'Lord Ram\'s Teachings for Modern Life Challenges',
      excerpt: 'Explore how the timeless wisdom of Lord Ram can guide us through contemporary challenges and moral dilemmas.',
      content: '# Lord Ram\'s Teachings for Modern Life Challenges\n\nLord Ram\'s life...',
      category: blogCategories[0], // Spiritual Wisdom
      tags: ['lord ram', 'dharma', 'righteousness', 'moral guidance'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-25',
      readingTime: 12,
      featured: true,
      status: 'published',
      spiritualQuotes: ['Dharma is the foundation of all righteous living.'],
      relatedSaints: ['Lord Ram', 'Valmiki'],
      viewCount: 3421,
      shareCount: 156,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '3',
      slug: 'diwali-spiritual-significance-celebration',
      title: 'Diwali: Beyond Lights - Understanding the Spiritual Significance',
      excerpt: 'Discover the deeper spiritual meaning behind Diwali celebrations and how to connect with its transformative energy.',
      content: '# Diwali: Beyond Lights - Understanding the Spiritual Significance\n\nDiwali...',
      category: blogCategories[3], // Festival Guides
      tags: ['diwali', 'festivals', 'light', 'spiritual celebration'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-20',
      readingTime: 10,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Light dispels darkness, knowledge dispels ignorance.'],
      relatedSaints: ['Lakshmi', 'Ganesha'],
      viewCount: 1893,
      shareCount: 67,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '4',
      slug: 'krishna-wisdom-relationships-love',
      title: 'Krishna\'s Wisdom on Relationships and Divine Love',
      excerpt: 'Learn from Lord Krishna\'s teachings about love, relationships, and the path to spiritual connection.',
      content: '# Krishna\'s Wisdom on Relationships and Divine Love\n\nLord Krishna...',
      category: blogCategories[0], // Spiritual Wisdom
      tags: ['lord krishna', 'love', 'relationships', 'bhakti'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-15',
      readingTime: 9,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Where there is love, there is life.'],
      relatedSaints: ['Lord Krishna', 'Radha'],
      viewCount: 2156,
      shareCount: 94,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '5',
      slug: 'daily-spiritual-practices-busy-lifestyle',
      title: 'Daily Spiritual Practices for the Busy Modern Lifestyle',
      excerpt: 'Simple yet powerful spiritual practices that can easily fit into your busy daily routine.',
      content: '# Daily Spiritual Practices for the Busy Modern Lifestyle\n\nIn today\'s...',
      category: blogCategories[1], // Daily Guidance
      tags: ['daily practice', 'modern spirituality', 'busy lifestyle', 'spiritual routine'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-10',
      readingTime: 6,
      featured: false,
      status: 'published',
      spiritualQuotes: ['A little progress each day adds up to big results.'],
      relatedSaints: ['Swami Vivekananda'],
      viewCount: 1745,
      shareCount: 52,
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(sampleBlogPosts);
      setFeaturedPosts(getFeaturedPosts());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      trackSearch(query, posts.length);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || post.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const stats = [
    { icon: BookOpen, label: 'Articles', value: '50+', color: 'text-blue-600' },
    { icon: Users, label: 'Readers', value: '10K+', color: 'text-green-600' },
    { icon: Clock, label: 'Reading Time', value: '5-15 min', color: 'text-purple-600' },
    { icon: Sparkles, label: 'Categories', value: '8', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <SEOHead
        title="Spiritual Wisdom Blog | SantVaani - Ancient Teachings for Modern Life"
        description="Discover ancient spiritual wisdom, saint teachings, meditation practices, and practical guidance for modern living. Join thousands on their spiritual journey with SantVaani."
        keywords={['spiritual blog', 'spiritual wisdom', 'hinduism', 'meditation', 'saints', 'ancient teachings', 'spiritual guidance', 'spirituality']}
        canonicalUrl="https://santvaani.com/blog"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Spiritual Wisdom Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Discover ancient wisdom for modern living. Explore teachings from great saints,
              practical spiritual guidance, and timeless practices for inner growth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-2">
                  <stat.icon className="w-8 h-8 mx-auto text-orange-200" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-orange-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for spiritual wisdom, practices, saint teachings..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-4 w-full text-lg bg-white/90 backdrop-blur border-0 rounded-xl focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="hover-lift"
                >
                  All Categories
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className="hover-lift"
                    style={{
                      backgroundColor: selectedCategory === category.id ? category.color : undefined,
                      borderColor: category.color,
                      color: selectedCategory === category.id ? 'white' : category.color
                    }}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && selectedCategory === 'all' && !searchQuery && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <BlogCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Categories */}
              <Card className="card-enhanced">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {blogCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/blog/category/${category.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{category.icon}</span>
                          <span className="font-medium text-gray-700 group-hover:text-orange-600">
                            {category.name}
                          </span>
                        </div>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="card-enhanced bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Stay Connected
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get weekly spiritual wisdom and updates delivered to your inbox
                  </p>
                  <Button className="w-full btn-primary-enhanced">
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogIndex;