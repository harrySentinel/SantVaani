import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const WEEK = [
  { label: 'M', done: true },
  { label: 'T', done: true },
  { label: 'W', done: true },
  { label: 'T', done: true },
  { label: 'F', done: true },
  { label: 'S', done: false },
  { label: 'S', done: false },
];

const LandingNaamJapSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/70 to-white border border-orange-100/80 shadow-[0_12px_40px_rgba(249,115,22,0.10)] px-8 py-8 md:px-10"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
                <span className="text-3xl leading-none text-white select-none" style={{ fontFamily: 'serif' }}>ॐ</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
                </h2>
                <p className="text-gray-500 max-w-sm">
                  {language === 'HI'
                    ? 'अपनी आध्यात्मिक साधना को ट्रैक करें। स्ट्रीक्स बनाएं और प्रगति देखें।'
                    : 'Track your daily spiritual practice. Build streaks, stay consistent.'}
                </p>
                <Link to="/naam-jap" className="inline-block pt-2">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full gap-2 shadow-md shadow-orange-200"
                  >
                    <Flame className="w-4 h-4" />
                    {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Weekly streak widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
              className="w-full max-w-xs bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-5 space-y-4 shadow-sm flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {language === 'HI' ? 'इस सप्ताह' : 'This week'}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1">
                  <Flame className="w-3.5 h-3.5" />
                  {language === 'HI' ? '5 दिन स्ट्रीक' : '5-day streak'}
                </span>
              </div>
              <div className="flex justify-between">
                {WEEK.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.25 + i * 0.06 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        day.done
                          ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md shadow-orange-200'
                          : 'border-2 border-dashed border-gray-200 text-gray-300'
                      }`}
                    >
                      {day.done && <Check className="w-4 h-4" strokeWidth={3} />}
                    </motion.div>
                    <span className="text-[10px] font-medium text-gray-400">{day.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">
                {language === 'HI' ? 'दैनिक लक्ष्य: 108 जाप' : 'Daily goal: 108 chants'}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingNaamJapSection;
