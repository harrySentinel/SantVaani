import { Link } from 'react-router-dom';
import { ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingSantvaaniSpaceSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl px-8 py-8 shadow-md overflow-hidden">
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-3 shadow-md">
                <Share2 className="w-5 h-5 text-white" />
              </div>
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
              <div className="flex gap-2 mt-4 flex-wrap">
                {['Jai Shri Ram', 'Meditation', 'Bhagavad Gita'].map(tag => (
                  <span key={tag} className="text-xs bg-orange-50/80 border border-orange-100 text-orange-500 px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>

            <Link to="/santvaani-space" className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full gap-2 shadow-md shadow-orange-200"
              >
                {language === 'HI' ? 'स्पेस देखें' : 'Explore Space'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSantvaaniSpaceSection;
