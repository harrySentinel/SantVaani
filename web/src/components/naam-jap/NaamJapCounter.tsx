'use client';

import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface NaamJapCounterProps {
  initialCount: number;
  onCountChange: (count: number) => void;
  language: string;
}

const BEADS = 108;
const SIZE = 272;
const CENTER = SIZE / 2;
const RING_R = 112;

// The common ways people count japa: one mala (108 beads), and multiples of it.
const QUICK_ADD = [108, 216, 540, 1080];

// Rounded to 2dp so server and client render byte-identical numbers — some
// runtimes' Math.cos/sin differ in the last bit, which otherwise trips hydration.
const round2 = (n: number) => Math.round(n * 100) / 100;

// A strung mala isn't a perfect machine-drawn circle — real beads sit with a little
// give in the thread. A tiny per-bead radius wobble (seeded, so it's stable across
// renders) reads as strung rather than plotted.
const wobble = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s) - 0.5) * 3;
};

const beadPositions = Array.from({ length: BEADS }, (_, i) => {
  const angle = (i / BEADS) * Math.PI * 2 - Math.PI / 2;
  const r = RING_R + wobble(i);
  return {
    x: round2(CENTER + r * Math.cos(angle)),
    y: round2(CENTER + r * Math.sin(angle)),
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
  const addQuick = (n: number) => applyCount(count + n);
  const reset = () => applyCount(0);

  // The cord threading every bead together — drawn once behind them, like a real strand.
  const cordPath = useMemo(() => {
    return beadPositions.map((b, i) => `${i === 0 ? 'M' : 'L'} ${b.x} ${b.y}`).join(' ') + ' Z';
  }, []);

  return (
    <div className="w-full">
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE + 34 }}>
        {roundComplete && (
          <div className="absolute inset-0 rounded-full animate-[ping_1s_ease-out] bg-[#ea580c]/10 pointer-events-none" />
        )}

        <button
          onClick={handleTap}
          aria-label={HI ? 'एक गिनती जोड़ने के लिए टैप करें' : 'Tap to add one'}
          className={`relative select-none transition-transform duration-150 ${pulse ? 'scale-[0.98]' : 'scale-100'} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf8f5] rounded-full`}
          style={{ width: SIZE, height: SIZE }}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="beadDim" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#e8d4b8" />
                <stop offset="100%" stopColor="#c9a877" />
              </radialGradient>
              <radialGradient id="beadLit" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#b45f3a" />
                <stop offset="100%" stopColor="#7c3a1d" />
              </radialGradient>
              <radialGradient id="beadGuru" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#d6764a" />
                <stop offset="100%" stopColor="#9a3412" />
              </radialGradient>
            </defs>

            <path d={cordPath} fill="none" stroke="#241a12" strokeOpacity="0.12" strokeWidth="1" />

            {beadPositions.map((b, i) => {
              const isLit = i < lit;
              const r = b.isGuru ? 8 : 6.2;
              const fill = b.isGuru ? 'url(#beadGuru)' : isLit ? 'url(#beadLit)' : 'url(#beadDim)';
              return (
                <circle
                  key={i}
                  cx={b.x}
                  cy={b.y}
                  r={r}
                  fill={fill}
                  stroke="#241a12"
                  strokeOpacity={isLit || b.isGuru ? 0.18 : 0.08}
                  strokeWidth="0.75"
                  className="transition-[fill] duration-200"
                />
              );
            })}
          </svg>

          {/* Tassel hanging from the guru bead, like a physical mala. */}
          <svg viewBox="0 0 40 40" className="absolute w-7 h-7 pointer-events-none" style={{ left: CENTER - 14, top: -6 }}>
            <path d="M20 2 L20 16" stroke="#9a3412" strokeWidth="1.5" strokeOpacity="0.5" />
            {[-6, -2, 2, 6].map(dx => (
              <path key={dx} d={`M20 16 Q${20 + dx} 26 ${20 + dx * 1.3} 36`} stroke="#c2410c" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            ))}
          </svg>

          <div className="absolute rounded-full bg-[#fefaf3] border border-[#241a12]/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_3px_rgba(36,26,18,0.12)] flex flex-col items-center justify-center" style={{ inset: 28, top: 40 }}>
            <span className="font-tiro font-normal text-6xl md:text-7xl text-[#241a12] leading-none tabular-nums">
              {count.toLocaleString()}
            </span>
            <span className="mt-3 text-[13px] text-[#7a6a5c]">
              {rounds > 0
                ? (HI ? `${rounds} माला पूर्ण` : `${rounds} mala${rounds > 1 ? 's' : ''} complete`)
                : count > 0
                ? (HI ? 'जारी रखें' : 'keep going')
                : (HI ? 'आज शुरू करें' : 'begin today')}
            </span>
          </div>
        </button>
      </div>

      {/* Quick add — how most people actually log japa: by the mala, not bead by bead. */}
      <div className="mt-8">
        <p className="text-center text-[12px] text-[#7a6a5c] mb-2.5">
          {HI ? 'माला जोड़ें' : 'Add a mala'}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ADD.map(n => (
            <button
              key={n}
              onClick={() => addQuick(n)}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#f1e7d8] border border-[#241a12]/8 py-3 transition-all duration-150 active:scale-[0.95] active:bg-[#e8d9c2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]"
            >
              <span className="font-tiro text-[18px] leading-none text-[#241a12]">+{n}</span>
              <span className="mt-1 text-[10px] text-[#8a6f52]">
                {n === 108 ? (HI ? '1 माला' : '1 mala') : `${n / 108} ${HI ? 'माला' : 'mala'}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-[#7a6a5c] hover:text-[#241a12] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          {HI ? 'रीसेट करें' : 'Reset'}
        </button>
      </div>
    </div>
  );
};

export default NaamJapCounter;
