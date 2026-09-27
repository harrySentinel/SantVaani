'use client';

import { useEffect, useMemo, useState } from 'react';

interface NaamJapCounterProps {
  initialCount: number;
  onCountChange: (count: number) => void;
  language: string;
}

const BEADS = 108;
const SIZE = 280;
const CENTER = SIZE / 2;
const RING_R = 118;

// One physical mala has 108 beads plus a slightly larger "guru" bead marking where a round begins and ends.
// Rounded to 2dp so server and client render byte-identical numbers — some
// runtimes' Math.cos/sin differ in the last bit, which otherwise trips hydration.
const round2 = (n: number) => Math.round(n * 100) / 100;

const beadPositions = Array.from({ length: BEADS }, (_, i) => {
  const angle = (i / BEADS) * Math.PI * 2 - Math.PI / 2;
  return {
    x: round2(CENTER + RING_R * Math.cos(angle)),
    y: round2(CENTER + RING_R * Math.sin(angle)),
    isGuru: i === 0,
  };
});

const NaamJapCounter = ({ initialCount, onCountChange, language }: NaamJapCounterProps) => {
  const [count, setCount] = useState(initialCount);
  const [pulse, setPulse] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const lit = count === 0 ? 0 : ((count - 1) % BEADS) + 1;
  const rounds = Math.floor(count / BEADS);
  const HI = language === 'HI';

  const applyCount = (newCount: number) => {
    setCount(newCount);
    onCountChange(newCount);
    setPulse(true);
    setTimeout(() => setPulse(false), 180);
    if ('vibrate' in navigator) navigator.vibrate(newCount % BEADS === 0 ? [12, 40, 12] : 10);
    if (newCount > 0 && newCount % BEADS === 0) {
      setRoundComplete(true);
      setTimeout(() => setRoundComplete(false), 1600);
    }
  };

  const handleTap = () => applyCount(count + 1);
  const addRound = () => applyCount(count + BEADS);
  const reset = () => applyCount(0);

  const arcPath = useMemo(() => {
    // Faint guide arc behind the beads, purely decorative.
    return `M ${CENTER} ${CENTER - RING_R} A ${RING_R} ${RING_R} 0 1 1 ${CENTER - 0.01} ${CENTER - RING_R}`;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {roundComplete && (
          <div className="absolute inset-0 rounded-full animate-[ping_1.4s_ease-out] bg-[#d4a017]/20 pointer-events-none" />
        )}

        <button
          onClick={handleTap}
          aria-label={HI ? 'नाम जप के लिए टैप करें' : 'Tap to chant'}
          className={`relative w-full h-full rounded-full select-none transition-transform duration-150 ${pulse ? 'scale-[0.98]' : 'scale-100'} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf8f5]`}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full -rotate-0">
            <path d={arcPath} fill="none" stroke="#241a12" strokeOpacity="0.06" strokeWidth="1.5" />
            {beadPositions.map((b, i) => {
              const isLit = i < lit;
              const r = b.isGuru ? 7 : 5;
              return (
                <circle
                  key={i}
                  cx={b.x}
                  cy={b.y}
                  r={r}
                  className="transition-all duration-200"
                  fill={isLit ? (b.isGuru ? '#c2410c' : '#d4a017') : '#241a12'}
                  fillOpacity={isLit ? 1 : 0.08}
                  style={isLit ? { filter: 'drop-shadow(0 0 3px rgba(212,160,23,0.7))' } : undefined}
                />
              );
            })}
          </svg>

          <div className="absolute inset-[22px] rounded-full bg-white shadow-[0_20px_50px_-15px_rgba(36,26,18,0.35)] flex flex-col items-center justify-center">
            <span className="font-tiro font-normal text-6xl md:text-7xl text-[#241a12] leading-none tabular-nums">
              {count.toLocaleString()}
            </span>
            <span className="mt-3 text-[13px] text-[#7a6a5c]">
              {rounds > 0
                ? (HI ? `${rounds} माला पूर्ण` : `${rounds} mala${rounds > 1 ? 's' : ''} complete`)
                : count > 0
                ? (HI ? 'जारी रखें' : 'keep going')
                : (HI ? 'टैप करें' : 'tap to begin')}
            </span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-5 mt-6">
        <button
          onClick={addRound}
          className="text-[13px] font-medium text-[#c2410c] hover:text-[#9a3412] transition-colors"
        >
          {HI ? '+१ माला (१०८)' : '+1 mala (108)'}
        </button>
        <span className="w-1 h-1 rounded-full bg-[#241a12]/15" />
        <button
          onClick={reset}
          className="text-[13px] font-medium text-[#7a6a5c] hover:text-[#241a12] transition-colors"
        >
          {HI ? 'रीसेट करें' : 'Reset'}
        </button>
      </div>
    </div>
  );
};

export default NaamJapCounter;
