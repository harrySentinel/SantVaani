// EPIC 3D Book Reader with DRAMATIC Realistic Page Flip
// Users will SEE and LOVE this! 📖✨

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Home, X, Moon, Sun, ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

interface Chapter {
  id: string;
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

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

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

  const getPages = () => {
    if (!chapter) return [];

    const content = language === 'hi' ? chapter.content_hi : chapter.content;
    const charsPerPage = 1200;
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

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setTimeout(() => setIsFlipping(false), 100);
      }, 1000);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setTimeout(() => setIsFlipping(false), 100);
      }, 1000);
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
      className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'} transition-colors duration-500 relative overflow-hidden`}
    >
      {/* SantVaani Branding */}
      <div className={`absolute top-4 left-4 z-50 flex items-center gap-2 ${darkMode ? 'text-white/70' : 'text-gray-600/70'}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">ॐ</span>
        </div>
        <span className="text-lg font-semibold">
          {language === 'hi' ? 'संतवाणी' : 'SantVaani'}
        </span>
      </div>

      {/* Top Controls */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => navigate('/prabhu-ki-leelaayen')}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-lg transition`}
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-lg transition`}
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-lg transition`}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-lg transition`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-lg transition`}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className={`absolute top-4 right-4 z-50 p-3 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-2xl transition`}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Book Container */}
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="relative" style={{ perspective: '2500px', perspectiveOrigin: 'center center' }}>
          {/* The Book with Page Flip Effect */}
          <div
            className="book-container relative"
            style={{
              width: isFullscreen ? 'min(90vw, 1200px)' : 'min(90vw, 900px)',
              height: isFullscreen ? 'min(85vh, 800px)' : 'min(80vh, 700px)',
            }}
          >
            {/* Current Page (Always Visible) */}
            <div
              className={`book-page current-page ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-amber-50 to-orange-100 border-orange-300'} rounded-2xl shadow-2xl border-4 overflow-hidden absolute inset-0`}
              style={{
                zIndex: 1,
              }}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className={`px-6 py-4 border-b-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-orange-200 bg-white/50'} backdrop-blur-sm flex items-center justify-between`}>
                  <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate max-w-md`}>
                    {language === 'hi' ? chapter.title_hi : chapter.title}
                  </h2>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                    {currentPage + 1} / {totalPages}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                  {isImagePage ? (
                    <div className="h-full flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={language === 'hi' ? chapter.title_hi : chapter.title}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div
                      className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: '1.8',
                        fontFamily: language === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'inherit'
                      }}
                      dangerouslySetInnerHTML={{ __html: currentPageContent }}
                    />
                  )}
                </div>

                {/* Navigation Buttons (INSIDE BOOK) */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  {currentPage > 0 && (
                    <button
                      onClick={prevPage}
                      disabled={isFlipping}
                      className={`group relative w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'} text-white shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-2xl">◀</span>
                      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap text-sm`}>
                        {language === 'hi' ? 'पिछला पृष्ठ' : 'Previous'}
                      </div>
                    </button>
                  )}

                  <div className="flex-1" />

                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={nextPage}
                      disabled={isFlipping}
                      className={`group relative w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'} text-white shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-2xl">▶</span>
                      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap text-sm`}>
                        {language === 'hi' ? 'अगला पृष्ठ' : 'Next'}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Flipping Page Overlay (Only Visible During Animation) */}
            {isFlipping && (
              <div
                className={`flipping-page absolute inset-0 pointer-events-none ${flipDirection === 'forward' ? 'flip-forward' : 'flip-backward'}`}
                style={{
                  zIndex: 10,
                  transformStyle: 'preserve-3d',
                  transformOrigin: flipDirection === 'forward' ? 'right center' : 'left center',
                }}
              >
                <div
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-amber-50 to-orange-100 border-orange-300'} rounded-2xl shadow-2xl border-4 h-full w-full`}
                  style={{
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Page curl shadow */}
                  <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-orange-200'} rounded-full overflow-hidden shadow-inner`}>
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-500"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(((currentPage + 1) / totalPages) * 100)}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {chapter.read_time} {language === 'hi' ? 'मिनट' : 'min read'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for DRAMATIC Page Flip */}
      <style>{`
        .book-page {
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(251, 146, 60, 0.1),
            inset -10px 0 20px rgba(0, 0, 0, 0.1);
        }

        .flipping-page.flip-forward {
          animation: dramaticFlipForward 1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        .flipping-page.flip-backward {
          animation: dramaticFlipBackward 1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        @keyframes dramaticFlipForward {
          0% {
            transform: rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
          25% {
            transform: rotateY(-30deg) translateZ(50px) translateX(-30px);
            opacity: 0.9;
          }
          50% {
            transform: rotateY(-90deg) translateZ(100px) translateX(-80px) scale(1.05);
            opacity: 0.7;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          }
          75% {
            transform: rotateY(-150deg) translateZ(50px) translateX(-30px);
            opacity: 0.4;
          }
          100% {
            transform: rotateY(-180deg) translateZ(0px);
            opacity: 0;
          }
        }

        @keyframes dramaticFlipBackward {
          0% {
            transform: rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
          25% {
            transform: rotateY(30deg) translateZ(50px) translateX(30px);
            opacity: 0.9;
          }
          50% {
            transform: rotateY(90deg) translateZ(100px) translateX(80px) scale(1.05);
            opacity: 0.7;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
          }
          75% {
            transform: rotateY(150deg) translateZ(50px) translateX(30px);
            opacity: 0.4;
          }
          100% {
            transform: rotateY(180deg) translateZ(0px);
            opacity: 0;
          }
        }

        /* Add page curl effect on hover */
        .book-page:hover {
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.35),
            0 0 50px rgba(251, 146, 60, 0.15),
            inset -12px 0 25px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
};

export default BookReader;
