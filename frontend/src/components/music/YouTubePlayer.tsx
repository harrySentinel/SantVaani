import { useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = () => {
  const { currentBhajan, isPlaying, volume, isMuted } = useMusicPlayer();
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
              event.target.setVolume(volume);
              if (isMuted) {
                event.target.mute();
              }
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // Handle state changes in context
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

  // Hidden container for YouTube player
  return <div ref={containerRef} style={{ display: 'none' }} />;
};

export default YouTubePlayer;
