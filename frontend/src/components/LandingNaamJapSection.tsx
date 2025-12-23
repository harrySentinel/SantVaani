import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNaamJapSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Compact Header */}
          <div className="flex items-center justify-center mb-3">
            <span className="text-4xl">📿</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {language === 'HI'
              ? 'अपनी आध्यात्मिक साधना को ट्रैक करें। स्ट्रीक्स बनाएं और प्रगति देखें।'
              : 'Track your spiritual practice. Build streaks and monitor your progress.'}
          </p>

          {/* Single CTA Button */}
          <Link to="/naam-jap">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingNaamJapSection;
