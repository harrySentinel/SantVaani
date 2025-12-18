import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

/**
 * Component that enables global keyboard shortcuts for the music player
 * This component doesn't render anything, it just sets up event listeners
 */
const KeyboardShortcuts = () => {
  useKeyboardShortcuts();
  return null;
};

export default KeyboardShortcuts;
