// Blog Category Page for Santvaani
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/blog/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, BookOpen, ArrowLeft, Filter, Calendar,
  TrendingUp, Clock, Users, Star
} from 'lucide-react';
import { BlogPost, BlogCategory } from '@/types/blog';
import { blogCategories } from '@/data/blog/categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualTracking } from '@/hooks/useAnalytics';

const BlogCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'reading-time'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useLanguage();
  const { trackSearch, trackQuoteView } = useSpiritualTracking();

  // Sample posts data (In production, fetch from API based on category)
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      slug: 'finding-inner-peace-through-meditation',
      title: 'Finding Inner Peace Through Ancient Meditation Techniques',
      excerpt: 'Discover timeless meditation practices that have guided spiritual seekers for thousands of years. Learn how to calm your mind and find lasting peace.',
      content: 'Full content here...',
      category: blogCategories[2], // Meditation & Practices
      tags: ['meditation', 'inner peace', 'mindfulness', 'spiritual practice'],
      author: {
        id: '1',
        name: 'Santvaani Team',
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
      content: 'Full content here...',
      category: blogCategories[0], // Spiritual Wisdom
      tags: ['lord ram', 'dharma', 'righteousness', 'moral guidance'],
      author: {
        id: '1',
        name: 'Santvaani Team',
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
      slug: 'breathing-techniques-stress-relief',
      title: 'Ancient Breathing Techniques for Modern Stress Relief',
      excerpt: 'Learn powerful pranayama techniques that have been used for centuries to calm the mind and reduce stress.',
      content: 'Full content here...',
      category: blogCategories[2], // Meditation & Practices
      tags: ['pranayama', 'breathing', 'stress relief', 'yoga'],
      author: {
        id: '1',
        name: 'Santvaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-20',
      readingTime: 6,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Breath is the bridge between the body and mind.'],
      relatedSaints: ['Patanjali'],
      viewCount: 1876,
      shareCount: 54,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '4',
      slug: 'mindful-walking-meditation-guide',
      title: 'The Art of Mindful Walking: A Complete Meditation Guide',
      excerpt: 'Transform your daily walks into profound meditation experiences with these ancient mindfulness techniques.',
      content: 'Full content here...',
      category: blogCategories[2], // Meditation & Practices
      tags: ['walking meditation', 'mindfulness', 'nature', 'present moment'],
      author: {
        id: '1',
        name: 'Santvaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-15',
      readingTime: 10,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Each step can be a prayer, each moment a meditation.'],
      relatedSaints: ['Thich Nhat Hanh'],
      viewCount: 1432,
      shareCount: 38,
      featuredImage: '/api/placeholder/800/400'
    },
    {
      id: '5',
      slug: 'krishna-wisdom-relationships-love',
      title: 'Krishna\'s Wisdom on Relationships and Divine Love',
      excerpt: 'Learn from Lord Krishna\'s teachings about love, relationships, and the path to spiritual connection.',
      content: 'Full content here...',
      category: blogCategories[0], // Spiritual Wisdom
      tags: ['lord krishna', 'love', 'relationships', 'bhakti'],
      author: {
        id: '1',
        name: 'Santvaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom',
        role: 'Spiritual Guide',
      },
      publishedAt: '2024-09-10',
      readingTime: 9,
      featured: false,
      status: 'published',
      spiritualQuotes: ['Where there is love, there is life.'],
      relatedSaints: ['Lord Krishna', 'Radha'],
      viewCount: 2156,
      shareCount: 94,
      featuredImage: '/api/placeholder/800/400'
    }
  ];

  useEffect(() => {
    if (slug) {
      // Find category
      const foundCategory = blogCategories.find(cat => cat.slug === slug);
      if (foundCategory) {
        setCategory(foundCategory);

        // Simulate API call to fetch posts for this category
        setTimeout(() => {
          const categoryPosts = samplePosts.filter(post => post.category.slug === slug);
          setPosts(categoryPosts);
          setFilteredPosts(categoryPosts);
          setIsLoading(false);

          // Track category view
          trackQuoteView(`category_${foundCategory.id}`, 'blog_category');
        }, 500);
      } else {
        setIsLoading(false);
      }
    }
  }, [slug, trackQuoteView]);

  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'reading-time':
          return a.readingTime - b.readingTime;
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      trackSearch(query, posts.length);
    }
  };

  const getCategoryStats = () => {
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const avgReadingTime = posts.length > 0
      ? Math.round(posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length)
      : 0;

    return { totalPosts, totalViews, avgReadingTime };
  };

  const stats = getCategoryStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Category not found</h1>
          <p className="text-gray-500 mb-6">The blog category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {category && <SEOHead category={category} />}
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-orange-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-700">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero Section */}
      <section
        className="relative py-20 text-white"
        style={{
          background: `linear-gradient(135deg, ${category.color}dd, ${category.color}aa)`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">{category.icon}</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {category.description}
            </p>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-white/80 text-sm">Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold text-white">{stats.avgReadingTime} min</div>
              <div className="text-white/80 text-sm">Avg Reading Time</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={`Search in ${category.name.toLowerCase()}...`}
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
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : `Latest in ${category.name}`}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="reading-time">Quick Reads</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {/* Featured Posts */}
                {filteredPosts.filter(post => post.featured).length > 0 && !searchQuery && (
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <Star className="w-5 h-5 text-orange-500 mr-2" />
                      Featured Articles
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredPosts.filter(post => post.featured).map((post) => (
                        <BlogCard key={post.id} post={post} featured />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Posts */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {filteredPosts.filter(post => post.featured).length > 0 && !searchQuery
                      ? 'More Articles'
                      : 'All Articles'
                    }
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts
                      .filter(post => !post.featured || searchQuery)
                      .map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search terms or browse other categories'
                    : 'We\'re working on adding more content to this category'
                  }
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Other Categories */}
              <Card className="card-enhanced">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Other Categories</h3>
                  <div className="space-y-3">
                    {blogCategories
                      .filter(cat => cat.slug !== category.slug)
                      .map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/blog/category/${cat.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{cat.icon}</span>
                            <span className="font-medium text-gray-700 group-hover:text-orange-600">
                              {cat.name}
                            </span>
                          </div>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          ></span>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Back to Blog */}
              <Card className="card-enhanced">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Explore All Topics
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover more spiritual wisdom across all categories
                  </p>
                  <Button asChild className="w-full btn-primary-enhanced">
                    <Link to="/blog">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      All Categories
                    </Link>
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

export default BlogCategoryPage;