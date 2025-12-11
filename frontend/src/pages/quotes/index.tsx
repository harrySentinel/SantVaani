import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Quote, Heart, Loader2, Share2, Download, ChevronDown, Home, X } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface QuoteItem {
  id: string;
  text: string;
  text_hi: string;
  author: string;
  category: string;
}

// Beautiful gradient combinations
const gradients = [
  'from-purple-500 via-pink-500 to-red-500',
  'from-blue-500 via-purple-500 to-pink-500',
  'from-green-400 via-blue-500 to-purple-600',
  'from-orange-400 via-red-500 to-pink-500',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-teal-400 via-cyan-500 to-blue-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-rose-400 via-fuchsia-500 to-indigo-500',
];

const Quotes = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch quotes from Supabase
  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setQuotes(data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Handle scroll to update current index using Intersection Observer
  useEffect(() => {
    if (quoteRefs.current.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = quoteRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) {
              setCurrentIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    quoteRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [quotes]);

  // Get gradient for quote based on index
  const getGradient = (index: number) => {
    return gradients[index % gradients.length];
  };

  // Share quote as image
  const shareQuote = async (quote: QuoteItem, index: number) => {
    setIsSharing(true);
    const quoteElement = quoteRefs.current[index];
    if (!quoteElement) return;

    try {
      // Capture the quote card as image with proper dimensions
      const canvas = await html2canvas(quoteElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'santvaani-quote.png', { type: 'image/png' });

        // Try native share API (mobile)
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'SantVaani Quote',
              text: `${quote.text}\n- ${quote.author}`,
            });
            toast({ title: '✅ Shared successfully!' });
          } catch (err: any) {
            if (err.name !== 'AbortError') {
              console.error('Share failed:', err);
            }
          }
        } else {
          // Fallback: Download image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `santvaani-quote-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast({ title: '✅ Image downloaded!' });
        }
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Error sharing quote:', err);
      toast({ title: '❌ Failed to share', variant: 'destructive' });
    } finally {
      setIsSharing(false);
    }
  };

  // Navigate to specific quote
  const goToQuote = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto" />
          <p className="text-lg text-white font-medium">Loading divine wisdom...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || quotes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-center space-y-4 text-white">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold">No Quotes Available</h2>
          <p className="text-white/80">Check back soon for divine wisdom</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white text-purple-600 rounded-full hover:bg-white/90 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Reel Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {quotes.map((quote, index) => (
          <div
            key={quote.id}
            ref={(el) => (quoteRefs.current[index] = el)}
            className="h-screen w-full snap-start snap-always flex items-center justify-center relative"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)}`} />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Quote Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-8 text-center space-y-8">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                  {quote.category}
                </span>
              </motion.div>

              {/* Quote Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Quote className="w-12 h-12 text-white/80 mx-auto" />
              </motion.div>

              {/* Quote Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed">
                  "{quote.text}"
                </blockquote>

                <p className="text-xl sm:text-2xl text-white/90 font-medium">
                  "{quote.text_hi}"
                </p>
              </motion.div>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <p className="text-lg sm:text-xl text-white/90 font-medium">
                  - {quote.author}
                </p>
              </motion.div>

              {/* SantVaani Branding */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="pt-8"
              >
                <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-sm text-white font-bold tracking-widest">
                    SANTVAANI
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Scroll indicator (only on first quote) */}
            {index === 0 && currentIndex === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, repeat: Infinity, duration: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
              >
                <ChevronDown className="w-8 h-8 animate-bounce" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Fixed UI Overlay */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
          <button
            onClick={() => window.location.href = '/'}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="text-white/80 text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {currentIndex + 1} / {quotes.length}
          </div>

          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Action Buttons - Bottom Right */}
        <div className="absolute right-4 sm:right-6 bottom-32 flex flex-col space-y-3 pointer-events-auto">
          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => shareQuote(quotes[currentIndex], currentIndex)}
            disabled={isSharing}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-all shadow-lg disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </motion.button>

          {/* Heart Button (Favorite - optional) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-all shadow-lg"
          >
            <Heart className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quote Navigation Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 pointer-events-auto">
          {quotes.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuote(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
          {quotes.length > 5 && (
            <span className="text-white/60 text-xs px-2">+{quotes.length - 5}</span>
          )}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Quotes;
