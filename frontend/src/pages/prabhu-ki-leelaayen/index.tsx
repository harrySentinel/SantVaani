// Prabhu Ki Leelaayen - Divine Scripture Reading Experience
// प्रभु की लीलाएँ - Interactive book reading with beautiful animations

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Clock, Eye, Heart, Sparkles, ChevronRight,
  BookMarked, Star, Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  title_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  chapter_image?: string;
  read_time: number;
  views: number;
}

const PrabhuKiLeelaayen: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch published chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prabhu_leelaayen_chapters')
          .select('*')
          .eq('published', true)
          .order('chapter_number', { ascending: true });

        if (error) throw error;
        setChapters(data || []);
      } catch (err: any) {
        console.error('Error fetching chapters:', err);
        setError('Unable to load chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/prabhu-ki-leelaayen/read/${chapters[0].slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      {/* Hero Section - Book Cover Design */}
      <section className="relative py-20 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-red-100/50 backdrop-blur-3xl" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Sacred Design Elements */}
            <div className="relative">
              {/* Decorative mandala-like design */}
              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-orange-500"></div>
                <Sparkles className="w-10 h-10 text-orange-500 animate-pulse" />
                <span className="text-7xl md:text-8xl animate-pulse drop-shadow-2xl">🕉️</span>
                <Sparkles className="w-10 h-10 text-orange-500 animate-pulse" />
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-orange-500 to-orange-500"></div>
              </div>

              {/* Epic Title - Hindi Only */}
              <div className="space-y-6">
                <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl tracking-wide" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  लीलाएँ
                </h1>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400"></div>
                  <p className="text-2xl md:text-3xl text-orange-700 font-semibold italic">
                    {language === 'hi' ? 'दिव्य कथाएँ' : 'Divine Stories'}
                  </p>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-400"></div>
                </div>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                  {language === 'hi'
                    ? 'दिव्य कथाओं की एक अद्भुत यात्रा। प्रभु की अनंत लीलाओं को सुंदर पुस्तक अनुभव के साथ पढ़ें।'
                    : 'An enchanting journey through divine stories. Experience the eternal pastimes of the Lord with a beautiful book-like interface.'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Badge variant="outline" className="px-6 py-3 text-lg bg-white/80 backdrop-blur-sm border-orange-300">
                <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                {chapters.length} {language === 'hi' ? 'अध्याय' : 'Chapters'}
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-lg bg-white/80 backdrop-blur-sm border-orange-300">
                <Star className="w-5 h-5 mr-2 text-orange-600" />
                {language === 'hi' ? 'इंटरैक्टिव अनुभव' : 'Interactive Experience'}
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-lg bg-white/80 backdrop-blur-sm border-orange-300">
                <BookMarked className="w-5 h-5 mr-2 text-orange-600" />
                {language === 'hi' ? 'बुकमार्क & सहेजें' : 'Bookmark & Save'}
              </Badge>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button
                onClick={handleStartReading}
                disabled={chapters.length === 0 || loading}
                size="lg"
                className="px-12 py-8 text-xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-2xl"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                {language === 'hi' ? 'पढ़ना शुरू करें' : 'Begin Reading'}
                <ChevronRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'अध्याय' : 'Chapters'}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">
                {language === 'hi' ? 'अध्याय लोड हो रहे हैं...' : 'Loading chapters...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-gray-600 text-lg">{error}</p>
            </div>
          )}

          {/* Chapters Grid */}
          {!loading && !error && chapters.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/prabhu-ki-leelaayen/read/${chapter.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-orange-200 hover:border-orange-400 bg-gradient-to-br from-white to-orange-50/30">
                    {/* Chapter Image */}
                    {chapter.chapter_image && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={chapter.chapter_image}
                          alt={language === 'hi' ? chapter.title_hi : chapter.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-orange-500 text-white px-3 py-1">
                            {language === 'hi' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Chapter Content */}
                    <CardContent className="p-6">
                      <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {language === 'hi' ? chapter.title_hi : chapter.title}
                      </h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {language === 'hi' ? chapter.description_hi : chapter.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-orange-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {chapter.read_time} {language === 'hi' ? 'मिनट' : 'min'}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {chapter.views}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && chapters.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
              </h3>
              <p className="text-gray-500">
                {language === 'hi'
                  ? 'दिव्य कथाओं को जल्द ही जोड़ा जाएगा।'
                  : 'Divine stories will be added soon.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {language === 'hi' ? 'विशेषताएं' : 'Features'}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'पढ़ने का अनुभव जो आपको मंत्रमुग्ध कर देगा'
                : 'A reading experience that will captivate you'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {language === 'hi' ? 'पुस्तक जैसा अनुभव' : 'Book-like Experience'}
                </h4>
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'पेज फ्लिप एनीमेशन के साथ वास्तविक पुस्तक पढ़ने का अनुभव'
                    : 'Realistic book reading with page flip animations'}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {language === 'hi' ? 'बुकमार्क करें' : 'Bookmark & Save'}
                </h4>
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'अपनी पसंदीदा कविताओं और अंशों को सहेजें'
                    : 'Save your favorite verses and passages'}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {language === 'hi' ? 'द्विभाषी सामग्री' : 'Bilingual Content'}
                </h4>
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'हिंदी और अंग्रेजी दोनों में उपलब्ध'
                    : 'Available in both Hindi and English'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrabhuKiLeelaayen;
