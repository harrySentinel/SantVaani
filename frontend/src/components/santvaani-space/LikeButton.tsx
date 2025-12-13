import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked?: boolean;
  userId?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikes,
  initialLiked = false,
  userId
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikes);
  }, [initialLiked, initialLikes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      toast({
        title: language === 'hi' ? 'साइन इन करें' : 'Sign In Required',
        description: language === 'hi'
          ? 'लाइक करने के लिए कृपया साइन इन करें'
          : 'Please sign in to like posts',
        variant: 'destructive'
      });
      return;
    }

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    // Trigger animation
    if (newLiked) {
      setAnimating(true);
      setShowHearts(true);
      setTimeout(() => {
        setAnimating(false);
        setShowHearts(false);
      }, 1000);
    }

    try {
      if (newLiked) {
        // Like the post
        await axios.post(`${API_URL}/api/santvaani-space/posts/${postId}/like`, {
          userId
        });
      } else {
        // Unlike the post
        await axios.delete(`${API_URL}/api/santvaani-space/posts/${postId}/like`, {
          data: { userId }
        });
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);

      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);

      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi'
          ? 'लाइक अपडेट करने में विफल'
          : 'Failed to update like',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleLike}
        className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={animating ? {
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 0]
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`h-6 w-6 ${liked ? 'fill-pink-600 text-pink-600' : ''}`}
          />
        </motion.div>
        <span className="text-sm font-medium">{likesCount}</span>
      </motion.button>

      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {showHearts && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 0.5
                }}
                animate={{
                  opacity: 0,
                  y: -100 + Math.random() * 50,
                  x: (Math.random() - 0.5) * 100,
                  scale: 1 + Math.random() * 0.5
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
                className="absolute top-0 left-1/2 pointer-events-none"
              >
                <Heart className="h-4 w-4 text-pink-500 fill-current" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikeButton;
