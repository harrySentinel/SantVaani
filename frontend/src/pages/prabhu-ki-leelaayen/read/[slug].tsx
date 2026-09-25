// Chapter reader: full-page scroll, reading themes, saved position and progress tracking.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Check, Minus, Plus, X, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { markChapterReading, markChapterCompleted } from '@/lib/readingProgress';
import { useChapterProgress } from '@/hooks/useReadingProgress';

interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  title_hi: string;
  slug: string;
  content: string;
  content_hi: string;
  chapter_image?: string;
  summary?: string | null;
  summary_hi?: string | null;
  read_time: number;
}

interface BookInfo {
  title: string;
  title_hi: string;
  slug: string;
}

type ThemeName = 'paper' | 'sepia' | 'night';
type FontName = 'serif' | 'sans';

const THEMES: Record<ThemeName, { bg: string; text: string; muted: string; accent: string; rule: string; chrome: string; card: string; label: [string, string] }> = {
  paper: { bg: '#fbf8f3', text: '#2a211a', muted: '#7a6a5c', accent: '#c2410c', rule: 'rgba(42,33,26,0.12)', chrome: 'rgba(251,248,243,0.94)', card: '#ffffff', label: ['Paper', 'सादा'] },
  sepia: { bg: '#f3e9d6', text: '#43321f', muted: '#7d6a52', accent: '#a8431a', rule: 'rgba(67,50,31,0.16)', chrome: 'rgba(243,233,214,0.94)', card: '#f9f2e4', label: ['Sepia', 'सीपिया'] },
  night: { bg: '#1b1814', text: '#e6ddcf', muted: '#a39684', accent: '#f0a35e', rule: 'rgba(230,221,207,0.14)', chrome: 'rgba(27,24,20,0.94)', card: '#25211c', label: ['Night', 'रात'] },
};

const FONTS: Record<FontName, string> = {
  serif: '"Tiro Devanagari Hindi", Georgia, serif',
  sans: 'Mukta, system-ui, sans-serif',
};

const SIZES = [16, 17, 18, 19, 20, 22, 24, 26];
const PREFS_KEY = 'santvaani-reader-prefs';

interface Prefs { theme: ThemeName; font: FontName; size: number }
const DEFAULT_PREFS: Prefs = { theme: 'paper', font: 'serif', size: 19 };

const loadPrefs = (): Prefs => {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return {
      theme: saved.theme in THEMES ? saved.theme : DEFAULT_PREFS.theme,
      font: saved.font in FONTS ? saved.font : DEFAULT_PREFS.font,
      size: SIZES.includes(saved.size) ? saved.size : DEFAULT_PREFS.size,
    };
  } catch {
    return DEFAULT_PREFS;
  }
};

// Titles are often stored as "Chapter 1: Early Life"; the reader shows the number separately.
const stripChapterPrefix = (t: string) => t.replace(/^\s*(chapter|ch\.?|अध्याय)\s*[\d०-९]+\s*[:\-–—.]\s*/i, '') || t;

const scrollPercent = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 100;
};

