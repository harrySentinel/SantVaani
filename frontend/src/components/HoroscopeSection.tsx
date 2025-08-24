import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Sparkles
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
  love_score: number;
  career_score: number;
  health_score: number;
  money_score: number;
  lucky_color: string;
  lucky_number: number;
}

const HoroscopeSection = () => {
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch zodiac signs list
  useEffect(() => {
    const fetchZodiacSigns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/horoscope/zodiac/list');
        const data = await response.json();
        if (data.success) {
          setZodiacSigns(data.zodiacSigns);
        }
      } catch (error) {
        console.error('Error fetching zodiac signs:', error);
      }
    };

    fetchZodiacSigns();
  }, []);

  // Fetch horoscope when sign is selected
  const fetchHoroscope = async (signId: string) => {
    if (!signId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/horoscope/${signId}`);
      const data = await response.json();
      if (data.success) {
        setHoroscope(data.horoscope);
      }
    } catch (error) {
      console.error('Error fetching horoscope:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignSelect = (signId: string) => {
    setSelectedSign(signId);
    fetchHoroscope(signId);
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const selectedZodiac = zodiacSigns.find(sign => sign.id === selectedSign);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
            <CardTitle className="text-2xl text-gray-800">Daily Horoscope</CardTitle>
            <Sparkles className="w-6 h-6 text-purple-500 ml-2" />
          </div>
          <p className="text-gray-600">Discover what the stars have in store for you today</p>
          <p className="text-purple-600 font-medium">आज के लिए ज्योतिष भविष्यवाणी</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Zodiac Sign Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Select Your Zodiac Sign / अपनी राशि चुनें
            </label>
            <Select value={selectedSign} onValueChange={handleSignSelect}>
              <SelectTrigger className="w-full border-purple-300 focus:ring-purple-500">
                <SelectValue placeholder="Choose your zodiac sign..." />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign.id} value={sign.id}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{sign.symbol}</span>
                      <span>{sign.name}</span>
                      <span className="text-gray-500">({sign.nameHi})</span>
                      <span className="text-xs text-gray-400">{sign.dates}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Reading the stars...</p>
            </div>
          )}

          {/* Horoscope Display */}
          {horoscope && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Selected Sign Display */}
              <div className="text-center p-4 bg-white/80 rounded-lg border border-purple-200">
                <div className="text-4xl mb-2">{selectedZodiac?.symbol}</div>
                <h3 className="text-xl font-bold text-gray-800">{selectedZodiac?.name}</h3>
                <p className="text-purple-600 font-medium">{selectedZodiac?.nameHi}</p>
                <p className="text-sm text-gray-500">{selectedZodiac?.dates}</p>
              </div>

              {/* Prediction */}
              <div className="bg-white/90 rounded-lg p-6 border border-purple-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Star className="w-5 h-5 text-purple-500 mr-2" />
                  Today's Prediction
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">{horoscope.prediction}</p>
                {horoscope.prediction_hi && (
                  <p className="text-gray-600 italic leading-relaxed">{horoscope.prediction_hi}</p>
                )}
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/90 rounded-lg p-4 text-center border border-red-200">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Love</p>
                  <div className="flex justify-center space-x-1 mb-1">
                    {renderStars(horoscope.love_score)}
                  </div>
                  <p className={`text-xs font-medium ${getScoreColor(horoscope.love_score)}`}>
                    {horoscope.love_score}/5
                  </p>
                </div>

                <div className="bg-white/90 rounded-lg p-4 text-center border border-blue-200">
                  <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Career</p>
                  <div className="flex justify-center space-x-1 mb-1">
                    {renderStars(horoscope.career_score)}
                  </div>
                  <p className={`text-xs font-medium ${getScoreColor(horoscope.career_score)}`}>
                    {horoscope.career_score}/5
                  </p>
                </div>

                <div className="bg-white/90 rounded-lg p-4 text-center border border-green-200">
                  <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Health</p>
                  <div className="flex justify-center space-x-1 mb-1">
                    {renderStars(horoscope.health_score)}
                  </div>
                  <p className={`text-xs font-medium ${getScoreColor(horoscope.health_score)}`}>
                    {horoscope.health_score}/5
                  </p>
                </div>

                <div className="bg-white/90 rounded-lg p-4 text-center border border-yellow-200">
                  <DollarSign className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Money</p>
                  <div className="flex justify-center space-x-1 mb-1">
                    {renderStars(horoscope.money_score)}
                  </div>
                  <p className={`text-xs font-medium ${getScoreColor(horoscope.money_score)}`}>
                    {horoscope.money_score}/5
                  </p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/90 rounded-lg p-4 text-center border border-orange-200">
                  <Palette className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Lucky Color</p>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700"
                  >
                    {horoscope.lucky_color}
                  </Badge>
                </div>

                <div className="bg-white/90 rounded-lg p-4 text-center border border-indigo-200">
                  <Hash className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Lucky Number</p>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 text-lg font-bold"
                  >
                    {horoscope.lucky_number}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!selectedSign && !loading && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select your zodiac sign to see your daily horoscope</p>
              <p className="text-purple-600 mt-1">अपनी दैनिक राशिफल देखने के लिए अपनी राशि चुनें</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HoroscopeSection;