import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNaamJapSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl px-8 py-8 shadow-md overflow-hidden">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div
                className="text-5xl leading-none select-none"
                style={{ color: '#f97316', filter: 'drop-shadow(0 0 16px rgba(249,115,22,0.4))', fontFamily: 'serif' }}
              >ॐ</div>
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
                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full gap-2 shadow-md shadow-orange-200"
              >
                <TrendingUp className="w-4 h-4" />
                {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingNaamJapSection;
