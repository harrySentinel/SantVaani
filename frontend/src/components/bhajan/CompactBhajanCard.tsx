import React from 'react';
import { BookOpen, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import FavoriteButton from './FavoriteButton';
import { getGradientClass } from '@/utils/categoryGradients';

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
  index = 0,
}) => {
  const gradientClass = getGradientClass(bhajan.category);

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
          <BookOpen className="w-12 h-12 text-white/25" />

          {/* Read-lyrics hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="px-4 py-2 rounded-full bg-white text-gray-900 text-xs font-semibold shadow-lg">
              Read Lyrics
            </span>
          </div>

          {/* Favorite — top right */}
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            onClick={e => e.stopPropagation()}
          >
            <FavoriteButton bhajanId={bhajan.id} bhajanTitle={bhajan.title} size="sm" variant="minimal" />
          </div>

          {/* Listen on YouTube — bottom right */}
          {bhajan.youtube_url && (
            <a
              href={bhajan.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              aria-label={`Listen to ${bhajan.title} on YouTube`}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors z-10 shadow"
            >
              <Youtube className="w-4 h-4" />
            </a>
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
