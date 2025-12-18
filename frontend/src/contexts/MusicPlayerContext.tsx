import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface Bhajan {
  id: string;
  title: string;
  title_hi: string;
  category: string;
  author: string;
  youtube_url?: string;
  lyrics?: string;
  lyrics_hi?: string;
}

interface MusicPlayerContextType {
  currentBhajan: Bhajan | null;
  playlist: Bhajan[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  currentTime: number;
  duration: number;
  isPlayerVisible: boolean;
  isFullPlayerOpen: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  error: string | null;
  playbackRate: number;

  playBhajan: (bhajan: Bhajan, newPlaylist?: Bhajan[]) => void;
  pauseBhajan: () => void;
  resumeBhajan: () => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (bhajan: Bhajan) => void;
  removeFromQueue: (index: number) => void;
  setFullPlayerOpen: (open: boolean) => void;
  clearPlayer: () => void;
  setPlayerRef: (player: any) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  clearError: () => void;
  setIsBuffering: (buffering: boolean) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// Load saved settings from localStorage
const loadSavedSettings = () => {
  try {
    const savedVolume = localStorage.getItem('musicPlayer_volume');
    const savedRepeat = localStorage.getItem('musicPlayer_repeat');
    const savedPlaybackRate = localStorage.getItem('musicPlayer_playbackRate');

    return {
      volume: savedVolume ? parseInt(savedVolume, 10) : 80,
      repeat: (savedRepeat as 'none' | 'one' | 'all') || 'all',
      playbackRate: savedPlaybackRate ? parseFloat(savedPlaybackRate) : 1,
    };
  } catch (error) {
    console.error('Failed to load saved settings:', error);
    return { volume: 80, repeat: 'all' as const, playbackRate: 1 };
  }
};

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedSettings = loadSavedSettings();

  const [currentBhajan, setCurrentBhajan] = useState<Bhajan | null>(null);
  const [playlist, setPlaylist] = useState<Bhajan[]>([]);
  const [originalPlaylist, setOriginalPlaylist] = useState<Bhajan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(savedSettings.volume);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeatState] = useState<'none' | 'one' | 'all'>(savedSettings.repeat);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(savedSettings.playbackRate);

