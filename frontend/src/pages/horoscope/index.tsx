import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Star,
  Heart,
  Briefcase,
  Activity,
  DollarSign,
  Palette,
  Hash,
  Sparkles,
  Calendar,
  TrendingUp,
  Moon,
  Sun,
  RefreshCw,
  Share2
} from 'lucide-react';

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
}

const HoroscopePage = () => {
  const { t, language } = useLanguage();
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('daily');
  const [horoscopes, setHoroscopes] = useState<{
    daily?: Horoscope;
    weekly?: Horoscope;
    monthly?: Horoscope;
  }>({});
  const [loading, setLoading] = useState<{
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  }>({ daily: false, weekly: false, monthly: false });
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaries, setSummaries] = useState<{
    daily?: string;
    weekly?: string;
    monthly?: string;
  }>({});
  const [showSummary, setShowSummary] = useState<{
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  }>({ daily: false, weekly: false, monthly: false });

  // Fetch zodiac signs list
  useEffect(() => {
    const fetchZodiacSigns = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/zodiac/list`);
        const data = await response.json();
        if (data.success && data.zodiacSigns) {
          setZodiacSigns(data.zodiacSigns);
        } else {
          // Fallback zodiac signs if API fails
          setZodiacSigns([
            { id: 'aries', name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19' },
            { id: 'taurus', name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20' },
            { id: 'gemini', name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20' },
            { id: 'cancer', name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22' },
            { id: 'leo', name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22' },
            { id: 'virgo', name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22' },
            { id: 'libra', name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22' },
            { id: 'scorpio', name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21' },
            { id: 'sagittarius', name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21' },
            { id: 'capricorn', name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19' },
            { id: 'aquarius', name: 'Aquarius', nameHi: 'कुम्भ', symbol: '♒', dates: 'Jan 20 - Feb 18' },
            { id: 'pisces', name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching zodiac signs:', error);
        // Fallback zodiac signs if network fails
        setZodiacSigns([
          { id: 'aries', name: 'Aries', nameHi: 'मेष', symbol: '♈', dates: 'Mar 21 - Apr 19' },
          { id: 'taurus', name: 'Taurus', nameHi: 'वृषभ', symbol: '♉', dates: 'Apr 20 - May 20' },
          { id: 'gemini', name: 'Gemini', nameHi: 'मिथुन', symbol: '♊', dates: 'May 21 - Jun 20' },
          { id: 'cancer', name: 'Cancer', nameHi: 'कर्क', symbol: '♋', dates: 'Jun 21 - Jul 22' },
          { id: 'leo', name: 'Leo', nameHi: 'सिंह', symbol: '♌', dates: 'Jul 23 - Aug 22' },
          { id: 'virgo', name: 'Virgo', nameHi: 'कन्या', symbol: '♍', dates: 'Aug 23 - Sep 22' },
          { id: 'libra', name: 'Libra', nameHi: 'तुला', symbol: '♎', dates: 'Sep 23 - Oct 22' },
          { id: 'scorpio', name: 'Scorpio', nameHi: 'वृश्चिक', symbol: '♏', dates: 'Oct 23 - Nov 21' },
          { id: 'sagittarius', name: 'Sagittarius', nameHi: 'धनु', symbol: '♐', dates: 'Nov 22 - Dec 21' },
          { id: 'capricorn', name: 'Capricorn', nameHi: 'मकर', symbol: '♑', dates: 'Dec 22 - Jan 19' },
          { id: 'aquarius', name: 'Aquarius', nameHi: 'कुम्भ', symbol: '♒', dates: 'Jan 20 - Feb 18' },
          { id: 'pisces', name: 'Pisces', nameHi: 'मीन', symbol: '♓', dates: 'Feb 19 - Mar 20' }
        ]);
      }
    };

    fetchZodiacSigns();
  }, []);

  // Fetch horoscope for specific period
  const fetchHoroscope = async (signId: string, period: string) => {
    if (!signId) return;

    setLoading(prev => ({ ...prev, [period]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/${signId}/${period}`);
      const data = await response.json();
      if (data.success) {
        setHoroscopes(prev => ({
          ...prev,
          [period]: data.horoscope
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${period} horoscope:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [period]: false }));
    }
  };

  const handleSignSelect = (signId: string) => {
    setSelectedSign(signId);
    // Clear previous horoscopes
    setHoroscopes({});
    // Fetch current tab's horoscope
    fetchHoroscope(signId, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Clear summary state when switching tabs
    setShowSummary({ daily: false, weekly: false, monthly: false });
    // If sign is selected and we don't have data for this period, fetch it
    if (selectedSign && !horoscopes[tab as keyof typeof horoscopes]) {
      fetchHoroscope(selectedSign, tab);
    }
  };


  // Summarize horoscope with AI
  const summarizeHoroscope = async (period: string) => {
    const horoscope = horoscopes[period as keyof typeof horoscopes];
    if (!horoscope || !horoscope.prediction) return;

    // Check if summary already exists - toggle visibility
    if (summaries[period as keyof typeof summaries]) {
      setShowSummary(prev => ({ ...prev, [period]: !prev[period as keyof typeof prev] }));
      return;
    }

    setSummaryLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction: horoscope.prediction,
          period: period,
          zodiacSign: selectedSign
        })
      });

      const data = await response.json();
      console.log('Summary response:', data); // Debug log

      if (data.success && data.summary) {
        setSummaries(prev => ({ ...prev, [period]: data.summary }));
        setShowSummary(prev => ({ ...prev, [period]: true }));
      } else {
        console.error('Failed to get summary:', data);
      }
    } catch (error) {
      console.error('Error summarizing horoscope:', error);
    } finally {
      setSummaryLoading(false);
    }
  };


  const getPeriodIcon = (period: string) => {
    switch(period) {
      case 'daily': return Sun;
      case 'weekly': return Calendar;
      case 'monthly': return Moon;
      default: return Sun;
    }
  };

  const getPeriodColor = (period: string) => {
    switch(period) {
      case 'daily': return 'from-orange-500 to-red-500';
      case 'weekly': return 'from-blue-500 to-indigo-500';
      case 'monthly': return 'from-purple-500 to-pink-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const selectedZodiac = zodiacSigns?.find(sign => sign.id === selectedSign);
  const currentHoroscope = horoscopes[activeTab as keyof typeof horoscopes];
  const isLoading = loading[activeTab as keyof typeof loading];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-orange-100 via-purple-100 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent pt-2">
                {t('horoscope.title')}
              </h1>
              <Sparkles className="w-8 h-8 text-purple-500 ml-3" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('horoscope.subtitle')}
            </p>
            {language === 'EN' && (
              <p className="text-lg text-orange-600 font-medium">
                आपके लिए ज्योतिषीय भविष्यवाणी और मार्गदर्शन
              </p>
            )}
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {t('horoscope.badge')}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Zodiac Sign Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-orange-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-800 flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-500 mr-2" />
                  {t('horoscope.select.title')}
                  <Star className="w-6 h-6 text-orange-500 ml-2" />
                </CardTitle>
                <p className="text-gray-600">{t('horoscope.select.subtitle')}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedSign} onValueChange={handleSignSelect}>
                    <SelectTrigger className="w-full max-w-md mx-auto border-orange-300 focus:ring-orange-500 text-base h-12">
                      <SelectValue placeholder={t('horoscope.select.placeholder')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {zodiacSigns.map((sign) => (
                        <SelectItem
                          key={sign.id}
                          value={sign.id}
                          className="py-3 px-3 cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{sign.symbol}</span>
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-800">
                                {language === 'EN' ? (
                                  <>{sign.name} <span className="text-orange-600">({sign.nameHi})</span></>
                                ) : (
                                  <>{sign.nameHi} <span className="text-orange-600">({sign.name})</span></>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{sign.dates}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedZodiac && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center space-x-4 mt-6"
                    >
                      <div className="text-5xl">{selectedZodiac.symbol}</div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {language === 'EN' ? selectedZodiac.name : selectedZodiac.nameHi}
                        </h3>
                        <p className="text-orange-600 font-medium text-lg">
                          {language === 'EN' ? selectedZodiac.nameHi : selectedZodiac.name}
                        </p>
                        <p className="text-sm text-gray-500">{selectedZodiac.dates}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {selectedSign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Period Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex justify-center mb-6">
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="daily" className="flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>{t('horoscope.tabs.daily')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{t('horoscope.tabs.weekly')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>{t('horoscope.tabs.monthly')}</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Contents */}
                {['daily', 'weekly', 'monthly'].map((period) => (
                  <TabsContent key={period} value={period} className="mt-6">
                    {loading[period as keyof typeof loading] ? (
                      <Card className="border-orange-200 shadow-lg bg-white/90">
                        <CardContent className="p-8">
                          <div className="text-center space-y-4">
                            <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto"></div>
                            <p className="text-gray-600">{t('horoscope.loading')}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : currentHoroscope && activeTab === period ? (
                      <HoroscopeDisplay
                        horoscope={currentHoroscope}
                        period={activeTab}
                        zodiac={selectedZodiac}
                        getPeriodColor={getPeriodColor}
                        onSummarize={() => summarizeHoroscope(activeTab)}
                        summaryLoading={summaryLoading}
                        summary={summaries[activeTab as keyof typeof summaries]}
                        showSummary={showSummary[activeTab as keyof typeof showSummary]}
                        t={t}
                        language={language}
                      />
                    ) : (
                      <Card className="border-orange-200 shadow-lg bg-white/90">
                        <CardContent className="p-8">
                          <div className="text-center space-y-4">
                            <Sparkles className="w-16 h-16 text-orange-300 mx-auto" />
                            <p className="text-gray-500 text-lg">
                              {period === 'daily' ? t('horoscope.empty.daily') :
                               period === 'weekly' ? t('horoscope.empty.weekly') :
                               t('horoscope.empty.monthly')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}

          {/* Empty State */}
          {!selectedSign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">🌟</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('horoscope.welcome.title')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t('horoscope.welcome.description')}
              </p>
              {language === 'EN' && (
                <p className="text-orange-600 mt-3">
                  अपनी राशि चुनकर व्यक्तिगत भविष्यवाणी प्राप्त करें
                </p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Horoscope Display Component
const HoroscopeDisplay = ({
  horoscope,
  period,
  zodiac,
  getPeriodColor,
  onSummarize,
  summaryLoading,
  summary,
  showSummary,
  t,
  language
}: {
  horoscope: Horoscope;
  period: string;
  zodiac: ZodiacSign | undefined;
  getPeriodColor: (period: string) => string;
  onSummarize: () => void;
  summaryLoading: boolean;
  summary?: string;
  showSummary: boolean;
  t: (key: string) => string;
  language: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Period Header */}
      <Card className={`border-0 shadow-lg bg-gradient-to-r ${getPeriodColor(period)} text-white`}>
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold capitalize mb-2">
            {period === 'daily' ? t('horoscope.period.daily.title') :
             period === 'weekly' ? t('horoscope.period.weekly.title') :
             t('horoscope.period.monthly.title')} {language === 'EN' ? zodiac?.name : zodiac?.nameHi}
          </h3>
          <p className="opacity-90">
            {period === 'daily' ? t('horoscope.period.daily.subtitle') :
             period === 'weekly' ? t('horoscope.period.weekly.subtitle') :
             t('horoscope.period.monthly.subtitle')}
          </p>
          {horoscope.period_theme && (
            <Badge variant="secondary" className="bg-white/20 text-white mt-2">
              {horoscope.period_theme}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Prediction */}
      <Card className="border-orange-200 shadow-lg bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Star className="w-5 h-5 text-orange-500 mr-2" />
            {t('horoscope.prediction.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-lg">{horoscope.prediction}</p>

          {horoscope.prediction_hi && (
            <p className="text-gray-600 italic leading-relaxed border-l-4 border-orange-200 pl-4">
              {horoscope.prediction_hi}
            </p>
          )}

          {/* AI Summarizer Section */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('horoscope.summary.prompt')}</span>
              <Button
                onClick={onSummarize}
                variant="outline"
                size="sm"
                disabled={summaryLoading}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                {summaryLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                    {t('horoscope.summary.analyzing')}
                  </>
                ) : (
                  <>
                    <Star className="w-3 h-3 mr-2" />
                    {t('horoscope.summary.button')}
                  </>
                )}
              </Button>
            </div>

            {/* AI Summary Display */}
            {showSummary && summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-400"
              >
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <h4 className="font-semibold text-orange-800">{t('horoscope.summary.title')}</h4>
                </div>
                <p className="text-orange-700 leading-relaxed font-medium">{summary}</p>
              </motion.div>
            )}
          </div>

          {horoscope.spiritual_advice && (
            <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-4 border-l-4 border-orange-400">
              <p className="text-sm text-gray-700">
                <strong>{t('horoscope.spiritual.guidance')}</strong> {horoscope.spiritual_advice}
              </p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Lucky Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 shadow-md bg-white/95">
          <CardContent className="p-6 text-center">
            <Palette className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">{t('horoscope.lucky.color')}</p>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-lg px-4 py-2"
            >
              {horoscope.lucky_color}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-md bg-white/95">
          <CardContent className="p-6 text-center">
            <Hash className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">{t('horoscope.lucky.number')}</p>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-2xl font-bold px-6 py-2"
            >
              {horoscope.lucky_number}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Share Button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${zodiac?.name} ${period} Horoscope`,
                text: horoscope.prediction,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(`${horoscope.prediction}\n\n- ${zodiac?.name} ${period} Horoscope from SantVaani`);
            }
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('horoscope.share.button')}
        </Button>
      </div>
    </motion.div>
  );
};

export default HoroscopePage;