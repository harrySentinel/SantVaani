import { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  color?: string;
  height?: number;
  /** Pass an element ref to track scroll within a container; defaults to window scroll */
  targetRef?: React.RefObject<HTMLElement>;
}

export default function ReadingProgressBar({
  color = 'from-orange-500 via-amber-500 to-orange-600',
  height = 3,
  targetRef,
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculate = () => {
      if (targetRef?.current) {
        const el = targetRef.current;
        const scrolled = el.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
      } else {
        const scrolled = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min((scrolled / docHeight) * 100, 100) : 0);
      }
    };

    const target = targetRef?.current ?? window;
    target.addEventListener('scroll', calculate, { passive: true });
    calculate();
    return () => target.removeEventListener('scroll', calculate);
  }, [targetRef]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-transparent"
      style={{ height }}
      aria-hidden="true"
    >
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-100 ease-out shadow-sm`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
