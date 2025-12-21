import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Copy, Quote, Play, ExternalLink, Youtube, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CopyToClipboard } from '@/utils/copyUtils';
import { getGradientClass, getCategoryIcon } from '@/utils/categoryGradients';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from './bhajan/FavoriteButton';
import BhajanShareButton from './BhajanShareButton';
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

interface BhajanModalProps {
  bhajan: Bhajan | null;
  isOpen: boolean;
  onClose: () => void;
}

const BhajanModal: React.FC<BhajanModalProps> = ({ bhajan, isOpen, onClose }) => {
  const { toast } = useToast();
  const { playBhajan, currentBhajan, isPlaying, togglePlayPause } = useMusicPlayer();
  const { user } = useAuth();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyLyrics = async () => {
    if (!bhajan) return;

    const formattedText = CopyToClipboard.formatBhajanForSharing({
      title: bhajan.title,
      title_hi: bhajan.title_hi,
      lyrics: bhajan.lyrics,
      lyrics_hi: bhajan.lyrics_hi,
      meaning: bhajan.meaning,
      author: bhajan.author,
      category: bhajan.category
    });

    const success = await CopyToClipboard.copyText(formattedText);

    if (success) {
      toast({
        title: "🎵 Bhajan Copied!",
        description: CopyToClipboard.getSuccessMessage(),
        duration: 3000,
      });
    } else {
      toast({
        title: "Copy Failed",
        description: CopyToClipboard.getErrorMessage(),
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handlePlayClick = () => {
    if (!bhajan) return;

    if (currentBhajan?.id === bhajan.id) {
      togglePlayPause();
    } else {
      playBhajan(bhajan, [bhajan]);
      recordBhajanPlay(bhajan.id, user?.id);
      toast({
        title: "🎵 Now Playing",
        description: bhajan.title,
        duration: 2000,
      });
    }
  };

  const handleListenOnYouTube = () => {
    if (!bhajan?.youtube_url) {
      const searchQuery = `${bhajan?.title} bhajan devotional song`.replace(/\s+/g, '+');
      const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
      window.open(searchUrl, '_blank');

      toast({
        title: "🎵 Redirecting to YouTube",
        description: "Opening YouTube search for this bhajan",
        duration: 2000,
      });
    } else {
      window.open(bhajan.youtube_url, '_blank');

      toast({
        title: "🎵 Opening YouTube",
        description: "Listen to this beautiful bhajan",
        duration: 2000,
      });
    }
  };

  if (!bhajan) return null;

  const isCurrentlyPlaying = currentBhajan?.id === bhajan.id && isPlaying;
  const gradientClass = getGradientClass(bhajan.category);
  const categoryIcon = getCategoryIcon(bhajan.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-16 z-50 overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Gradient Header with Blur */}
            <div className={`relative ${gradientClass} p-8 md:p-12`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">{categoryIcon}</span>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 text-white"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Header Content */}
              <div className="relative z-10 text-white space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {bhajan.category}
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                  {bhajan.title}
                </h1>

                <p className="text-2xl md:text-3xl font-medium opacity-90 drop-shadow">
                  {bhajan.title_hi}
                </p>

                <p className="text-lg opacity-80">
                  by {bhajan.author}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  {bhajan.youtube_url && (
                    <Button
                      onClick={handlePlayClick}
                      size="lg"
                      className={`rounded-full font-semibold px-8 shadow-lg transition-all ${
                        isCurrentlyPlaying
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <Music className="w-5 h-5 mr-2 animate-pulse" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play Now
                        </>
                      )}
                    </Button>
                  )}

                  <div onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton
                      bhajanId={bhajan.id}
                      bhajanTitle={bhajan.title}
                      size="lg"
                      variant="default"
                    />
                  </div>

                  <Button
                    onClick={handleCopyLyrics}
                    variant="ghost"
                    size="lg"
                    className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
                  </Button>

                  <div onClick={(e) => e.stopPropagation()}>
                    <BhajanShareButton
                      bhajan={bhajan}
                      variant="ghost"
                      size="lg"
                      className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="h-[calc(100%-250px)] md:h-[calc(100%-280px)] overflow-y-auto bg-gray-50">
              <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12">
                <div className="space-y-8">

                  {/* Lyrics Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-1 h-8 rounded-full ${gradientClass}`}></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Sacred Lyrics
                      </h2>
                    </div>

                    {/* Dual Language Display */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Hindi Lyrics */}
                      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className={`w-3 h-3 rounded-full ${gradientClass}`}></span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            देवनागरी
                          </h3>
                        </div>
                        <pre className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap font-medium">
                          {bhajan.lyrics_hi}
                        </pre>
                      </div>

                      {/* Transliteration */}
                      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className={`w-3 h-3 rounded-full ${gradientClass}`}></span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Transliteration
                          </h3>
                        </div>
                        <pre className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                          {bhajan.lyrics}
                        </pre>
                      </div>
                    </div>
                  </motion.div>

                  {/* Meaning Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl p-6 md:p-8 shadow-md border border-orange-200/50"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Quote className="w-6 h-6 text-orange-500" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        Spiritual Meaning
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg italic">
                      {bhajan.meaning}
                    </p>
                  </motion.div>

                  {/* YouTube Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-md border border-red-200/50"
                  >
                    <div className="text-center space-y-4">
                      <div className="flex justify-center items-center space-x-2">
                        <Youtube className="w-8 h-8 text-red-500 animate-pulse" />
                        <Play className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Experience on YouTube
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Listen to this sacred bhajan and let the divine vibrations fill your heart with peace and devotion.
                      </p>
                      <Button
                        onClick={handleListenOnYouTube}
                        className="group bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-3 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                      >
                        <Youtube className="w-5 h-5 mr-2" />
                        Open in YouTube
                        <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BhajanModal;
