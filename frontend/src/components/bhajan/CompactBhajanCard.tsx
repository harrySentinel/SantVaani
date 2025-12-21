import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from './FavoriteButton';
import { getGradientClass, getGradientTextClass, getCategoryIcon } from '@/utils/categoryGradients';
import { recordBhajanPlay } from '@/services/bhajanEngagementService';

interface Bhajan {
  id: string;
  title: string;
  title_hi: string;
  category: string;
  lyrics: string;
  lyrics_hi: string;
  meaning: string;
  author: string;
  youtube_url?: string;
}

interface CompactBhajanCardProps {
  bhajan: Bhajan;
  onClick: () => void;
  playlist?: Bhajan[];
  index?: number;
}

const CompactBhajanCard: React.FC<CompactBhajanCardProps> = ({
  bhajan,
  onClick,
  playlist = [],
  index = 0
}) => {
  const { playBhajan, currentBhajan, isPlaying, togglePlayPause } = useMusicPlayer();
  const { user } = useAuth();
  const isCurrentlyPlaying = currentBhajan?.id === bhajan.id && isPlaying;
  const gradientClass = getGradientClass(bhajan.category);
  const textClass = getGradientTextClass(bhajan.category);
  const categoryIcon = getCategoryIcon(bhajan.category);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBhajan?.id === bhajan.id) {
      togglePlayPause();
    } else {
      playBhajan(bhajan, playlist.length > 0 ? playlist : [bhajan]);
      recordBhajanPlay(bhajan.id, user?.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div
        onClick={onClick}
        className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-md hover:shadow-2xl"
      >
        {/* Gradient Background */}
        <div className={`${gradientClass} aspect-square flex items-center justify-center relative`}>
          {/* Decorative Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-8xl">{categoryIcon}</span>
          </div>

          {/* Play Button Overlay - Shows on hover or when playing */}
          {bhajan.youtube_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${
                isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <Button
                onClick={handlePlayClick}
                size="lg"
                className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
                  isCurrentlyPlaying
                    ? 'bg-green-500 hover:bg-green-600 scale-110'
                    : 'bg-white hover:bg-green-50 text-gray-800 hover:scale-110'
                }`}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-7 h-7" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 ml-1" fill="currentColor" />
                )}
              </Button>
            </motion.div>
          )}

          {/* Favorite Button - Top Right */}
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton
              bhajanId={bhajan.id}
              bhajanTitle={bhajan.title}
              size="sm"
              variant="minimal"
            />
          </div>

          {/* Currently Playing Indicator */}
          {isCurrentlyPlaying && (
            <div className="absolute bottom-2 left-2 flex items-center space-x-1">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="bg-white/95 backdrop-blur-sm p-3 space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-green-600 transition-colors">
            {bhajan.title}
          </h3>
          <p className="text-xs text-green-600 line-clamp-1 font-medium">
            {bhajan.title_hi}
          </p>
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              {bhajan.category}
            </Badge>
            {bhajan.author && (
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {bhajan.author}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactBhajanCard;
