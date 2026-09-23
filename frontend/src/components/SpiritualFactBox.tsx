import { useState, useEffect, useRef, useCallback } from 'react';
import { Lightbulb, Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpiritualFact {
  id: string;
  text: string;
  text_hi?: string;
  category: string;
  icon: string;
  source?: string;
}

const FALLBACK_FACTS: SpiritualFact[] = [
  {
    id: '1',
    text: "In the Ramayana, Hanuman's heart contains an image of Rama and Sita, discovered when his chest was opened by the gods to verify his devotion.",
    text_hi: "रामायण में, हनुमान के हृदय में राम और सीता की छवि है, जो उनकी भक्ति को सत्यापित करने के लिए देवताओं द्वारा उनकी छाती खोले जाने पर खोजी गई।",
    category: "Ramayana",
    icon: ""
  },
  {
    id: '2',
    text: "Lord Ganesha wrote the entire Mahabharata as Sage Vyasa dictated it, breaking his tusk to use as a pen when the original one broke.",
    text_hi: "भगवान गणेश ने संपूर्ण महाभारत को महर्षि व्यास के कहे अनुसार लिखा, जब उनकी मूल कलम टूट गई तो अपना दांत तोड़कर कलम के रूप में इस्तेमाल किया।",
    category: "Hindu Deities",
    icon: ""
  },
];

const ROTATE_MS = 7000;
const FADE_MS = 600;
const SWIPE_THRESHOLD = 56;

const SpiritualFactBox = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [facts, setFacts] = useState<SpiritualFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const countRef = useRef(0);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const { data, error } = await supabase
          .from('spiritual_facts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error || !data?.length) throw new Error();
        setFacts(data);
        countRef.current = data.length;
      } catch {
        setFacts(FALLBACK_FACTS);
        countRef.current = FALLBACK_FACTS.length;
      } finally {
        setLoading(false);
      }
    };
    fetchFacts();
  }, []);

  // Fade out, swap text while invisible, fade back in. Pure CSS opacity — no layout thrash.
  const changeTo = useCallback((next: number) => {
    setVisible(false);
    window.setTimeout(() => {
      setCurrentIndex(next);
      setVisible(true);
    }, FADE_MS);
  }, []);

  // Auto-rotate uses the same fade-out/in cycle
  useEffect(() => {
    if (facts.length < 2 || paused) return;
    const interval = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % countRef.current);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [facts.length, paused]);

  if (loading || facts.length === 0) return null;

  const fact = facts[currentIndex];
  const count = facts.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6"
    >
      <div
        className="relative overflow-hidden rounded-[26px]"
        style={{
          background: 'linear-gradient(150deg, rgba(255,253,250,0.92) 0%, rgba(255,245,230,0.74) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.75), 0 18px 50px -12px rgba(234,88,0,0.28), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient glows */}
        <div className="absolute -top-16 -right-10 w-52 h-52 bg-orange-300 rounded-full blur-[85px] opacity-45 pointer-events-none" />
        <div className="absolute -bottom-20 -left-12 w-52 h-52 bg-amber-200 rounded-full blur-[85px] opacity-35 pointer-events-none" />

        {/* OM watermark */}
        <span
          className="absolute -bottom-12 right-2 text-[170px] leading-none select-none pointer-events-none hidden sm:block"
          style={{ color: 'rgba(249,115,22,0.055)', fontFamily: 'serif' }}
        >
          ॐ
        </span>

        {/* Top shimmer line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 px-5 sm:px-7 pt-5 sm:pt-6">
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)' }}
            />
            <div
              className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"
              style={{ boxShadow: '0 6px 18px rgba(234,88,0,0.4)' }}
            >
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-900 leading-tight">
              {t('didyouknow.title')}
            </p>
            <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-[0.12em] truncate">
              {fact.category || (language === 'HI' ? 'आध्यात्मिक' : 'Spiritual')}
            </p>
          </div>
        </div>

        {/* Swipeable fact body — CSS opacity crossfade */}
        <motion.div
          className="relative z-10 px-5 sm:px-7 pt-4 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.55}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) changeTo((currentIndex + 1) % count);
            else if (info.offset.x > SWIPE_THRESHOLD) changeTo((currentIndex - 1 + count) % count);
          }}
        >
          <div className="min-h-[112px] sm:min-h-[96px]">
            <div
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
              }}
            >
              <p className="text-gray-800 text-[17px] sm:text-xl leading-relaxed font-medium">
                {language === 'EN' ? fact.text : fact.text_hi || fact.text}
              </p>
              {fact.source && (
                <p className="text-xs text-orange-500/85 mt-3 font-semibold tracking-wide">
                  — {fact.source}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer controls */}
        {count > 1 && (
          <div className="relative z-10 flex items-center gap-3 px-5 sm:px-7 pb-5 sm:pb-6 mt-3">
            {/* Progress track */}
            <div className="flex-1 h-1 rounded-full bg-orange-100/90 overflow-hidden">
              <div
                key={`${currentIndex}-${paused}`}
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                style={{
                  transformOrigin: 'left',
                  animation: `factProgress ${ROTATE_MS}ms linear forwards`,
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              />
            </div>

            {/* Segmented dots */}
            <div className="flex gap-1.5 items-center">
              {facts.slice(0, Math.min(count, 6)).map((f, i) => (
                <motion.button
                  key={f.id}
                  onClick={() => changeTo(i)}
                  aria-label={`Fact ${i + 1}`}
                  whileTap={{ scale: 0.8 }}
                  className="h-[6px] rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? '20px' : '6px',
                    background: i === currentIndex ? 'rgba(234,88,0,0.85)' : 'rgba(249,115,22,0.25)',
                  }}
                />
              ))}
            </div>

            {/* Pause / play */}
            <motion.button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play facts' : 'Pause facts'}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              className="p-2 rounded-full flex-shrink-0"
              style={{ color: 'rgba(234,88,0,0.8)', background: 'rgba(249,115,22,0.1)' }}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </motion.button>
          </div>
        )}

        {/* Swipe hint (mobile only) */}
        {count > 1 && (
          <p className="relative z-10 sm:hidden text-center text-[10px] text-orange-400/70 font-medium pb-3 -mt-1">
            {language === 'HI' ? 'स्वाइप करें' : 'Swipe to explore'}
          </p>
        )}
      </div>

      <style>{`@keyframes factProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </motion.div>
  );
};

export default SpiritualFactBox;
