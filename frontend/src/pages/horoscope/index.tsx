import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Hash, Sun, Moon, Calendar, RefreshCw, Share2, Sparkles, ChevronLeft } from 'lucide-react';

interface ZodiacSign {
  id: string;
  name: string;
  nameHi: string;
  symbol: string;
  dates: string;
}

interface Horoscope {
  zodiac_sign: string;
  date: string;
  period: string;
  prediction: string;
  prediction_hi: string;
  lucky_color: string;
  lucky_number: number;
  period_theme?: string;
  spiritual_advice?: string;
  source?: string;
  standout_days?: string | null;
  challenging_days?: string | null;
}

const FALLBACK_SIGNS: ZodiacSign[] = [
  { id: 'aries',       name: 'Aries',       nameHi: 'मेष',      symbol: '♈', dates: 'Mar 21 – Apr 19' },
  { id: 'taurus',      name: 'Taurus',      nameHi: 'वृषभ',     symbol: '♉', dates: 'Apr 20 – May 20' },
  { id: 'gemini',      name: 'Gemini',      nameHi: 'मिथुन',    symbol: '♊', dates: 'May 21 – Jun 20' },
  { id: 'cancer',      name: 'Cancer',      nameHi: 'कर्क',     symbol: '♋', dates: 'Jun 21 – Jul 22' },
  { id: 'leo',         name: 'Leo',         nameHi: 'सिंह',     symbol: '♌', dates: 'Jul 23 – Aug 22' },
  { id: 'virgo',       name: 'Virgo',       nameHi: 'कन्या',    symbol: '♍', dates: 'Aug 23 – Sep 22' },
  { id: 'libra',       name: 'Libra',       nameHi: 'तुला',     symbol: '♎', dates: 'Sep 23 – Oct 22' },
  { id: 'scorpio',     name: 'Scorpio',     nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 – Nov 21' },
  { id: 'sagittarius', name: 'Sagittarius', nameHi: 'धनु',      symbol: '♐', dates: 'Nov 22 – Dec 21' },
  { id: 'capricorn',   name: 'Capricorn',   nameHi: 'मकर',      symbol: '♑', dates: 'Dec 22 – Jan 19' },
  { id: 'aquarius',    name: 'Aquarius',    nameHi: 'कुम्भ',    symbol: '♒', dates: 'Jan 20 – Feb 18' },
  { id: 'pisces',      name: 'Pisces',      nameHi: 'मीन',      symbol: '♓', dates: 'Feb 19 – Mar 20' },
];

const PERIOD_CONFIG = {
  daily:   { icon: Sun,      label: 'Daily',   labelHi: 'दैनिक',   color: 'from-orange-500 to-rose-500' },
  weekly:  { icon: Calendar, label: 'Weekly',  labelHi: 'साप्ताहिक', color: 'from-amber-500 to-orange-500' },
  monthly: { icon: Moon,     label: 'Monthly', labelHi: 'मासिक',   color: 'from-purple-500 to-indigo-600' },
};

const HoroscopePage = () => {
  const { t, language } = useLanguage();
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [horoscopes, setHoroscopes] = useState<{ daily?: Horoscope; weekly?: Horoscope; monthly?: Horoscope }>({});
  const [loading, setLoading] = useState<{ daily: boolean; weekly: boolean; monthly: boolean }>({ daily: false, weekly: false, monthly: false });
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaries, setSummaries] = useState<{ daily?: string; weekly?: string; monthly?: string }>({});
  const [showSummary, setShowSummary] = useState<{ daily: boolean; weekly: boolean; monthly: boolean }>({ daily: false, weekly: false, monthly: false });

  useEffect(() => {
    const fetchZodiacSigns = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/zodiac/list`);
        const data = await response.json();
        setZodiacSigns(data.success && data.zodiacSigns ? data.zodiacSigns : FALLBACK_SIGNS);
      } catch {
        setZodiacSigns(FALLBACK_SIGNS);
      }
    };
    fetchZodiacSigns();
  }, []);

  const fetchHoroscope = async (signId: string, period: string) => {
    if (!signId) return;
    setLoading(prev => ({ ...prev, [period]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/${signId}/${period}`);
      const data = await response.json();
      if (data.success) setHoroscopes(prev => ({ ...prev, [period]: data.horoscope }));
    } catch {
      // silent
    } finally {
      setLoading(prev => ({ ...prev, [period]: false }));
    }
  };

  const handleSignSelect = (signId: string) => {
    setSelectedSign(signId);
    setHoroscopes({});
    setSummaries({});
    setShowSummary({ daily: false, weekly: false, monthly: false });
    fetchHoroscope(signId, activeTab);
  };

  const handleTabChange = (tab: 'daily' | 'weekly' | 'monthly') => {
    setActiveTab(tab);
    setShowSummary({ daily: false, weekly: false, monthly: false });
    if (selectedSign && !horoscopes[tab]) fetchHoroscope(selectedSign, tab);
  };

  const summarizeHoroscope = async (period: string) => {
    const horoscope = horoscopes[period as keyof typeof horoscopes];
    if (!horoscope?.prediction) return;
    if (summaries[period as keyof typeof summaries]) {
      setShowSummary(prev => ({ ...prev, [period]: !prev[period as keyof typeof prev] }));
      return;
    }
    setSummaryLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prediction: horoscope.prediction, period, zodiacSign: selectedSign })
      });
      const data = await response.json();
      if (data.success && data.summary) {
        setSummaries(prev => ({ ...prev, [period]: data.summary }));
        setShowSummary(prev => ({ ...prev, [period]: true }));
      }
    } catch {
      // silent
    } finally {
      setSummaryLoading(false);
    }
  };

  const selectedZodiac = zodiacSigns.find(s => s.id === selectedSign);
  const currentHoroscope = horoscopes[activeTab];
  const periodCfg = PERIOD_CONFIG[activeTab];

  const faqItems = [
    { question: 'What is a spiritual horoscope?', answer: 'A spiritual horoscope combines Vedic astrology with spiritual guidance, offering insights into your daily, weekly, and monthly journey based on your zodiac sign and ancient wisdom.' },
    { question: 'How often is the horoscope updated?', answer: 'Daily horoscopes are updated every day, weekly horoscopes every Monday, and monthly horoscopes on the first of each month.' },
    { question: 'Which zodiac signs are covered?', answer: 'All 12 zodiac signs are covered: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces.' },
    { question: 'Is the horoscope available in Hindi?', answer: 'Yes, all horoscope predictions are available in both English and Hindi on Santvaani.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Daily Horoscope & Spiritual Guidance - Vedic Astrology"
        description="Get your daily, weekly, and monthly spiritual horoscope based on Vedic astrology. Personalized guidance for all 12 zodiac signs in English and Hindi."
        canonical="https://santvaani.com/horoscope"
        keywords="daily horoscope, vedic astrology, spiritual horoscope, zodiac signs, rashifal, राशिफल, jyotish, aries horoscope, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces"
      />
      <StructuredData type="faq" items={faqItems} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-orange-950">
        {/* Subtle star pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center pt-10 pb-4">
          <p className="text-orange-300 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            {language === 'EN' ? 'Vedic Astrology' : 'वैदिक ज्योतिष'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t('horoscope.title')}
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            {t('horoscope.subtitle')}
          </p>
          {language === 'EN' && (
            <p className="text-orange-400 text-sm mt-2">
              अपनी राशि चुनें और व्यक्तिगत मार्गदर्शन पाएं
            </p>
          )}
        </div>
      </section>

      {/* ── Main ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 -mt-8 relative z-10">

        {!selectedSign ? (
          /* ── Zodiac Grid ── */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 text-center">
              <h2 className="text-lg font-semibold text-gray-900">{t('horoscope.select.title')}</h2>
              <p className="text-gray-400 text-sm mt-1">{t('horoscope.select.subtitle')}</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px bg-gray-100">
              {(zodiacSigns.length ? zodiacSigns : FALLBACK_SIGNS).map(sign => (
                <button
                  key={sign.id}
                  onClick={() => handleSignSelect(sign.id)}
                  className="bg-white flex flex-col items-center gap-1.5 py-5 px-2 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                >
                  <span className="text-3xl text-gray-500 group-hover:text-orange-500 transition-colors leading-none">
                    {sign.symbol}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-orange-700">
                    {language === 'EN' ? sign.name : sign.nameHi}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight text-center">
                    {sign.dates}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Prediction View ── */
          <div className="space-y-5">
            {/* Back + Sign Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${periodCfg.color} px-6 py-5 flex items-center justify-between`}>
                <button
                  onClick={() => setSelectedSign('')}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === 'EN' ? 'All Signs' : 'सभी राशियां'}
                </button>
                <div className="text-center">
                  <div className="text-4xl text-white/90 leading-none mb-1">{selectedZodiac?.symbol}</div>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {language === 'EN' ? selectedZodiac?.name : selectedZodiac?.nameHi}
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">{selectedZodiac?.dates}</p>
                </div>
                <div className="w-20" />
              </div>

              {/* Period Tabs */}
              <div className="flex border-t border-gray-100">
                {(Object.entries(PERIOD_CONFIG) as [string, typeof PERIOD_CONFIG['daily']][]).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleTabChange(key as 'daily' | 'weekly' | 'monthly')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                        isActive
                          ? 'border-orange-500 text-orange-600 bg-orange-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {language === 'EN' ? cfg.label : cfg.labelHi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prediction Content */}
            {loading[activeTab] ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <span className="text-5xl text-orange-300 block mb-4" style={{ fontFamily: 'serif' }}>ॐ</span>
                <p className="text-gray-400 text-sm animate-pulse">{t('horoscope.loading')}</p>
              </div>
            ) : currentHoroscope ? (
              <div className="space-y-4">
                {/* Prediction Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {currentHoroscope.period_theme && (
                    <div className="px-6 pt-5 pb-0">
                      <Badge className="bg-orange-100 text-orange-700 border-0 text-xs font-semibold">
                        {currentHoroscope.period_theme}
                      </Badge>
                    </div>
                  )}
                  <div className="px-6 py-5">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t('horoscope.prediction.title')}
                    </h3>
                    <p className="text-gray-800 leading-relaxed text-[15px]">
                      {currentHoroscope.prediction}
                    </p>

                    {currentHoroscope.prediction_hi && (
                      <div className="mt-4 border-l-4 border-orange-200 pl-4">
                        <p className="text-gray-500 text-sm italic leading-relaxed">
                          {currentHoroscope.prediction_hi}
                        </p>
                      </div>
                    )}

                    {currentHoroscope.spiritual_advice && (
                      <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-sm text-amber-800 leading-relaxed">
                          <span className="font-semibold">{t('horoscope.spiritual.guidance')}</span>{' '}
                          {currentHoroscope.spiritual_advice}
                        </p>
                      </div>
                    )}

                    {/* AI Summary */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-400">{t('horoscope.summary.prompt')}</span>
                      <Button
                        onClick={() => summarizeHoroscope(activeTab)}
                        variant="outline"
                        size="sm"
                        disabled={summaryLoading}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 flex-shrink-0"
                      >
                        {summaryLoading ? (
                          <><RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />{t('horoscope.summary.analyzing')}</>
                        ) : (
                          <><Sparkles className="w-3 h-3 mr-1.5" />{t('horoscope.summary.button')}</>
                        )}
                      </Button>
                    </div>
                    {showSummary[activeTab] && summaries[activeTab] && (
                      <div className="mt-3 bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <p className="text-xs font-semibold text-orange-700 mb-1.5">{t('horoscope.summary.title')}</p>
                        <p className="text-orange-800 text-sm leading-relaxed">{summaries[activeTab]}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lucky Elements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
                    <Palette className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-2">{t('horoscope.lucky.color')}</p>
                    <span className="inline-block bg-orange-50 border border-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                      {currentHoroscope.lucky_color}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
                    <Hash className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-2">{t('horoscope.lucky.number')}</p>
                    <span className="inline-block bg-amber-50 border border-amber-100 text-amber-700 text-3xl font-bold px-6 py-1 rounded-full">
                      {currentHoroscope.lucky_number}
                    </span>
                  </div>
                </div>

                {/* Share */}
                <div className="text-center pb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 gap-2"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${selectedZodiac?.name} ${activeTab} Horoscope`,
                          text: currentHoroscope.prediction,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(`${currentHoroscope.prediction}\n\n— ${selectedZodiac?.name} ${activeTab} Horoscope from Santvaani`);
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    {t('horoscope.share.button')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <p className="text-gray-400 text-sm">
                  {activeTab === 'daily' ? t('horoscope.empty.daily') :
                   activeTab === 'weekly' ? t('horoscope.empty.weekly') :
                   t('horoscope.empty.monthly')}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HoroscopePage;
