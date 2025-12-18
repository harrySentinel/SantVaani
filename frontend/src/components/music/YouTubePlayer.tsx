import { useEffect, useRef, useCallback } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = () => {
  const {
    currentBhajan,
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    playNext,
    setPlayerRef,
    setDuration,
    setCurrentTime: setContextCurrentTime,
    setIsBuffering,
    setError,
    isLoading,
    setIsLoading,
  } = useMusicPlayer();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playNextRef = useRef<(() => void)>(playNext);
  const apiLoadedRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  // Update playNextRef when playNext changes
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Handle play next using ref to avoid stale closure
  const handlePlayNext = useCallback(() => {
    playNextRef.current?.();
  }, []);

  // Load YouTube IFrame API with error handling
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (apiLoadedRef.current) return;

      try {
        if (!window.YT) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          tag.onerror = () => {
            console.error('Failed to load YouTube IFrame API');
            setError('Failed to load video player. Please check your internet connection.');
            apiLoadedRef.current = false;
          };

          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

          window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube IFrame API ready');
            apiLoadedRef.current = true;
            setError(null);
          };
        } else {
          apiLoadedRef.current = true;
        }
      } catch (err) {
        console.error('Error loading YouTube API:', err);
        setError('Failed to initialize video player');
      }
    };

    loadYouTubeAPI();
  }, [setError]);

  // Create/update YouTube player when bhajan changes
  useEffect(() => {
    if (!currentBhajan?.youtube_url || !containerRef.current) return;

    const videoId = getYouTubeVideoId(currentBhajan.youtube_url);
    if (!videoId) {
      console.error('Invalid YouTube URL:', currentBhajan.youtube_url);
      setError('Invalid video URL. Please try another bhajan.');
      return;
    }

    const initPlayer = () => {
      try {
        setIsBuffering(true);
        setError(null);

        if (playerRef.current) {
          // Update existing player
          playerRef.current.loadVideoById(videoId);
          if (isPlaying) {
            playerRef.current.playVideo()
              .catch((err: Error) => {
                console.warn('Autoplay prevented:', err);
                // Autoplay was prevented, user needs to interact first
                setError('Click play to start the bhajan');
              });
          }
        } else {
          // Create new player
          playerRef.current = new window.YT.Player(containerRef.current, {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              playsinline: 1, // Better mobile support
            },
            events: {
              onReady: (event: any) => {
                console.log('YouTube player ready');
                setIsBuffering(false);
                setIsLoading(false);
                retryCountRef.current = 0;

                // Pass player reference to context
                setPlayerRef(event.target);

                // Set initial volume, mute state, and playback rate
                event.target.setVolume(volume);
                if (isMuted) {
                  event.target.mute();
                }
                event.target.setPlaybackRate(playbackRate);

                // Set duration
                const videoDuration = event.target.getDuration();
                if (videoDuration) {
                  setDuration(videoDuration);
                }

                // Auto-play if needed
                if (isPlaying) {
                  event.target.playVideo()
                    .catch((err: Error) => {
                      console.warn('Autoplay prevented:', err);
                      setError('Click play to start the bhajan');
                    });
                }
              },
              onStateChange: (event: any) => {
                // YouTube Player States:
                // -1: unstarted
                // 0: ended
                // 1: playing
                // 2: paused
                // 3: buffering
                // 5: video cued

                if (event.data === 0) {
                  // Video ended - play next song
                  console.log('Video ended, playing next...');
                  setIsBuffering(false);
                  handlePlayNext();
                } else if (event.data === 1) {
                  // Playing - update duration if not set and clear buffering/loading
                  setIsBuffering(false);
                  setIsLoading(false);
                  setError(null);
                  const videoDuration = event.target.getDuration();
                  if (videoDuration) {
                    setDuration(videoDuration);
                  }
                } else if (event.data === 3) {
                  // Buffering
                  setIsBuffering(true);
                } else if (event.data === 2) {
                  // Paused
                  setIsBuffering(false);
                }
              },
              onError: (event: any) => {
                console.error('YouTube player error:', event.data);
                setIsBuffering(false);
                setIsLoading(false);

                // YouTube error codes:
                // 2: Invalid parameter
                // 5: HTML5 player error
                // 100: Video not found
                // 101/150: Video not embeddable

                const errorMessages: Record<number, string> = {
                  2: 'Invalid video. Please try another bhajan.',
                  5: 'Playback error. Please refresh and try again.',
                  100: 'Video not found. It may have been removed.',
                  101: 'Video cannot be played. Please try another.',
                  150: 'Video cannot be played. Please try another.',
                };

                const errorMsg = errorMessages[event.data] || 'Failed to play video. Please try another bhajan.';
                setError(errorMsg);

                // Retry logic
                if (retryCountRef.current < MAX_RETRIES) {
                  retryCountRef.current++;
                  console.log(`Retrying... (${retryCountRef.current}/${MAX_RETRIES})`);
                  setTimeout(() => {
                    if (playerRef.current) {
                      playerRef.current.loadVideoById(videoId);
                    }
                  }, 2000);
                } else {
                  // Max retries reached, skip to next
                  console.log('Max retries reached, skipping...');
                  setTimeout(handlePlayNext, 2000);
                }
              },
            },
          });
        }
      } catch (err) {
        console.error('Failed to initialize player:', err);
        setError('Failed to load video player');
        setIsBuffering(false);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Wait for API to load
      const checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkAPI);
          initPlayer();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkAPI);
        if (!window.YT || !window.YT.Player) {
          setError('Failed to load video player. Please refresh the page.');
        }
      }, 10000);
    }

    return () => {
      // Don't destroy player on unmount, keep it playing
    };
  }, [currentBhajan?.youtube_url, currentBhajan?.id, isPlaying, volume, isMuted, playbackRate, setPlayerRef, setDuration, setIsBuffering, setError, handlePlayNext]);

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo?.();
    } else {
      playerRef.current.pauseVideo?.();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume?.(volume);
  }, [volume]);

  // Handle mute
  useEffect(() => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.mute?.();
    } else {
      playerRef.current.unMute?.();
    }
  }, [isMuted]);

  // Handle playback rate changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate?.(playbackRate);
  }, [playbackRate]);

  // Update current time periodically while playing
  useEffect(() => {
    if (!playerRef.current || !isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setContextCurrentTime(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, setContextCurrentTime]);

  // Hidden container for YouTube player
  return <div ref={containerRef} style={{ display: 'none' }} />;
};

export default YouTubePlayer;
