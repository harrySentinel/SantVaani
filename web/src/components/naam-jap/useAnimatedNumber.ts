'use client';

import { useEffect, useRef, useState } from 'react';

/** Rolls a number toward its new value. Single steps land instantly so a tap never feels laggy. */
export function useAnimatedNumber(value: number, duration = 650) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);
  const frame = useRef(0);

  useEffect(() => {
    const start = current.current;
    const diff = value - start;
    cancelAnimationFrame(frame.current);
    if (Math.abs(diff) <= 1) {
      current.current = value;
      setDisplay(value);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + diff * eased);
      current.current = v;
      setDisplay(v);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return display;
}
