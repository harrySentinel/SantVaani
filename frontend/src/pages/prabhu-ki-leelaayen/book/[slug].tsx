// Book Detail Page - Shows chapters list for a book
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { BookOpen, ChevronLeft, ArrowRight, Check, ListOrdered, Languages, Share2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useBookProgress } from '@/hooks/useReadingProgress';
import { useToast } from '@/hooks/use-toast';
import { nativeShare, copyToClipboard } from '@/utils/shareUtils';

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

const PAGE = '#faf8f5';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';

const coverShadow = 'shadow-[0_24px_48px_-16px_rgba(36,26,18,0.45)]';

const BookCover = ({ title, author }: { title: string; author: string; }) => (
  <div className={`w-full aspect-[2/3] rounded-md bg-[#f1e7d8] border border-[#e4d6c1] ${coverShadow} flex flex-col justify-between text-center px-5 py-8`}>
    <span className="font-tiro text-lg text-[#c2410c]">ॐ</span>
    <div className="space-y-4">
      <div className="w-10 h-px bg-[#241a12]/25 mx-auto" />
      <p className="font-tiro text-[1.7rem] leading-tight text-[#241a12]">{title}</p>
      <div className="w-10 h-px bg-[#241a12]/25 mx-auto" />
    </div>
    <p className="text-xs tracking-wide text-[#241a12]/60">{author}</p>
  </div>
);

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const HI = language === 'HI';

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const contentsRef = useRef<HTMLElement>(null);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: PAGE }}>
        <Loader2 className="w-8 h-8 text-[#ea580c] animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  const title = HI ? book.title_hi || book.title : book.title;
  const author = HI ? book.author_hi || book.author : book.author;
  const description = HI ? book.description_hi || book.description : book.description;
  const chapterCount = chapters.length || book.total_chapters;
  const isHouseAuthor = /santvaani|संतवाणी/i.test(author || '');

  const summary = user ? progress.summary : null;
  const started = !!summary && summary.chapters_read > 0;
  const finished = started && summary!.progress_percentage >= 100;
  const nextChapter = chapters.find(ch => !isChapterCompleted(ch.id)) ?? chapters[0];
  const primaryTarget = finished ? chapters[0] : nextChapter;
  const primaryLabel = finished
    ? (HI ? 'फिर से पढ़ें' : 'Read again')
    : started
      ? (HI ? `अध्याय ${nextChapter?.chapter_number} से जारी रखें` : `Continue with chapter ${nextChapter?.chapter_number}`)
      : (HI ? 'पढ़ना शुरू करें' : 'Start reading');

  const handleShare = async () => {
    const url = window.location.href;
    const shared = await nativeShare({ title, description: description || title, url });
    if (shared) return;
    if (await copyToClipboard(url)) {
      toast({ title: HI ? 'लिंक कॉपी हो गया' : 'Link copied' });
    }
  };

  const chaptersLabel = HI
    ? `${chapterCount} अध्याय`
    : `${chapterCount} ${chapterCount === 1 ? 'chapter' : 'chapters'}`;

  return (
    <div className="min-h-screen font-mukta text-[#241a12]" style={{ background: PAGE }}>
      <SEO
        title={`${book.title} — Divine Stories | Santvaani`}
        description={book.description || `Read ${book.title} on Santvaani.`}
        canonical={`https://santvaani.com/prabhu-ki-leelaayen/book/${book.slug}`}
        ogImage={book.cover_image || undefined}
        ogType="article"
      />
      <Navbar />

      {/* ── Hero ── */}
      <header>
        <div className="max-w-xl mx-auto px-5 pt-5">
          <Link
            to="/prabhu-ki-leelaayen"
            className={`inline-flex items-center gap-1 -ml-1 rounded-full px-1 py-1 text-sm text-[#7a6a5c] hover:text-[#241a12] transition-colors ${focusRing}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {HI ? 'दिव्य कथाएं' : 'Divine Stories'}
          </Link>

          <motion.div
            className="mt-6 mx-auto w-48 sm:w-56"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={title}
                className={`w-full h-auto rounded-md ${coverShadow}`}
              />
            ) : (
              <BookCover title={title} author={book.is_santvaani_original || isHouseAuthor ? 'Santvaani' : author} />
            )}
          </motion.div>

          <h1 className="mt-8 text-center font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15] text-[#241a12]">
            {title}
          </h1>
        </div>

        <div className="max-w-xl mx-auto px-5 pt-3 text-center">
          <p className="text-[15px] text-[#7a6a5c]">
            {book.is_santvaani_original
              ? (HI ? 'संतवाणी ओरिजिनल' : 'A Santvaani original')
              : !isHouseAuthor && author
                ? (HI ? `${author} द्वारा` : `By ${author}`)
                : null}
          </p>

          {primaryTarget && (
            <button
              onClick={() => navigate(`/prabhu-ki-leelaayen/read/${primaryTarget.slug}`)}
              className={`mt-6 w-full h-14 rounded-full bg-[#ea580c] hover:bg-[#d24e0a] active:scale-[0.99] transition text-white text-lg font-semibold inline-flex items-center justify-center gap-2.5 ${focusRing}`}
            >
              <BookOpen className="w-5 h-5" />
              {primaryLabel}
            </button>
          )}

          {started && (
            <div className="mt-4 flex items-center gap-3 text-sm text-[#7a6a5c]">
              <span className="flex-1 h-1.5 rounded-full bg-[#241a12]/10 overflow-hidden">
                <span
                  className="block h-full rounded-full bg-[#ea580c]"
                  style={{ width: `${Math.min(summary!.progress_percentage, 100)}%` }}
                />
              </span>
              <span className="tabular-nums">{Math.round(summary!.progress_percentage)}%</span>
            </div>
          )}

          {!user && (
            <p className="mt-3 text-sm text-[#7a6a5c]">
              <Link to="/login" className={`underline underline-offset-4 decoration-[#7a6a5c]/50 hover:text-[#241a12] rounded ${focusRing}`}>
                {HI ? 'लॉगिन करें' : 'Sign in'}
              </Link>{' '}
              {HI ? 'ताकि आपकी प्रगति सहेजी रहे' : 'to keep your place between visits'}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 pb-20">
        {/* Description */}
        {description && (
          <div className="mt-8">
            <p className={`text-[17px] leading-relaxed text-[#241a12]/85 ${expanded ? '' : 'line-clamp-3'}`}>
              {description}
            </p>
            {description.length > 150 && (
              <button
                onClick={() => setExpanded(e => !e)}
                className={`mt-1 text-sm font-semibold text-[#c2410c] rounded ${focusRing}`}
              >
                {expanded ? (HI ? 'कम दिखाएं' : 'Show less') : (HI ? 'और पढ़ें' : 'Read more')}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 grid grid-cols-3 gap-2">
          {[
            { icon: ListOrdered, label: HI ? 'अध्याय सूची' : 'Contents', onClick: () => contentsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }) },
            { icon: Languages, label: HI ? 'English में' : 'हिंदी में', onClick: toggleLanguage },
            { icon: Share2, label: HI ? 'साझा करें' : 'Share', onClick: handleShare },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex flex-col items-center gap-2 rounded-2xl py-3 text-[#241a12]/85 hover:bg-[#241a12]/5 transition-colors ${focusRing}`}
            >
              <Icon className="w-6 h-6" strokeWidth={1.75} />
              <span className="text-[15px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Chapters */}
        <section ref={contentsRef} className="mt-10 scroll-mt-24" aria-labelledby="contents-heading">
          <h2 id="contents-heading" className="font-mukta tracking-normal text-2xl font-semibold pb-4 border-b border-[#241a12]/10">
            {chaptersLabel}
          </h2>

          {chapters.length > 0 ? (
            <ol>
              {chapters.map(chapter => {
                const done = !!user && isChapterCompleted(chapter.id);
                const reading = !!user && !done && getChapterStatus(chapter.id) === 'reading';
                return (
                  <li key={chapter.id} className="border-b border-[#241a12]/10">
                    <Link
                      to={`/prabhu-ki-leelaayen/read/${chapter.slug}`}
                      className={`group flex items-center gap-4 py-5 -mx-2 px-2 rounded-xl hover:bg-[#ea580c]/[0.05] transition-colors ${focusRing}`}
                    >
                      <span className="w-6 flex-shrink-0 text-lg text-[#7a6a5c] tabular-nums">{chapter.chapter_number}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mukta tracking-normal text-lg font-semibold leading-snug text-[#241a12] line-clamp-2">
                          {HI ? chapter.title_hi || chapter.title : chapter.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-3 text-[15px] text-[#7a6a5c]">
                          <span>{chapter.read_time} {HI ? 'मिनट' : 'min'}</span>
                          {done && (
                            <span className="inline-flex items-center gap-1 text-green-700">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                              {HI ? 'पढ़ा गया' : 'Read'}
                            </span>
                          )}
                          {reading && (
                            <span className="inline-flex items-center gap-1.5 text-[#c2410c]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                              {HI ? 'पढ़ रहे हैं' : 'In progress'}
                            </span>
                          )}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                          done ? 'border border-[#241a12]/20 text-[#241a12]' : 'bg-[#241a12] text-white'
                        }`}
                        aria-hidden="true"
                      >
                        {done ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="py-10 text-center text-[#7a6a5c]">
              {HI ? 'अध्याय जल्द ही जोड़े जाएंगे' : 'Chapters are on their way'}
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetail;
