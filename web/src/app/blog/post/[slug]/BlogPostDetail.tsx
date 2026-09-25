'use client';

// Individual Blog Post Page for Santvaani
import React, { useState, useEffect } from 'react';
import Link from '@/components/SiteLink';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualTracking, useSocialTracking } from '@/hooks/useAnalytics';
import { useServerBlogView } from '@/hooks/useServerBlogView';
import LikeButton from '@/components/blog/LikeButton';
import BookmarkButton from '@/components/blog/BookmarkButton';
import CommentsSection from '@/components/blog/CommentsSection';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import Breadcrumb from '@/components/Breadcrumb';

interface BlogPostDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostDetail({ post, relatedPosts }: BlogPostDetailProps) {
  const [loadComments, setLoadComments] = useState(false);
  const loadRelated = true;
  const [copied, setCopied] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const { t } = useLanguage();
  const { trackQuoteView } = useSpiritualTracking();
  const { trackSocialShare } = useSocialTracking();
  const trackShare = (postId: string, platform: string) => trackSocialShare(platform, 'blog_post', postId);

  // Track blog view with server-side IP-based tracking
  const { viewRecorded } = useServerBlogView(post.id);

  useEffect(() => {
    trackQuoteView(`blog_${post.id}`, 'blog_post_detail');
    const timer = setTimeout(() => setLoadComments(true), 1000);
    return () => clearTimeout(timer);
  }, [post.id, trackQuoteView]);

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

      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-50">
        <ReadingProgressBar />
        <Navbar />

        <Breadcrumb
          items={[
            { label: 'Blog', to: '/blog' },
            { label: post.category.name, to: `/blog/category/${post.category.slug}` },
            { label: post.title },
          ]}
        />

      <article lang={post.language} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
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
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300 transition-colors"
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

