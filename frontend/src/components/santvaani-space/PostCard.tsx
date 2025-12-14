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
  profile_photo_url: string | null;
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 hover:border-orange-200 transition-all duration-300"
    >
      {/* Post Header - Instagram Style */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center space-x-3">
          {/* Profile Avatar - Custom or Default with ring effect */}
          {post.profile_photo_url ? (
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 p-[2px]">
                <div className="bg-white rounded-full w-full h-full p-[2px]">
                  <img
                    src={post.profile_photo_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg">🕉️</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 p-[2px]">
                <div className="bg-white rounded-full w-full h-full p-[2px] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg">🕉️</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post Info */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              {language === 'hi' ? 'संतवाणी' : 'Santvaani'}
            </h3>
            <p className="text-xs text-gray-500">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        {/* More Options */}
        <button className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Title */}
      <div className="px-5 pt-3 pb-2">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
      </div>

      {/* Post Image - Instagram/Facebook Style */}
      {post.image_url && (
        <div className="w-full relative overflow-hidden bg-gray-50">
          <img
            src={post.image_url}
            alt={title}
            className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      {/* Action Buttons - Like Instagram */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <LikeButton
            postId={post.id}
            initialLikes={post.likes_count}
            userId={userId}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm font-semibold">{post.comments_count}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            <Share2 className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      {/* Likes Count */}
      {post.likes_count > 0 && (
        <div className="px-5 pb-2">
          <p className="text-sm font-semibold text-gray-900">
            {post.likes_count} {post.likes_count === 1
              ? (language === 'hi' ? 'पसंद' : 'like')
              : (language === 'hi' ? 'पसंद' : 'likes')
            }
          </p>
        </div>
      )}

      {/* Post Caption/Content */}
      <div className="px-5 pb-2">
        <div className="text-gray-800 text-sm leading-relaxed">
          <span className="font-bold">
            {language === 'hi' ? 'संतवाणी' : 'Santvaani'}
          </span>
          {' '}
          <span className="whitespace-pre-wrap">{displayContent}</span>

          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 ml-1 font-medium"
            >
              {expanded
                ? (language === 'hi' ? 'कम देखें' : 'less')
                : (language === 'hi' ? 'और देखें' : 'more')
              }
            </button>
          )}
        </div>
      </div>

      {/* View Comments Link */}
      {post.comments_count > 0 && (
        <button
          onClick={onClick}
          className="px-5 pb-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
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
