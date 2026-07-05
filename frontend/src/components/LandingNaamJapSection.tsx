import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNaamJapSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="text-4xl font-bold text-orange-500 leading-none">ॐ</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
            </h2>
            <p className="text-gray-500 max-w-sm">
              {language === 'HI'
                ? 'अपनी आध्यात्मिक साधना को ट्रैक करें। स्ट्रीक्स बनाएं और प्रगति देखें।'
                : 'Track your daily spiritual practice. Build streaks, stay consistent.'}
            </p>
          </div>

          <Link to="/naam-jap" className="flex-shrink-0">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-7 py-3 rounded-full gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingNaamJapSection;
