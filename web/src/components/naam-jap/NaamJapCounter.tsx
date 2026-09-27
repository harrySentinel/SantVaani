'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import MalaRing from './MalaRing';
import JapFocusMode from './JapFocusMode';
import { useAnimatedNumber } from './useAnimatedNumber';
import { playBead, playBell } from './sounds';
import type { DayPeriod } from './timeOfDay';

const MANTRAS = [
  { id: 'ram', hi: 'राम', en: 'Ram' },
  { id: 'radhe', hi: 'राधे राधे', en: 'Radhe Radhe' },
  { id: 'shiv', hi: 'ॐ नमः शिवाय', en: 'Om Namah Shivaya' },
  { id: 'krishna', hi: 'हरे कृष्ण', en: 'Hare Krishna' },
  { id: 'om', hi: 'ॐ', en: 'Om' },
  { id: 'waheguru', hi: 'वाहेगुरु', en: 'Waheguru' },
];

// How people actually log japa done on physical beads: by the mala.
const QUICK_ADD = [108, 216, 540, 1080];
const TALLY_MAX = 12;

const readPref = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const writePref = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
};

interface NaamJapCounterProps {
  count: number;
  onCountChange: (count: number) => void;
  language: string;
  period: DayPeriod;
}

export default function NaamJapCounter({ count, onCountChange, language, period }: NaamJapCounterProps) {
  const HI = language === 'HI';
  const [mantraId, setMantraId] = useState('ram');
  const [sound, setSound] = useState(true);
  const [bloom, setBloom] = useState(0);
  const [gain, setGain] = useState<{ id: number; n: number } | null>(null);
  const [focus, setFocus] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const countRef = useRef(count);
  const shown = useAnimatedNumber(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const m = readPref('naamjap-mantra');
    if (m && MANTRAS.some(x => x.id === m)) setMantraId(m);
    if (readPref('naamjap-sound') === 'off') setSound(false);
  }, []);

  const mantra = MANTRAS.find(m => m.id === mantraId) ?? MANTRAS[0];
  const mantraLabel = HI ? mantra.hi : mantra.en;
  const rounds = Math.floor(count / 108);
  const lap = count % 108;

  // Reads the latest count from a ref so fast taps in chanting mode never drop a bead.
  const add = (n: number) => {
    const before = countRef.current;
    const next = Math.max(0, before + n);
    countRef.current = next;
    onCountChange(next);

    const completed = Math.floor(next / 108) > Math.floor(before / 108);
    if (sound) {
      playBead();
      if (completed) setTimeout(playBell, n === 1 ? 40 : 380);
    }
    if (completed) setBloom(b => b + 1);
    if ('vibrate' in navigator) navigator.vibrate(completed ? [14, 50, 18] : 8);
    if (n > 1) {
      const id = Date.now();
      setGain({ id, n });
      setTimeout(() => setGain(g => (g?.id === id ? null : g)), 900);
    }
  };

  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
    countRef.current = 0;
    onCountChange(0);
  };

  const chooseMantra = (id: string) => {
    setMantraId(id);
    writePref('naamjap-mantra', id);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    writePref('naamjap-sound', next ? 'on' : 'off');
  };

  const status =
    count === 0
      ? (HI ? 'पहला मनका छुएं' : 'Touch the first bead')
      : lap === 0
      ? (HI ? `${rounds} माला पूर्ण` : `${rounds} mala${rounds > 1 ? 's' : ''} complete`)
      : (HI ? `माला ${rounds + 1} · ${lap}/108` : `Mala ${rounds + 1} · ${lap}/108`);

  return (
    <>
      <section
        aria-label={HI ? 'जप माला' : 'Japa mala'}
        className="relative rounded-[2rem] bg-gradient-to-b from-white to-[#fbf4e8] border border-[#241a12]/[0.06] shadow-[0_1px_2px_rgba(36,26,18,0.05),0_24px_50px_-28px_rgba(36,26,18,0.45)] px-4 pt-4 pb-6"
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MANTRAS.map(m => {
              const on = m.id === mantraId;
              return (
                <button
                  key={m.id}
                  onClick={() => chooseMantra(m.id)}
                  aria-pressed={on}
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 font-tiro text-[14px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] ${
                    on ? 'bg-[#241a12] text-[#fbf1e4]' : 'bg-[#f4ead9] text-[#5c4632] hover:bg-[#eddcc2]'
                  }`}
                >
                  {HI ? m.hi : m.en}
                </button>
              );
            })}
          </div>
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? (HI ? 'ध्वनि बंद करें' : 'Mute sound') : (HI ? 'ध्वनि चालू करें' : 'Turn sound on')}
            className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-[#7a6a5c] hover:bg-[#f4ead9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]"
          >
            {sound ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
          </button>
        </div>

        <div className="relative mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => add(1)}
            aria-label={HI ? `${mantra.hi} — एक जप जोड़ें` : `Add one ${mantra.en}`}
            className="relative rounded-full select-none touch-manipulation transition-transform duration-100 active:scale-[0.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            <MalaRing count={count} size={272} bloom={bloom}>
              <span className="font-tiro text-[15px] leading-tight text-[#b4501f] px-8 line-clamp-1">{mantraLabel}</span>
              <span className="mt-1 font-tiro text-[3.4rem] leading-none text-[#241a12] tabular-nums">
                {shown.toLocaleString('en-IN')}
              </span>
              <span className="mt-2 text-[12px] text-[#7a6a5c] tabular-nums">{status}</span>
            </MalaRing>
          </button>
          {gain && (
            <span
              key={gain.id}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[36%] font-tiro text-2xl text-[#c2410c] opacity-0 animate-[naamjapGain_0.9s_ease-out_forwards]"
            >
              +{gain.n}
            </span>
          )}
          <span className="sr-only" aria-live="polite">{count}</span>
        </div>

        {/* Today's completed malas, strung as a small tally. */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-1.5 h-4">
            {Array.from({ length: Math.min(rounds, TALLY_MAX) }, (_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full shadow-[0_1px_1.5px_rgba(36,26,18,0.35)] ${
                  i === Math.min(rounds, TALLY_MAX) - 1 ? 'animate-[naamjapPop_0.45s_cubic-bezier(.3,1.6,.5,1)]' : ''
                }`}
                style={{ background: 'radial-gradient(circle at 35% 30%, #c47650, #7c3a1d)' }}
              />
            ))}
            {rounds < TALLY_MAX && <span className="w-3 h-3 rounded-full border border-dashed border-[#241a12]/25" />}
            {rounds > TALLY_MAX && <span className="ml-1 text-[11px] text-[#7a6a5c]">+{rounds - TALLY_MAX}</span>}
          </div>
          <p className="mt-2 text-[12px] text-[#7a6a5c]">
            {HI ? `आज की पूर्ण मालाएँ · ${rounds}` : `Malas completed today · ${rounds}`}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {QUICK_ADD.map(n => (
            <button
              key={n}
              onClick={() => add(n)}
              className="flex flex-col items-center justify-center rounded-2xl bg-[#f4ead9] border border-[#241a12]/[0.07] shadow-[0_1px_2px_rgba(36,26,18,0.06)] py-2.5 transition-all duration-150 active:scale-[0.95] active:bg-[#ecdcbe] hover:bg-[#efe1ca] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]"
            >
              <span className="font-tiro text-[17px] leading-none text-[#241a12]">+{n / 108}</span>
              <span className="mt-1 text-[10px] text-[#8a6f52]">{HI ? `माला · ${n}` : `mala · ${n}`}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setFocus(true)}
          className="mt-4 w-full h-12 rounded-full bg-[#241a12] text-[#fbf1e4] text-[15px] font-semibold flex items-center justify-center gap-2 shadow-[0_10px_24px_-12px_rgba(36,26,18,0.8)] transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2"
        >
          <Maximize2 className="w-4 h-4" />
          {HI ? 'जप मोड में जाएं' : 'Enter chanting mode'}
        </button>

        <div className="mt-3 flex justify-center">
          <button
            onClick={reset}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
              confirmReset ? 'text-[#c2410c]' : 'text-[#7a6a5c] hover:text-[#241a12]'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            {confirmReset
              ? (HI ? 'पुष्टि के लिए फिर टैप करें' : 'Tap again to reset')
              : (HI ? 'आज की गिनती रीसेट करें' : 'Reset today')}
          </button>
        </div>
      </section>

      {focus && (
        <JapFocusMode
          count={count}
          mantra={mantraLabel}
          period={period}
          language={language}
          bloom={bloom}
          onTap={() => add(1)}
          onClose={() => setFocus(false)}
        />
      )}
    </>
  );
}
