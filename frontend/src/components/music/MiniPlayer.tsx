import { useState, useEffect } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronUp,
  X,
  ListMusic,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const MiniPlayer = () => {
  const {
    currentBhajan,
    isPlaying,
    volume,
    isMuted,
    shuffle,
    repeat,
    currentTime,
    duration,
    isPlayerVisible,
    isLoading,
    isBuffering,
    error,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setFullPlayerOpen,
    clearPlayer,
    clearError,
  } = useMusicPlayer();

  const { language } = useLanguage();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get YouTube thumbnail (using hqdefault which is always available)
  const getThumbnail = (url: string): string => {
    if (!url) return '/placeholder-bhajan.jpg';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/placeholder-bhajan.jpg';
  };

  if (!isPlayerVisible || !currentBhajan) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-2xl border-t border-orange-500/30" role="region" aria-label="Music Player">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-700 px-4 py-2 flex items-center justify-between text-sm" role="alert">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-red-800"
            onClick={clearError}
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-black/30 cursor-pointer group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        seekTo(duration * percentage);
      }}>
        <div
          className="h-full bg-white/90 transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100" />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={getThumbnail(currentBhajan.youtube_url || '')}
              alt={currentBhajan.title}
              className="w-14 h-14 rounded-lg object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setFullPlayerOpen(true)}
            />
            <div className="min-w-0 flex-1">
              <h4
                className="font-semibold text-sm truncate cursor-pointer hover:underline"
                onClick={() => setFullPlayerOpen(true)}
              >
                {language === 'hi' && currentBhajan.title_hi
                  ? currentBhajan.title_hi
                  : currentBhajan.title}
              </h4>
              <p className="text-xs text-white/80 truncate">{currentBhajan.author}</p>
            </div>
          </div>

          {/* Center: Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Shuffle */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-white/20 transition-colors ${
                  shuffle ? 'text-orange-200' : 'text-white/70'
                }`}
                onClick={toggleShuffle}
                aria-label={shuffle ? 'Shuffle on' : 'Shuffle off'}
                aria-pressed={shuffle}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              {/* Previous */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-white/20 text-white"
                onClick={playPrevious}
                aria-label="Previous track"
              >
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </Button>

              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                className="h-11 w-11 p-0 bg-white hover:bg-white/90 text-orange-600 rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={togglePlayPause}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isBuffering || isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </Button>

              {/* Next */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-white/20 text-white"
                onClick={playNext}
                aria-label="Next track"
              >
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </Button>

              {/* Repeat */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-white/20 transition-colors ${
                  repeat !== 'none' ? 'text-orange-200' : 'text-white/70'
                }`}
                onClick={toggleRepeat}
                aria-label={`Repeat ${repeat}`}
                aria-pressed={repeat !== 'none'}
              >
                {repeat === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Time */}
            <div className="text-xs text-white/80 font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right: Volume & Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Volume Control */}
            <div
              className="flex items-center gap-2 relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                aria-pressed={isMuted}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 shadow-2xl border border-white/10">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-24 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-500 [&_[role=slider]]:shadow-lg [&>span:first-child]:bg-white/20 [&>span:first-child>span]:bg-white"
                    orientation="vertical"
                    style={{ height: '100px' }}
                  />
                </div>
              )}
            </div>

            {/* Queue */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white hidden md:flex"
              onClick={() => setFullPlayerOpen(true)}
              aria-label="Show queue"
            >
              <ListMusic className="w-5 h-5" />
            </Button>

            {/* Expand */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              onClick={() => setFullPlayerOpen(true)}
              aria-label="Expand player"
            >
              <ChevronUp className="w-5 h-5" />
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white/70 hover:text-white"
              onClick={clearPlayer}
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
