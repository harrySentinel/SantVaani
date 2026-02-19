import React, { useState, useEffect } from 'react';
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
  Palette,
  Hash,
  Calendar,
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
          setZodiacSigns(FALLBACK_SIGNS);
        }
      } catch (error) {
        console.error('Error fetching zodiac signs:', error);
        setZodiacSigns(FALLBACK_SIGNS);
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
    setHoroscopes({});
    fetchHoroscope(signId, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowSummary({ daily: false, weekly: false, monthly: false });
    if (selectedSign && !horoscopes[tab as keyof typeof horoscopes]) {
      fetchHoroscope(selectedSign, tab);
    }
  };

  // Summarize horoscope with AI
  const summarizeHoroscope = async (period: string) => {
    const horoscope = horoscopes[period as keyof typeof horoscopes];
    if (!horoscope || !horoscope.prediction) return;

    if (summaries[period as keyof typeof summaries]) {
      setShowSummary(prev => ({ ...prev, [period]: !prev[period as keyof typeof prev] }));
      return;
    }

    setSummaryLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/horoscope/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prediction: horoscope.prediction,
          period: period,
          zodiacSign: selectedSign
        })
      });

      const data = await response.json();
      console.log('Summary response:', data);

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

  const getPeriodColor = (period: string) => {
    switch(period) {
      case 'daily': return 'from-orange-500 to-red-500';
      case 'weekly': return 'from-orange-400 to-amber-500';
      case 'monthly': return 'from-amber-500 to-orange-600';
      default: return 'from-orange-500 to-red-500';
    }
  };

  const selectedZodiac = zodiacSigns?.find(sign => sign.id === selectedSign);
  const currentHoroscope = horoscopes[activeTab as keyof typeof horoscopes];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-orange-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <p className="text-5xl mb-2">✨</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t('horoscope.title')}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t('horoscope.subtitle')}
            </p>
            {language === 'EN' && (
              <p className="text-base text-orange-600">
                आपके लिए ज्योतिषीय भविष्यवाणी और मार्गदर्शन
              </p>
            )}
            <div className="flex justify-center">
              <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium">
                {t('horoscope.badge')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Zodiac Sign Selector */}
          <div className="mb-8">
            <Card className="border-orange-100 shadow-sm bg-white">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl text-gray-800 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  {t('horoscope.select.title')}
                </CardTitle>
                <p className="text-gray-500 text-sm">{t('horoscope.select.subtitle')}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedSign} onValueChange={handleSignSelect}>
                    <SelectTrigger className="w-full max-w-md mx-auto border-orange-200 focus:ring-orange-400 text-base h-12">
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
                    <div className="flex items-center justify-center space-x-4 mt-6">
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
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedSign && (
            <div>
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
                      <Card className="border-orange-100 shadow-sm bg-white">
                        <CardContent className="p-8">
                          <div className="text-center space-y-4">
                            <div className="animate-spin w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full mx-auto"></div>
                            <p className="text-gray-500">{t('horoscope.loading')}</p>
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
                      <Card className="border-orange-100 shadow-sm bg-white">
                        <CardContent className="p-8">
                          <div className="text-center space-y-4">
                            <Star className="w-12 h-12 text-orange-200 mx-auto" />
                            <p className="text-gray-400 text-base">
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
            </div>
          )}

          {/* Empty State */}
          {!selectedSign && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6">🌟</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('horoscope.welcome.title')}</h2>
              <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                {t('horoscope.welcome.description')}
              </p>
              {language === 'EN' && (
                <p className="text-orange-500 mt-3 text-sm">
                  अपनी राशि चुनकर व्यक्तिगत भविष्यवाणी प्राप्त करें
                </p>
              )}
            </div>
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
    <div className="space-y-5">
      {/* Period Header */}
      <Card className={`border-0 shadow-md bg-gradient-to-r ${getPeriodColor(period)} text-white`}>
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold capitalize mb-1">
            {period === 'daily' ? t('horoscope.period.daily.title') :
             period === 'weekly' ? t('horoscope.period.weekly.title') :
             t('horoscope.period.monthly.title')} {language === 'EN' ? zodiac?.name : zodiac?.nameHi}
          </h3>
          <p className="opacity-85 text-sm">
            {period === 'daily' ? t('horoscope.period.daily.subtitle') :
             period === 'weekly' ? t('horoscope.period.weekly.subtitle') :
             t('horoscope.period.monthly.subtitle')}
          </p>
          {horoscope.period_theme && (
            <Badge variant="secondary" className="bg-white/20 text-white mt-2 border-0">
              {horoscope.period_theme}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Prediction */}
      <Card className="border-orange-100 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-gray-800 text-base">
            <Star className="w-4 h-4 text-orange-500 mr-2" />
            {t('horoscope.prediction.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{horoscope.prediction}</p>

          {horoscope.prediction_hi && (
            <p className="text-gray-500 italic leading-relaxed border-l-4 border-orange-200 pl-4 text-sm">
              {horoscope.prediction_hi}
            </p>
          )}

          {/* AI Summarizer Section */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{t('horoscope.summary.prompt')}</span>
              <Button
                onClick={onSummarize}
                variant="outline"
                size="sm"
                disabled={summaryLoading}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
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
              <div className="mt-3 bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-orange-500 mr-2" />
                  <h4 className="font-semibold text-orange-800 text-sm">{t('horoscope.summary.title')}</h4>
                </div>
                <p className="text-orange-700 leading-relaxed text-sm font-medium">{summary}</p>
              </div>
            )}
          </div>

          {horoscope.spiritual_advice && (
            <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
              <p className="text-sm text-gray-700">
                <strong>{t('horoscope.spiritual.guidance')}</strong> {horoscope.spiritual_advice}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lucky Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-100 shadow-sm bg-white">
          <CardContent className="p-6 text-center">
            <Palette className="w-7 h-7 text-orange-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-2">{t('horoscope.lucky.color')}</p>
            <span className="inline-block bg-orange-100 text-orange-700 text-base px-4 py-1.5 rounded-full font-medium">
              {horoscope.lucky_color}
            </span>
          </CardContent>
        </Card>

        <Card className="border-orange-100 shadow-sm bg-white">
          <CardContent className="p-6 text-center">
            <Hash className="w-7 h-7 text-orange-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-2">{t('horoscope.lucky.number')}</p>
            <span className="inline-block bg-amber-100 text-amber-700 text-2xl font-bold px-6 py-1.5 rounded-full">
              {horoscope.lucky_number}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Share Button */}
      <div className="text-center pt-2">
        <Button
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${zodiac?.name} ${period} Horoscope`,
                text: horoscope.prediction,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(`${horoscope.prediction}\n\n- ${zodiac?.name} ${period} Horoscope from Santvaani`);
            }
          }}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('horoscope.share.button')}
        </Button>
      </div>
    </div>
  );
};

const FALLBACK_SIGNS: ZodiacSign[] = [
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
];

export default HoroscopePage;
