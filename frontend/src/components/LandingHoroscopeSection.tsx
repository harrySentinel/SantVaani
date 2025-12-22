import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowRight, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
