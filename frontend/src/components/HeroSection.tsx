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

  const handleManualRotate = () => {
    if (quotes.length < 2) return;
    rotateQuote();
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[5%] w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-[5%] w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ea580c 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-10">

          {/* OM */}
          <div className="flex justify-center">
            <span className="text-6xl leading-none select-none text-orange-400">ॐ</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-2xl text-gray-500 font-medium tracking-wide">संतवाणी</p>
            )}
          </div>

          {/* Tagline */}
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl text-gray-800 font-semibold leading-relaxed">
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets <span className="text-orange-600">Modern Hearts</span></>
              ) : (
                <>जहाँ <span className="text-orange-600">प्राचीन ज्ञान</span> मिलता है <span className="text-orange-600">आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              {t('hero.description.main')}
            </p>
          </div>

          {/* Rotating Quote Card */}
          <div className="max-w-2xl mx-auto">
            {quoteLoading ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100 space-y-4 animate-pulse">
                <div className="h-4 bg-orange-100 rounded w-1/4 mx-auto" />
                <div className="space-y-2">
                  <div className="h-4 bg-orange-100 rounded w-full" />
                  <div className="h-4 bg-orange-100 rounded w-5/6 mx-auto" />
                  <div className="h-4 bg-orange-100 rounded w-4/6 mx-auto" />
                </div>
                <div className="h-3 bg-orange-100 rounded w-1/3 ml-auto" />
              </div>
            ) : currentQuote ? (
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100 group">
                {/* Category pill */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full tracking-wide uppercase">
                    {currentQuote.category || 'Divine Wisdom'}
                  </span>
                  {quotes.length > 1 && (
                    <button
                      onClick={handleManualRotate}
                      title="Next quote"
                      className="p-1.5 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quote text */}
                <div
                  className="space-y-3 transition-opacity duration-400"
                  style={{ opacity: visible ? 1 : 0 }}
                >
                  <div className="text-3xl text-orange-300 font-serif leading-none select-none">"</div>
                  <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed font-medium">
                    {language === 'EN' ? currentQuote.text : currentQuote.text_hi}
                  </p>
                  <p className="text-sm text-gray-500 text-right not-italic font-medium">
                    — {currentQuote.author}
                  </p>
                </div>

                {/* Progress dots */}
                {quotes.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-5">
                    {quotes.slice(0, Math.min(quotes.length, 8)).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setVisible(false);
                          setTimeout(() => { setCurrentQuote(q); setVisible(true); }, 400);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          q.id === currentQuote.id
                            ? 'w-6 bg-orange-500'
                            : 'w-1.5 bg-orange-200 hover:bg-orange-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { label: language === 'EN' ? 'Saints' : 'संत', value: '100+' },
              { label: language === 'EN' ? 'Bhajans' : 'भजन', value: '500+' },
              { label: language === 'EN' ? 'Quotes' : 'उद्धरण', value: '1000+' },
              { label: language === 'EN' ? 'Seekers' : 'साधक', value: '10k+' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link to="/saints">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full shadow-md transition-colors duration-200"
              >
                <Heart className="w-5 h-5 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>

            <Link to="/bhajans">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full transition-colors duration-200"
              >
                <Music className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>

            <Link to="/blog">
              <Button
                variant="ghost"
                size="lg"
                className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="pt-10 animate-bounce">
            <ArrowDown className="w-6 h-6 text-orange-400 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
