// Full-Screen Blog Reader Component with Bilingual Support
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  X, Languages, Bookmark, BookmarkCheck, Share2, Moon, Sun,
  Maximize2, Minimize2, Twitter, Facebook, MessageSquare, Copy,
  CheckCircle, ChevronLeft, ChevronRight, Type, Settings
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogReaderProps {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (platform: string) => void;
}

export const BlogReader: React.FC<BlogReaderProps> = ({
  post,
  isOpen,
  onClose,
  onShare
}) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = element.scrollHeight;
      const scrollTop = element.scrollTop;

      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    const element = contentRef.current;
    element?.addEventListener('scroll', handleScroll);
    return () => element?.removeEventListener('scroll', handleScroll);
  }, []);

  // Check bookmark status
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('santvaani_bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(post.id));
  }, [post.id]);

  // Handle bookmark
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('santvaani_bookmarks') || '[]');
    let updated;

    if (isBookmarked) {
      updated = bookmarks.filter((id: string) => id !== post.id);
    } else {
      updated = [...bookmarks, post.id];
    }

    localStorage.setItem('santvaani_bookmarks', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  };

  // Handle share
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      return;
    }

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onShare?.(platform);
    }
  };

  const fontSizeClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    xlarge: 'text-xl leading-loose'
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-1 left-0 right-0 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-lg bg-opacity-95 z-40`}>
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : ''} p-2`}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-1 sm:space-x-2">
            {/* Language Toggle */}
            <Button
              variant={language === 'hi' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className={`${isDarkMode ? 'text-gray-300' : ''} text-xs sm:text-sm p-2`}
            >
              <Languages className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{language === 'en' ? 'English' : 'हिंदी'}</span>
            </Button>

            {/* Bookmark */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={`${isDarkMode ? 'text-gray-300' : ''} p-2`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              ) : (
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>

            {/* Settings */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className={`${isDarkMode ? 'text-gray-300' : ''} p-2`}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {showSettings && (
                <Card className={`absolute top-12 right-0 p-3 sm:p-4 w-56 sm:w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''} z-50`}>
                  <div className="space-y-4">
                    {/* Font Size */}
                    <div>
                      <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : ''}`}>
                        Font Size
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant={fontSize === 'normal' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('normal')}
                          className="flex-1"
                        >
                          <Type className="w-3 h-3" />
                        </Button>
                        <Button
                          variant={fontSize === 'large' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('large')}
                          className="flex-1"
                        >
                          <Type className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={fontSize === 'xlarge' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize('xlarge')}
                          className="flex-1"
                        >
                          <Type className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Dark Mode */}
                    <div>
                      <label className={`text-sm font-medium mb-2 block ${isDarkMode ? 'text-gray-300' : ''}`}>
                        Theme
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-full"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun className="w-4 h-4 mr-2" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 mr-2" />
                            Dark Mode
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Share */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className={`${isDarkMode ? 'text-gray-300' : ''} p-2`}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Card className={`absolute top-12 right-0 p-2 sm:p-3 w-40 sm:w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''} z-50`}>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="w-full justify-start"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="w-full justify-start"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('whatsapp')}
                    className="w-full justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className={`w-full justify-start ${copied ? 'text-green-500' : ''}`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        ref={contentRef}
        className={`pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 h-screen overflow-y-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
      >
        <article className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {post.excerpt}
          </p>

          <Separator className={`my-8 ${isDarkMode ? 'bg-gray-700' : ''}`} />

          {/* Content */}
          <div className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]} ${isDarkMode ? 'prose-invert' : ''}`}>
            {language === 'en' ? (
              <div
                className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />
            ) : (
              <div className={`${isDarkMode ? 'bg-orange-50 dark:bg-gray-800' : 'bg-orange-50'} border-l-4 border-orange-500 p-6 rounded-r-xl`}>
                <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  🙏 यह लेख हिंदी में जल्द ही उपलब्ध होगा।
                </p>
                <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  कृपया अंग्रेजी संस्करण पढ़ें या जल्द ही हिंदी अनुवाद के लिए वापस आएं।
                </p>
                <Button
                  onClick={() => setLanguage('en')}
                  className="mt-4"
                  variant="outline"
                >
                  Read in English →
                </Button>
              </div>
            )}
          </div>

          {/* Spiritual Quotes */}
          {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
            <div className="mt-12">
              <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Spiritual Wisdom
              </h3>
              <div className="space-y-4">
                {post.spiritualQuotes.map((quote, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-6 rounded-r-xl ${
                      isDarkMode
                        ? 'bg-gray-800 border-orange-500'
                        : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-400'
                    }`}
                  >
                    <blockquote className={`text-lg italic mb-2 ${isDarkMode ? 'text-gray-300' : 'text-orange-800'}`}>
                      "{quote}"
                    </blockquote>
                    {post.relatedSaints && post.relatedSaints[index] && (
                      <cite className={`font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                        - {post.relatedSaints[index]}
                      </cite>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exit Fullscreen Button - Prominent at Bottom */}
          <div className="mt-16 mb-8 flex justify-center">
            <Button
              onClick={onClose}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 rounded-full shadow-xl text-lg font-semibold"
            >
              <X className="w-6 h-6 mr-2" />
              Exit Reader
            </Button>
          </div>
        </article>
      </div>

      {/* Floating Exit Button - Always Visible */}
      <Button
        onClick={onClose}
        className="fixed bottom-8 right-8 bg-gray-900 hover:bg-gray-800 text-white rounded-full w-14 h-14 shadow-2xl z-50 flex items-center justify-center"
        title="Exit Fullscreen (ESC)"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default BlogReader;
