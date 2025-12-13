import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface SpiritualPost {
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

interface PostCardProps {
  post: SpiritualPost;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const { language } = useLanguage();

  const title = language === 'hi' && post.title_hi ? post.title_hi : post.title;
  const content = language === 'hi' && post.content_hi ? post.content_hi : post.content;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Truncate content for preview
  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Image */}
      {post.image_url && (
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={post.image_url}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-purple-100 text-orange-800">
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.created_at)}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
          {title}
        </h2>

        {/* Content Preview */}
        <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {truncateContent(content)}
        </p>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </button>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </button>
          </div>

          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
            {language === 'hi' ? 'और पढ़ें →' : 'Read More →'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
