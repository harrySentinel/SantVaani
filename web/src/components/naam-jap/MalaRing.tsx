'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

const BEADS = 108;
const STEP = 360 / BEADS;

// Rounded so server and client produce identical numbers (Math.cos/sin can differ in the last bit).
const round2 = (n: number) => Math.round(n * 100) / 100;

// Real beads sit with a little give on the thread; a seeded wobble reads as strung, not plotted.
const wobble = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s) - 0.5) * 2.6;
};

const TONES = {
  light: {
    dim: ['#f1e2c8', '#c9a877'],
    passed: ['#c47650', '#7c3a1d'],
    guru: ['#e38c5c', '#9a3412'],
    cord: 'rgba(36,26,18,0.16)',
    bead: 'rgba(36,26,18,0.12)',
    thumb: 'rgba(234,88,12,0.3)',
    ring: 'rgba(234,88,12,0.6)',
    tassel: '#b4501f',
  },
  dark: {
    dim: ['#7a6552', '#4a3a2d'],
    passed: ['#f6c778', '#b9742f'],
    guru: ['#ffb07a', '#c2410c'],
    cord: 'rgba(251,241,228,0.2)',
    bead: 'rgba(0,0,0,0.25)',
    thumb: 'rgba(246,199,120,0.4)',
    ring: 'rgba(246,199,120,0.85)',
    tassel: '#ffb07a',
  },
} as const;

interface MalaRingProps {
  count: number;
  size?: number;
  tone?: 'light' | 'dark';
  /** Increment to play the "mala complete" bloom. */
  bloom?: number;
  children?: ReactNode;
}

/**
 * A 108-bead mala whose strand turns one bead per count, the way beads slide past the
 * thumb in real japa. The thumb point is fixed at the bottom; the guru bead and tassel
 * travel with the strand, so a new round begins with the guru bead under the thumb.
 */
export default function MalaRing({ count, size = 272, tone = 'light', bloom = 0, children }: MalaRingProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const t = TONES[tone];
  const c = size / 2;
  const ringR = size * 0.415;
  const beadR = size * 0.0235;

  const beads = useMemo(
    () =>
      Array.from({ length: BEADS }, (_, i) => {
        const a = ((90 + i * STEP) * Math.PI) / 180;
        const r = ringR + wobble(i) * (size / 272);
        return { x: round2(c + r * Math.cos(a)), y: round2(c + r * Math.sin(a)) };
      }),
    [c, ringR, size],
  );
  const cord = useMemo(() => beads.map((b, i) => `${i ? 'L' : 'M'}${b.x} ${b.y}`).join(' ') + 'Z', [beads]);

  // Invariant: rot ≡ -count·STEP (mod 360). Big jumps are capped to a few visible turns.
  const [rot, setRot] = useState(() => -(count % BEADS) * STEP);
  const [dur, setDur] = useState(0);
  const prev = useRef(count);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const p = prev.current;
    prev.current = count;
    if (p === count) return;
    let delta: number;
    if (count === 0) {
      // Reset unwinds the current round back to the guru bead.
      delta = -(p % BEADS);
    } else {
      const d = count - p;
      const a = Math.abs(d);
      delta = Math.sign(d) * (a > 540 ? (a % BEADS) + 324 : a);
    }
    const a = Math.abs(delta);
    setDur(reduceMotion.current || a === 0 ? 0 : a === 1 ? 0.3 : Math.min(0.6 + Math.log10(a) * 0.45, 1.9));
    setRot(r => r - delta * STEP);
  }, [count]);

  const lap = count % BEADS;
  const thumbY = c + ringR;
  const guru = beads[0];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {bloom > 0 && (
        <span
          key={bloom}
          aria-hidden="true"
          className="absolute inset-[5%] rounded-full pointer-events-none opacity-0 animate-[naamjapBloom_1.2s_ease-out_forwards]"
          style={{ boxShadow: `0 0 0 2px ${t.ring}, 0 0 30px 4px ${t.thumb}` }}
        />
      )}

      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute inset-0 overflow-visible" aria-hidden="true">
        <defs>
          {(['dim', 'passed', 'guru'] as const).map(k => (
            <radialGradient key={k} id={`${uid}-${k}`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor={t[k][0]} />
              <stop offset="100%" stopColor={t[k][1]} />
            </radialGradient>
          ))}
          <radialGradient id={`${uid}-thumb`}>
            <stop offset="0%" stopColor={t.thumb} />
            <stop offset="100%" stopColor={t.thumb} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Where the thumb rests. */}
        <circle cx={c} cy={thumbY} r={beadR * 3.4} fill={`url(#${uid}-thumb)`} />

        <g
          style={{
            transform: `rotate(${rot}deg)`,
            transformOrigin: '50% 50%',
            transformBox: 'view-box',
            transition: dur ? `transform ${dur}s cubic-bezier(.2,.85,.25,1)` : 'none',
          }}
        >
          <path d={cord} fill="none" stroke={t.cord} strokeWidth={1} />

          <g transform={`translate(${guru.x} ${guru.y})`} stroke={t.tassel} strokeOpacity={0.75} fill="none" strokeLinecap="round" strokeWidth={1.3}>
            <path d={`M0 ${beadR} L0 ${beadR * 2.6}`} />
            {[-3, -1, 1, 3].map(dx => (
              <path key={dx} d={`M0 ${beadR * 2.6} Q${dx * 1.6} ${beadR * 4.2} ${dx * 2.4} ${beadR * 6}`} />
            ))}
          </g>

          {beads.map((b, i) => {
            const isGuru = i === 0;
            const current = i === lap;
            const kind = isGuru ? 'guru' : i < lap ? 'passed' : 'dim';
            const r = (isGuru ? beadR * 1.3 : beadR) + (current ? beadR * 0.35 : 0);
            return (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r={r}
                fill={`url(#${uid}-${kind})`}
                stroke={current ? t.ring : t.bead}
                strokeWidth={current ? 1.4 : 0.6}
              />
            );
          })}
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full flex flex-col items-center justify-center text-center"
          style={{
            width: size * 0.66,
            height: size * 0.66,
            ...(tone === 'dark'
              ? {
                  background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.09), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                }
              : {
                  background: 'radial-gradient(circle at 50% 30%, #fffdf8, #f8eedd)',
                  border: '1px solid rgba(212,153,31,0.2)',
                  boxShadow: 'inset 0 1px 0 #fff, inset 0 -8px 18px rgba(36,26,18,0.06), 0 6px 18px -8px rgba(36,26,18,0.25)',
                }),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
