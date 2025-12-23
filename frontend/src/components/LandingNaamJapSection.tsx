import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNaamJapSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-5xl">🕉️</span>
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {language === 'HI'
              ? 'अपनी आध्यात्मिक साधना को ट्रैक करें। दैनिक प्रगति, स्ट्रीक्स और सुंदर एनालिटिक्स के साथ निरंतरता बनाएं।'
              : 'Track your spiritual practice. Build consistency with daily progress, streaks, and beautiful analytics.'}
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">
              {language === 'HI' ? 'अपनी आध्यात्मिक यात्रा का दस्तावेज़ बनाएं' : 'Document your spiritual journey'}
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 max-w-3xl mx-auto border border-orange-200 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-3xl">📿</span>
              <Target className="w-6 h-6 text-orange-600" />
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {language === 'HI' ? 'अपनी नाम जप यात्रा शुरू करें' : 'Start Your Naam Jap Journey'}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {language === 'HI'
                ? 'रोज़ अपनी नाम जप गिनती दर्ज करें, स्ट्रीक्स बनाएं, और अपनी प्रगति का विश्लेषण करें। एक सरल और सुंदर तरीके से अपनी आध्यात्मिक साधना को मज़बूत बनाएं।'
                : 'Log your daily naam jap count, build streaks, and analyze your progress. Strengthen your spiritual practice in a simple and beautiful way.'}
            </p>

            <Link to="/naam-jap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <span className="text-2xl mr-2">🙏</span>
                {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-4">
              {language === 'HI' ? 'मुफ्त • कोई साइन-अप आवश्यक नहीं' : 'Free • No sign-up required'}
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'स्ट्रीक ट्रैकिंग' : 'Streak Tracking'}</span>
              </div>
              <p className="text-xs text-gray-600">{language === 'HI' ? 'निरंतरता बनाएं और प्रेरित रहें' : 'Build consistency & stay motivated'}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'सुंदर एनालिटिक्स' : 'Beautiful Analytics'}</span>
              </div>
              <p className="text-xs text-gray-600">{language === 'HI' ? 'अपनी प्रगति को विज़ुअलाइज़ करें' : 'Visualize your progress'}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'माइलस्टोन बैज' : 'Milestone Badges'}</span>
              </div>
              <p className="text-xs text-gray-600">{language === 'HI' ? 'उपलब्धियां अनलॉक करें' : 'Unlock achievements'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingNaamJapSection;
