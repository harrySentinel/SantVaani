// Interactive Book Reader for Prabhu Ki Leelaayen
// Beautiful page flip animation with chapter images

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, ChevronRight, Home, BookMarked, Share2,
  ZoomIn, ZoomOut, Moon, Sun, X, Menu
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
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);

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

  // Split content into pages (simple pagination - 800 characters per page)
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
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'} transition-colors duration-300`}>
      {/* Top Controls Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 ${showControls ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-300 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-orange-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left - Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/prabhu-ki-leelaayen')}
              className={`${darkMode ? 'text-white hover:bg-gray-700' : 'hover:bg-orange-50'}`}
            >
              <Home className="w-5 h-5 mr-2" />
              {language === 'hi' ? 'मुख्य' : 'Home'}
            </Button>
          </div>

          {/* Center - Chapter Info */}
          <div className="text-center flex-1 px-4">
            <h3 className={`text-base md:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
              {language === 'hi' ? chapter.title_hi : chapter.title}
            </h3>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'hi' ? 'अध्याय' : 'Chapter'} {chapter.chapter_number}
            </p>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={decreaseFontSize}
              className={darkMode ? 'text-white hover:bg-gray-700' : ''}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={increaseFontSize}
              className={darkMode ? 'text-white hover:bg-gray-700' : ''}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? 'text-white hover:bg-gray-700' : ''}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Book Container */}
      <div className="flex items-center justify-center min-h-screen pt-24 pb-20 px-4">
        <div className="relative max-w-5xl w-full">
          {/* Book */}
          <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-amber-50 to-orange-50'} rounded-2xl shadow-2xl overflow-hidden border-4 ${darkMode ? 'border-gray-700' : 'border-orange-300'}`}
            style={{
              minHeight: '600px',
              backgroundImage: !darkMode ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` : 'none'
            }}
          >
            {/* Page Content */}
            <div className="p-8 md:p-16">
              {isImagePage ? (
                /* Image Page */
                <div className="flex items-center justify-center h-96">
                  <img
                    src={imageUrl}
                    alt={language === 'hi' ? chapter.title_hi : chapter.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                  />
                </div>
              ) : (
                /* Text Page */
                <div
                  className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: currentPageContent }}
                />
              )}
            </div>

            {/* Page Number */}
            <div className={`absolute bottom-8 right-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              {currentPage + 1} / {totalPages}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              size="lg"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'} text-white shadow-xl`}
            >
              <ChevronLeft className="w-6 h-6 mr-2" />
              {language === 'hi' ? 'पिछला' : 'Previous'}
            </Button>

            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              size="lg"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'} text-white shadow-xl`}
            >
              {language === 'hi' ? 'अगला' : 'Next'}
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-orange-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
            <p className={`text-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(((currentPage + 1) / totalPages) * 100)}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        {showControls ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default BookReader;
