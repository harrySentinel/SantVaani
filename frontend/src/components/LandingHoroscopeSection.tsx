import { Link } from 'react-router-dom';
import { Star, ArrowRight, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingHoroscopeSection = () => {
  const { language } = useLanguage();

  const today = new Date().toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div className="space-y-5">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
              {language === 'HI' ? 'वैदिक ज्योतिष' : 'Vedic Astrology'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {language === 'HI' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {language === 'HI'
                ? 'जानें कि आज तारे आपके लिए क्या लेकर आए हैं। वैदिक ज्योतिष पर आधारित व्यक्तिगत मार्गदर्शन प्राप्त करें।'
                : 'Discover what the stars hold for you today. Get personalized guidance grounded in ancient Vedic wisdom.'}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>{today}</span>
            </div>

            <Link to="/horoscope">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full mt-2 gap-2 shadow-md shadow-orange-200"
              >
                {language === 'HI' ? 'आज का राशिफल देखें' : "View Today's Horoscope"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right — visual */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Sun,      label: language === 'HI' ? 'दैनिक'    : 'Daily',   sub: language === 'HI' ? 'आज का मार्गदर्शन'     : 'Today\'s guidance' },
              { icon: Moon,     label: language === 'HI' ? 'साप्ताहिक' : 'Weekly',  sub: language === 'HI' ? 'इस सप्ताह का दृष्टिकोण' : 'This week\'s outlook' },
              { icon: Star,     label: language === 'HI' ? 'मासिक'    : 'Monthly', sub: language === 'HI' ? 'मासिक अंतर्दृष्टि'     : 'Monthly insights' },
              { icon: Calendar, label: language === 'HI' ? '12 राशियां' : '12 Signs', sub: language === 'HI' ? 'सभी राशियों के लिए'   : 'All zodiac signs' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHoroscopeSection;
