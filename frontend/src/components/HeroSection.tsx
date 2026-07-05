import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Heart, Music, BookOpen, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

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

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [visible, setVisible] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(true);

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
    setVisible(false);
    setTimeout(() => {
      setCurrentQuote((prev) => {
        const idx = quotes.findIndex((q) => q.id === prev?.id);
        return quotes[(idx + 1) % quotes.length];
      });
      setVisible(true);
    }, 400);
  }, [quotes]);

  useEffect(() => {
    if (quotes.length < 2) return;
    const timer = setInterval(rotateQuote, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [quotes, rotateQuote]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0c0804]">

      {/* ── Rich saffron atmosphere ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0c02] via-[#0f0804] to-[#080510]" />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-600 rounded-full blur-[140px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500 rounded-full blur-[120px] opacity-15" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[700px] h-[300px] bg-orange-800 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-[20%] right-[15%] w-48 h-48 bg-yellow-600 rounded-full blur-[80px] opacity-10" />
      </div>

      {/* Noise grain overlay for matte depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center space-y-10">

          {/* OM glyph */}
          <div className="flex justify-center">
            <span
              className="text-7xl leading-none select-none"
              style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(135deg, #fb923c, #f97316, #fbbf24)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 24px rgba(251,146,60,0.5))',
                fontFamily: 'serif',
              }}
            >
              ॐ
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
              style={{ textShadow: '0 2px 40px rgba(251,146,60,0.25)' }}
            >
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-2xl text-orange-300/60 font-medium tracking-widest">संतवाणी</p>
            )}
          </div>

          {/* Tagline */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl text-white/85 font-semibold leading-relaxed">
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets <span className="text-orange-300">Modern Hearts</span></>
              ) : (
                <>जहाँ <span className="text-orange-300">प्राचीन ज्ञान</span> मिलता है <span className="text-orange-300">आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-base text-white/45 leading-relaxed max-w-xl mx-auto">
              {t('hero.description.main')}
            </p>
          </div>

          {/* Glass Quote Card */}
          <div className="max-w-2xl mx-auto">
            {quoteLoading ? (
              <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-4 animate-pulse">
                <div className="h-3 bg-white/15 rounded-full w-1/4 mx-auto" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded-full w-full" />
                  <div className="h-4 bg-white/10 rounded-full w-5/6 mx-auto" />
                  <div className="h-4 bg-white/10 rounded-full w-3/4 mx-auto" />
                </div>
                <div className="h-3 bg-white/10 rounded-full w-1/3 ml-auto" />
              </div>
            ) : currentQuote ? (
              <div className="relative bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_64px_rgba(0,0,0,0.4)]">
                {/* Inner highlight line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-semibold text-orange-300 bg-orange-500/15 border border-orange-400/20 px-3 py-1 rounded-full tracking-widest uppercase">
                    {currentQuote.category || 'Divine Wisdom'}
                  </span>
                  {quotes.length > 1 && (
                    <button
                      onClick={rotateQuote}
                      className="p-1.5 rounded-full text-white/30 hover:text-orange-300 hover:bg-white/10 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 transition-opacity duration-400" style={{ opacity: visible ? 1 : 0 }}>
                  <div className="text-4xl text-orange-400/40 font-serif leading-none select-none">"</div>
                  <p className="text-lg md:text-xl text-white/85 italic leading-relaxed font-medium">
                    {language === 'EN' ? currentQuote.text : currentQuote.text_hi}
                  </p>
                  <p className="text-sm text-white/40 text-right not-italic font-medium tracking-wide">
                    — {currentQuote.author}
                  </p>
                </div>

                {quotes.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-6">
                    {quotes.slice(0, Math.min(quotes.length, 8)).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => { setVisible(false); setTimeout(() => { setCurrentQuote(q); setVisible(true); }, 400); }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          q.id === currentQuote.id ? 'w-6 bg-orange-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Stats — glass pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: language === 'EN' ? 'Saints' : 'संत', value: '100+' },
              { label: language === 'EN' ? 'Bhajans' : 'भजन', value: '500+' },
              { label: language === 'EN' ? 'Quotes' : 'उद्धरण', value: '1000+' },
              { label: language === 'EN' ? 'Seekers' : 'साधक', value: '10k+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-sm border border-white/10 px-5 py-2.5 rounded-full"
              >
                <span className="text-lg font-bold text-orange-300">{stat.value}</span>
                <span className="text-sm text-white/45 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Link to="/saints">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-200"
              >
                <Heart className="w-5 h-5 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>

            <Link to="/bhajans">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-3 rounded-full backdrop-blur-sm bg-transparent transition-all duration-200"
              >
                <Music className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>

            <Link to="/blog">
              <Button
                variant="ghost"
                size="lg"
                className="text-white/60 hover:text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="pt-8">
            <ArrowDown className="w-5 h-5 text-white/20 mx-auto animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
