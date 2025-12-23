import { useState, Suspense, lazy } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Sparkles, Book, ArrowDown, Video, MessageSquare, Star } from 'lucide-react';
import VisitorCounter from '@/components/VisitorCounter';
import SpiritualFactBox from '@/components/SpiritualFactBox';
import FeedbackForm from '@/components/FeedbackForm';
import NoticeBoard from '@/components/NoticeBoard';
import LandingBlogSection from '@/components/LandingBlogSection';
import LandingStoriesSection from '@/components/LandingStoriesSection';
import LandingBhajanSection from '@/components/LandingBhajanSection';
import LandingHoroscopeSection from '@/components/LandingHoroscopeSection';
import LandingNaamJapSection from '@/components/LandingNaamJapSection';
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
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: t('livingsaints.title'),
      description: t('livingsaints.subtitle'),
      to: "/living-saints",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Sparkles,
      title: t('features.divine.title'),
      description: t('features.divine.description'),
      to: "/divine",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Santvaani - Where Ancient Wisdom Meets Modern Hearts"
        description="Discover the profound teachings and divine wisdom of India's greatest saints. Explore bhajans, spiritual quotes, daily horoscopes, and connect with a global community of seekers."
        canonical="https://santvaani.com"
        keywords="Indian saints, spirituality, bhajans, spiritual quotes, meditation, Hindu spirituality, daily horoscope, spiritual community, divine wisdom, sant vaani"
      />
      <StructuredData type="website" />
      <Navbar />
      <NoticeBoard />


       {/* Beta Banner - Option 1: Top of page */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-center py-2 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 animate-pulse"></div>
        <p className="text-sm font-medium relative z-10">
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
      <section className="py-20 bg-gradient-to-br from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Sacred Wisdom
            </h2>

             {/* Beta Badge - Option 3: Next to heading */}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                {t('beta.badge')}
              </span>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with enlightened masters and divine manifestations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.to}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowDown className="w-5 h-5 text-orange-500 mx-auto transform rotate-[-90deg]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Live Bhajan Section */}
<section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {t('live.title')}
      </h2>
      <p className="text-lg text-gray-600">
        {t('live.subtitle')}
      </p>
    </div>
    
    <Link to="/live-bhajans">
      <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 backdrop-blur-sm max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg relative">
            <Video className="w-10 h-10 text-white ml-1" fill="white" />
            {/* Live indicator dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              {t('live.button')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('live.description')}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-red-600 font-medium">
                {t('live.status')}
              </p>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowDown className="w-6 h-6 text-orange-500 mx-auto transform rotate-[-90deg]" />
          </div>
        </CardContent>
      </Card>
    </Link>
  </div>
</section>

      {/* Featured Bhajan Section - New Spotify-style */}
      <LandingBhajanSection />

      {/* Featured Horoscope Section */}
      <LandingHoroscopeSection />

      {/* Naam Jap Tracker Section */}
      <LandingNaamJapSection />

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

               {/* Beta Notice - Option 4: In mission section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-700">
                  {t('mission.beta.notice')}
                </p>
              </div>

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