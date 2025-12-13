import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import LikeButton from './LikeButton';

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
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [userId] = useState(localStorage.getItem('userId') || undefined);

  const title = language === 'hi' && post.title_hi ? post.title_hi : post.title;
  const content = language === 'hi' && post.content_hi ? post.content_hi : post.content;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Check if content is long (more than 150 characters)
  const isLongContent = content.length > 150;
  const displayContent = expanded || !isLongContent
    ? content
    : content.substring(0, 150) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200"
    >
      {/* Post Header - Like Instagram */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">🕉️</span>
          </div>

          {/* Post Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {language === 'hi' ? 'संतवाणी' : 'SantVaani'}
            </h3>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)} • {post.category}
            </p>
          </div>
        </div>

        {/* More Options */}
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Title */}
      <div className="px-4 pt-3">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h2>
      </div>

      {/* Post Image - Full Width like Instagram */}
      {post.image_url && (
        <div className="w-full">
          <img
            src={post.image_url}
            alt={title}
            className="w-full object-cover"
            style={{ maxHeight: '600px' }}
          />
        </div>
      )}

      {/* Action Buttons - Like Instagram */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LikeButton
            postId={post.id}
            initialLikes={post.likes_count}
            userId={userId}
          />

          <button
            onClick={onClick}
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-medium">{post.comments_count}</span>
          </button>

          <button className="text-gray-700 hover:text-green-600 transition-colors">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Post Caption/Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-800">
          <span className="font-semibold">
            {language === 'hi' ? 'संतवाणी' : 'SantVaani'}
          </span>
          {' '}
          <span className="whitespace-pre-wrap">{displayContent}</span>

          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 ml-1 font-medium"
            >
              {expanded
                ? (language === 'hi' ? 'कम देखें' : 'See less')
                : (language === 'hi' ? 'और देखें' : 'See more')
              }
            </button>
          )}
        </div>
      </div>

      {/* View Comments Link */}
      {post.comments_count > 0 && (
        <button
          onClick={onClick}
          className="px-4 pb-3 text-sm text-gray-500 hover:text-gray-700"
        >
          {language === 'hi'
            ? `सभी ${post.comments_count} टिप्पणियां देखें`
            : `View all ${post.comments_count} comments`
          }
        </button>
      )}
    </motion.div>
  );
};

export default PostCard;