  const playerRef = useRef<any>(null);
  const playNextRef = useRef<() => void>();

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('musicPlayer_volume', volume.toString());
    } catch (error) {
      console.error('Failed to save volume:', error);
    }
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem('musicPlayer_repeat', repeat);
    } catch (error) {
      console.error('Failed to save repeat mode:', error);
    }
  }, [repeat]);

  useEffect(() => {
    try {
      localStorage.setItem('musicPlayer_playbackRate', playbackRate.toString());
    } catch (error) {
      console.error('Failed to save playback rate:', error);
    }
  }, [playbackRate]);

  // Shuffle playlist
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const playBhajan = useCallback((bhajan: Bhajan, newPlaylist?: Bhajan[]) => {
    try {
      // Validate bhajan has a YouTube URL
      if (!bhajan.youtube_url) {
        setError('This bhajan does not have a valid YouTube URL');
        return;
      }

      setError(null);
      setIsLoading(true);
      setCurrentBhajan(bhajan);
      setIsPlayerVisible(true);
      setIsPlaying(true);
      setCurrentTime(0);

      if (newPlaylist && newPlaylist.length > 0) {
        setOriginalPlaylist(newPlaylist);
        const list = shuffle ? shuffleArray(newPlaylist) : newPlaylist;
        setPlaylist(list);
        const index = list.findIndex(b => b.id === bhajan.id);
        setCurrentIndex(index >= 0 ? index : 0);
      } else if (playlist.length === 0) {
        setPlaylist([bhajan]);
        setOriginalPlaylist([bhajan]);
        setCurrentIndex(0);
      } else {
        const index = playlist.findIndex(b => b.id === bhajan.id);
        if (index >= 0) {
          setCurrentIndex(index);
        } else {
          setPlaylist([...playlist, bhajan]);
          setCurrentIndex(playlist.length);
        }
      }
    } catch (err) {
      console.error('Failed to play bhajan:', err);
      setError('Failed to play this bhajan. Please try again.');
      setIsLoading(false);
    }
  }, [playlist, shuffle]);

  const pauseBhajan = useCallback(() => {
    setIsPlaying(false);
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  }, []);

  const resumeBhajan = useCallback(() => {
    setIsPlaying(true);
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseBhajan();
    } else {
      resumeBhajan();
    }
  }, [isPlaying, pauseBhajan, resumeBhajan]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    if (repeat === 'one') {
      // Replay current bhajan
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= playlist.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        // End of playlist
        setIsPlaying(false);
        return;
      }
    }

    setCurrentIndex(nextIndex);
    setCurrentBhajan(playlist[nextIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  }, [playlist, currentIndex, repeat]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;

    // If more than 3 seconds into the song, restart it
    if (currentTime > 3) {
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(0);
      }
      setCurrentTime(0);
      return;
    }

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (repeat === 'all') {
        prevIndex = playlist.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    setCurrentIndex(prevIndex);
    setCurrentBhajan(playlist[prevIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  }, [playlist, currentIndex, currentTime, repeat]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (playerRef.current) {
      if (newMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    }
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);

    if (newShuffle) {
      // Shuffle the playlist but keep current song
      const current = playlist[currentIndex];
      const remaining = playlist.filter((_, idx) => idx !== currentIndex);
      const shuffled = shuffleArray(remaining);
      const newPlaylist = [current, ...shuffled];
      setPlaylist(newPlaylist);
      setCurrentIndex(0);
    } else {
      // Restore original order
      const current = currentBhajan;
      setPlaylist(originalPlaylist);
      const newIndex = originalPlaylist.findIndex(b => b?.id === current?.id);
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
  }, [shuffle, playlist, currentIndex, currentBhajan, originalPlaylist]);

  const toggleRepeat = useCallback(() => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatState(nextMode);
  }, [repeat]);

  const setPlaybackRate = useCallback((rate: number) => {
    // Validate playback rate (0.25x to 2x)
    const validRate = Math.max(0.25, Math.min(2, rate));
    setPlaybackRateState(validRate);
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(validRate);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addToQueue = useCallback((bhajan: Bhajan) => {
    setPlaylist(prev => [...prev, bhajan]);
    setOriginalPlaylist(prev => [...prev, bhajan]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    if (index === currentIndex) {
      // Can't remove currently playing song
      return;
    }

    setPlaylist(prev => prev.filter((_, idx) => idx !== index));
    setOriginalPlaylist(prev => prev.filter((_, idx) => idx !== index));

    // Adjust current index if needed
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const clearPlayer = useCallback(() => {
    setCurrentBhajan(null);
    setPlaylist([]);
    setOriginalPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsPlayerVisible(false);
    setIsFullPlayerOpen(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setIsLoading(false);
    setIsBuffering(false);
    if (playerRef.current && playerRef.current.stopVideo) {
      playerRef.current.stopVideo();
    }
  }, []);

  const setPlayerReference = useCallback((player: any) => {
    playerRef.current = player;
  }, []);

  // Update playNextRef whenever playNext changes
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const value = {
    currentBhajan,
    playlist,
    isPlaying,
    volume,
    isMuted,
    shuffle,
    repeat,
    currentTime,
    duration,
    isPlayerVisible,
    isFullPlayerOpen,
    isLoading,
    isBuffering,
    error,
    playbackRate,
    playBhajan,
    pauseBhajan,
    resumeBhajan,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
    setFullPlayerOpen: setIsFullPlayerOpen,
    clearPlayer,
    setPlayerRef: setPlayerReference,
    setDuration,
    setCurrentTime,
    setPlaybackRate,
    clearError,
    setIsBuffering,
    setError,
    setIsLoading,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
