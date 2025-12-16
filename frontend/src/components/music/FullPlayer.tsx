import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
  Music,
  List,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const FullPlayer = () => {
  const {
    currentBhajan,
    playlist,
    isPlaying,
    volume,
    isMuted,
    shuffle,
    repeat,
    currentTime,
    duration,
    isFullPlayerOpen,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setFullPlayerOpen,
    playBhajan,
  } = useMusicPlayer();

  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue'>('lyrics');

  if (!isFullPlayerOpen || !currentBhajan) return null;

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getThumbnail = (url: string): string => {
    if (!url) return '/placeholder-bhajan.jpg';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder-bhajan.jpg';
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 text-white overflow-hidden">
      {/* Background blur effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${getThumbnail(currentBhajan.youtube_url || '')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px)',
        }}
      />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 hover:bg-white/20 text-white"
        onClick={() => setFullPlayerOpen(false)}
      >
        <ChevronDown className="w-6 h-6" />
      </Button>

      {/* Main Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-8 p-8 max-w-screen-2xl mx-auto w-full">
          {/* Left: Album Art & Info */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Album Art */}
              <div className="relative group">
                <img
                  src={getThumbnail(currentBhajan.youtube_url || '')}
                  alt={currentBhajan.title}
                  className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Song Info */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">
                  {language === 'hi' && currentBhajan.title_hi
                    ? currentBhajan.title_hi
                    : currentBhajan.title}
                </h1>
                <p className="text-xl text-white/80">{currentBhajan.author}</p>
                <p className="text-sm text-white/60">{currentBhajan.category}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  onValueChange={(value) => seekTo(value[0])}
                  max={duration || 100}
                  step={1}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-500"
                />
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Shuffle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-white/20 ${shuffle ? 'text-orange-200' : 'text-white/70'}`}
                  onClick={toggleShuffle}
                >
                  <Shuffle className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-4">
                  {/* Previous */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/20 w-12 h-12"
                    onClick={playPrevious}
                  >
                    <SkipBack className="w-6 h-6" fill="currentColor" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-16 h-16 bg-white hover:bg-white/90 text-orange-600 rounded-full shadow-lg hover:scale-105 transition-transform"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" fill="currentColor" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    )}
                  </Button>

                  {/* Next */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/20 w-12 h-12"
                    onClick={playNext}
                  >
                    <SkipForward className="w-6 h-6" fill="currentColor" />
                  </Button>
                </div>

                {/* Repeat */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-white/20 ${repeat !== 'none' ? 'text-orange-200' : 'text-white/70'}`}
                  onClick={toggleRepeat}
                >
                  {repeat === 'one' ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 flex-shrink-0"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Lyrics & Queue */}
          <div className="flex-1 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="lyrics" className="data-[state=active]:bg-white/20">
                  <Music className="w-4 h-4 mr-2" />
                  Lyrics
                </TabsTrigger>
                <TabsTrigger value="queue" className="data-[state=active]:bg-white/20">
                  <List className="w-4 h-4 mr-2" />
                  Queue ({playlist.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lyrics" className="flex-1 mt-4 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {language === 'hi' && currentBhajan.lyrics_hi ? (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-lg">गीत</h3>
                        <p className="whitespace-pre-wrap leading-relaxed text-white/90 font-quote">
                          {currentBhajan.lyrics_hi}
                        </p>
                      </div>
                    ) : currentBhajan.lyrics ? (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="font-semibold mb-4 text-lg">Lyrics</h3>
                        <p className="whitespace-pre-wrap leading-relaxed text-white/90 font-quote">
                          {currentBhajan.lyrics}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-white/60 py-12">
                        <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Lyrics not available</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="queue" className="flex-1 mt-4 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-2">
                    {playlist.map((bhajan, index) => (
                      <div
                        key={`${bhajan.id}-${index}`}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          bhajan.id === currentBhajan.id
                            ? 'bg-white/20'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => playBhajan(bhajan, playlist)}
                      >
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                          {bhajan.id === currentBhajan.id && isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {language === 'hi' && bhajan.title_hi ? bhajan.title_hi : bhajan.title}
                          </p>
                          <p className="text-sm text-white/70 truncate">{bhajan.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPlayer;
