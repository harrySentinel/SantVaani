// Book Detail Page - Shows chapters list for a book
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, ChevronRight, Loader2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useBookProgress } from '@/hooks/useReadingProgress';
import Breadcrumb from '@/components/Breadcrumb';

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
  is_santvaani_original?: boolean;
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

const devanagari = { fontFamily: "'Noto Sans Devanagari', sans-serif" };

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const HI = language === 'HI';

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const { progress, getChapterStatus, isChapterCompleted } = useBookProgress(book?.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);

        const { data: bookData, error: bookError } = await supabase
          .from('leelaayen_books')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (bookError) throw bookError;
        setBook(bookData);

        const { data: chaptersData, error: chaptersError } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('book_id', bookData.id)
          .eq('published', true)
          .order('chapter_number', { ascending: true });

        if (chaptersError) throw chaptersError;
        setChapters(chaptersData || []);

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
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  const title = HI ? book.title_hi || book.title : book.title;
  const author = HI ? book.author_hi || book.author : book.author;
  const showAuthor = !!author && !(book.is_santvaani_original && /santvaani|संतवाणी/i.test(author));
  const description = HI ? book.description_hi || book.description : book.description;
  const chapterCount = chapters.length || book.total_chapters;
  const titleFont = HI ? devanagari : undefined;

  const summary = user ? progress.summary : null;
  const started = !!summary && summary.chapters_read > 0;
  const finished = started && summary!.progress_percentage >= 100;
  const nextChapter = chapters.find(ch => !isChapterCompleted(ch.id)) ?? chapters[0];

  const primaryLabel = finished
    ? (HI ? 'फिर से पढ़ें' : 'Read again')
    : started
      ? (HI ? `पढ़ना जारी रखें · अध्याय ${nextChapter?.chapter_number}` : `Continue · Chapter ${nextChapter?.chapter_number}`)
      : (HI ? 'पढ़ना शुरू करें' : 'Start reading');
  const primaryTarget = finished ? chapters[0] : nextChapter;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <Breadcrumb
        items={[
          { label: HI ? 'दिव्य कथाएं' : 'Divine Stories', to: '/prabhu-ki-leelaayen' },
          { label: title },
        ]}
      />

      {/* ── Book header ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          {/* Cover */}
          <div className="w-40 sm:w-48 md:w-56 flex-shrink-0">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={title}
                className="w-full aspect-[2/3] object-cover rounded-md shadow-[0_18px_40px_-12px_rgba(36,26,18,0.35)]"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-md bg-[#f1e7d8] border border-[#e4d6c1] shadow-[0_18px_40px_-12px_rgba(36,26,18,0.35)] flex flex-col items-center justify-between text-center px-4 py-6">
                <span className="font-serif text-orange-500 text-lg">ॐ</span>
                <div className="space-y-3">
                  <div className="w-8 h-px bg-[#241a12]/30 mx-auto" />
                  <p className="font-serif text-xl md:text-2xl font-bold text-[#241a12] leading-tight" style={titleFont}>
                    {title}
                  </p>
                  <div className="w-8 h-px bg-[#241a12]/30 mx-auto" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#241a12]/60">{author}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 w-full text-center md:text-left">
            {book.is_santvaani_original && (
              <p className="text-[13px] font-medium text-orange-600 tracking-wide mb-2">
                {HI ? 'संतवाणी ओरिजिनल' : 'A Santvaani Original'}
              </p>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#241a12] leading-[1.1]" style={titleFont}>
              {title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {showAuthor && <span>{HI ? `${author} द्वारा` : `by ${author}`}</span>}
              {showAuthor && <span className="mx-2 text-gray-300">·</span>}
              <span>
                {chapterCount} {HI ? 'अध्याय' : chapterCount === 1 ? 'chapter' : 'chapters'}
              </span>
              <span className="mx-2 text-gray-300">·</span>
              <span>
                {book.views.toLocaleString()} {HI ? 'पाठक' : 'reads'}
              </span>
            </p>

            {description && (
              <p className="mt-5 text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                {description}
              </p>
            )}

            {/* Progress */}
            {started && (
              <div className="mt-6 max-w-sm mx-auto md:mx-0">
                <div className="h-1 rounded-full bg-[#241a12]/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-700"
                    style={{ width: `${Math.min(summary!.progress_percentage, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {finished
                    ? (HI ? 'आपने यह पुस्तक पूरी कर ली है' : 'You finished this book')
                    : HI
                      ? `${summary!.chapters_completed} / ${chapterCount} अध्याय पढ़े`
                      : `${summary!.chapters_completed} of ${chapterCount} chapters read`}
                </p>
              </div>
            )}

            {/* Actions */}
            {primaryTarget && (
              <div className="mt-7 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate(`/prabhu-ki-leelaayen/read/${primaryTarget.slug}`)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#241a12] hover:bg-[#3a2b1c] transition-colors px-8 py-3.5 rounded-full"
                >
                  <BookOpen className="w-4 h-4" />
                  {primaryLabel}
                </button>
                {!user && (
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 hover:text-[#241a12] transition-colors"
                  >
                    {HI ? 'अपनी प्रगति सहेजने के लिए लॉगिन करें' : 'Sign in to save your place'}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Chapters ── */}
      <section className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241a12]">
              {HI ? 'अध्याय' : 'Contents'}
            </h2>
            <span className="text-sm text-gray-400">
              {chapterCount} {HI ? 'अध्याय' : chapterCount === 1 ? 'chapter' : 'chapters'}
            </span>
          </div>

          {chapters.length > 0 ? (
            <ol className="border-t border-gray-200">
              {chapters.map(chapter => {
                const done = !!user && isChapterCompleted(chapter.id);
                const reading = !!user && !done && getChapterStatus(chapter.id) === 'reading';
                return (
                  <li key={chapter.id}>
                    <Link
                      to={`/prabhu-ki-leelaayen/read/${chapter.slug}`}
                      className="group flex items-center gap-4 md:gap-8 py-5 md:py-6 border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-2 hover:bg-orange-50/40 transition-colors"
                    >
                      <span className="font-serif text-xl md:text-2xl text-orange-300 group-hover:text-orange-500 transition-colors w-8 flex-shrink-0">
                        {String(chapter.chapter_number).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base md:text-lg font-semibold text-[#241a12] group-hover:text-orange-600 transition-colors line-clamp-2"
                          style={titleFont}
                        >
                          {HI ? chapter.title_hi || chapter.title : chapter.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400 flex items-center gap-2">
                          <span>{chapter.read_time} {HI ? 'मिनट' : 'min read'}</span>
                          {done && (
                            <span className="inline-flex items-center gap-1 text-green-700">
                              <Check className="w-3 h-3" strokeWidth={3} />
                              {HI ? 'पढ़ा गया' : 'Read'}
                            </span>
                          )}
                          {reading && (
                            <span className="inline-flex items-center gap-1 text-orange-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              {HI ? 'पढ़ रहे हैं' : 'In progress'}
                            </span>
                          )}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="py-12 text-center text-gray-500 border-t border-gray-200">
              {HI ? 'अध्याय जल्द ही जोड़े जाएंगे' : 'Chapters will be added soon'}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDetail;
