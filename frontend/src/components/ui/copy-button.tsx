import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CopyToClipboard } from '@/utils/copyUtils';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  textHi?: string;
  author: string;
  category?: string;
  source?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  type?: 'quote' | 'simple';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  textHi,
  author,
  category,
  source = 'SantVaani',
  variant = 'ghost',
  size = 'sm',
  className,
  showIcon = true,
  children,
  type = 'quote'
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let success = false;
      
      if (type === 'quote') {
        success = await CopyToClipboard.copyQuote({
          text,
          text_hi: textHi,
          author,
          category,
          source
        });
      } else {
        success = await CopyToClipboard.copySimpleQuote(text, author);
      }

      if (success) {
        setIsCopied(true);
        
        // Detect device type for appropriate message
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        toast({
          title: "✨ Quote Copied!",
          description: CopyToClipboard.getSuccessMessage(),
          duration: 3000,
        });

        // Reset copied state after animation
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: CopyToClipboard.getErrorMessage(),
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // Device detection for appropriate icon
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <Button
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all duration-300 group",
        isCopied && "bg-green-50 border-green-200 text-green-700",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        {showIcon && (
          <div className="relative">
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="text-green-500"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="flex items-center"
                >
                  {isMobile ? (
                    <Share2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ripple effect on click */}
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-green-400 rounded-full -z-10"
                />
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence mode="wait">
          {children || (
            <motion.span
              key={isCopied ? 'copied' : 'copy'}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
            >
              {isCopied 
                ? (isMobile ? 'Ready to Share!' : 'Copied!') 
                : (isMobile ? 'Share' : 'Copy Quote')
              }
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Hover effect background */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovered ? 0.1 : 0, 
          scale: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-orange-400 rounded-md"
      />
    </Button>
  );
};

interface QuickCopyButtonProps {
  text: string;
  author: string;
  className?: string;
}

export const QuickCopyButton: React.FC<QuickCopyButtonProps> = ({
  text,
  author,
  className
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await CopyToClipboard.copySimpleQuote(text, author);

    if (success) {
      setIsCopied(true);
      toast({
        title: "📋 Copied!",
        description: "Quote ready to share",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <motion.button
      onClick={handleQuickCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "p-2 rounded-full transition-all duration-300 group",
        isCopied 
          ? "bg-green-100 text-green-600 border border-green-200" 
          : "bg-white/70 hover:bg-white text-gray-600 hover:text-orange-600 border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;