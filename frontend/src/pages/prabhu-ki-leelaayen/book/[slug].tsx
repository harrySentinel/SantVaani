// Book Detail Page - Shows chapters list for a book
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Clock, Eye, ChevronRight, Loader2, ArrowLeft, Sparkles, BookMarked, CheckCircle, Circle, PlayCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useBookProgress } from '@/hooks/useReadingProgress';

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
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Reading progress tracking
  const { progress, getChapterStatus, isChapterCompleted } = useBookProgress(book?.id);

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

              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="bg-orange-500 text-white px-4 py-2 text-base">
                  {book.total_chapters} {language === 'HI' ? 'अध्याय' : 'Chapters'}
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-base">
                  <Eye className="w-4 h-4 mr-2" />
                  {book.views} {language === 'HI' ? 'बार देखा गया' : 'views'}
                </Badge>

                {/* Reading Progress Badge (only for logged-in users) */}
                {user && progress.summary && progress.summary.chapters_read > 0 && (
                  <Badge className="bg-green-500 text-white px-4 py-2 text-base">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {progress.summary.progress_percentage}% {language === 'HI' ? 'पूर्ण' : 'Complete'}
                  </Badge>
                )}
              </div>

              {/* Progress Bar (only for logged-in users with progress) */}
              {user && progress.summary && progress.summary.chapters_read > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {progress.summary.chapters_completed} / {book.total_chapters} {language === 'HI' ? 'अध्याय पूर्ण' : 'chapters completed'}
                    </span>
                    <span>{progress.summary.progress_percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                      style={{ width: `${progress.summary.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Continue Reading Button */}
              {user && progress.summary && progress.summary.chapters_read > 0 && progress.summary.progress_percentage < 100 && (
                <Button
                  onClick={() => {
                    // Find first incomplete chapter
                    const nextChapter = chapters.find(ch => !isChapterCompleted(ch.id))
                    if (nextChapter) {
                      navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`)
                    }
                  }}
                  className="mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  size="lg"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {language === 'HI' ? 'पढ़ना जारी रखें' : 'Continue Reading'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="py-16 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
              <BookMarked className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">
                {language === 'HI' ? 'कहानी की यात्रा' : 'Story Journey'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {language === 'HI' ? 'अध्याय' : 'Chapters'}
            </h2>
            <p className="text-gray-600">
              {language === 'HI'
                ? `${chapters.length} अध्यायों में विभाजित यह अद्भुत यात्रा`
                : `Embark on this beautiful journey of ${chapters.length} chapters`}
            </p>
          </div>

          {/* Chapters Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {chapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                onClick={() => navigate(`/prabhu-ki-leelaayen/read/${chapter.slug}`)}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative"
              >
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-50"></div>

                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Chapter Number - Large Decorative */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">
                          {chapter.chapter_number}
                        </span>
                      </div>
                    </div>

                    {/* Chapter Content */}
                    <div className="flex-1 min-w-0">
                      {/* Chapter Badge & Status */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                          {language === 'HI' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
                        </Badge>

                        {/* Status Indicator (only for logged-in users) */}
                        {user && (
                          <>
                            {isChapterCompleted(chapter.id) && (
                              <Badge className="bg-green-500 text-white border-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {language === 'HI' ? 'पूर्ण' : 'Completed'}
                              </Badge>
                            )}
                            {getChapterStatus(chapter.id) === 'reading' && (
                              <Badge className="bg-blue-500 text-white border-0">
                                <Circle className="w-3 h-3 mr-1 fill-current" />
                                {language === 'HI' ? 'पढ़ रहे हैं' : 'Reading'}
                              </Badge>
                            )}
                          </>
                        )}

                        <Sparkles className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Chapter Title */}
                      <h3
                        className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2"
                        style={{ fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}
                      >
                        {language === 'HI' ? chapter.title_hi : chapter.title}
                      </h3>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">
                            {chapter.read_time} {language === 'HI' ? 'मिनट' : 'min read'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{chapter.views}</span>
                        </div>
                      </div>

                      {/* Progress Bar (decorative) */}
                      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <ChevronRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {chapters.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {language === 'HI' ? 'अभी कोई अध्याय नहीं' : 'No chapters yet'}
              </h3>
              <p className="text-gray-500">
                {language === 'HI' ? 'जल्द ही अध्याय जोड़े जाएंगे' : 'Chapters will be added soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDetail;
