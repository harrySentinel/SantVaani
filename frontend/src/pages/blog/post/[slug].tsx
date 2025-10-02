// Individual Blog Post Page for SantVaani
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/blog/SEOHead';
import BlogReader from '@/components/blog/BlogReader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Clock, User, Calendar, Eye, Share2, BookOpen, Heart,
  ArrowLeft, ArrowRight, MessageCircle, Twitter, Facebook,
  Linkedin, MessageSquare, Copy, CheckCircle, Maximize2
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { blogService } from '@/services/blogService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualTracking } from '@/hooks/useAnalytics';
import { useBlogView } from '@/hooks/useBlogView';
import LikeButton from '@/components/blog/LikeButton';
import BookmarkButton from '@/components/blog/BookmarkButton';
import CommentsSection from '@/components/blog/CommentsSection';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const { t } = useLanguage();
  const { trackQuoteView, trackShare } = useSpiritualTracking();

  // Track blog view
  useBlogView(post?.id || '');

  // Fetch post from API
  /*
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      slug: 'finding-inner-peace-through-meditation',
      title: 'Finding Inner Peace Through Ancient Meditation Techniques',
      excerpt: 'Discover timeless meditation practices that have guided spiritual seekers for thousands of years. Learn how to calm your mind and find lasting peace.',
      content: `# Finding Inner Peace Through Ancient Meditation Techniques

In our fast-paced modern world, finding moments of peace and tranquility has become more challenging than ever. Ancient meditation techniques, passed down through generations of spiritual masters, offer us a pathway to inner calm and lasting peace.

## The Foundation of Meditation

Meditation is not merely a practice; it is a way of being. The ancient sages understood that true peace comes from within, and they developed various techniques to help us access this inner sanctuary.

### Key Principles of Ancient Meditation

1. **Breath Awareness**: The foundation of all meditation practices
2. **Mindful Observation**: Watching thoughts without attachment
3. **Compassionate Presence**: Cultivating loving-kindness towards all beings

## Traditional Techniques

### Vipassana (Insight Meditation)
This practice involves observing the breath and bodily sensations with complete awareness. As taught by the Buddha, Vipassana helps us understand the impermanent nature of all experiences.

### Trataka (Candle Gazing)
An ancient yogic practice that involves gazing at a candle flame to develop concentration and inner vision. This technique has been used for thousands of years to purify the mind and enhance spiritual awareness.

### Mantra Meditation
The repetition of sacred sounds or phrases helps focus the mind and connect with divine energy. Each mantra carries specific vibrations that resonate with different aspects of consciousness.

## The Science Behind Ancient Wisdom

Modern neuroscience has confirmed what ancient masters knew intuitively - meditation literally changes the brain. Regular practice increases gray matter in areas associated with:

- Emotional regulation
- Attention and focus
- Self-awareness
- Compassion and empathy

## Practical Steps to Begin

1. **Start Small**: Begin with just 5-10 minutes daily
2. **Choose Your Time**: Early morning or evening work best
3. **Create Sacred Space**: Designate a quiet corner for practice
4. **Be Patient**: Progress in meditation is subtle but profound

## Overcoming Common Obstacles

### Restless Mind
It's natural for the mind to wander. Simply notice when this happens and gently return attention to your chosen focus point.

### Physical Discomfort
Start with shorter sessions and gradually increase duration. Comfort is important for sustained practice.

### Lack of Time
Even 5 minutes of conscious breathing can make a difference. Quality matters more than quantity.

## The Fruits of Practice

Regular meditation practice brings numerous benefits:

- Reduced stress and anxiety
- Improved emotional stability
- Enhanced creativity and intuition
- Deeper sense of peace and contentment
- Greater compassion for self and others

## Conclusion

The ancient masters left us a precious gift - the knowledge that peace is our birthright. Through dedicated practice of these timeless techniques, we can access the same profound states of consciousness that have inspired seekers throughout history.

Remember, meditation is not about achieving a particular state, but about developing a friendly relationship with whatever arises in consciousness. As you embark on this journey, be patient and compassionate with yourself.

> "Peace comes from within. Do not seek it without." - Buddha

Start today, even if just for a few minutes. Your future self will thank you for taking this first step toward inner peace and spiritual awakening.`,
      category: blogCategories[2], // Meditation & Practices
      tags: ['meditation', 'inner peace', 'mindfulness', 'spiritual practice'],
      author: {
        id: '1',
        name: 'SantVaani Team',
        bio: 'Dedicated to sharing ancient spiritual wisdom for modern seekers',
        role: 'Spiritual Guide',
        avatar: '/api/placeholder/100/100'
      },
      publishedAt: '2024-09-28',
      readingTime: 8,
      featured: true,
      status: 'published',
      spiritualQuotes: [
        'Peace comes from within. Do not seek it without.',
        'The mind is everything. What you think you become.',
        'Meditation is not evasion; it is a serene encounter with reality.'
      ],
      relatedSaints: ['Buddha', 'Patanjali', 'Swami Vivekananda'],
      viewCount: 2547,
      shareCount: 89,
      featuredImage: '/api/placeholder/1200/600',
      seoMeta: {
        title: 'Finding Inner Peace Through Ancient Meditation Techniques | SantVaani',
        description: 'Discover timeless meditation practices from ancient masters. Learn Vipassana, Trataka, and Mantra meditation for lasting inner peace and spiritual growth.',
        keywords: ['meditation techniques', 'inner peace', 'vipassana', 'spiritual practice', 'mindfulness', 'ancient wisdom'],
        canonicalUrl: 'https://santvaani.com/blog/post/finding-inner-peace-through-meditation'
      }
    },
    {
      id: '2',
      slug: 'lord-rams-teachings-modern-life',
      title: 'Lord Ram\'s Teachings for Modern Life Challenges',
      excerpt: 'Explore how the timeless wisdom of Lord Ram can guide us through contemporary challenges and moral dilemmas.',
      content: `# Lord Ram's Teachings for Modern Life Challenges

Lord Ram, revered as Maryada Purushottam (the ideal man), exemplifies the perfect balance of strength, compassion, duty, and devotion. His life teachings offer profound guidance for navigating the complexities of modern existence.

## The Essence of Dharma

Ram's life was a testament to dharmic living - upholding righteousness even in the face of personal sacrifice. In today's world, where moral boundaries often blur, his example shows us how to maintain ethical integrity.

### Key Teachings for Modern Life

1. **Duty Before Personal Desire**: Ram accepted exile to honor his father's word
2. **Respect for All Beings**: His treatment of every person, regardless of status
3. **Patience in Adversity**: Maintaining composure during 14 years of exile
4. **Forgiveness and Compassion**: Even towards those who wronged him

## Practical Applications

### In Professional Life
- Honor commitments and promises
- Treat colleagues with respect and fairness
- Lead by example, not just words
- Make decisions based on principles, not convenience

### In Relationships
- Practice unconditional love and loyalty
- Communicate with honesty and kindness
- Support loved ones through difficulties
- Maintain boundaries while showing compassion

### In Personal Growth
- Accept life's challenges as opportunities for growth
- Cultivate patience and perseverance
- Develop self-discipline and mental strength
- Stay connected to your spiritual core

## The Ramayana's Timeless Wisdom

The epic doesn't just tell a story; it provides a blueprint for righteous living. Each character represents different aspects of human nature, teaching us about:

- **Courage**: Facing life's battles with determination
- **Sacrifice**: Putting collective good above personal gain
- **Faith**: Trusting in divine providence during dark times
- **Justice**: Standing up for what is right, even when difficult

## Conclusion

Lord Ram's teachings remind us that true strength lies not in power or wealth, but in character and righteousness. By embodying these principles, we can navigate modern challenges with wisdom, grace, and inner peace.`,
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
      featuredImage: '/api/placeholder/1200/600'
    }
  ];
  */

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await blogService.getPost(slug);

        if (response.success && response.post) {
          setPost(response.post);

          // Get related posts from same category
          const relatedResponse = await blogService.getPosts({
            category: response.post.category.id,
            limit: 3
          });

          if (relatedResponse.success) {
            // Filter out current post from related
            const filtered = relatedResponse.posts.filter(p => p.id !== response.post.id);
            setRelatedPosts(filtered.slice(0, 3));
          }

          // Track blog post view
          trackQuoteView(`blog_${response.post.id}`, 'blog_post_detail');
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate, trackQuoteView]);

  const handleShare = async (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    const description = post.excerpt;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          trackShare(post.id, 'copy_link');
          return;
        } catch (err) {
          console.error('Failed to copy URL:', err);
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      trackShare(post.id, platform);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Post not found</h1>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
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
    <>
      {post && isReaderOpen && (
        <BlogReader
          post={post}
          isOpen={isReaderOpen}
          onClose={() => setIsReaderOpen(false)}
          onShare={(platform) => trackShare(post.id, platform)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {post && <SEOHead post={post} />}
        <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-orange-600">Blog</Link>
            <span>/</span>
            <Link
              to={`/blog/category/${post.category.slug}`}
              className="hover:text-orange-600"
            >
              {post.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            <div className="mb-4">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${post.category.color}15`,
                  color: post.category.color
                }}
              >
                {post.category.icon} {post.category.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readingTime} min read
              </div>
              {post.viewCount && (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.viewCount.toLocaleString()} views
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Full Screen Reader Button */}
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setIsReaderOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
              >
                <Maximize2 className="w-5 h-5 mr-2" />
                Read in Full Screen
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative mb-12 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Spiritual Quotes */}
        {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Spiritual Wisdom</h3>
            <div className="space-y-4">
              {post.spiritualQuotes.map((quote, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400 p-6 rounded-r-xl">
                  <blockquote className="text-lg italic text-orange-800 mb-2">
                    "{quote}"
                  </blockquote>
                  {post.relatedSaints && post.relatedSaints[index] && (
                    <cite className="text-orange-600 font-medium">
                      - {post.relatedSaints[index]}
                    </cite>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Share Section */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share this wisdom</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="hover:bg-green-50 hover:border-green-300"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
              className={`transition-colors ${copied ? 'bg-green-50 border-green-300 text-green-700' : 'hover:bg-gray-50'}`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Like and Bookmark Buttons */}
        <div className="flex items-center justify-center gap-4 my-8">
          <LikeButton postId={post.id} showCount size="lg" />
          <BookmarkButton postId={post.id} showText size="lg" />
        </div>

        <Separator className="my-12" />

        {/* Author Info */}
        <Card className="mb-12 card-enhanced">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  About {post.author.name}
                </h4>
                <p className="text-orange-600 font-medium mb-2">{post.author.role}</p>
                <p className="text-gray-600 leading-relaxed">{post.author.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/blog/category/${post.category.slug}`}>
              More in {post.category.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Comments Section */}
        <CommentsSection postId={post.id} className="mb-16" />

        <Separator className="my-12" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} compact />
              ))}
            </div>
          </div>
        )}
      </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPostDetail;