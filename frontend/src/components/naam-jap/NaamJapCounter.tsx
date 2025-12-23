import { useState, useEffect } from 'react';
import { Flame, Sparkles, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NaamJapCounterProps {
  initialCount: number;
  onCountChange: (count: number) => void;
  language: string;
}

const NaamJapCounter = ({ initialCount, onCountChange, language }: NaamJapCounterProps) => {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(Math.floor(initialCount / 1000) * 1000);
  const [showCelebration, setShowCelebration] = useState(false);

  // Progress to next thousand
  const progressToNextThousand = (count % 1000) / 1000 * 100;
  const nextMilestone = Math.ceil(count / 1000) * 1000;

  // Calculate color based on count
  const getGradientColor = () => {
    const thousands = Math.floor(count / 1000);
    const colors = [
      'from-orange-400 to-orange-600',      // 0-999
      'from-pink-400 to-pink-600',          // 1000-1999
      'from-purple-400 to-purple-600',      // 2000-2999
      'from-blue-400 to-blue-600',          // 3000-3999
      'from-green-400 to-green-600',        // 4000-4999
      'from-yellow-400 to-yellow-600',      // 5000-5999
      'from-red-400 to-red-600',            // 6000+
    ];
    return colors[Math.min(thousands, colors.length - 1)];
  };

  // Trigger celebration at milestones
  const triggerCelebration = () => {
    setShowCelebration(true);

    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b35', '#f7931e', '#fdc82f', '#8ac926', '#1982c4', '#6a4c93']
    });

    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // Handle click
  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange(newCount);

    // Click animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    // Check for milestone (every 1000)
    if (newCount > 0 && newCount % 1000 === 0) {
      setLastMilestone(newCount);
      triggerCelebration();
    }

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Sync with initial count changes
  useEffect(() => {
    setCount(initialCount);
    setLastMilestone(Math.floor(initialCount / 1000) * 1000);
  }, [initialCount]);

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce">
            <div className="text-8xl">
              {count >= 10000 ? '✨' : count >= 5000 ? '⭐' : count >= 3000 ? '💫' : '🔥'}
            </div>
          </div>
        </div>
      )}

      {/* Next Milestone Indicator */}
      {count > 0 && count % 1000 !== 0 && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {language === 'HI'
              ? `अगला माइलस्टोन: ${nextMilestone.toLocaleString()}`
              : `Next Milestone: ${nextMilestone.toLocaleString()}`}
          </p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-600 transition-all duration-300"
              style={{ width: `${progressToNextThousand}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Counter Circle */}
      <div className="relative">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={`${progressToNextThousand * 5.65} 565`}
            className="transition-all duration-300"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Clickable Circle */}
        <button
          onClick={handleClick}
          className={`
            relative w-48 h-48 md:w-64 md:h-64 rounded-full
            bg-gradient-to-br ${getGradientColor()}
            text-white font-bold
            shadow-2xl hover:shadow-3xl
            transform transition-all duration-200
            ${isAnimating ? 'scale-95' : 'scale-100 hover:scale-105'}
            active:scale-95
            flex flex-col items-center justify-center
            cursor-pointer
            select-none
            overflow-hidden
          `}
        >
          {/* Ripple Effect */}
          {isAnimating && (
            <div className="absolute inset-0 bg-white opacity-30 animate-ping rounded-full" />
          )}

          {/* Count Display */}
          <div className="relative z-10">
            <div className="text-6xl md:text-7xl font-black mb-2">
              {count.toLocaleString()}
            </div>
            <div className="text-sm md:text-base opacity-90 uppercase tracking-wider">
              {language === 'HI' ? 'नाम जप' : 'Naam Jap'}
            </div>

            {/* Milestone Badge */}
            {count > 0 && count % 1000 === 0 && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-pulse">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
            )}
          </div>

          {/* Click Hint */}
          <div className="absolute bottom-6 text-xs opacity-75 animate-pulse">
            {language === 'HI' ? 'टैप करें' : 'TAP'}
          </div>
        </button>
      </div>

      {/* Stats Below */}
      <div className="mt-6 text-center space-y-2">
        {/* Current Thousand */}
        {count >= 1000 && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>
              {language === 'HI'
                ? `${Math.floor(count / 1000)} हज़ार पूर्ण!`
                : `${Math.floor(count / 1000)} Thousand${Math.floor(count / 1000) > 1 ? 's' : ''} Complete!`}
            </span>
          </div>
        )}

        {/* Quick Add Buttons */}
        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={() => {
              const newCount = count + 108;
              setCount(newCount);
              onCountChange(newCount);
            }}
            className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full text-sm font-semibold transition-colors"
          >
            +108
          </button>
          <button
            onClick={() => {
              const newCount = count + 1080;
              setCount(newCount);
              onCountChange(newCount);
              if (newCount % 1000 < 1080 && Math.floor(newCount / 1000) > Math.floor((newCount - 1080) / 1000)) {
                triggerCelebration();
              }
            }}
            className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full text-sm font-semibold transition-colors"
          >
            +1 {language === 'HI' ? 'माला' : 'Mala'}
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setCount(0);
            onCountChange(0);
            setLastMilestone(0);
          }}
          className="text-xs text-gray-500 hover:text-gray-700 underline mt-2"
        >
          {language === 'HI' ? 'रीसेट करें' : 'Reset Counter'}
        </button>
      </div>
    </div>
  );
};

export default NaamJapCounter;
