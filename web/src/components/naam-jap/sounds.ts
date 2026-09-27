// Synthesised with Web Audio so there are no sound files to load.

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** A soft wooden click, like one bead meeting the next. */
export function playBead() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const filter = a.createBiquadFilter();
  const gain = a.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(380, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.07);
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.18, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(a.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}

/** A small temple bell, struck once when a mala is complete. */
export function playBell() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const base = 523.25;
  const master = a.createGain();
  master.gain.value = 0.22;
  master.connect(a.destination);
  // Bells ring at inharmonic partials; each fades at its own rate.
  const partials: [number, number, number][] = [
    [1, 1, 3.2],
    [2, 0.45, 2.4],
    [2.76, 0.3, 1.8],
    [5.4, 0.12, 1.1],
    [8.93, 0.06, 0.7],
  ];
  for (const [ratio, amp, decay] of partials) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = 'sine';
    osc.frequency.value = base * ratio;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(amp, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }
}