          {/* Featured Image - Fully Responsive for Mobile & Desktop */}
          {post.featuredImage && (
            <div className="relative mb-8 md:mb-12 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="relative mb-12">
          {/* Decorative Side Border */}
          <div className="absolute -left-2 md:-left-6 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-500 via-red-500 to-orange-600 rounded-full shadow-lg"></div>

          {/* Main Content Card */}
          <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 rounded-2xl shadow-2xl border-2 border-orange-200 p-6 md:p-12 relative overflow-hidden">
            {/* Decorative Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-tr-full"></div>

            <style>{`
              .blog-content h1 {
                font-size: 2.5rem;
                font-weight: 800;
                background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-top: 2.5rem;
                margin-bottom: 1.5rem;
                text-shadow: 0 2px 10px rgba(251, 146, 60, 0.2);
              }
              .blog-content h2 {
                font-size: 2rem;
                font-weight: 700;
                color: #ea580c;
                background: linear-gradient(90deg, #fed7aa 0%, transparent 100%);
                border-left: 6px solid #f97316;
                padding-left: 1.25rem;
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                margin-top: 2rem;
                margin-bottom: 1.25rem;
                border-radius: 0 8px 8px 0;
              }
              .blog-content h3 {
                font-size: 1.625rem;
                font-weight: 600;
                color: #ea580c;
                background: linear-gradient(90deg, #fed7aa 0%, transparent 100%);
                padding: 0.5rem 0.75rem;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                border-radius: 8px;
                display: inline-block;
                border-left: 4px solid #f97316;
              }
              .blog-content h3::before {
                content: '🔸';
                margin-right: 0.5rem;
              }
              .blog-content h1:first-child,
              .blog-content h2:first-child,
              .blog-content h3:first-child {
                margin-top: 0;
              }
              .blog-content p {
                color: #1f2937;
                line-height: 1.9;
                margin-bottom: 1.5rem;
                margin-top: 0.75rem;
                font-size: 1.125rem;
                text-align: justify;
              }
              .blog-content strong {
                color: #dc2626;
                font-weight: 700;
              }
              .blog-content em {
                color: #ea580c;
                font-style: italic;
                font-weight: 500;
              }
              .blog-content a {
                color: #dc2626;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.2s;
                border-bottom: 1px solid #fb923c;
              }
              .blog-content a:hover {
                color: #991b1b;
                text-decoration-color: #dc2626;
                background: #fed7aa;
              }
              .blog-content blockquote {
                border-left: 6px solid #f97316;
                background: linear-gradient(90deg, #fed7aa 0%, #ffedd5 100%);
                padding: 1rem 1.5rem;
                font-style: italic;
                color: #78350f;
                margin: 1.5rem 0;
                border-radius: 0 12px 12px 0;
                box-shadow: 0 4px 6px rgba(251, 146, 60, 0.1);
                font-size: 1.125rem;
              }
              .blog-content ul, .blog-content ol {
                margin-left: 2rem;
                color: #1f2937;
                font-size: 1.125rem;
              }
              .blog-content li {
                margin-bottom: 0.75rem;
                line-height: 1.8;
              }
              .blog-content li::marker {
                color: #f97316;
                font-weight: bold;
              }
              .blog-content code {
                background: #fed7aa;
                color: #9a3412;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 0.95em;
              }

              /* Mobile Responsive Fixes */
              @media (max-width: 768px) {
                .blog-content h1 {
                  font-size: 1.75rem !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 1rem !important;
                  line-height: 1.3 !important;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .blog-content h2 {
                  font-size: 1.5rem !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 1rem !important;
                  padding-left: 0.75rem !important;
                  border-left-width: 4px !important;
                  line-height: 1.4 !important;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .blog-content h3 {
                  font-size: 1.25rem !important;
                  margin-top: 1.25rem !important;
                  margin-bottom: 0.75rem !important;
                  padding: 0.4rem 0.6rem !important;
                  border-left-width: 3px !important;
                  line-height: 1.4 !important;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                  display: block !important;
                }
                .blog-content p {
                  font-size: 1rem !important;
                  line-height: 1.75 !important;
                  margin-bottom: 1.25rem !important;
                  text-align: left !important;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .blog-content strong {
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .blog-content blockquote {
                  font-size: 1rem !important;
                  padding: 0.75rem 1rem !important;
                  margin: 1rem 0 !important;
                }
                .blog-content ul, .blog-content ol {
                  font-size: 1rem !important;
                  margin-left: 1.25rem !important;
                }
                .blog-content li {
                  font-size: 1rem !important;
                  margin-bottom: 0.5rem !important;
                }
              }

              /* Extra small mobile screens */
              @media (max-width: 480px) {
                .blog-content h1 {
                  font-size: 1.5rem !important;
                }
                .blog-content h2 {
                  font-size: 1.25rem !important;
                }
                .blog-content h3 {
                  font-size: 1.125rem !important;
                }
                .blog-content p {
                  font-size: 0.95rem !important;
                }
                .blog-content ul, .blog-content ol {
                  font-size: 0.95rem !important;
                }
                .blog-content li {
                  font-size: 0.95rem !important;
                }
                .blog-content blockquote {
                  font-size: 0.95rem !important;
                  padding: 0.6rem 0.8rem !important;
                }
              }
            `}</style>
            <div className="blog-content relative z-10">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
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
        <div className="flex flex-wrap justify-between items-center gap-3 mb-12">
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

        {/* Comments Section - Lazy Loaded */}
        {loadComments ? (
          <CommentsSection postId={post.id} className="mb-16" />
        ) : (
          <div className="mb-16 text-center py-8">
            <div className="animate-pulse text-gray-400">Loading comments...</div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Related Posts - Lazy Loaded */}
        {loadRelated && relatedPosts.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} compact />
              ))}
            </div>
          </div>
        )}
        {loadRelated && relatedPosts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No related articles found
          </div>
        )}
      </article>

        <Footer />
      </div>
    </>
  );
}
