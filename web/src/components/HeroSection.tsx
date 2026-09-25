'use client';

import Link from '@/components/SiteLink';
import { Button } from '@/components/ui/button';
import { ArrowDown, Heart, Music, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background images */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/mb_bckg.png')" }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url('/dsk_bckg.png')" }}
      />

      {/* Warm vignette overlay — lets image breathe while keeping text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/55 via-white/20 to-orange-50/65" />
      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-7">

          {/* OM with halo ring */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer halo */}
              <div className="absolute w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 72%)' }} />
              <span
                className="relative text-7xl leading-none select-none"
                style={{ fontFamily: 'serif', color: '#ea6800', filter: 'drop-shadow(0 2px 16px rgba(249,115,22,0.45))' }}
              >
                ॐ
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div className="space-y-1.5" variants={fadeUp} custom={0.15} initial="hidden" animate="visible">
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 45%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 8px rgba(249,115,22,0.2))',
              }}
            >
              {t('site.name')}
            </h1>
            {language === 'EN' && (
              <p className="text-xl font-medium tracking-[0.12em]" style={{ color: 'rgba(249,115,22,0.55)' }}>संतवाणी</p>
            )}
          </motion.div>

          {/* Tagline */}
          <motion.div className="max-w-2xl mx-auto space-y-2" variants={fadeUp} custom={0.3} initial="hidden" animate="visible">
            <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed"
              style={{ color: 'rgba(22,12,2,0.88)', textShadow: '0 1px 12px rgba(255,255,255,0.6)' }}>
              {language === 'EN' ? (
                <>Where Ancient Wisdom Meets{' '}
                  <span style={{ color: '#ea580c' }}>Modern Hearts</span>
                </>
              ) : (
                <>जहाँ <span style={{ color: '#ea580c' }}>प्राचीन ज्ञान</span> मिलता है <span style={{ color: '#ea580c' }}>आधुनिक हृदयों</span> से</>
              )}
            </h2>
            <p className="text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: 'rgba(35,20,5,0.6)', textShadow: '0 1px 8px rgba(255,255,255,0.5)' }}>
              {t('hero.description.main')}
            </p>
          </motion.div>

          {/* ── Stats pills ── */}
          <motion.div
            className="flex flex-wrap justify-center gap-2.5"
            variants={fadeUp} custom={0.6} initial="hidden" animate="visible"
          >
            {[
              { label: language === 'EN' ? 'Saints' : 'संत', value: '100+' },
              { label: language === 'EN' ? 'Bhajans' : 'भजन', value: '500+' },
              { label: language === 'EN' ? 'Seekers' : 'साधक', value: '10k+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,252,248,0.72)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.55), 0 1px 4px rgba(249,115,22,0.07)',
                }}
              >
                <span className="text-sm font-bold" style={{ color: '#ea580c' }}>{stat.value}</span>
                <span className="w-px h-3 flex-shrink-0" style={{ background: 'rgba(249,115,22,0.2)' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(30,15,5,0.65)' }}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-1"
            variants={fadeUp} custom={0.75} initial="hidden" animate="visible"
          >
            <Link to="/saints">
              <Button size="lg"
                className="text-white px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 4px 20px rgba(234,88,0,0.35)',
                }}>
                <Heart className="w-4 h-4 mr-2" />
                {t('hero.button.saints')}
              </Button>
            </Link>
            <Link to="/bhajans">
              <Button variant="outline" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: '#9a3412',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                <Music className="w-4 h-4 mr-2" />
                {language === 'EN' ? 'Listen Bhajans' : 'भजन सुनें'}
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="lg"
                className="px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ color: '#9a3412' }}>
                <BookOpen className="w-4 h-4 mr-2" />
                {language === 'EN' ? 'Read Blog' : 'ब्लॉग पढ़ें'}
              </Button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
          >
            <ArrowDown className="w-4 h-4 mx-auto animate-bounce" style={{ color: 'rgba(249,115,22,0.5)' }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
