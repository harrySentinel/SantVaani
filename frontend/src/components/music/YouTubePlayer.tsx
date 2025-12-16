import { useEffect, useRef } from 'react';
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
    playNext,
    setPlayerRef,
    setDuration,
    setCurrentTime: setContextCurrentTime,
  } = useMusicPlayer();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube IFrame API ready');
      };
    }
  }, []);

  // Create/update YouTube player when bhajan changes
  useEffect(() => {
    if (!currentBhajan?.youtube_url || !containerRef.current) return;

    const videoId = getYouTubeVideoId(currentBhajan.youtube_url);
    if (!videoId) {
      console.error('Invalid YouTube URL:', currentBhajan.youtube_url);
      return;
    }

    const initPlayer = () => {
      if (playerRef.current) {
        // Update existing player
        playerRef.current.loadVideoById(videoId);
        if (isPlaying) {
          playerRef.current.playVideo();
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
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
              // Pass player reference to context
              setPlayerRef(event.target);

              // Set initial volume and mute state
              event.target.setVolume(volume);
              if (isMuted) {
                event.target.mute();
              }

              // Set duration
              const videoDuration = event.target.getDuration();
              if (videoDuration) {
                setDuration(videoDuration);
              }

              // Auto-play if needed
              if (isPlaying) {
                event.target.playVideo();
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
                playNext();
              } else if (event.data === 1) {
                // Playing - update duration if not set
                const videoDuration = event.target.getDuration();
                if (videoDuration) {
                  setDuration(videoDuration);
                }
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      // Don't destroy player on unmount, keep it playing
    };
  }, [currentBhajan?.youtube_url, currentBhajan?.id]);

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
