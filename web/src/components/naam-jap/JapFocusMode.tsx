'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import MalaRing from './MalaRing';
import { useAnimatedNumber } from './useAnimatedNumber';
import { PERIODS, type DayPeriod } from './timeOfDay';

interface JapFocusModeProps {
  count: number;
  mantra: string;
  period: DayPeriod;
  language: string;
  bloom: number;
  onTap: () => void;
  onClose: () => void;
}

type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
};

/** Full-screen chanting: tap anywhere, keep the phone awake, nothing else on screen. */
export default function JapFocusMode({ count, mantra, period, language, bloom, onTap, onClose }: JapFocusModeProps) {
  const HI = language === 'HI';
  const P = PERIODS[period];
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tapped, setTapped] = useState(false);
  const [size, setSize] = useState(300);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const seq = useRef(0);
  const onTapRef = useRef(onTap);
  const onCloseRef = useRef(onClose);
  const shown = useAnimatedNumber(count);

  useEffect(() => {
    onTapRef.current = onTap;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    setSize(Math.min(320, window.innerWidth - 56));
    dialogRef.current?.focus({ preventScroll: true });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let lock: { release: () => Promise<void> } | null = null;
    (navigator as WakeLockNavigator).wakeLock?.request('screen').then(l => { lock = l; }).catch(() => {});

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      else if ((e.key === ' ' || e.key === 'Enter') && document.activeElement !== closeRef.current) {
        e.preventDefault();
        onTapRef.current();
        setTapped(true);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      lock?.release().catch(() => {});
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    onTap();
    setTapped(true);
    seq.current += 1;
    const id = seq.current;
    setRipples(r => [...r.slice(-5), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 700);
  };

  const rounds = Math.floor(count / 108);
  const lap = count % 108;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={HI ? 'जप मोड' : 'Chanting mode'}
      onPointerDown={handleTap}
      className="fixed inset-0 z-[80] flex flex-col select-none outline-none text-[#fbf1e4] font-mukta animate-[naamjapFadeIn_0.35s_ease-out]"
      style={{
        background: `radial-gradient(130% 90% at 50% 105%, ${P.deep[1]} 0%, ${P.deep[0]} 62%)`,
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <span className="text-[13px] text-[#fbf1e4]/65">{HI ? P.hi : P.en}</span>
        <button
          ref={closeRef}
          onPointerDown={e => e.stopPropagation()}
          onClick={onClose}
          aria-label={HI ? 'जप मोड बंद करें' : 'Exit chanting mode'}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6c778]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p
          className="font-tiro text-[2.5rem] sm:text-5xl leading-tight text-center text-[#fde7c7]"
          style={{ textShadow: '0 0 32px rgba(246,199,120,0.35)' }}
        >
          {mantra}
        </p>
        <div className="mt-8">
          <MalaRing count={count} size={size} tone="dark" bloom={bloom}>
            <span className="font-tiro text-6xl leading-none tabular-nums">{shown.toLocaleString('en-IN')}</span>
            <span className="mt-2 text-[13px] text-[#fbf1e4]/60 tabular-nums">
              {rounds > 0 && lap === 0
                ? (HI ? `${rounds} माला पूर्ण` : `${rounds} mala${rounds > 1 ? 's' : ''} complete`)
                : (HI ? `माला ${rounds + 1} · ${lap}/108` : `Mala ${rounds + 1} · ${lap}/108`)}
            </span>
          </MalaRing>
        </div>
      </div>

      <p
        className={`pb-[max(2rem,env(safe-area-inset-bottom))] text-center text-[13px] text-[#fbf1e4]/55 transition-opacity duration-700 ${tapped ? 'opacity-0' : 'opacity-100'}`}
      >
        {HI ? 'स्क्रीन पर कहीं भी टैप करें' : 'Tap anywhere on the screen'}
      </p>

      <span className="sr-only" aria-live="polite">{count}</span>

      {ripples.map(r => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none fixed w-16 h-16 -ml-8 -mt-8 rounded-full border border-[#f6c778]/60 opacity-0 animate-[naamjapRipple_0.7s_ease-out_forwards]"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}
