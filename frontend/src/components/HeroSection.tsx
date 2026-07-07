import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Heart, Music, BookOpen, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: string;
  text: string;
  text_hi: string;
  author: string;
  category: string;
}

const FALLBACK_QUOTE: Quote = {
  id: 'fallback',
  text: "In truth, this world is not separate at all — everywhere, in every form, it is only Lord Shri Krishna who plays His divine lila.",
  text_hi: "वस्तुतः यह प्रपंच है ही नहीं। सदा, सर्वत्र, सर्वरूपों में एकमात्र श्रीकृष्ण ही लीलायमान हैं।",
  author: "Sai Ji",
  category: "Divine Wisdom",
};

const ROTATE_INTERVAL = 8000;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteKey, setQuoteKey] = useState(0);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('id, text, text_hi, author, category')
          .limit(50);
        if (error || !data || data.length === 0) throw new Error();
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuotes(shuffled);
        setCurrentQuote(shuffled[0]);
      } catch {
        setCurrentQuote(FALLBACK_QUOTE);
      } finally {
        setQuoteLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const rotateQuote = useCallback(() => {
    if (quotes.length < 2) return;
    setCurrentQuote((prev) => {
      const idx = quotes.findIndex((q) => q.id === prev?.id);
      return quotes[(idx + 1) % quotes.length];
    });
    setQuoteKey((k) => k + 1);
  }, [quotes]);

  const jumpToQuote = (q: Quote) => {
    setCurrentQuote(q);
    setQuoteKey((k) => k + 1);
  };

  useEffect(() => {
    if (quotes.length < 2) return;
    const timer = setInterval(rotateQuote, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [quotes, rotateQuote]);

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background images */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/mb_bckg.png')" }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url('/dsk_bckg.png')" }}
      />

      {/* Warm vignette overlay — lets image breathe while keeping text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/55 via-white/20 to-orange-50/65" />
      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-7">

          {/* OM with halo ring */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer halo */}
              <div className="absolute w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 72%)' }} />
              <span
                className="relative text-7xl leading-none select-none"
                style={{ fontFamily: 'serif', color: '#ea6800', filter: 'drop-shadow(0 2px 16px rgba(249,115,22,0.45))' }}
              >
                ॐ
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div className="space-y-1.5" variants={fadeUp} custom={0.15} initial="hidden" animate="visible">
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 45%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 8px rgba(249,115,22,0.2))',
              }}
            >
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-xl font-medium tracking-[0.12em]" style={{ color: 'rgba(249,115,22,0.55)' }}>संतवाणी</p>
            )}
          </motion.div>

          {/* Tagline */}
          <motion.div className="max-w-2xl mx-auto space-y-2" variants={fadeUp} custom={0.3} initial="hidden" animate="visible">
            <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed"
              style={{ color: 'rgba(22,12,2,0.88)', textShadow: '0 1px 12px rgba(255,255,255,0.6)' }}>
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets{' '}
                  <span style={{ color: '#ea580c' }}>Modern Hearts</span>
                </>
              ) : (
                <>जहाँ <span style={{ color: '#ea580c' }}>प्राचीन ज्ञान</span> मिलता है <span style={{ color: '#ea580c' }}>आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: 'rgba(35,20,5,0.6)', textShadow: '0 1px 8px rgba(255,255,255,0.5)' }}>
              {t('hero.description.main')}
            </p>
          </motion.div>

          {/* ── Quote Card ── */}
          <motion.div
            className="max-w-xl mx-auto"
            variants={fadeUp} custom={0.45} initial="hidden" animate="visible"
          >
            {quoteLoading ? (
              <div className="rounded-2xl p-6 space-y-4 animate-pulse"
                style={{
                  background: 'rgba(255,252,248,0.68)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.55), 0 4px 24px rgba(249,115,22,0.08)',
                }}>
                <div className="h-2 bg-orange-100 rounded-full w-1/4" />
                <div className="space-y-2.5">
                  <div className="h-3.5 bg-orange-50 rounded-full w-full" />
                  <div className="h-3.5 bg-orange-50 rounded-full w-5/6" />
                  <div className="h-3.5 bg-orange-50 rounded-full w-3/4" />
                </div>
                <div className="h-2 bg-orange-100 rounded-full w-1/4 ml-auto" />
              </div>
            ) : currentQuote ? (
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,252,248,0.78) 0%, rgba(255,246,232,0.62) 100%)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.6), 0 4px 32px rgba(249,115,22,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',
                }}
              >
                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />

                {/* Watermark decorative quote glyph */}
                <div
                  className="absolute -top-3 left-4 text-[88px] leading-none select-none pointer-events-none font-serif"
                  style={{ color: 'rgba(249,115,22,0.09)', fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  ❝
                </div>

                <div className="px-6 pt-5 pb-5">
                  {/* Category row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      <span
                        className="text-[10px] font-bold tracking-[0.14em] uppercase"
                        style={{ color: 'rgba(234,88,0,0.85)' }}
                      >
                        {currentQuote.category || 'Divine Wisdom'}
                      </span>
                    </div>
                    {quotes.length > 1 && (
                      <button
                        onClick={rotateQuote}
                        className="p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ color: 'rgba(249,115,22,0.6)', background: 'rgba(249,115,22,0.08)' }}
                        aria-label="Next quote"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Animated quote body */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteKey}
                      initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                    >
                      <p
                        className="text-base md:text-[17px] italic leading-[1.75] font-medium"
                        style={{ color: 'rgba(22,10,2,0.82)' }}
                      >
                        {language === 'EN' ? currentQuote.text : currentQuote.text_hi}
                      </p>

                      {/* Divider + author */}
                      <div className="flex items-center gap-3 mt-4 pt-4"
                        style={{ borderTop: '1px solid rgba(249,115,22,0.12)' }}>
                        <div className="w-5 h-px flex-shrink-0" style={{ background: 'rgba(249,115,22,0.4)' }} />
                        <p className="text-xs font-bold tracking-widest uppercase"
                          style={{ color: 'rgba(234,88,0,0.8)' }}>
                          {currentQuote.author}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress dots */}
                  {quotes.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-4">
                      {quotes.slice(0, Math.min(quotes.length, 8)).map((q) => (
                        <button
                          key={q.id}
                          onClick={() => jumpToQuote(q)}
                          className="h-[3px] rounded-full transition-all duration-300"
                          style={{
                            width: q.id === currentQuote?.id ? '20px' : '5px',
                            background: q.id === currentQuote?.id ? 'rgba(234,88,0,0.75)' : 'rgba(249,115,22,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom shimmer line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-100/60 to-transparent" />
              </div>
            ) : null}
          </motion.div>

          {/* ── Stats pills ── */}
          <motion.div
            className="flex flex-wrap justify-center gap-2.5"
            variants={fadeUp} custom={0.6} initial="hidden" animate="visible"
          >
            {[
              { label: language === 'EN' ? 'Saints' : 'संत', value: '100+' },
              { label: language === 'EN' ? 'Bhajans' : 'भजन', value: '500+' },
              { label: language === 'EN' ? 'Quotes' : 'उद्धरण', value: '1000+' },
              { label: language === 'EN' ? 'Seekers' : 'साधक', value: '10k+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,252,248,0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.55), 0 1px 4px rgba(249,115,22,0.07)',
                }}
              >
                <span className="text-sm font-bold" style={{ color: '#ea580c' }}>{stat.value}</span>
                <span className="w-px h-3 flex-shrink-0" style={{ background: 'rgba(249,115,22,0.2)' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(30,15,5,0.65)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-1"
            variants={fadeUp} custom={0.75} initial="hidden" animate="visible"
          >
            <Link to="/saints">
              <Button size="lg"
                className="text-white px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 4px 20px rgba(234,88,0,0.35)',
                }}>
                <Heart className="w-4 h-4 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>
            <Link to="/bhajans">
              <Button variant="outline" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: '#9a3412',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                <Music className="w-4 h-4 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ color: '#9a3412' }}>
                <BookOpen className="w-4 h-4 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
          >
            <ArrowDown className="w-4 h-4 mx-auto animate-bounce" style={{ color: 'rgba(249,115,22,0.5)' }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
