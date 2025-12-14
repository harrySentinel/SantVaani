// Language Selector for Blog - Choose Hindi or English Content
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/blog/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { useSpiritualTracking } from '@/hooks/useAnalytics';

const BlogLanguageSelector: React.FC = () => {
  const { trackVisitorCounter } = useSpiritualTracking();

  // Track page view
  useEffect(() => {
    trackVisitorCounter && trackVisitorCounter(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <SEOHead
        title="Spiritual Wisdom | Santvaani - Ancient Teachings in Hindi & English"
        description="Choose your preferred language to explore timeless spiritual teachings. Available in both Hindi and English for seekers worldwide."
        keywords={['spiritual wisdom', 'meditation', 'inner peace', 'bhakti', 'devotion', 'Hindi', 'English', 'spiritual guidance']}
        canonicalUrl="https://santvaani.com/blog"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white via-orange-25 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <span className="text-5xl animate-pulse">🕉️</span>
              <Heart className="w-7 h-7 text-orange-400 animate-pulse" />
              <span className="text-5xl animate-pulse">📿</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
              Spiritual Wisdom
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Choose your language to begin your journey
            </p>

            <div className="flex justify-center items-center gap-3 text-gray-500 text-sm">
              <Globe className="w-5 h-5" />
              <span className="font-light">Available in Hindi & English</span>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Hindi Option */}
          <Link to="/blog/hindi" className="block group">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-orange-200 hover:border-orange-400 bg-white cursor-pointer transform hover:-translate-y-2">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🇮🇳
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    हिंदी
                  </h2>
                  <p className="text-gray-500 font-light text-sm">
                    Hindi
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed font-light">
                  पवित्र शिक्षाओं को अपनी मातृभाषा में पढ़ें। भक्ति, ध्यान, और आध्यात्मिक मार्गदर्शन।
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100 w-full justify-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Articles</span>
                  </div>
                  <span>•</span>
                  <span className="text-orange-500">🕉️ मोक्ष</span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-orange-500 font-medium group-hover:gap-4 transition-all duration-300 pt-2">
                  <span>पढ़ना शुरू करें</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* English Option */}
          <Link to="/blog/english" className="block group">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-orange-200 hover:border-orange-400 bg-white cursor-pointer transform hover:-translate-y-2">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🌍
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    English
                  </h2>
                  <p className="text-gray-500 font-light text-sm">
                    International
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed font-light">
                  Discover timeless spiritual wisdom in English. Meditation, devotion, and daily practices for inner peace.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100 w-full justify-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Articles</span>
                  </div>
                  <span>•</span>
                  <span className="text-orange-500">🕉️ Moksha</span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-orange-500 font-medium group-hover:gap-4 transition-all duration-300 pt-2">
                  <span>Start Reading</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-white via-orange-25 to-white rounded-2xl p-8 border border-orange-100">
            <Globe className="w-10 h-10 text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-gray-800 mb-3">
              Reaching Seekers Worldwide
            </h3>
            <p className="text-gray-600 mb-6 font-light max-w-2xl mx-auto leading-relaxed">
              Our spiritual teachings are now available in both Hindi and English, making ancient wisdom
              accessible to seekers across India, USA, UK, Australia, and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
              <span className="px-3 py-1 bg-orange-50 rounded-full">🇮🇳 India</span>
              <span className="px-3 py-1 bg-orange-50 rounded-full">🇺🇸 USA</span>
              <span className="px-3 py-1 bg-orange-50 rounded-full">🇬🇧 UK</span>
              <span className="px-3 py-1 bg-orange-50 rounded-full">🇦🇺 Australia</span>
              <span className="px-3 py-1 bg-orange-50 rounded-full">🇨🇦 Canada</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogLanguageSelector;
