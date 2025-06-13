
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Copy, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Bhajan {
  id: number;
  title: string;
  titleHi: string;
  category: string;
  lyrics: string;
  lyricsHi: string;
  meaning: string;
  author: string;
}

interface BhajanModalProps {
  bhajan: Bhajan | null;
  isOpen: boolean;
  onClose: () => void;
}

const BhajanModal: React.FC<BhajanModalProps> = ({ bhajan, isOpen, onClose }) => {
  const { toast } = useToast();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyLyrics = () => {
    if (!bhajan) return;
    
    const textToCopy = `${bhajan.title}\n\n${bhajan.lyricsHi}\n\n${bhajan.lyrics}\n\nMeaning: ${bhajan.meaning}\n\n- ${bhajan.author}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "✅ Copied!",
        description: "Bhajan lyrics copied to clipboard",
        duration: 2000,
      });
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "✅ Copied!",
        description: "Bhajan lyrics copied to clipboard",
        duration: 2000,
      });
    });
  };

  if (!bhajan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-white to-orange-50 shadow-2xl border border-green-200/50"
          >
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700" />
            </Button>

            {/* Content Container */}
            <div className="h-full overflow-y-auto">
              <div className="min-h-full p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Header Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-6 mb-8"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-center items-center space-x-2 mb-4">
                        <Music className="w-8 h-8 text-green-500" />
                        <span className="text-3xl">🎵</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-orange-600 bg-clip-text text-transparent leading-tight">
                        {bhajan.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-green-600 font-medium">
                        {bhajan.titleHi}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                        <Music className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{bhajan.category}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Lyrics Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Sacred Lyrics
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-orange-600 mx-auto rounded-full" />
                    </div>

                    {/* Hindi Lyrics */}
                    <div className="bg-gradient-to-r from-green-50 to-orange-100/50 rounded-2xl p-6 md:p-8 shadow-lg border border-green-200/50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-green-400 to-orange-600 rounded-full mr-3" />
                        देवनागरी (Devanagari)
                      </h3>
                      <pre className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-medium">
                        {bhajan.lyricsHi}
                      </pre>
                    </div>

                    {/* Transliteration */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-green-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-green-400 to-orange-600 rounded-full mr-3" />
                        Transliteration
                      </h3>
                      <pre className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                        {bhajan.lyrics}
                      </pre>
                    </div>

                    {/* Meaning */}
                    <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 md:p-8 shadow-lg border border-orange-200/50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Quote className="w-6 h-6 text-orange-500 mr-3" />
                        Spiritual Meaning
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg italic">
                        {bhajan.meaning}
                      </p>
                      <p className="text-sm text-gray-500 mt-4 font-medium">- {bhajan.author}</p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleCopyLyrics}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Bhajan</span>
                      </Button>
                    </div>

                    {/* Optional Audio Player Placeholder */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 text-center">
                      <Music className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-800 mb-2">Audio Player</h3>
                      <p className="text-sm text-gray-600">Audio will be available when added to the bhajan</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BhajanModal;
