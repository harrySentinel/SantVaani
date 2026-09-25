'use client';

import Link from '@/components/SiteLink';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Check } from 'lucide-react';
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
    <section id="naam-jap" className="py-12 md:py-16 relative scroll-mt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="rounded-2xl border border-gray-200 px-6 py-8 md:px-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
              <div className="w-12 h-12 flex-shrink-0 rounded-full border border-orange-200 flex items-center justify-center">
                <span className="text-2xl leading-none text-orange-500 select-none font-serif">ॐ</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241a12]">
                  {language === 'HI' ? 'नाम जप ट्रैकर' : 'Naam Jap Tracker'}
                </h2>
                <p className="text-gray-500 max-w-sm">
                  {language === 'HI'
                    ? 'अपनी आध्यात्मिक साधना को ट्रैक करें। स्ट्रीक्स बनाएं और प्रगति देखें।'
                    : 'Track your daily spiritual practice. Build streaks, stay consistent.'}
                </p>
                <Link
                  to="/naam-jap"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#241a12] hover:bg-[#3a2b1c] transition-colors px-6 py-2.5 rounded-full mt-2"
                >
                  <Flame className="w-4 h-4" />
                  {language === 'HI' ? 'ट्रैकिंग शुरू करें' : 'Start Tracking'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Weekly streak widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
              className="w-full max-w-xs border border-gray-200 rounded-2xl p-5 space-y-4 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {language === 'HI' ? 'इस सप्ताह' : 'This week'}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
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
                          ? 'bg-orange-500 text-white'
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
