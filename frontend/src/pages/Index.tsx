import { useState, Suspense, lazy } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

// Lazy load ChatBot for better performance
const ChatBot = lazy(() => import('@/components/chatBot'));

const Index = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Users,
      title: t('features.saints.title'),
      description: t('features.saints.description'),
      to: "/saints",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Heart,
      title: t('livingsaints.title'),
      description: t('livingsaints.subtitle'),
      to: "/living-saints",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Star,
      title: t('features.divine.title'),
      description: t('features.divine.description'),
      to: "/divine",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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


       {/* Beta Banner - Option 1: Top of page */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          {t('beta.banner')}
        </p>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Spiritual Fact Box */}
      <section className="py-16 bg-gradient-to-br from-white to-orange-25">
        <SpiritualFactBox />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sacred Wisdom
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.to}>
                  <Card className="group hover:shadow-lg transition-shadow duration-200 border border-gray-100 shadow-sm bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                          {feature.title}
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Bhajans */}
      <section className="py-16 bg-orange-50 border-t border-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md relative flex-shrink-0">
              <Video className="w-7 h-7 text-white ml-0.5" fill="white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('live.title')}</h2>
              <p className="text-gray-500">{t('live.description')}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-600 font-medium">{t('live.status')}</span>
              </div>
            </div>
            <Link to="/live-bhajans" className="flex-shrink-0">
              <button className="flex items-center gap-2 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full text-sm font-semibold transition-colors">
                {t('live.button')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Bhajan Section - New Spotify-style */}
      <LandingBhajanSection />

      {/* Featured Horoscope Section */}
      <LandingHoroscopeSection />

      {/* Naam Jap Tracker Section */}
      <LandingNaamJapSection />

      {/* Santvaani Space Section */}
      <LandingSantvaaniSpaceSection />

      {/* Featured Divine Stories Section */}
      <LandingStoriesSection />

      {/* Featured Blog Posts Section */}
      <LandingBlogSection />

      {/* Visitor Counter Section - Now fully dynamic */}
      <section className="py-12 bg-gradient-to-br from-white via-orange-25 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisitorCounter className="mb-8" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {t('mission.title')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('mission.description')}
              </p>

            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
                {t('mission.quote.sanskrit')}
              </blockquote>
              <p className="text-lg text-orange-600 mt-2">
                {t('mission.quote.english')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full w-full sm:w-auto"
                >
                  {t('mission.learn.more')}
                </Button>
              </Link>

              <Button
                onClick={() => setIsFeedbackOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('mission.feedback')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeedbackForm 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;