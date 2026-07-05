import React, { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSpiritualTracking } from '@/hooks/useAnalytics';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = '' }) => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasTracked = useRef(false);
  const { trackVisitorCounter } = useSpiritualTracking();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const { data: currentData, error: fetchError } = await supabase
          .from('visitor_stats')
          .select('id, total_visitors')
          .limit(1)
          .single();

        if (fetchError) { setCount(30); setIsLoading(false); return; }

        let currentCount = currentData?.total_visitors || 30;
        const lastVisit = localStorage.getItem('santvaani_last_visit');
        const sessionVisit = sessionStorage.getItem('santvaani_session_tracked');
        const now = new Date().toISOString();
        const isNewVisitor = !lastVisit ||
          (new Date(now).getTime() - new Date(lastVisit).getTime()) > 24 * 60 * 60 * 1000;

        if (isNewVisitor && !hasTracked.current && !sessionVisit) {
          try {
            const { data: fnResult, error: fnErr } = await supabase.rpc('increment_visitor_count');
            if (fnErr) {
              const { data: upData } = await supabase
                .from('visitor_stats')
                .update({ total_visitors: currentCount + 1, updated_at: now })
                .eq('id', currentData.id)
                .select('total_visitors')
                .single();
              if (upData) currentCount = upData.total_visitors;
            } else {
              currentCount = fnResult;
            }
            localStorage.setItem('santvaani_last_visit', now);
            sessionStorage.setItem('santvaani_session_tracked', 'true');
            hasTracked.current = true;
          } catch { /* silent */ }
        }

        setCount(currentCount);
        trackVisitorCounter(currentCount);
      } catch {
        setCount(30);
      } finally {
        setIsLoading(false);
      }
    };
    trackVisitor();
  }, []);

  // Animated count-up
  useEffect(() => {
    if (!count) return;
    const steps = 80;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisplayCount(Math.min(Math.floor(count * ease), count));
      if (step >= steps) clearInterval(timer);
    }, 2400 / steps);
    return () => clearInterval(timer);
  }, [count]);

  const formatNumber = (n: number) =>
    n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K'
    : n.toLocaleString();

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-2xl px-8 py-5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-bold text-orange-600 leading-none">{formatNumber(displayCount)}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {displayCount.toLocaleString()} seekers on Santvaani
          </p>
        </div>
        <div className="pl-6 border-l border-gray-100 hidden sm:block">
          <p className="text-orange-400 text-lg font-medium" style={{ fontFamily: 'serif' }}>ॐ</p>
          <p className="text-xs text-gray-400 mt-0.5">हर आत्मा का स्वागत है</p>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
