import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingSantvaaniSpaceSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Compact Header */}
          <div className="flex items-center justify-center mb-3">
            <span className="text-4xl">🌸</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
            {language === 'HI' ? 'संतवाणी स्पेस' : 'Santvaani Space'}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {language === 'HI'
              ? 'आध्यात्मिक सोशल फीड। प्रेरक पोस्ट, कहानियां और ज्ञान साझा करें।'
              : 'Spiritual Social Feed. Share inspiring posts, stories, and wisdom.'}
          </p>

          {/* Single CTA Button */}
          <Link to="/santvaani-space">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:from-pink-600 hover:via-purple-600 hover:to-purple-700 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {language === 'HI' ? 'स्पेस देखें' : 'Explore Space'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingSantvaaniSpaceSection;
