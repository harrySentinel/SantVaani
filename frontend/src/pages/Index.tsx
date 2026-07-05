import { useState, Suspense, lazy } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Heart, Star, ArrowRight, Video, MessageSquare } from 'lucide-react';
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
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('features.saints.title'),
      description: t('features.saints.description'),
      to: '/saints',
      gradient: 'from-orange-500 to-amber-500',
      glow: 'group-hover:shadow-orange-200/60',
    },
    {
      icon: Heart,
      title: t('livingsaints.title'),
      description: t('livingsaints.subtitle'),
      to: '/living-saints',
      gradient: 'from-rose-500 to-orange-500',
      glow: 'group-hover:shadow-rose-200/60',
    },
    {
      icon: Star,
      title: t('features.divine.title'),
      description: t('features.divine.description'),
      to: '/divine',
      gradient: 'from-amber-500 to-yellow-500',
      glow: 'group-hover:shadow-amber-200/60',
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

      {/* ── Page body with warm ambient background ── */}
      <div className="relative bg-[#faf8f5] overflow-hidden">

        {/* Fixed ambient blobs — these show through glass cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[5%] left-[-8%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[120px] opacity-30" />
          <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-amber-200 rounded-full blur-[100px] opacity-25" />
          <div className="absolute top-[60%] left-[20%] w-[600px] h-[400px] bg-orange-100 rounded-full blur-[130px] opacity-35" />
          <div className="absolute bottom-[5%] right-[10%] w-[450px] h-[450px] bg-yellow-100 rounded-full blur-[110px] opacity-30" />
        </div>

        {/* Spiritual Fact Box */}
        <section className="relative py-16 px-4">
          <SpiritualFactBox />
        </section>

        {/* Features — glass cards */}
        <section className="relative py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Explore</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sacred Wisdom</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.to} to={feature.to} className="group">
                    <div className={`relative bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-6 space-y-4 shadow-md transition-all duration-300 hover:shadow-xl hover:bg-white/80 ${feature.glow}`}>
                      {/* Inner top highlight */}
                      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                          {feature.title}
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-all duration-200 group-hover:translate-x-0.5" />
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Bhajans — glass strip */}
        <section className="relative py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl px-8 py-7 shadow-md flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg relative flex-shrink-0">
                <Video className="w-6 h-6 text-white ml-0.5" fill="white" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1.5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('live.title')}</h2>
                <p className="text-gray-500 text-sm">{t('live.description')}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-red-600 font-medium">{t('live.status')}</span>
                </div>
              </div>
              <Link to="/live-bhajans" className="flex-shrink-0">
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md shadow-orange-200">
                  {t('live.button')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Content sections */}
        <LandingBhajanSection />
        <LandingHoroscopeSection />
        <LandingNaamJapSection />
        <LandingSantvaaniSpaceSection />
        <LandingStoriesSection />
        <LandingBlogSection />

        {/* Visitor Counter */}
        <section className="relative py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <VisitorCounter className="mb-8" />
          </div>
        </section>

        {/* Mission — glass quote block */}
        <section className="relative py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{t('mission.title')}</h2>
                <p className="text-lg text-gray-500 leading-relaxed">{t('mission.description')}</p>
              </div>

              {/* Glass quote block */}
              <div className="relative bg-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-8 shadow-md overflow-hidden">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-40 pointer-events-none" />
                <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed relative z-10">
                  {t('mission.quote.sanskrit')}
                </blockquote>
                <p className="text-base text-orange-500 mt-3 font-medium relative z-10">
                  {t('mission.quote.english')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full w-full sm:w-auto bg-white/60 backdrop-blur-sm"
                  >
                    {t('mission.learn.more')}
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsFeedbackOpen(true)}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full w-full sm:w-auto shadow-md shadow-orange-200"
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
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