const BookReader: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const HI = language === 'HI';

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [book, setBook] = useState<BookInfo | null>(null);
  const [totalChapters, setTotalChapters] = useState(0);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const [resumedAt, setResumedAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const { progress: chapterProgress, refreshProgress } = useChapterProgress(chapter?.id);

  const lastScrollY = useRef(0);
  const percentRef = useRef(0);
  const dirtyRef = useRef(false);
  const restoredRef = useRef(false);
  const completedRef = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const theme = THEMES[prefs.theme];

  // ── Data ──
  useEffect(() => {
    const fetchChapter = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        restoredRef.current = false;
        completedRef.current = false;
        setCompleted(false);
        setResumedAt(null);

        const { data, error } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
        if (error) throw error;
        setChapter(data);

        const [bookRes, nextRes, prevRes, countRes] = await Promise.all([
          supabase.from('leelaayen_books').select('title, title_hi, slug').eq('id', data.book_id).single(),
          supabase.from('leelaayen_chapters').select('*').eq('book_id', data.book_id).eq('published', true)
            .gt('chapter_number', data.chapter_number).order('chapter_number', { ascending: true }).limit(1).maybeSingle(),
          supabase.from('leelaayen_chapters').select('*').eq('book_id', data.book_id).eq('published', true)
            .lt('chapter_number', data.chapter_number).order('chapter_number', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('leelaayen_chapters').select('id', { count: 'exact', head: true }).eq('book_id', data.book_id).eq('published', true),
        ]);
        setBook(bookRes.data);
        setNextChapter(nextRes.data);
        setPrevChapter(prevRes.data);
        setTotalChapters(countRes.count || 0);

        window.scrollTo(0, 0);
        await supabase.rpc('increment_chapter_views', { chapter_slug: slug });
      } catch (err) {
        console.error('Error:', err);
        navigate('/prabhu-ki-leelaayen');
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [slug, navigate]);

  // ── Preferences ──
  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* storage unavailable */ }
  }, [prefs]);

  // Match the page behind the reader (overscroll, safe areas) to the theme.
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = theme.bg;
    return () => { document.body.style.backgroundColor = prev; };
  }, [theme.bg]);

  // ── Progress saving ──
  const saveProgress = useCallback(() => {
    if (!user || !chapter || !dirtyRef.current) return;
    dirtyRef.current = false;
    markChapterReading(user.id, chapter.id, chapter.book_id, Math.round(window.scrollY), percentRef.current);
  }, [user, chapter]);

  const completeChapter = useCallback(async () => {
    if (!user || !chapter || completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    await markChapterCompleted(user.id, chapter.id, chapter.book_id);
    refreshProgress();
  }, [user, chapter, refreshProgress]);

  useEffect(() => {
    if (!user || !chapter) return;
    markChapterReading(user.id, chapter.id, chapter.book_id, 0, 0);
  }, [user, chapter]);

  useEffect(() => {
    if (chapterProgress?.status === 'completed') {
      completedRef.current = true;
      setCompleted(true);
    }
  }, [chapterProgress?.status]);

  // Restore the reader's place once, after the chapter has rendered.
  useEffect(() => {
    if (restoredRef.current || loading || !chapter || !chapterProgress) return;
    restoredRef.current = true;
    const saved = chapterProgress.reading_percentage || 0;
    if (saved > 3 && saved < 95) {
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: (saved / 100) * max });
        setResumedAt(saved);
      });
    }
  }, [loading, chapter, chapterProgress]);

  useEffect(() => {
    if (resumedAt === null) return;
    const t = setTimeout(() => setResumedAt(null), 5000);
    return () => clearTimeout(t);
  }, [resumedAt]);

  useEffect(() => {
    if (!chapter) return;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      const y = window.scrollY;
      const p = scrollPercent();
      percentRef.current = p;
      setPercent(p);

      const goingDown = y > lastScrollY.current + 4;
      const goingUp = y < lastScrollY.current - 4;
      if (y < 80 || p >= 99) setChromeVisible(true);
      else if (goingDown) setChromeVisible(false);
      else if (goingUp) setChromeVisible(true);
      lastScrollY.current = y;

      if (p >= 95) completeChapter();
      dirtyRef.current = true;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveProgress, 1500);
    };

    const onHide = () => { if (document.visibilityState === 'hidden') saveProgress(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', saveProgress);
    return () => {
      clearTimeout(saveTimer);
      saveProgress();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', saveProgress);
    };
  }, [chapter, saveProgress, completeChapter]);

  // ── Navigation ──
  const goTo = useCallback((c: Chapter | null) => {
    if (c) navigate(`/prabhu-ki-leelaayen/read/${c.slug}`);
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') { setSettingsOpen(false); return; }
      if (settingsOpen) return;
      if (e.key === 'ArrowLeft') goTo(prevChapter);
      else if (e.key === 'ArrowRight') goTo(nextChapter);
      else if (e.key === '+' || e.key === '=') changeSize(1);
      else if (e.key === '-') changeSize(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || settingsOpen) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 2) return;
    goTo(dx < 0 ? nextChapter : prevChapter);
  };

  const changeSize = (step: number) => {
    setPrefs(p => {
      const i = SIZES.indexOf(p.size);
      return { ...p, size: SIZES[Math.min(SIZES.length - 1, Math.max(0, i + step))] };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  if (!chapter) return null;

  const hasHindi = !!chapter.content_hi?.trim();
  const showingFallback = HI && !hasHindi;
  const content = HI && hasHindi ? chapter.content_hi : chapter.content;
  const title = stripChapterPrefix(HI ? chapter.title_hi || chapter.title : chapter.title);
  const bookTitle = book ? (HI ? book.title_hi || book.title : book.title) : '';
  const bookUrl = book ? `/prabhu-ki-leelaayen/book/${book.slug}` : '/prabhu-ki-leelaayen';
  const chapterNum = HI ? chapter.chapter_number.toLocaleString('hi-IN-u-nu-deva') : String(chapter.chapter_number);
  const totalNum = HI ? totalChapters.toLocaleString('hi-IN-u-nu-deva') : String(totalChapters);
  const minutesLeft = Math.max(1, Math.ceil((chapter.read_time || 1) * (100 - percent) / 100));
  const lineHeight = (prefs.font === 'serif' ? 1.8 : 1.75) + (HI && !showingFallback ? 0.12 : 0);
  const nextSummary = nextChapter ? (HI ? nextChapter.summary_hi || nextChapter.summary : nextChapter.summary) : null;

  const vars = {
    '--r-bg': theme.bg,
    '--r-text': theme.text,
    '--r-muted': theme.muted,
    '--r-accent': theme.accent,
    '--r-rule': theme.rule,
    '--r-card': theme.card,
    '--r-font': FONTS[prefs.font],
    '--r-size': `${prefs.size}px`,
    '--r-lh': lineHeight,
    background: theme.bg,
    color: theme.text,
  } as React.CSSProperties;

  const iconBtn = 'w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--r-rule)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)]';
  const segBtn = (active: boolean) =>
    `flex-1 h-11 rounded-xl text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)] ${
      active ? 'bg-[var(--r-text)] text-[var(--r-bg)]' : 'bg-[var(--r-rule)] hover:opacity-80'
    }`;

  return (
    <div className="min-h-screen font-mukta" style={vars} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <SEO
        title={`${chapter.title}${book ? ` — ${book.title}` : ''} | Santvaani`}
        description={chapter.summary || `Read ${chapter.title} on Santvaani.`}
        canonical={`https://santvaani.com/prabhu-ki-leelaayen/read/${chapter.slug}`}
        ogType="article"
      />

      {/* ── Top bar ── */}
      <header
        className={`fixed inset-x-0 top-0 z-40 backdrop-blur transition-transform duration-300 ${chromeVisible || settingsOpen ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ background: theme.chrome, borderBottom: `1px solid ${theme.rule}` }}
      >
        <div className="max-w-3xl mx-auto h-14 px-2 flex items-center gap-1">
          <Link to={bookUrl} className={iconBtn} aria-label={HI ? 'पुस्तक पर वापस' : 'Back to book'}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0 text-center">
            <p className="truncate text-[15px] font-semibold leading-tight">{bookTitle}</p>
            <p className="truncate text-xs" style={{ color: theme.muted }}>
              {HI ? `अध्याय ${chapterNum}` : `Chapter ${chapterNum}`}
              {percent > 0 && percent < 100 && (HI ? `, ${minutesLeft} मिनट बाकी` : `, ${minutesLeft} min left`)}
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className={`${iconBtn} font-tiro text-lg`}
            aria-label={HI ? 'पढ़ने की सेटिंग्स' : 'Reading settings'}
            aria-expanded={settingsOpen}
          >
            Aa
          </button>
        </div>
        <div className="h-0.5" style={{ background: theme.rule }}>
          <div className="h-full transition-[width] duration-150" style={{ width: `${percent}%`, background: theme.accent }} />
        </div>
      </header>

      {/* ── Settings ── */}
      {settingsOpen && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/20 md:bg-transparent cursor-default"
            aria-label={HI ? 'बंद करें' : 'Close'}
            onClick={() => setSettingsOpen(false)}
          />
          <div
            role="dialog"
            aria-label={HI ? 'पढ़ने की सेटिंग्स' : 'Reading settings'}
            className="fixed z-50 inset-x-0 bottom-0 rounded-t-3xl p-5 pb-8 md:inset-x-auto md:bottom-auto md:top-16 md:right-[max(1rem,calc(50vw-24rem+0.5rem))] md:w-80 md:rounded-2xl md:pb-5 shadow-2xl animate-in slide-in-from-bottom-4 md:slide-in-from-top-2 fade-in duration-200"
            style={{ background: theme.card, border: `1px solid ${theme.rule}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold">{HI ? 'पढ़ने की सेटिंग्स' : 'Reading settings'}</p>
              <button onClick={() => setSettingsOpen(false)} className={iconBtn} aria-label={HI ? 'बंद करें' : 'Close'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeName[]).map(name => {
                const t = THEMES[name];
                const active = prefs.theme === name;
                return (
                  <button
                    key={name}
                    onClick={() => setPrefs(p => ({ ...p, theme: name }))}
                    className="h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)]"
                    style={{ background: t.bg, color: t.text, border: `2px solid ${active ? theme.accent : t.rule}` }}
                    aria-pressed={active}
                  >
                    <span className="font-tiro text-lg leading-none">{HI ? 'अ' : 'Aa'}</span>
                    <span className="text-xs">{t.label[HI ? 1 : 0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => changeSize(-1)} disabled={prefs.size === SIZES[0]} className={`${iconBtn} bg-[var(--r-rule)] disabled:opacity-40`} aria-label={HI ? 'अक्षर छोटे करें' : 'Smaller text'}>
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-end justify-center gap-1.5" aria-hidden="true">
                {SIZES.map(s => (
                  <span key={s} className="w-1.5 rounded-full" style={{ height: 6 + (s - 14) * 1.3, background: s <= prefs.size ? theme.accent : theme.rule }} />
                ))}
              </div>
              <button onClick={() => changeSize(1)} disabled={prefs.size === SIZES[SIZES.length - 1]} className={`${iconBtn} bg-[var(--r-rule)] disabled:opacity-40`} aria-label={HI ? 'अक्षर बड़े करें' : 'Larger text'}>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => setPrefs(p => ({ ...p, font: 'serif' }))} className={`${segBtn(prefs.font === 'serif')} font-tiro`} aria-pressed={prefs.font === 'serif'}>
                {HI ? 'पुस्तक' : 'Book'}
              </button>
              <button onClick={() => setPrefs(p => ({ ...p, font: 'sans' }))} className={`${segBtn(prefs.font === 'sans')} font-mukta`} aria-pressed={prefs.font === 'sans'}>
                {HI ? 'सरल' : 'Clean'}
              </button>
            </div>

            <div className="mt-2 flex gap-2">
              <button onClick={() => setLanguage('HI')} className={segBtn(HI)} aria-pressed={HI}>हिंदी</button>
              <button onClick={() => setLanguage('EN')} className={segBtn(!HI)} aria-pressed={!HI}>English</button>
            </div>
          </div>
        </>
      )}

      {/* ── Chapter ── */}
      <main className="px-5 pt-28 pb-24 md:pt-36">
        <article className="mx-auto max-w-[36rem]">
          <header className="text-center mb-12 md:mb-16">
            <p className="text-[15px]" style={{ color: theme.accent }}>
              {HI ? `अध्याय ${chapterNum}` : `Chapter ${chapterNum}`}
              {totalChapters > 1 && <span style={{ color: theme.muted }}>{HI ? ` / ${totalNum}` : ` of ${totalNum}`}</span>}
            </p>
            <h1 className="mt-4 font-tiro font-normal tracking-normal text-[2.1rem] sm:text-[2.6rem] leading-[1.2]">
              {title}
            </h1>
            <p className="mt-4 text-sm" style={{ color: theme.muted }}>
              {chapter.read_time} {HI ? 'मिनट का पाठ' : 'min read'}
            </p>
            {showingFallback && (
              <p className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm" style={{ background: theme.rule }}>
                हिंदी अनुवाद जल्द आ रहा है, तब तक अंग्रेज़ी में पढ़ें
              </p>
            )}
          </header>

          {chapter.chapter_image && (
            <img src={chapter.chapter_image} alt="" className="w-full rounded-xl mb-12" />
          )}

          <div
            className={`reader-prose ${!HI || showingFallback ? 'drop-cap' : ''}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* ── End of chapter ── */}
          <div className="mt-16 text-center font-tiro text-2xl" style={{ color: theme.accent }} aria-hidden="true">॥</div>

          <section className="mt-10 space-y-4">
            {user && completed && (
              <p className="text-center text-sm inline-flex w-full items-center justify-center gap-1.5" style={{ color: theme.muted }}>
                <Check className="w-4 h-4" style={{ color: theme.accent }} strokeWidth={3} />
                {HI ? 'अध्याय पूरा हुआ' : 'Chapter finished'}
              </p>
            )}

            {nextChapter ? (
              <Link
                to={`/prabhu-ki-leelaayen/read/${nextChapter.slug}`}
                className="group block rounded-2xl p-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)]"
                style={{ background: theme.card, border: `1px solid ${theme.rule}` }}
              >
                <p className="text-sm" style={{ color: theme.accent }}>{HI ? 'अगला अध्याय' : 'Next chapter'}</p>
                <div className="mt-1 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-tiro text-xl leading-snug">{stripChapterPrefix(HI ? nextChapter.title_hi || nextChapter.title : nextChapter.title)}</p>
                    {nextSummary && <p className="mt-1 text-[15px] line-clamp-2" style={{ color: theme.muted }}>{nextSummary}</p>}
                    <p className="mt-2 text-sm" style={{ color: theme.muted }}>{nextChapter.read_time} {HI ? 'मिनट' : 'min'}</p>
                  </div>
                  <span className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5" style={{ background: theme.text, color: theme.bg }}>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl p-6 text-center" style={{ background: theme.card, border: `1px solid ${theme.rule}` }}>
                <p className="font-tiro text-xl">{HI ? `आपने "${bookTitle}" पूरी पढ़ ली` : `You've reached the end of ${bookTitle}`}</p>
                <Link
                  to={bookUrl}
                  className="mt-4 inline-flex items-center gap-2 h-11 px-6 rounded-full text-[15px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)]"
                  style={{ background: theme.text, color: theme.bg }}
                >
                  {HI ? 'पुस्तक पर वापस जाएं' : 'Back to the book'}
                </Link>
              </div>
            )}

            {prevChapter && (
              <Link
                to={`/prabhu-ki-leelaayen/read/${prevChapter.slug}`}
                className="flex items-center gap-1 text-[15px] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--r-accent)]"
                style={{ color: theme.muted }}
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {HI ? 'पिछला: ' : 'Previous: '}
                  {HI ? prevChapter.title_hi || prevChapter.title : prevChapter.title}
                </span>
              </Link>
            )}

            {!user && (
              <p className="pt-2 text-center text-sm" style={{ color: theme.muted }}>
                <Link to="/login" className="underline underline-offset-4" style={{ color: theme.text }}>
                  {HI ? 'लॉगिन करें' : 'Sign in'}
                </Link>{' '}
                {HI ? 'ताकि आपकी जगह और प्रगति सहेजी रहे' : 'to save your place and progress'}
              </p>
            )}
          </section>
        </article>
      </main>

      {/* Desktop chapter arrows */}
      {prevChapter && (
        <button onClick={() => goTo(prevChapter)} className={`hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 ${iconBtn} w-12 h-12`} style={{ border: `1px solid ${theme.rule}` }} aria-label={HI ? 'पिछला अध्याय' : 'Previous chapter'}>
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {nextChapter && (
        <button onClick={() => goTo(nextChapter)} className={`hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 ${iconBtn} w-12 h-12`} style={{ border: `1px solid ${theme.rule}` }} aria-label={HI ? 'अगला अध्याय' : 'Next chapter'}>
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Resume notice */}
      {resumedAt !== null && (
        <div className="fixed z-30 bottom-6 inset-x-0 flex justify-center px-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 rounded-full pl-5 pr-2 py-2 shadow-lg text-sm" style={{ background: theme.text, color: theme.bg }}>
            {HI ? `आप वहीं से पढ़ रहे हैं जहां छोड़ा था (${resumedAt}%)` : `Picked up where you left off (${resumedAt}%)`}
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setResumedAt(null); }}
              className="rounded-full px-3 py-1.5 font-semibold"
              style={{ background: theme.bg, color: theme.text }}
            >
              {HI ? 'शुरू से' : 'Start over'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .reader-prose {
          font-family: var(--r-font);
          font-size: var(--r-size);
          line-height: var(--r-lh);
          color: var(--r-text);
          overflow-wrap: break-word;
        }
        .reader-prose > h1:first-child { display: none; }
        .reader-prose h1, .reader-prose h2 {
          font-family: "Tiro Devanagari Hindi", Georgia, serif;
          font-weight: 400;
          letter-spacing: normal;
          font-size: 1.45em;
          line-height: 1.3;
          margin: 2.2em 0 0.75em;
          color: var(--r-text);
          text-align: center;
        }
        .reader-prose h3 {
          font-family: var(--r-font);
          font-weight: 600;
          letter-spacing: normal;
          font-size: 1.1em;
          line-height: 1.4;
          margin: 2em 0 0.6em;
          color: var(--r-text);
        }
        .reader-prose p { margin: 0 0 1.15em; }
        .reader-prose p:has(> em:only-child),
        .reader-prose blockquote {
          margin: 1.8em 0;
          padding: 0.15em 0 0.15em 1.1em;
          border-left: 2px solid var(--r-accent);
          font-family: "Tiro Devanagari Hindi", Georgia, serif;
          font-size: 1.08em;
          line-height: 1.7;
        }
        .reader-prose blockquote p { margin: 0; }
        .reader-prose em { font-style: italic; }
        .reader-prose strong { font-weight: 600; }
        .reader-prose a { color: var(--r-accent); text-decoration: underline; text-underline-offset: 3px; }
        .reader-prose ul, .reader-prose ol { margin: 0 0 1.15em; padding-left: 1.4em; }
        .reader-prose ul { list-style: disc; }
        .reader-prose ol { list-style: decimal; }
        .reader-prose li { margin-bottom: 0.4em; }
        .reader-prose hr { border: 0; margin: 2.4em 0; text-align: center; }
        .reader-prose hr::after { content: "॥"; color: var(--r-accent); font-family: "Tiro Devanagari Hindi", serif; }
        .reader-prose img { max-width: 100%; height: auto; border-radius: 10px; margin: 1.6em 0; }
        .reader-prose.drop-cap > p:first-of-type::first-letter {
          float: left;
          font-family: "Tiro Devanagari Hindi", Georgia, serif;
          font-size: 3.3em;
          line-height: 0.9;
          margin: 0.07em 0.1em 0 0;
          color: var(--r-accent);
        }
        ::selection { background: color-mix(in srgb, var(--r-accent) 28%, transparent); }
        @media (prefers-reduced-motion: reduce) {
          header, .reader-prose { transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default BookReader;
