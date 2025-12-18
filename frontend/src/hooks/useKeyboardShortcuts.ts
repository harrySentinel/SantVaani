import { useEffect } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

/**
 * Custom hook to handle keyboard shortcuts for the music player
 *
 * Keyboard shortcuts:
 * - Space: Play/Pause
 * - Arrow Right: Seek forward 10s
 * - Arrow Left: Seek backward 10s
 * - Arrow Up: Volume up
 * - Arrow Down: Volume down
 * - M: Mute/Unmute
 * - N: Next track
 * - P: Previous track
 * - S: Toggle shuffle
 * - R: Toggle repeat
 * - F: Toggle full player
 * - Escape: Close full player
 * - 0-9: Seek to percentage (0% - 90%)
 */
export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    volume,
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
  } = useMusicPlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Prevent default for handled keys
      const handledKeys = [
        ' ',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'm',
        'M',
        'n',
        'N',
        'p',
        'P',
        's',
        'S',
        'r',
        'R',
        'f',
        'F',
        'Escape',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ];

      if (handledKeys.includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case ' ':
          // Space: Play/Pause
          togglePlayPause();
          break;

        case 'ArrowRight':
          // Arrow Right: Seek forward 10s
          if (duration > 0) {
            const newTime = Math.min(currentTime + 10, duration);
            seekTo(newTime);
          }
          break;

        case 'ArrowLeft':
          // Arrow Left: Seek backward 10s
          if (duration > 0) {
            const newTime = Math.max(currentTime - 10, 0);
            seekTo(newTime);
          }
          break;

        case 'ArrowUp':
          // Arrow Up: Volume up by 10
          setVolume(Math.min(volume + 10, 100));
          break;

        case 'ArrowDown':
          // Arrow Down: Volume down by 10
          setVolume(Math.max(volume - 10, 0));
          break;

        case 'm':
        case 'M':
          // M: Mute/Unmute
          toggleMute();
          break;

        case 'n':
        case 'N':
          // N: Next track
          playNext();
          break;

        case 'p':
        case 'P':
          // P: Previous track
          playPrevious();
          break;

        case 's':
        case 'S':
          // S: Toggle shuffle
          toggleShuffle();
          break;

        case 'r':
        case 'R':
          // R: Toggle repeat
          toggleRepeat();
          break;

        case 'f':
        case 'F':
          // F: Toggle full player
          setFullPlayerOpen(!isFullPlayerOpen);
          break;

        case 'Escape':
          // Escape: Close full player
          if (isFullPlayerOpen) {
            setFullPlayerOpen(false);
          }
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          // Number keys: Seek to percentage
          if (duration > 0) {
            const percentage = parseInt(event.key, 10) * 10;
            const newTime = (duration * percentage) / 100;
            seekTo(newTime);
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isPlaying,
    volume,
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
  ]);
};
