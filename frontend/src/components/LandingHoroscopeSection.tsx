import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Calendar, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const ZodiacWheel = () => (
  <svg viewBox="0 0 420 420" className="w-full h-full">
    <circle cx="210" cy="210" r="200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="210" cy="210" r="150" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
    {ZODIAC.map((glyph, i) => {
      const a = ((i * 30 - 90) * Math.PI) / 180;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      return (
        <g key={glyph}>
          <line
            x1={210 + 192 * cos} y1={210 + 192 * sin}
            x2={210 + 200 * cos} y2={210 + 200 * sin}
            stroke="currentColor" strokeWidth="1" opacity="0.5"
          />
          <text
            x={210 + 172 * cos} y={210 + 172 * sin}
            fontSize="17" fill="currentColor" textAnchor="middle" dominantBaseline="central" opacity="0.85"
          >
            {glyph + '︎'}
          </text>
        </g>
      );
    })}
  </svg>
);

const LandingHoroscopeSection = () => {
  const { language } = useLanguage();

  const today = new Date().toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tiles = [
    { icon: Sun, label: language === 'HI' ? 'दैनिक' : 'Daily', sub: language === 'HI' ? 'आज का मार्गदर्शन' : "Today's guidance" },
    { icon: Moon, label: language === 'HI' ? 'साप्ताहिक' : 'Weekly', sub: language === 'HI' ? 'इस सप्ताह का दृष्टिकोण' : "This week's outlook" },
    { icon: Star, label: language === 'HI' ? 'मासिक' : 'Monthly', sub: language === 'HI' ? 'मासिक अंतर्दृष्टि' : 'Monthly insights' },
    { icon: Calendar, label: language === 'HI' ? '12 राशियां' : '12 Signs', sub: language === 'HI' ? 'सभी राशियों के लिए' : 'All zodiac signs' },
  ];

  return (
    <section id="horoscope" className="py-12 md:py-20 relative overflow-hidden scroll-mt-32 border-t border-gray-200">
      {/* Rotating zodiac wheel */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[440px] md:h-[440px] text-orange-200 opacity-50 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full"
        >
          <ZodiacWheel />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="space-y-5"
          >
            <p className="text-[13px] font-medium text-orange-600 tracking-wide">
              {language === 'HI' ? 'वैदिक ज्योतिष' : 'Vedic Astrology'}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#241a12] leading-tight">
              {language === 'HI' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
            </h2>
            <p className="text-gray-500 leading-relaxed">
              {language === 'HI'
                ? 'जानें कि आज तारे आपके लिए क्या लेकर आए हैं। वैदिक ज्योतिष पर आधारित व्यक्तिगत मार्गदर्शन प्राप्त करें।'
                : 'Discover what the stars hold for you today. Get personalized guidance grounded in ancient Vedic wisdom.'}
            </p>

            <div className="inline-flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{today}</span>
            </div>

            <div>
              <Link
                to="/horoscope"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#241a12] hover:bg-[#3a2b1c] transition-colors px-7 py-3 rounded-full mt-2"
              >
                {language === 'HI' ? 'आज का राशिफल देखें' : "View Today's Horoscope"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right — tiles */}
          <div className="grid grid-cols-2 gap-4">
            {tiles.map(({ icon: Icon, label, sub }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 + idx * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 space-y-2 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHoroscopeSection;
