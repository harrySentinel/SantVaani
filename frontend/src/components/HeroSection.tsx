import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Heart, Music, BookOpen, RefreshCw } from 'lucide-react';
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
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
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

      {/* Strong warm overlay — washes image to soft watercolor so content reads cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/80 via-amber-50/65 to-orange-50/80" />
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">

          {/* OM */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="text-7xl leading-none select-none"
              style={{ fontFamily: 'serif', color: '#f97316', filter: 'drop-shadow(0 0 28px rgba(249,115,22,0.5))' }}
            >
              ॐ
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div className="space-y-2" variants={fadeUp} custom={0.15} initial="hidden" animate="visible">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight drop-shadow-sm">
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-2xl text-orange-300 font-medium tracking-wide drop-shadow-sm">संतवाणी</p>
            )}
          </motion.div>

          {/* Tagline */}
          <motion.div className="max-w-2xl mx-auto space-y-2" variants={fadeUp} custom={0.3} initial="hidden" animate="visible">
            <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed drop-shadow-sm"
              style={{ color: 'rgba(30,20,10,0.9)' }}>
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets{' '}
                  <span className="text-orange-500 drop-shadow-sm">Modern Hearts</span>
                </>
              ) : (
                <>जहाँ <span className="text-orange-500">प्राचीन ज्ञान</span> मिलता है <span className="text-orange-500">आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-base leading-relaxed max-w-xl mx-auto"
              style={{ color: 'rgba(40,25,10,0.65)' }}>
              {t('hero.description.main')}
            </p>
          </motion.div>

          {/* Quote Card */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={fadeUp} custom={0.45} initial="hidden" animate="visible"
          >
            {quoteLoading ? (
              <div className="rounded-3xl p-7 border border-white/20 space-y-4 animate-pulse"
                style={{ background: 'rgba(255,251,245,0.5)', backdropFilter: 'blur(20px)' }}>
                <div className="h-2.5 bg-white/20 rounded-full w-1/4 mx-auto" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/15 rounded-full w-full" />
                  <div className="h-4 bg-white/15 rounded-full w-5/6 mx-auto" />
                  <div className="h-4 bg-white/15 rounded-full w-3/4 mx-auto" />
                </div>
                <div className="h-2.5 bg-white/15 rounded-full w-1/3 ml-auto" />
              </div>
            ) : currentQuote ? (
              <div
                className="relative rounded-3xl p-7 border border-white/25 overflow-hidden"
                style={{
                  background: 'rgba(255, 251, 245, 0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(249,115,22,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
              >
                {/* Inner shimmer */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-orange-300/40"
                    style={{ color: 'rgba(249,115,22,0.9)', background: 'rgba(249,115,22,0.12)' }}>
                    {currentQuote.category || 'Divine Wisdom'}
                  </span>
                  {quotes.length > 1 && (
                    <button onClick={rotateQuote}
                      className="p-1.5 rounded-full transition-all duration-200 hover:scale-110"
                      style={{ color: 'rgba(249,115,22,0.7)', background: 'rgba(249,115,22,0.1)' }}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quote text with AnimatePresence for smooth swap */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteKey}
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="space-y-3"
                  >
                    <div className="text-5xl leading-none select-none font-serif"
                      style={{ color: 'rgba(249,115,22,0.35)' }}>"</div>
                    <p className="text-base md:text-lg italic leading-relaxed font-medium"
                      style={{ color: 'rgba(30,15,5,0.85)', textShadow: '0 1px 6px rgba(255,255,255,0.3)' }}>
                      {language === 'EN' ? currentQuote.text : currentQuote.text_hi}
                    </p>
                    <p className="text-sm text-right not-italic font-semibold tracking-wide"
                      style={{ color: 'rgba(249,115,22,0.8)' }}>
                      — {currentQuote.author}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Dots */}
                {quotes.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-5">
                    {quotes.slice(0, Math.min(quotes.length, 8)).map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => jumpToQuote(q)}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                          width: q.id === currentQuote?.id ? '24px' : '6px',
                          background: q.id === currentQuote?.id ? 'rgba(249,115,22,0.8)' : 'rgba(249,115,22,0.25)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
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
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/25"
                style={{
                  background: 'rgba(255,251,245,0.55)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
              >
                <span className="text-lg font-bold text-orange-500 drop-shadow-sm">{stat.value}</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(30,15,5,0.75)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
            variants={fadeUp} custom={0.75} initial="hidden" animate="visible"
          >
            <Link to="/saints">
              <Button size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-900/20 transition-all duration-200 hover:scale-105">
                <Heart className="w-5 h-5 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>
            <Link to="/bhajans">
              <Button variant="outline" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 border-white/40 text-orange-700 hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <Music className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:bg-white/20 text-orange-800">
                <BookOpen className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="pt-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
          >
            <ArrowDown className="w-5 h-5 mx-auto animate-bounce" style={{ color: 'rgba(249,115,22,0.6)' }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
