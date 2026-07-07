import { useState, Suspense, lazy } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Heart, Star, ArrowRight, Video, MessageSquare, Sparkles } from 'lucide-react';
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

/* Reusable section label component for visual consistency */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{children}</p>
  </div>
);

const Index = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('features.saints.title'),
      description: t('features.saints.description'),
      to: '/saints',
      gradient: 'from-orange-500 to-amber-500',
      accent: 'from-orange-400 to-amber-400',
      shadow: 'hover:shadow-orange-100',
    },
    {
      icon: Heart,
      title: t('livingsaints.title'),
      description: t('livingsaints.subtitle'),
      to: '/living-saints',
      gradient: 'from-rose-500 to-orange-500',
      accent: 'from-rose-400 to-orange-400',
      shadow: 'hover:shadow-rose-100',
    },
    {
      icon: Star,
      title: t('features.divine.title'),
      description: t('features.divine.description'),
      to: '/divine',
      gradient: 'from-amber-500 to-yellow-400',
      accent: 'from-amber-400 to-yellow-300',
      shadow: 'hover:shadow-amber-100',
    },
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

      {/* ── Page body ── */}
      <div className="relative bg-[#faf8f5] overflow-hidden">

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[2%]  left-[-6%]  w-[600px] h-[600px] bg-orange-200  rounded-full blur-[130px] opacity-35" />
          <div className="absolute top-[25%] right-[-4%] w-[450px] h-[450px] bg-amber-200  rounded-full blur-[110px] opacity-28" />
          <div className="absolute top-[55%] left-[18%] w-[650px] h-[420px] bg-orange-100  rounded-full blur-[140px] opacity-40" />
          <div className="absolute top-[78%] right-[8%] w-[500px] h-[500px] bg-yellow-100  rounded-full blur-[120px] opacity-32" />
        </div>

        {/* ── Spiritual Fact ── */}
        <section className="relative py-14 px-4">
          <SpiritualFactBox />
        </section>

        {/* ── Features ── */}
        <section className="relative py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <SectionLabel>{language === 'EN' ? 'Explore' : 'खोजें'}</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {language === 'EN' ? 'Sacred Wisdom' : 'पवित्र ज्ञान'}
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                {language === 'EN' ? 'Discover India\'s timeless spiritual heritage' : 'भारत की शाश्वत आध्यात्मिक विरासत की खोज करें'}
              </p>
            </div>

            {/* Mobile: horizontal cards. Desktop: 3-column vertical grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.to} to={feature.to} className="group">

                    {/* ── Mobile card (horizontal) ── */}
                    <div className={`md:hidden flex items-stretch rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] ${feature.shadow}`}
                      style={{
                        background: 'rgba(255,255,255,0.82)',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.7)',
                      }}>
                      {/* Colored sidebar with icon */}
                      <div className={`w-16 flex-shrink-0 bg-gradient-to-b ${feature.gradient} flex items-center justify-center`}>
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 px-4 py-4 flex items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors leading-snug">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{feature.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-orange-400 transition-all duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* ── Desktop card (vertical) ── */}
                    <div className={`hidden md:block relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${feature.shadow}`}
                      style={{
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.7)',
                      }}>
                      {/* Top gradient strip — thicker, more impactful */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${feature.accent}`} />
                      <div className="p-6 space-y-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                            {feature.title}
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-all duration-200 group-hover:translate-x-0.5" />
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>

                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Live Bhajans ── */}
        <section className="relative py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-8 py-7 shadow-[0_8px_32px_rgba(249,115,22,0.25)] overflow-hidden">
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Video className="w-6 h-6 text-white ml-0.5" fill="white" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-red-500 animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-1">
                  <h2 className="text-xl font-bold text-white">{t('live.title')}</h2>
                  <p className="text-white/70 text-sm">{t('live.description')}</p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm text-white/80 font-medium">{t('live.status')}</span>
                  </div>
                </div>
                <Link to="/live-bhajans" className="flex-shrink-0">
                  <button className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-6 py-2.5 rounded-full text-sm font-bold transition-colors shadow-md">
                    {t('live.button')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
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
        <section className="relative py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <VisitorCounter />
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="relative py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                    {language === 'EN' ? 'Our Mission' : 'हमारा उद्देश्य'}
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">{t('mission.title')}</h2>
                <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">{t('mission.description')}</p>
              </div>

              {/* Quote card */}
              <div className="relative bg-white/55 backdrop-blur-md border border-white/70 rounded-3xl p-10 shadow-[0_4px_32px_rgba(249,115,22,0.08)] overflow-hidden">
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="text-5xl text-orange-200 font-serif leading-none select-none mb-4">"</div>
                <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed relative z-10">
                  {t('mission.quote.sanskrit')}
                </blockquote>
                <p className="text-base text-orange-500 mt-4 font-medium relative z-10">
                  {t('mission.quote.english')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/about">
                  <Button size="lg" variant="outline"
                    className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full bg-white/60 backdrop-blur-sm"
                  >
                    {t('mission.learn.more')}
                  </Button>
                </Link>
                <Button onClick={() => setIsFeedbackOpen(true)} size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-200"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('mission.feedback')}
                </Button>
              </div>
            </div>
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
