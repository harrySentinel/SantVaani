// Simple, Beautiful Book Reader with Chapter Navigation
// Clean reading experience without complex animations! 📖

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home, X, Moon, Sun, ZoomIn, ZoomOut, Maximize, Minimize, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

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
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

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
        setCurrentPage(0);
      } catch (err) {
        console.error('Error:', err);
        navigate('/prabhu-ki-leelaayen');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [slug, navigate]);

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
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const getPages = () => {
    if (!chapter) return [];
    const content = language === 'hi' ? chapter.content_hi : chapter.content;
    const charsPerPage = 1800;
    const pages: string[] = [];

    if (chapter.chapter_image) {
      pages.push(`IMAGE:${chapter.chapter_image}`);
    }

    for (let i = 0; i < content.length; i += charsPerPage) {
      pages.push(content.substring(i, i + charsPerPage));
    }

    return pages;
  };

  const pages = getPages();
  const totalPages = pages.length;
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPageFn = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextChapter = () => {
    if (nextChapter) {
      navigate(`/prabhu-ki-leelaayen/read/${nextChapter.slug}`);
    }
  };

  const goToPrevChapter = () => {
    if (prevChapter) {
      navigate(`/prabhu-ki-leelaayen/read/${prevChapter.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📖</div>
          <p className="text-gray-600">
            {language === 'hi' ? 'पुस्तक खुल रही है...' : 'Opening book...'}
          </p>
        </div>
      </div>
    );
  }

  if (!chapter) return null;

  const currentPageContent = pages[currentPage] || '';
  const isImagePage = currentPageContent.startsWith('IMAGE:');
  const imageUrl = isImagePage ? currentPageContent.replace('IMAGE:', '') : '';

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'} transition-colors duration-500`}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Top Controls */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showControls ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-orange-200'} shadow-lg`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left - Branding + Home */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ॐ</span>
                </div>
                <span className={`text-lg font-semibold hidden sm:inline ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {language === 'hi' ? 'संतवाणी' : 'SantVaani'}
                </span>
              </div>
              {!isFullscreen && (
                <button
                  onClick={() => navigate('/prabhu-ki-leelaayen')}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}
                >
                  <Home className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Center - Chapter Title */}
            <div className="flex-1 text-center px-4">
              <h2 className={`text-sm sm:text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                {language === 'hi' ? chapter.title_hi : chapter.title}
              </h2>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'hi' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
              </p>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={() => setFontSize(Math.min(26, fontSize + 2))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={toggleFullscreen} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
              {isFullscreen && (
                <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl">
          {/* Book Page */}
          <div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border-2 overflow-hidden`}
            style={{ minHeight: isFullscreen ? '85vh' : '70vh' }}
          >
            <div className="h-full flex flex-col">
              {/* Page Number */}
              <div className={`px-6 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'hi' ? 'पृष्ठ' : 'Page'} {currentPage + 1} / {totalPages}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {chapter.read_time} {language === 'hi' ? 'मिनट' : 'min'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                {isImagePage ? (
                  <div className="h-full flex items-center justify-center">
                    <img src={imageUrl} alt={chapter.title} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                  </div>
                ) : (
                  <div
                    className="enhanced-content"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: '1.9',
                      fontFamily: language === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'Georgia, serif',
                      color: darkMode ? '#e5e7eb' : '#1f2937',
                    }}
                    dangerouslySetInnerHTML={{ __html: currentPageContent }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-4">
            {/* Previous */}
            {(currentPage > 0 || prevChapter) && (
              <button
                onClick={isFirstPage && prevChapter ? goToPrevChapter : prevPageFn}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-600' : 'bg-white hover:bg-orange-50 border-orange-300'
                } border-2 shadow-lg transition`}
              >
                <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-orange-600'}`} />
                <div className="text-left">
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isFirstPage && prevChapter ? (language === 'hi' ? 'पिछला अध्याय' : 'Previous Chapter') : (language === 'hi' ? 'पिछला पृष्ठ' : 'Previous Page')}
                  </div>
                  {isFirstPage && prevChapter && (
                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {language === 'hi' ? prevChapter.title_hi : prevChapter.title}
                    </div>
                  )}
                </div>
              </button>
            )}

            <div className="flex-1" />

            {/* Next */}
            {(currentPage < totalPages - 1 || nextChapter) && (
              <button
                onClick={isLastPage && nextChapter ? goToNextChapter : nextPage}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                } text-white border-2 border-transparent shadow-lg transition`}
              >
                <div className="text-right">
                  <div className="text-xs opacity-90">
                    {isLastPage && nextChapter ? (language === 'hi' ? 'अगला अध्याय' : 'Next Chapter') : (language === 'hi' ? 'अगला पृष्ठ' : 'Next Page')}
                  </div>
                  {isLastPage && nextChapter && (
                    <div className="text-sm font-semibold">
                      {language === 'hi' ? nextChapter.title_hi : nextChapter.title}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-orange-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
            <p className={`text-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(((currentPage + 1) / totalPages) * 100)}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-content h2 {
          font-size: 1.6em;
          font-weight: 700;
          margin: 1.5em 0 0.8em;
          color: ${darkMode ? '#fbbf24' : '#ea580c'};
        }

        .enhanced-content p {
          margin-bottom: 1.5em;
          text-align: justify;
          text-indent: 2em;
        }

        .enhanced-content p:first-of-type::first-letter {
          font-size: 3.5em;
          font-weight: 700;
          float: left;
          line-height: 0.9;
          margin: 0.05em 0.1em 0 0;
          color: ${darkMode ? '#f59e0b' : '#ea580c'};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#fed7aa'};
          border-radius: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#6b7280' : '#f97316'};
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default BookReader;
