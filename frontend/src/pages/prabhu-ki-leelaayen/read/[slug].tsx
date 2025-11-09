// Enterprise-Level Story Reader
// Continuous scroll, progress tracking, mobile gestures, keyboard shortcuts

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home, X, Moon, Sun, ZoomIn, ZoomOut, Maximize, Minimize, ChevronRight, ChevronLeft,
  Languages, CheckCircle, ArrowUp, ChevronDown, Type, Settings, BookOpen
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { markChapterReading, markChapterCompleted, calculateReadingPercentage } from '@/lib/readingProgress';
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
  read_time: number;
}

const BookReader: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Reading progress state
  const [readingPercentage, setReadingPercentage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { progress: chapterProgress, refreshProgress } = useChapterProgress(chapter?.id);

  // Touch gesture handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setChapter(data);

        // Fetch next chapter
        const { data: nextData } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('book_id', data.book_id)
          .eq('published', true)
          .gt('chapter_number', data.chapter_number)
          .order('chapter_number', { ascending: true })
          .limit(1)
          .single();
        setNextChapter(nextData);

        // Fetch previous chapter
        const { data: prevData } = await supabase
          .from('leelaayen_chapters')
          .select('*')
          .eq('book_id', data.book_id)
          .eq('published', true)
          .lt('chapter_number', data.chapter_number)
          .order('chapter_number', { ascending: false })
          .limit(1)
          .single();
        setPrevChapter(prevData);

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

  // Mark chapter as reading when loaded
  useEffect(() => {
    if (!user || !chapter) return;

    const markAsReading = async () => {
      await markChapterReading(user.id, chapter.id, chapter.book_id, 0, 0);
      refreshProgress();
    };

    markAsReading();
  }, [user, chapter, refreshProgress]);

  // Scroll to saved position
  useEffect(() => {
    if (!chapterProgress || !contentRef.current) return;

    const scrollPosition = chapterProgress.scroll_position || 0;
    if (scrollPosition > 0) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }, 500);
    }
  }, [chapterProgress]);

  // Track scroll progress and auto-save
  useEffect(() => {
    if (!chapter || !contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;

      const percentage = calculateReadingPercentage(scrollTop, scrollHeight, clientHeight);
      setReadingPercentage(percentage);

      // Calculate time remaining (assuming 200 words per minute)
      if (chapter.read_time) {
        const remainingPercentage = 100 - percentage;
        const remaining = Math.ceil((chapter.read_time * remainingPercentage) / 100);
        setTimeRemaining(remaining);
      }

      // Show scroll-to-top button after 20% scroll
      setShowScrollTop(percentage > 20);

      // Auto-mark as completed when reaching 95% or more
      if (user && percentage >= 95 && chapterProgress?.status !== 'completed') {
        markChapterCompleted(user.id, chapter.id, chapter.book_id).then(() => {
          refreshProgress();
        });
      }

      // Auto-save progress
      if (user) {
        markChapterReading(user.id, chapter.id, chapter.book_id, scrollTop, percentage);
      }
    };

    const saveInterval = setInterval(() => {
      if (user && contentRef.current) {
        const scrollPos = contentRef.current.scrollTop;
        markChapterReading(user.id, chapter.id, chapter.book_id, scrollPos, readingPercentage);
      }
    }, 10000); // Save every 10 seconds

    contentRef.current.addEventListener('scroll', handleScroll);
    const currentContent = contentRef.current;

    return () => {
      clearInterval(saveInterval);
      currentContent?.removeEventListener('scroll', handleScroll);
    };
  }, [user, chapter, readingPercentage, chapterProgress, refreshProgress]);

  // Manually mark as completed
  const handleMarkCompleted = async () => {
    if (!user || !chapter) return;
    await markChapterCompleted(user.id, chapter.id, chapter.book_id);
    refreshProgress();
  };

  // Fullscreen handling
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleGesture();
  };

  const handleGesture = () => {
    const swipeThreshold = 75;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) < swipeThreshold) return;

    if (diff > 0 && nextChapter) {
      // Swipe left - next chapter
      navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`);
    } else if (diff < 0 && prevChapter) {
      // Swipe right - previous chapter
      navigate(`/prabhu-ki-leelaayen/read/${prevChapter.slug}`);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (prevChapter) navigate(`/prabhu-ki-leelaayen/read/${prevChapter.slug}`);
          break;
        case 'ArrowRight':
          if (nextChapter) navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`);
          break;
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          contentRef.current?.scrollBy({ top: 400, behavior: 'smooth' });
          break;
        case 'ArrowUp':
          e.preventDefault();
          contentRef.current?.scrollBy({ top: -400, behavior: 'smooth' });
          break;
        case 'Home':
          e.preventDefault();
          contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'd':
        case 'D':
          setDarkMode(!darkMode);
          break;
        case '+':
        case '=':
          setFontSize(Math.min(26, fontSize + 2));
          break;
        case '-':
          setFontSize(Math.max(14, fontSize - 2));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fontSize, darkMode, prevChapter, nextChapter, navigate]);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📖</div>
          <p className="text-gray-600">
            {language === 'HI' ? 'पुस्तक खुल रही है...' : 'Opening book...'}
          </p>
        </div>
      </div>
    );
  }

  if (!chapter) return null;

  const content = language === 'HI' ? chapter.content_hi : chapter.content;

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
      } transition-colors duration-500`}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={(e) => {
        setShowControls(true);
        handleTouchStart(e);
      }}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Controls */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${
            darkMode ? 'border-gray-700' : 'border-orange-200'
          } shadow-lg`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
            {/* Left - Branding + Home */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">ॐ</span>
              </div>
              {!isFullscreen && (
                <button
                  onClick={() => navigate('/prabhu-ki-leelaayen')}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  aria-label="Go home"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Center - Chapter Title + Progress */}
            <div className="flex-1 text-center px-2 min-w-0">
              <h1 className={`text-xs sm:text-sm md:text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                {language === 'HI' ? chapter.title_hi : chapter.title}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                {/* Progress Ring */}
                <div className="relative w-8 h-8 hidden sm:flex">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke={darkMode ? '#374151' : '#fed7aa'}
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke={darkMode ? '#f59e0b' : '#ea580c'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - readingPercentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {Math.round(readingPercentage)}
                  </span>
                </div>
                <div className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {timeRemaining > 0 && (
                    <span>{timeRemaining} {language === 'HI' ? 'मिनट बाकी' : 'min left'}</span>
                  )}
                  {timeRemaining === 0 && readingPercentage >= 95 && (
                    <span className="text-green-500">✓ {language === 'HI' ? 'पूर्ण' : 'Complete'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
              {/* Mark as Completed */}
              {user && chapterProgress?.status !== 'completed' && (
                <button
                  onClick={handleMarkCompleted}
                  className={`p-1.5 sm:p-2 rounded-lg ${
                    darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                  } text-white transition`}
                  title={language === 'HI' ? 'पूर्ण करें' : 'Mark as Completed'}
                  aria-label="Mark as completed"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Mobile Settings Button */}
              <button
                onClick={() => setShowMobileControls(!showMobileControls)}
                className={`sm:hidden p-1.5 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                } transition`}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Desktop Controls */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={toggleLanguage}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  title={language === 'HI' ? 'Switch to English' : 'हिंदी में बदलें'}
                  aria-label="Toggle language"
                >
                  <Languages className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  aria-label="Decrease font size"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  aria-label="Increase font size"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  aria-label={darkMode ? 'Light mode' : 'Dark mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'
                  } transition`}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>

              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 sm:p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                  aria-label="Exit fullscreen"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls Drawer */}
      {showMobileControls && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-2xl p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              {language === 'HI' ? 'सेटिंग्स' : 'Settings'}
            </h3>
            <button
              onClick={() => setShowMobileControls(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-orange-100 dark:hover:bg-gray-600"
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm">{language === 'HI' ? 'English' : 'हिंदी'}</span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-orange-100 dark:hover:bg-gray-600"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <div className="col-span-2 flex items-center gap-3">
              <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="range"
                min="14"
                max="26"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Continuous Scroll */}
      <div
        className={`${isFullscreen ? 'h-screen pt-20' : 'min-h-screen pt-24 sm:pt-20'} flex items-start justify-center ${
          isFullscreen ? 'p-0' : 'p-2 sm:p-4 pb-20'
        }`}
      >
        <div className={`w-full ${isFullscreen ? 'h-full' : 'max-w-4xl'}`}>
          {/* Book Container */}
          <div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${
              isFullscreen ? 'rounded-none h-full' : 'rounded-xl sm:rounded-2xl'
            } shadow-2xl ${isFullscreen ? 'border-0' : 'border-2'} overflow-hidden`}
            style={{ minHeight: isFullscreen ? '100%' : '70vh' }}
          >
            {/* Content - Continuous Scroll */}
            <div
              ref={contentRef}
              className="h-full overflow-y-auto custom-scrollbar"
              style={{ maxHeight: isFullscreen ? 'calc(100vh - 80px)' : '80vh' }}
            >
              <article className={`${isFullscreen ? 'p-6 sm:p-12 md:p-20' : 'p-6 sm:p-8 md:p-16'} max-w-3xl mx-auto`}>
                <div
                  className="enhanced-content"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.9',
                    fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'Georgia, serif',
                    color: darkMode ? '#e5e7eb' : '#1f2937',
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Chapter Image */}
                {chapter.chapter_image && (
                  <div className="mt-12 mb-8">
                    <img
                      src={chapter.chapter_image}
                      alt={chapter.title}
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                )}

                {/* Chapter Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  {prevChapter ? (
                    <button
                      onClick={() => navigate(`/prabhu-ki-leelaayen/read/${prevChapter.slug}`)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-orange-50 hover:bg-orange-100 text-gray-800'
                      } transition`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'HI' ? 'पिछला' : 'Previous'}
                        </div>
                        <div className="text-sm font-semibold truncate max-w-32">
                          {language === 'HI' ? prevChapter.title_hi : prevChapter.title}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {nextChapter && (
                    <button
                      onClick={() => navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      } text-white transition`}
                    >
                      <div className="text-right">
                        <div className="text-xs text-orange-100">
                          {language === 'HI' ? 'अगला' : 'Next'}
                        </div>
                        <div className="text-sm font-semibold truncate max-w-32">
                          {language === 'HI' ? nextChapter.title_hi : nextChapter.title}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-orange-50'
          } shadow-xl border-2 ${
            darkMode ? 'border-gray-600' : 'border-orange-300'
          } flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
          aria-label="Scroll to top"
        >
          <ArrowUp className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
        </button>
      )}

      {/* Floating Navigation Buttons (only on desktop) */}
      <div className="hidden lg:block">
        {prevChapter && (
          <button
            onClick={() => navigate(`/prabhu-ki-leelaayen/read/${prevChapter.slug}`)}
            className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-orange-50'
            } shadow-xl border-2 ${
              darkMode ? 'border-gray-600' : 'border-orange-300'
            } flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
            title={language === 'HI' ? 'पिछला अध्याय' : 'Previous Chapter'}
            aria-label="Previous chapter"
          >
            <ChevronLeft className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-orange-600'}`} />
          </button>
        )}

        {nextChapter && (
          <button
            onClick={() => navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`)}
            className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            } shadow-xl border-2 border-transparent flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
            title={language === 'HI' ? 'अगला अध्याय' : 'Next Chapter'}
            aria-label="Next chapter"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        )}
      </div>

      {/* Progress Bar at Bottom */}
      {!isFullscreen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-300"
            style={{ width: `${readingPercentage}%` }}
          />
        </div>
      )}

      <style>{`
        /* Beautiful Chapter Headings */
        .enhanced-content h1,
        .enhanced-content h2 {
          font-size: 2em;
          font-weight: 800;
          margin: 1.5em 0 1em;
          padding-bottom: 0.5em;
          border-bottom: 3px solid ${darkMode ? '#f59e0b' : '#ea580c'};
          color: ${darkMode ? '#fbbf24' : '#ea580c'};
          text-align: center;
          letter-spacing: 0.02em;
        }

        .enhanced-content h3 {
          font-size: 1.5em;
          font-weight: 700;
          margin: 1.2em 0 0.8em;
          color: ${darkMode ? '#fcd34d' : '#f97316'};
        }

        /* Elegant Paragraphs */
        .enhanced-content p {
          margin-bottom: 1.5em;
          text-align: justify;
          text-indent: 2em;
          hyphens: auto;
          word-spacing: 0.05em;
        }

        /* Magnificent Drop Cap */
        .enhanced-content p:first-of-type {
          margin-top: 1.5em;
        }

        .enhanced-content p:first-of-type::first-letter {
          font-size: 4em;
          font-weight: 900;
          float: left;
          line-height: 0.85;
          margin: 0.08em 0.12em 0 0;
          padding: 0.1em 0.15em;
          background: ${darkMode ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' : 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'};
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }

        /* Blockquotes for Sacred Texts */
        .enhanced-content blockquote {
          margin: 2em 0;
          padding: 1.5em 2em;
          border-left: 5px solid ${darkMode ? '#f59e0b' : '#ea580c'};
          background: ${darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(234, 88, 12, 0.05)'};
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }

        /* Strong emphasis */
        .enhanced-content strong {
          color: ${darkMode ? '#fbbf24' : '#ea580c'};
          font-weight: 700;
        }

        /* Emphasis */
        .enhanced-content em {
          color: ${darkMode ? '#fcd34d' : '#f97316'};
        }

        /* Lists */
        .enhanced-content ul,
        .enhanced-content ol {
          margin: 1.5em 0;
          padding-left: 2.5em;
        }

        .enhanced-content li {
          margin-bottom: 0.8em;
          line-height: 1.9;
        }

        /* Horizontal Rules */
        .enhanced-content hr {
          margin: 2.5em auto;
          border: none;
          height: 3px;
          background: ${darkMode ? 'linear-gradient(90deg, transparent, #f59e0b, transparent)' : 'linear-gradient(90deg, transparent, #ea580c, transparent)'};
          width: 50%;
        }

        /* Beautiful Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#fed7aa'};
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'linear-gradient(180deg, #f59e0b 0%, #ea580c 100%)' : 'linear-gradient(180deg, #f97316 0%, #dc2626 100%)'};
          border-radius: 10px;
          border: 2px solid ${darkMode ? '#374151' : '#fed7aa'};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)'};
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookReader;
