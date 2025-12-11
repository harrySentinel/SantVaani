import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleBhajanFavorite, checkIfFavorited, getBhajanFavoriteCount } from '@/services/bhajanEngagementService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  bhajanId: string;
  bhajanTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  variant?: 'default' | 'minimal';
  className?: string;
  onFavoriteChange?: (favorited: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  bhajanId,
  bhajanTitle,
  size = 'md',
  showCount = false,
  variant = 'default',
  className,
  onFavoriteChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && bhajanId) {
        try {
          const favorited = await checkIfFavorited(bhajanId, user.id);
          setIsFavorited(favorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [bhajanId, user]);

  // Fetch favorite count
  useEffect(() => {
    if (showCount && bhajanId) {
      const fetchCount = async () => {
        try {
          const result = await getBhajanFavoriteCount(bhajanId);
          setFavoriteCount(result.count || 0);
        } catch (error) {
          console.error('Error fetching favorite count:', error);
        }
      };

      fetchCount();
    }
  }, [bhajanId, showCount, isFavorited]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to favorite bhajans',
        variant: 'default',
      });
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const result = await toggleBhajanFavorite(bhajanId);
      const newFavorited = result.favorited;

      setIsFavorited(newFavorited);
      setFavoriteCount(prev => newFavorited ? prev + 1 : Math.max(0, prev - 1));

      // Callback
      if (onFavoriteChange) {
        onFavoriteChange(newFavorited);
      }

      // Toast notification
      toast({
        title: newFavorited ? '❤️ Added to Favorites' : 'Removed from Favorites',
        description: bhajanTitle ? `${bhajanTitle}` : result.message,
        variant: 'default',
      });

      // Reset animation after delay
      setTimeout(() => setIsAnimating(false), 600);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite',
        variant: 'destructive',
      });
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'minimal') {
    return (
      <motion.button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={cn(
          'relative',
          buttonSizeClasses[size],
          'rounded-full transition-colors',
          'hover:bg-red-50 dark:hover:bg-red-950',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{
            scale: isAnimating ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              sizeClasses[size],
              'transition-colors',
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-red-400'
            )}
          />
        </motion.div>

        {/* Particle effect on favorite */}
        <AnimatePresence>
          {isAnimating && isFavorited && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-400 rounded-full"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI) / 3) * 20,
                    y: Math.sin((i * Math.PI) / 3) * 20,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.6 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        'flex items-center space-x-2',
        buttonSizeClasses[size],
        'rounded-full transition-all',
        isFavorited
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
          rotate: isAnimating ? [0, 15, -15, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            'transition-all',
            isFavorited ? 'fill-red-500' : ''
          )}
        />
      </motion.div>

      {showCount && (
        <span className="text-sm font-medium tabular-nums">
          {favoriteCount > 0 ? favoriteCount : ''}
        </span>
      )}

      {/* Confetti particles on favorite */}
      <AnimatePresence>
        {isAnimating && isFavorited && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#ef4444', '#f97316', '#ec4899', '#8b5cf6'][i % 4],
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI) / 4) * 30,
                  y: Math.sin((i * Math.PI) / 4) * 30,
                  opacity: [1, 1, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FavoriteButton;
