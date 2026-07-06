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
    <section className="relative min-h-screen overflow-hidden">

      {/* Background images — mobile vs desktop */}
      <div
        className="absolute inset-0 bg-no-repeat bg-top md:hidden"
        style={{ backgroundImage: "url('/mb_bckg.png')", backgroundSize: '100% auto' }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url('/dsk_bckg.png')" }}
      />

      {/* Light warm overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-orange-50/25 to-white/65" />

      {/* Soft vignette on sides to focus center content */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-10">

          {/* OM */}
          <div className="flex justify-center">
            <span
              className="text-7xl leading-none select-none"
              style={{ fontFamily: 'serif', color: '#f97316', filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.35))' }}
            >
              ॐ
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-2xl text-orange-400/60 font-medium tracking-wide">संतवाणी</p>
            )}
          </div>

          {/* Tagline */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl text-gray-800 font-semibold leading-relaxed">
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets <span className="text-orange-500">Modern Hearts</span></>
              ) : (
                <>जहाँ <span className="text-orange-500">प्राचीन ज्ञान</span> मिलता है <span className="text-orange-500">आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
              {t('hero.description.main')}
            </p>
          </div>

          {/* Glass Quote Card */}
          <div className="max-w-2xl mx-auto">
            {quoteLoading ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg space-y-4 animate-pulse">
                <div className="h-3 bg-orange-100 rounded-full w-1/4 mx-auto" />
                <div className="space-y-2">
                  <div className="h-4 bg-orange-50 rounded-full w-full" />
                  <div className="h-4 bg-orange-50 rounded-full w-5/6 mx-auto" />
                  <div className="h-4 bg-orange-50 rounded-full w-3/4 mx-auto" />
                </div>
                <div className="h-3 bg-orange-50 rounded-full w-1/3 ml-auto" />
              </div>
            ) : currentQuote ? (
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/90 shadow-[0_8px_32px_rgba(249,115,22,0.12),0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Inner top highlight */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />
                {/* Subtle warm tint bottom-right */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-40 pointer-events-none" />

                <div className="flex items-center justify-between mb-5 relative z-10">
                  <span className="text-[11px] font-semibold text-orange-500 bg-orange-50/80 border border-orange-200/60 px-3 py-1 rounded-full tracking-widest uppercase backdrop-blur-sm">
                    {currentQuote.category || 'Divine Wisdom'}
                  </span>
                  {quotes.length > 1 && (
                    <button
                      onClick={rotateQuote}
                      className="p-1.5 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 relative z-10" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}>
                  <div className="text-4xl text-orange-300/50 font-serif leading-none select-none">"</div>
                  <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed font-medium">
                    {language === 'EN' ? currentQuote.text : currentQuote.text_hi}
                  </p>
                  <p className="text-sm text-gray-400 text-right not-italic font-medium tracking-wide">
                    — {currentQuote.author}
                  </p>
                </div>

                {quotes.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-6 relative z-10">
                    {quotes.slice(0, Math.min(quotes.length, 8)).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => { setVisible(false); setTimeout(() => { setCurrentQuote(q); setVisible(true); }, 400); }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          q.id === currentQuote.id ? 'w-6 bg-orange-400' : 'w-1.5 bg-orange-200 hover:bg-orange-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: language === 'EN' ? 'Saints' : 'संत', value: '100+' },
              { label: language === 'EN' ? 'Bhajans' : 'भजन', value: '500+' },
              { label: language === 'EN' ? 'Quotes' : 'उद्धरण', value: '1000+' },
              { label: language === 'EN' ? 'Seekers' : 'साधक', value: '10k+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 bg-white/70 backdrop-blur-md border border-white/90 px-5 py-2.5 rounded-full shadow-sm"
              >
                <span className="text-lg font-bold text-orange-500">{stat.value}</span>
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Link to="/saints">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-200 transition-all duration-200"
              >
                <Heart className="w-5 h-5 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>

            <Link to="/bhajans">
              <Button
                variant="outline"
                size="lg"
                className="border-orange-200 text-orange-600 hover:bg-orange-50/80 px-8 py-3 rounded-full bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <Music className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>

            <Link to="/blog">
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-500 hover:text-orange-600 hover:bg-orange-50/80 px-8 py-3 rounded-full transition-all duration-200"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="pt-8">
            <ArrowDown className="w-5 h-5 text-orange-300 mx-auto animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
