import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Calendar, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const STARS = [
  { top: '6%', left: '8%', s: 2, d: '0s' },
  { top: '12%', left: '28%', s: 1.5, d: '1.2s' },
  { top: '9%', left: '52%', s: 2.5, d: '0.6s' },
  { top: '18%', left: '71%', s: 1.5, d: '2s' },
  { top: '7%', left: '88%', s: 2, d: '1.6s' },
  { top: '31%', left: '15%', s: 1.5, d: '0.9s' },
  { top: '38%', left: '44%', s: 2, d: '2.4s' },
  { top: '29%', left: '63%', s: 1.5, d: '0.3s' },
  { top: '44%', left: '84%', s: 2.5, d: '1.8s' },
  { top: '58%', left: '6%', s: 2, d: '1.1s' },
  { top: '64%', left: '33%', s: 1.5, d: '2.8s' },
  { top: '55%', left: '57%', s: 2, d: '0.5s' },
  { top: '71%', left: '76%', s: 1.5, d: '1.4s' },
  { top: '83%', left: '18%', s: 2, d: '2.2s' },
  { top: '88%', left: '47%', s: 1.5, d: '0.8s' },
  { top: '79%', left: '91%', s: 2, d: '1.9s' },
];

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
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#fcf7ee] via-[#f9f0e0] to-[#f5e7d0] border border-orange-100/70 p-8 md:p-14 shadow-[0_24px_64px_rgba(180,120,40,0.14)]"
        >
          {/* Starfield */}
          {STARS.map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-orange-300/70 animate-pulse pointer-events-none"
              style={{ top: star.top, left: star.left, width: star.s, height: star.s, animationDelay: star.d, animationDuration: '3s' }}
            />
          ))}

          {/* Ambient glows */}
          <div className="absolute -top-28 -right-20 w-96 h-96 rounded-full bg-orange-200/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-amber-200/50 blur-3xl pointer-events-none" />

          {/* Rotating zodiac wheel */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-28 -bottom-28 w-[440px] h-[440px] text-orange-300 opacity-25 pointer-events-none"
          >
            <ZodiacWheel />
          </motion.div>

          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left — text */}
            <div className="space-y-5">
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
                {language === 'HI' ? 'वैदिक ज्योतिष' : 'Vedic Astrology'}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {language === 'HI' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {language === 'HI'
                  ? 'जानें कि आज तारे आपके लिए क्या लेकर आए हैं। वैदिक ज्योतिष पर आधारित व्यक्तिगत मार्गदर्शन प्राप्त करें।'
                  : 'Discover what the stars hold for you today. Get personalized guidance grounded in ancient Vedic wisdom.'}
              </p>

              <div className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white/70 border border-orange-100 backdrop-blur-sm rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{today}</span>
              </div>

              <div>
                <Link to="/horoscope">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-7 py-3 rounded-full mt-2 gap-2 shadow-lg shadow-orange-200"
                  >
                    {language === 'HI' ? 'आज का राशिफल देखें' : "View Today's Horoscope"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — tiles */}
            <div className="grid grid-cols-2 gap-4">
              {tiles.map(({ icon: Icon, label, sub }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 + idx * 0.08 }}
                  className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-orange-100/80 rounded-2xl p-5 space-y-2 shadow-sm"
                >
                  <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-3 shadow-md shadow-orange-200">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHoroscopeSection;
