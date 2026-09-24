import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video, MessageSquare, Music2, Moon, Flame, Share2, BookMarked, BookOpen, ScrollText } from 'lucide-react';
import VisitorCounter from '@/components/VisitorCounter';
import SpiritualFactBox from '@/components/SpiritualFactBox';
import FeedbackForm from '@/components/FeedbackForm';
import NoticeBoard from '@/components/NoticeBoard';
import LandingBlogSection from '@/components/LandingBlogSection';
import LandingStoriesSection from '@/components/LandingStoriesSection';
import LandingBhajanSection from '@/components/LandingBhajanSection';
import LandingHoroscopeSection from '@/components/LandingHoroscopeSection';
import LandingNaamJapSection from '@/components/LandingNaamJapSection';
import LandingSantvaaniSpaceSection from '@/components/LandingSantvaaniSpaceSection';
import { useLanguage } from '@/contexts/LanguageContext';

const ChatBot = lazy(() => import('@/components/chatBot'));

const Index = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { t, language } = useLanguage();

  const features = [
    {
      title: t('features.saints.title'),
      description: t('features.saints.description'),
      to: '/saints',
    },
    {
      title: t('features.divine.title'),
      description: t('features.divine.description'),
      to: '/divine',
    },
  ];

  const quickLinks = [
    { id: 'bhajans', to: '#bhajans', icon: Music2, label: { EN: 'Bhajans', HI: 'भजन' } },
    { id: 'horoscope', to: '#horoscope', icon: Moon, label: { EN: 'Horoscope', HI: 'राशिफल' } },
    { id: 'naam-jap', to: '#naam-jap', icon: Flame, label: { EN: 'Naam Jap', HI: 'नाम जप' } },
    { id: 'space', to: '#space', icon: Share2, label: { EN: 'Space', HI: 'स्पेस' } },
    { id: 'stories', to: '#stories', icon: BookMarked, label: { EN: 'Stories', HI: 'कथाएं' } },
    { id: 'blog', to: '#blog', icon: BookOpen, label: { EN: 'Blog', HI: 'ब्लॉग' } },
    { id: 'jeevani', to: '/jeevani', icon: ScrollText, label: { EN: 'Jeevani', HI: 'जीवनी' } },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <SEO
        title="Santvaani - Spiritual Wisdom, Bhajans & Indian Saints"
        description="Explore the teachings of India's greatest saints. Daily horoscopes, devotional bhajans, spiritual quotes, meditation guidance, and stories of divine wisdom — in English and Hindi."
        canonical="https://santvaani.com"
        keywords="Indian saints, spirituality, bhajans, spiritual quotes, meditation, Hindu spirituality, daily horoscope, rashifal, spiritual community, divine wisdom, sant vaani, santvaani, vedic wisdom, kabir, meera bai, hanuman chalisa, krishna, shiva"
      />
      <StructuredData type="website" />
      <StructuredData type="organization" />
      <Navbar />
      <NoticeBoard />

      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">{t('beta.banner')}</p>
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Smooth hero → body transition */}
      <div className="h-16 bg-gradient-to-b from-white/80 to-[#faf8f5] -mt-1" />

      {/* ── Quick-nav chips ── */}
      <div className="sticky top-16 z-20 bg-[#faf8f5]/90 backdrop-blur-md border-b border-orange-100/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.to}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors rounded-full px-4 py-2"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label[language === 'HI' ? 'HI' : 'EN']}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="relative bg-[#faf8f5]">

        {/* ── Spiritual Fact ── */}
        <section className="relative py-10 md:py-14 px-4">
          <SpiritualFactBox />
        </section>

        {/* ── Features ── */}
        <section className="relative py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-xl mb-10 md:mb-14"
            >
              <p className="text-[13px] font-medium text-orange-600 tracking-wide mb-3">
                {language === 'EN' ? 'Explore' : 'खोजें'}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#241a12] leading-[1.08]">
                {language === 'EN' ? 'Sacred Wisdom' : 'पवित्र ज्ञान'}
              </h2>
              <p className="text-gray-500 mt-4 leading-relaxed">
                {language === 'EN' ? 'Discover India\'s timeless spiritual heritage' : 'भारत की शाश्वत आध्यात्मिक विरासत की खोज करें'}
              </p>
            </motion.div>

            {/* Editorial list */}
            <div className="border-t border-gray-200">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.to}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: idx * 0.08 }}
                >
                  <Link
                    to={feature.to}
                    className="group flex items-center gap-5 md:gap-10 py-7 md:py-9 border-b border-gray-200 transition-colors hover:bg-orange-50/40 -mx-4 px-4 sm:mx-0 sm:px-2"
                  >
                    <span className="font-serif text-2xl md:text-3xl text-orange-300 group-hover:text-orange-500 transition-colors w-10 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-2xl font-semibold text-[#241a12] group-hover:text-orange-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500 mt-1 leading-relaxed max-w-lg">
                        {feature.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Live Bhajans ── */}
        <section className="relative py-4 md:py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 bg-[#241a12] rounded-2xl px-6 md:px-8 py-6">
              <div className="relative flex-shrink-0">
                <Video className="w-6 h-6 text-orange-400" fill="currentColor" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#241a12] animate-pulse" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h2 className="text-lg font-semibold text-white">{t('live.title')}</h2>
                <p className="text-white/50 text-sm">{t('live.description')}</p>
              </div>
              <Link
                to="/live-bhajans"
                className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200 transition-colors border border-white/15 hover:border-white/30 rounded-full px-5 py-2.5"
              >
                {t('live.button')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Content sections ── */}
        <LandingBhajanSection />
        <LandingHoroscopeSection />
        <LandingNaamJapSection />
        <LandingSantvaaniSpaceSection />
        <LandingStoriesSection />
        <LandingBlogSection />

        {/* ── Visitor Counter ── */}
        <section className="relative py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <VisitorCounter />
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="relative py-16 md:py-24 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-3"
            >
              <p className="text-[13px] font-medium text-orange-600 tracking-wide">
                {language === 'EN' ? 'Our Mission' : 'हमारा उद्देश्य'}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#241a12] leading-tight">{t('mission.title')}</h2>
              <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">{t('mission.description')}</p>
            </motion.div>

            {/* Pull quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="my-12 md:my-16"
            >
              <div className="w-10 h-px bg-orange-300 mx-auto mb-6" />
              <blockquote className="font-serif text-2xl md:text-3xl text-[#241a12] italic leading-relaxed">
                {t('mission.quote.sanskrit')}
              </blockquote>
              <p className="text-sm text-orange-600 mt-4 font-medium tracking-wide">
                {t('mission.quote.english')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/about"
                className="text-sm font-semibold text-[#241a12] border-b-2 border-orange-400 pb-0.5 hover:text-orange-600 transition-colors"
              >
                {t('mission.learn.more')}
              </Link>
              <Button onClick={() => setIsFeedbackOpen(true)} size="lg"
                className="bg-[#241a12] hover:bg-[#3a2b1c] text-white px-8 py-3 rounded-full shadow-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('mission.feedback')}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <Suspense fallback={null}><ChatBot /></Suspense>
      <Footer />
    </div>
  );
};

export default Index;
