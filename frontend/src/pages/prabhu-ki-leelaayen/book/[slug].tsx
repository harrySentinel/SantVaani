// Book Detail Page - Shows chapters list for a book
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { BookOpen, ChevronLeft, ArrowRight, Check, ListOrdered, Languages, Share2, Loader2, Clock } from 'lucide-react';
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
  summary?: string | null;
  summary_hi?: string | null;
  read_time: number;
  views: number;
}

const PAGE = '#faf8f5';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';

const coverShadow = 'shadow-[0_24px_48px_-16px_rgba(36,26,18,0.45)]';

const BookCover = ({ title, author, small = false }: { title: string; author: string; small?: boolean }) => (
  <div
    className={`w-full aspect-[2/3] rounded-md bg-[#f1e7d8] border border-[#e4d6c1] flex flex-col justify-between text-center ${
      small ? 'px-2 py-3 shadow-md' : `px-5 py-8 ${coverShadow}`
    }`}
  >
    <span className={`font-tiro text-[#c2410c] ${small ? 'text-xs' : 'text-lg'}`}>ॐ</span>
    <div className={small ? 'space-y-1.5' : 'space-y-4'}>
      <div className={`h-px bg-[#241a12]/25 mx-auto ${small ? 'w-5' : 'w-10'}`} />
      <p className={`font-tiro leading-tight text-[#241a12] ${small ? 'text-sm' : 'text-[1.7rem]'}`}>{title}</p>
      <div className={`h-px bg-[#241a12]/25 mx-auto ${small ? 'w-5' : 'w-10'}`} />
    </div>
    <p className={`tracking-wide text-[#241a12]/60 ${small ? 'text-[9px]' : 'text-xs'}`}>{author}</p>
  </div>
);

const SAFFRON_TINT = '240, 150, 50';

// Average the cover's colours (weighted toward saturated pixels) so the header can pick them up.
const useCoverTint = (url?: string) => {
  const [tint, setTint] = useState<string | null>(null);
  useEffect(() => {
    setTint(null);
    if (!url) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const d = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, w = 0;
        for (let i = 0; i < d.length; i += 4) {
          const max = Math.max(d[i], d[i + 1], d[i + 2]);
          const min = Math.min(d[i], d[i + 1], d[i + 2]);
          if (max < 30 || min > 235) continue;
          const weight = max - min + 8;
          r += d[i] * weight; g += d[i + 1] * weight; b += d[i + 2] * weight; w += weight;
        }
        if (w) setTint(`${Math.round(r / w)}, ${Math.round(g / w)}, ${Math.round(b / w)}`);
      } catch {
        // Cover host doesn't allow CORS reads; fall back to the default tint.
      }
    };
    img.src = url;
  }, [url]);
  return tint;
};

interface MoreBook {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  cover_image?: string;
}

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
  const [moreBooks, setMoreBooks] = useState<MoreBook[]>([]);
  const contentsRef = useRef<HTMLElement>(null);
  const coverTint = useCoverTint(book?.cover_image);

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

        const { data: moreData } = await supabase
          .from('leelaayen_books')
          .select('id, title, title_hi, slug, cover_image')
          .eq('published', true)
          .neq('id', bookData.id)
          .order('views', { ascending: false })
          .limit(8);
        setMoreBooks(moreData || []);

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
  const totalMinutes = chapters.reduce((sum, ch) => sum + (ch.read_time || 0), 0);
  const bilingual = !!(book.title_hi && book.title);
  const tint = coverTint ?? SAFFRON_TINT;
  const details = [
    totalMinutes > 0 && { icon: Clock, label: HI ? `${totalMinutes} मिनट` : `${totalMinutes} min read` },
    { icon: BookOpen, label: chaptersLabel },
    bilingual && { icon: Languages, label: HI ? 'हिंदी और अंग्रेज़ी' : 'Hindi & English' },
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

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
      <header
        style={{ background: `linear-gradient(180deg, rgba(${tint}, 0.26) 0%, rgba(${tint}, 0.10) 55%, ${PAGE} 100%)` }}
      >
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

          <h1 className={`${book.cover_image ? 'mt-8' : 'sr-only'} text-center font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15] text-[#241a12]`}>
            {title}
          </h1>
        </div>

        <div className={`max-w-xl mx-auto px-5 text-center ${book.cover_image ? 'pt-3' : 'pt-7'}`}>
          <p className="text-[15px] text-[#7a6a5c]">
            {book.is_santvaani_original
              ? (HI ? 'संतवाणी ओरिजिनल' : 'A Santvaani original')
              : !isHouseAuthor && author
                ? (HI ? `${author} द्वारा` : `By ${author}`)
                : null}
          </p>

          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#241a12]/75">
            {details.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-[#c2410c]" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>

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
            {HI ? 'अध्याय' : 'Chapters'}
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
                        {(HI ? chapter.summary_hi || chapter.summary : chapter.summary) && (
                          <p className="mt-0.5 text-[15px] leading-snug text-[#241a12]/70 line-clamp-2">
                            {HI ? chapter.summary_hi || chapter.summary : chapter.summary}
                          </p>
                        )}
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

        {moreBooks.length > 0 && (
          <section className="mt-14" aria-labelledby="more-heading">
            <h2 id="more-heading" className="font-mukta tracking-normal text-2xl font-semibold">
              {HI ? 'और दिव्य कथाएं' : 'More divine stories'}
            </h2>
            <div className="mt-5 -mx-5 px-5 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {moreBooks.map(b => {
                const t = HI ? b.title_hi || b.title : b.title;
                return (
                  <Link
                    key={b.id}
                    to={`/prabhu-ki-leelaayen/book/${b.slug}`}
                    className={`w-28 flex-shrink-0 snap-start rounded-md ${focusRing}`}
                  >
                    {b.cover_image ? (
                      <img src={b.cover_image} alt="" className="w-full aspect-[2/3] object-cover rounded-md shadow-md" />
                    ) : (
                      <BookCover title={t} author="Santvaani" small />
                    )}
                    <p className="mt-2 text-sm font-medium leading-snug line-clamp-2">{t}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookDetail;
