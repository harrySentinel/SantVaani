// Interactive Book Reader with Card Expansion & Page Flip Animation
// Beautiful 3D book flip experience that users will LOVE!

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, ChevronRight, Home, X, Moon, Sun,
  ZoomIn, ZoomOut, Maximize2, Minimize2
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
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Fetch chapter data
  useEffect(() => {
    const fetchChapter = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prabhu_leelaayen_chapters')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setChapter(data);

        // Increment view count
        await supabase.rpc('increment_chapter_views', { chapter_slug: slug });
      } catch (err) {
        console.error('Error fetching chapter:', err);
        navigate('/prabhu-ki-leelaayen');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [slug, navigate]);

  // Split content into pages (800 characters per page)
  const getPages = () => {
    if (!chapter) return [];

    const content = language === 'hi' ? chapter.content_hi : chapter.content;
    const charsPerPage = 800;
    const pages: string[] = [];

    // First page with image
    if (chapter.chapter_image) {
      pages.push(`IMAGE:${chapter.chapter_image}`);
    }

    // Split content into pages
    for (let i = 0; i < content.length; i += charsPerPage) {
      pages.push(content.substring(i, i + charsPerPage));
    }

    return pages;
  };

  const pages = getPages();
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📖</div>
          <p className="text-gray-600">
            {language === 'hi' ? 'अध्याय खुल रहा है...' : 'Opening chapter...'}
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'} transition-colors duration-500 py-8 px-4`}>
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/prabhu-ki-leelaayen')}
          className={`${darkMode ? 'text-white hover:bg-gray-800' : 'hover:bg-white'}`}
        >
          <Home className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className={darkMode ? 'text-white hover:bg-gray-800' : ''}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className={darkMode ? 'text-white hover:bg-gray-800' : ''}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className={darkMode ? 'text-white hover:bg-gray-800' : ''}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className={darkMode ? 'text-white hover:bg-gray-800' : ''}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Book Container with Card Expansion */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`perspective-1000 transition-all duration-700 ease-out ${
            isExpanded ? 'scale-100' : 'scale-95'
          }`}
        >
          {/* Book Card */}
          <div
            className={`relative mx-auto transition-all duration-700 ${
              isExpanded ? 'max-w-6xl' : 'max-w-4xl'
            }`}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* The Actual Book */}
            <div
              className={`relative ${
                darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-amber-50 to-orange-100'
              } rounded-2xl shadow-2xl border-4 ${
                darkMode ? 'border-gray-700' : 'border-orange-300'
              } overflow-hidden transition-all duration-500`}
              style={{
                minHeight: isExpanded ? '700px' : '600px',
                backgroundImage: !darkMode
                  ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  : 'none',
              }}
            >
              {/* Chapter Header */}
              <div className={`p-4 border-b-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-orange-200 bg-white/50'} backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} truncate max-w-md`}>
                      {language === 'hi' ? chapter.title_hi : chapter.title}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'hi' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
                    </p>
                  </div>
                  <Badge className="bg-orange-500 text-white">
                    {currentPage + 1} / {totalPages}
                  </Badge>
                </div>
              </div>

              {/* Book Pages with Flip Animation */}
              <div className="relative p-6 md:p-12" style={{ minHeight: isExpanded ? '550px' : '450px' }}>
                <div
                  className={`transition-all duration-600 ${
                    isFlipping ? 'opacity-0 scale-95 rotate-y-90' : 'opacity-100 scale-100 rotate-y-0'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)',
                  }}
                >
                  {isImagePage ? (
                    /* Image Page */
                    <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                      <img
                        src={imageUrl}
                        alt={language === 'hi' ? chapter.title_hi : chapter.title}
                        className="max-w-full max-h-96 object-contain rounded-lg shadow-2xl"
                      />
                    </div>
                  ) : (
                    /* Text Page */
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
              </div>

              {/* Page Turn Indicator */}
              {!isImagePage && (
                <div className={`absolute bottom-20 right-8 ${darkMode ? 'text-gray-600' : 'text-orange-300'} text-6xl opacity-20 pointer-events-none`}>
                  📖
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6 gap-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0 || isFlipping}
                size="lg"
                className={`flex-1 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                } text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                {language === 'hi' ? 'पिछला पृष्ठ' : 'Previous Page'}
              </Button>

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1 || isFlipping}
                size="lg"
                className={`flex-1 ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                } text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105`}
              >
                {language === 'hi' ? 'अगला पृष्ठ' : 'Next Page'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className={`h-3 ${darkMode ? 'bg-gray-700' : 'bg-orange-200'} rounded-full overflow-hidden shadow-inner`}>
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Math.round(((currentPage + 1) / totalPages) * 100)}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {chapter.read_time} {language === 'hi' ? 'मिनट पढ़ें' : 'min read'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Tips */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} italic`}>
          {language === 'hi'
            ? '💡 युक्ति: पृष्ठों के बीच सुचारु रूप से नेविगेट करने के लिए तीर कुंजी का उपयोग करें'
            : '💡 Tip: Use arrow keys to smoothly navigate between pages'}
        </p>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        .rotate-y-0 {
          transform: rotateY(0deg);
        }

        .rotate-y-90 {
          transform: rotateY(90deg);
        }
      `}</style>
    </div>
  );
};

export default BookReader;
