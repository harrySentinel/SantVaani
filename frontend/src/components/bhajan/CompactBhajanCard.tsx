import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from './FavoriteButton';
import { getGradientClass } from '@/utils/categoryGradients';
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
  index = 0,
}) => {
  const { playBhajan, currentBhajan, isPlaying, togglePlayPause } = useMusicPlayer();
  const { user } = useAuth();
  const isCurrentlyPlaying = currentBhajan?.id === bhajan.id && isPlaying;
  const gradientClass = getGradientClass(bhajan.category);

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div
        onClick={onClick}
        className="relative overflow-hidden rounded-xl cursor-pointer transition-shadow duration-200 shadow-sm hover:shadow-lg"
      >
        {/* Card cover */}
        <div className={`${gradientClass} aspect-square flex items-center justify-center relative`}>
          {/* Subtle icon background — no emoji */}
          <Music className="w-12 h-12 text-white/25" />

          {/* Play overlay */}
          {bhajan.youtube_url && (
            <div className={`absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-opacity duration-200 ${
              isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <Button
                onClick={handlePlayClick}
                size="icon"
                className={`w-12 h-12 rounded-full shadow-lg transition-colors duration-150 ${
                  isCurrentlyPlaying
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white hover:bg-orange-50 text-gray-900'
                }`}
              >
                {isCurrentlyPlaying
                  ? <Pause className="w-5 h-5" fill="currentColor" />
                  : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                }
              </Button>
            </div>
          )}

          {/* Favorite — top right */}
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            onClick={e => e.stopPropagation()}
          >
            <FavoriteButton bhajanId={bhajan.id} bhajanTitle={bhajan.title} size="sm" variant="minimal" />
          </div>

          {/* Playing bars indicator */}
          {isCurrentlyPlaying && (
            <div className="absolute bottom-2 left-2 flex items-end gap-0.5">
              {[0, 150, 300].map(delay => (
                <div key={delay} className="w-1 bg-white rounded-full animate-pulse" style={{ height: delay === 150 ? 16 : 12, animationDelay: `${delay}ms` }} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white p-3 space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
            {bhajan.title}
          </h3>
          <p className="text-xs text-orange-500 line-clamp-1 font-medium">{bhajan.title_hi}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full truncate">
              {bhajan.category}
            </span>
            {bhajan.author && (
              <p className="text-[10px] text-gray-400 truncate max-w-[80px]">{bhajan.author}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompactBhajanCard;
