import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowRight, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const zodiacSigns = [
  { name: 'Aries', icon: '♈', dates: 'Mar 21 - Apr 19', color: 'from-red-500 to-orange-500' },
  { name: 'Taurus', icon: '♉', dates: 'Apr 20 - May 20', color: 'from-green-500 to-emerald-500' },
  { name: 'Gemini', icon: '♊', dates: 'May 21 - Jun 20', color: 'from-yellow-500 to-amber-500' },
  { name: 'Cancer', icon: '♋', dates: 'Jun 21 - Jul 22', color: 'from-blue-500 to-cyan-500' },
  { name: 'Leo', icon: '♌', dates: 'Jul 23 - Aug 22', color: 'from-orange-500 to-red-500' },
  { name: 'Virgo', icon: '♍', dates: 'Aug 23 - Sep 22', color: 'from-green-600 to-teal-500' },
  { name: 'Libra', icon: '♎', dates: 'Sep 23 - Oct 22', color: 'from-pink-500 to-purple-500' },
  { name: 'Scorpio', icon: '♏', dates: 'Oct 23 - Nov 21', color: 'from-purple-600 to-indigo-600' },
  { name: 'Sagittarius', icon: '♐', dates: 'Nov 22 - Dec 21', color: 'from-purple-500 to-pink-500' },
  { name: 'Capricorn', icon: '♑', dates: 'Dec 22 - Jan 19', color: 'from-gray-600 to-slate-600' },
  { name: 'Aquarius', icon: '♒', dates: 'Jan 20 - Feb 18', color: 'from-blue-600 to-purple-600' },
  { name: 'Pisces', icon: '♓', dates: 'Feb 19 - Mar 20', color: 'from-teal-500 to-blue-500' },
];

const LandingHoroscopeSection = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-orange-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Star className="w-8 h-8 text-purple-600 animate-pulse" />
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-4xl">✨</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Daily Horoscope
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover what the stars have in store for you today. Get personalized insights based on Vedic astrology.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              {today}
            </span>
          </div>
        </div>

        {/* Zodiac Signs Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 mb-12">
          {zodiacSigns.map((sign, index) => (
            <Link key={sign.name} to="/horoscope" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-md bg-white/90 backdrop-blur-sm h-full">
                <CardContent className="p-3 md:p-4 text-center space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${sign.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl text-white">{sign.icon}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {sign.name}
                    </h3>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {sign.dates}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-3xl mx-auto border border-purple-200 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Moon className="w-6 h-6 text-purple-600" />
              <Sun className="w-6 h-6 text-orange-500" />
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Get Your Daily Guidance
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Receive personalized predictions based on ancient Vedic astrology.
              Discover insights about love, career, health, and more.
            </p>

            <Link to="/horoscope">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <Star className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                View Today's Horoscope
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-4">
              Updated daily with accurate Vedic predictions
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Daily Updates</span>
              </div>
              <p className="text-xs text-gray-600">Fresh predictions every day</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Vedic Astrology</span>
              </div>
              <p className="text-xs text-gray-600">Ancient wisdom & accuracy</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700">All Aspects</span>
              </div>
              <p className="text-xs text-gray-600">Love, career, health & more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHoroscopeSection;
