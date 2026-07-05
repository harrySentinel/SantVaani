import { Link } from 'react-router-dom';
import { ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingSantvaaniSpaceSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
              {language === 'HI' ? 'समुदाय' : 'Community'}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'संतवाणी स्पेस' : 'Santvaani Space'}
            </h2>
            <p className="text-gray-500 max-w-sm">
              {language === 'HI'
                ? 'आध्यात्मिक सोशल फीड। प्रेरक पोस्ट, कहानियां और ज्ञान साझा करें।'
                : 'A spiritual social feed. Share posts, stories, and wisdom with fellow seekers.'}
            </p>
          </div>

          <Link to="/santvaani-space" className="flex-shrink-0">
            <Button
              size="lg"
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 px-7 py-3 rounded-full gap-2"
            >
              <Share2 className="w-4 h-4" />
              {language === 'HI' ? 'स्पेस देखें' : 'Explore Space'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingSantvaaniSpaceSection;
