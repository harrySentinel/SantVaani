// Beautiful Blog Card Component for Santvaani
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, Eye, Share2, Calendar } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { useSpiritualTracking } from '@/hooks/useAnalytics';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false, compact = false }) => {
  const { trackQuoteView } = useSpiritualTracking();

  const handleCardClick = () => {
    // Track blog post view
    trackQuoteView(`blog_${post.id}`, 'blog_post');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Link
        to={`/blog/post/${post.slug}`}
        onClick={handleCardClick}
        className="block hover:no-underline"
      >
        <Card className="card-enhanced hover-lift transition-all duration-300 h-full">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {post.featuredImage && (
                <div className="flex-shrink-0">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${post.category.color}15`,
                      color: post.category.color
                    }}
                  >
                    {post.category.icon} {post.category.name}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readingTime} min
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/post/${post.slug}`}
      onClick={handleCardClick}
      className="block hover:no-underline"
    >
      <Card className={`card-enhanced hover-lift transition-all duration-300 h-full overflow-hidden ${featured ? 'lg:col-span-2' : ''}`}>
        {post.featuredImage && (
          <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                  ✨ Featured
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.icon} {post.category.name}
              </span>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          <div className="space-y-4">
            {!post.featuredImage && (
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${post.category.color}15`,
                    color: post.category.color
                  }}
                >
                  {post.category.icon} {post.category.name}
                </span>
                {post.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    ✨ Featured
                  </span>
                )}
              </div>
            )}

            <div>
              <h3 className={`font-bold text-gray-900 line-clamp-2 mb-3 hover:text-orange-600 transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
                {post.title}
              </h3>
              <p className={`text-gray-600 line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
                {post.excerpt}
              </p>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {post.author.name}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readingTime} min read
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.publishedAt)}
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-400">
                {post.viewCount && (
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.viewCount}
                  </div>
                )}
                {post.shareCount && (
                  <div className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1" />
                    {post.shareCount}
                  </div>
                )}
              </div>
            </div>

            {/* Spiritual Quotes Preview */}
            {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                <p className="text-sm italic text-orange-800">
                  "{post.spiritualQuotes[0]}"
                </p>
                {post.relatedSaints && post.relatedSaints.length > 0 && (
                  <p className="text-xs text-orange-600 mt-2">
                    - {post.relatedSaints[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;