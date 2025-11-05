// Simple, Beautiful Book Reader with Chapter Navigation
// Clean reading experience without complex animations! 📖

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home, X, Moon, Sun, ZoomIn, ZoomOut, Maximize, Minimize, ChevronRight, ChevronLeft, Languages
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
  const { language, toggleLanguage } = useLanguage();
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
    const content = language === 'HI' ? chapter.content_hi : chapter.content;
    const charsPerPage = 2400; // Increased for better reading flow
    const pages: string[] = [];

    // Content comes FIRST (Chapter 1 on first page)
    for (let i = 0; i < content.length; i += charsPerPage) {
      pages.push(content.substring(i, i + charsPerPage));
    }

    // Image comes LAST (if exists)
    if (chapter.chapter_image) {
      pages.push(`IMAGE:${chapter.chapter_image}`);
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
            {language === 'HI' ? 'पुस्तक खुल रही है...' : 'Opening book...'}
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
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'} transition-colors duration-500`}
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
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
            {/* Left - Branding + Home */}
            <div className="flex items-center gap-1 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">ॐ</span>
                </div>
                <span className={`text-base sm:text-lg font-semibold hidden sm:inline ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {language === 'HI' ? 'संतवाणी' : 'SantVaani'}
                </span>
              </div>
              {!isFullscreen && (
                <button
                  onClick={() => navigate('/prabhu-ki-leelaayen')}
                  className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Center - Chapter Title */}
            <div className="flex-1 text-center px-1 sm:px-4 min-w-0 overflow-hidden">
              <h2 className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                {language === 'HI' ? chapter.title_hi : chapter.title}
              </h2>
              <p className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                {language === 'HI' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
              </p>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={toggleLanguage}
                className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}
                title={language === 'HI' ? 'Switch to English' : 'हिंदी में बदलें'}
              >
                <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition hidden sm:inline-flex`}>
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setFontSize(Math.min(26, fontSize + 2))} className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition hidden sm:inline-flex`}>
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button onClick={toggleFullscreen} className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-orange-50 text-gray-700'} transition`}>
                {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              {isFullscreen && (
                <button onClick={toggleFullscreen} className="p-1.5 sm:p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isFullscreen ? 'h-screen pt-12 sm:pt-16' : 'min-h-screen pt-16 sm:pt-20'} flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4'}`}>
        <div className={`w-full ${isFullscreen ? 'h-full' : 'max-w-4xl'}`}>
          {/* Book Page */}
          <div
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${isFullscreen ? 'rounded-none h-full' : 'rounded-xl sm:rounded-2xl'} shadow-2xl ${isFullscreen ? 'border-0' : 'border-2'} overflow-hidden`}
            style={{ minHeight: isFullscreen ? '100%' : '70vh' }}
          >
            <div className="h-full flex flex-col">
              {/* Page Number */}
              <div className={`px-3 sm:px-6 py-2 sm:py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'HI' ? 'पृष्ठ' : 'Page'} {currentPage + 1} / {totalPages}
                </span>
                <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {chapter.read_time} {language === 'HI' ? 'मिनट' : 'min'}
                </span>
              </div>

              {/* Content - SCROLLABLE */}
              <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: isFullscreen ? 'calc(100vh - 120px)' : '65vh' }}>
                <div className={`${isFullscreen ? 'p-4 sm:p-8 md:p-16' : 'p-4 sm:p-6 md:p-12'}`}>
                  {isImagePage ? (
                    <div className="h-full flex items-center justify-center">
                      <img src={imageUrl} alt={chapter.title} className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                    </div>
                  ) : (
                    <div
                      className="enhanced-content"
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: '2',
                        fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'Georgia, serif',
                        color: darkMode ? '#e5e7eb' : '#1f2937',
                      }}
                      dangerouslySetInnerHTML={{ __html: currentPageContent }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Simple Floating Navigation Buttons - < > */}
      {/* Previous Button */}
      {(currentPage > 0 || prevChapter) && (
        <button
          onClick={isFirstPage && prevChapter ? goToPrevChapter : prevPageFn}
          className={`fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-orange-50'
          } shadow-xl border-2 ${darkMode ? 'border-gray-600' : 'border-orange-300'} flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
          title={isFirstPage && prevChapter ? (language === 'HI' ? 'पिछला अध्याय' : 'Previous Chapter') : (language === 'HI' ? 'पिछला पृष्ठ' : 'Previous')}
        >
          <ChevronLeft className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-white' : 'text-orange-600'}`} />
        </button>
      )}

      {/* Next Button */}
      {(currentPage < totalPages - 1 || nextChapter) && (
        <button
          onClick={isLastPage && nextChapter ? goToNextChapter : nextPage}
          className={`fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
          } shadow-xl border-2 border-transparent flex items-center justify-center transition-all hover:scale-110 active:scale-95`}
          title={isLastPage && nextChapter ? (language === 'HI' ? 'अगला अध्याय' : 'Next Chapter') : (language === 'HI' ? 'अगला पृष्ठ' : 'Next')}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </button>
      )}

      {/* Progress Bar - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-orange-200'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-300"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
          <p className={`text-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {Math.round(((currentPage + 1) / totalPages) * 100)}% {language === 'HI' ? 'पूर्ण' : 'Complete'}
          </p>
        </div>
      )}

      <style>{`
        /* Beautiful Chapter Headings */
        .enhanced-content h2 {
          font-size: 2em;
          font-weight: 800;
          margin: 1em 0 1em;
          padding-bottom: 0.5em;
          border-bottom: 3px solid ${darkMode ? '#f59e0b' : '#ea580c'};
          color: ${darkMode ? '#fbbf24' : '#ea580c'};
          text-align: center;
          letter-spacing: 0.02em;
        }

        /* Elegant Paragraphs */
        .enhanced-content p {
          margin-bottom: 1.8em;
          text-align: justify;
          text-indent: 2.5em;
          hyphens: auto;
          word-spacing: 0.05em;
        }

        /* Magnificent Drop Cap */
        .enhanced-content p:first-of-type {
          margin-top: 1.5em;
        }

        .enhanced-content p:first-of-type::first-letter {
          font-size: 4.5em;
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
        .enhanced-content ul, .enhanced-content ol {
          margin: 1.5em 0;
          padding-left: 3em;
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
          margin: 8px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'linear-gradient(180deg, #f59e0b 0%, #ea580c 100%)' : 'linear-gradient(180deg, #f97316 0%, #dc2626 100%)'};
          border-radius: 10px;
          border: 2px solid ${darkMode ? '#374151' : '#fed7aa'};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)' : 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)'};
        }
      `}</style>
    </div>
  );
};

export default BookReader;
