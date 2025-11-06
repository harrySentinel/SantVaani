// Book Detail Page - Shows chapters list for a book
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Clock, Eye, ChevronRight, Loader2, ArrowLeft
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

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  title_hi: string;
  slug: string;
  chapter_image?: string;
  read_time: number;
  views: number;
}

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        // Fetch book
        const { data: bookData, error: bookError } = await supabase
          .from('leelaayen_books')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (bookError) throw bookError;
        setBook(bookData);

        // Fetch chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('book_id', bookData.id)
          .eq('published', true)
          .order('chapter_number', { ascending: true });

        if (chaptersError) throw chaptersError;
        setChapters(chaptersData || []);

        // Increment book views
        await supabase.rpc('increment_book_views', { book_slug: slug });
      } catch (err) {
        console.error('Error:', err);
        navigate('/prabhu-ki-leelaayen');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />

      {/* Book Header */}
      <section className="relative py-16 overflow-hidden">
        {book.cover_image && (
          <div className="absolute inset-0 opacity-20">
            <img src={book.cover_image} alt="" className="w-full h-full object-cover blur-2xl" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/prabhu-ki-leelaayen')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'HI' ? 'वापस' : 'Back'}
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Book Cover */}
            <div className="w-full md:w-64 flex-shrink-0">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={language === 'HI' ? book.title_hi : book.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white opacity-80" />
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3" style={{ fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
                {language === 'HI' ? book.title_hi : book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {language === 'HI' ? book.author_hi : book.author}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {language === 'HI' ? book.description_hi : book.description}
              </p>

              <div className="flex items-center gap-4">
                <Badge className="bg-orange-500 text-white px-4 py-2 text-base">
                  {book.total_chapters} {language === 'HI' ? 'अध्याय' : 'Chapters'}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base">
                  <Eye className="w-4 h-4 mr-2" />
                  {book.views} {language === 'HI' ? 'बार देखा गया' : 'views'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {language === 'HI' ? 'अध्याय' : 'Chapters'}
          </h2>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <Card
                key={chapter.id}
                onClick={() => navigate(`/prabhu-ki-leelaayen/read/${chapter.slug}`)}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-orange-200 hover:border-orange-400"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-orange-500 text-white">
                          {language === 'HI' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-800">
                          {language === 'HI' ? chapter.title_hi : chapter.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {chapter.read_time} {language === 'HI' ? 'मिनट' : 'min'}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {chapter.views}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDetail;
