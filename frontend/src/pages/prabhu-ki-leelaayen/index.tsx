// Leelaayen - Divine Scripture Library
// Shows books like Mahabharat, Ramayan with beautiful cards

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Eye, Sparkles, ChevronRight, Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface Book {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  cover_image?: string;
  author: string;
  author_hi: string;
  total_chapters: number;
  views: number;
}

const Leelaayen: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch published books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leelaayen_books')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setBooks(data || []);
      } catch (err: any) {
        console.error('Error fetching books:', err);
        setError('Unable to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      {/* Hero Section - Smaller, More Elegant */}
      <section className="relative py-16 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-red-100/30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Sacred Symbol */}
            <div className="flex justify-center items-center gap-4">
              <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
              <span className="text-5xl animate-pulse">🕉️</span>
              <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>

            {/* Smaller, Elegant Title */}
            <div className="space-y-3">
              <h1
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                लीलाएँ
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {language === 'hi'
                  ? 'दिव्य ग्रंथों का सुंदर संग्रह। महाभारत, रामायण और अन्य पवित्र कथाओं को पढ़ें।'
                  : 'Beautiful collection of divine scriptures. Read Mahabharat, Ramayan and other sacred stories.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Books Library Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {language === 'hi' ? 'पुस्तकालय' : 'Sacred Library'}
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">
                {language === 'hi' ? 'पुस्तकें लोड हो रही हैं...' : 'Loading books...'}
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

          {/* Books Grid */}
          {!loading && !error && books.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => navigate(`/prabhu-ki-leelaayen/book/${book.slug}`)}
                  className="group cursor-pointer"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-2 border-orange-200 hover:border-orange-400 bg-gradient-to-br from-white to-orange-50/30 overflow-hidden">
                    {/* Book Cover Image */}
                    {book.cover_image ? (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={book.cover_image}
                          alt={language === 'hi' ? book.title_hi : book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Book Title Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-3xl font-bold text-white mb-2 drop-shadow-lg" style={{ fontFamily: language === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
                            {language === 'hi' ? book.title_hi : book.title}
                          </h4>
                          <p className="text-orange-200 text-sm">
                            {language === 'hi' ? book.author_hi : book.author}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Default Book Design */
                      <div className="relative h-64 bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 flex items-center justify-center">
                        <div className="text-center text-white p-6">
                          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <h4 className="text-3xl font-bold mb-2" style={{ fontFamily: language === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
                            {language === 'hi' ? book.title_hi : book.title}
                          </h4>
                          <p className="text-orange-100">
                            {language === 'hi' ? book.author_hi : book.author}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Book Details */}
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {language === 'hi' ? book.description_hi : book.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {book.total_chapters} {language === 'hi' ? 'अध्याय' : 'Chapters'}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {book.views}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white group-hover:scale-110 transition-transform"
                        >
                          {language === 'hi' ? 'पढ़ें' : 'Read'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && books.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
              </h3>
              <p className="text-gray-500">
                {language === 'hi'
                  ? 'दिव्य ग्रंथों को जल्द ही जोड़ा जाएगा।'
                  : 'Divine scriptures will be added soon.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leelaayen;
