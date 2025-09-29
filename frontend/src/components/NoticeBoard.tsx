import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NoticeData {
  id: string;
  title: string;
  message: string;
  messageHi?: string; // Hindi message option
  type: 'festival' | 'announcement' | 'greeting' | 'update';
  saintImage?: string; // Selected saint image
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

const NoticeBoard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<NoticeData | null>(null);

  // Fetch active notice from API
  useEffect(() => {
    const fetchActiveNotice = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/notice/active`);
        const data = await response.json();

        if (data.success && data.notice) {
          const notice: NoticeData = {
            id: data.notice.id,
            title: data.notice.title,
            message: data.notice.message,
            messageHi: data.notice.message_hi,
            type: data.notice.type,
            saintImage: data.notice.saint_image || 'Saint.png',
            isActive: data.notice.is_active,
            createdAt: data.notice.created_at,
            expiresAt: data.notice.expires_at
          };

          setCurrentNotice(notice);
          // Show notification after 2 seconds of page load
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, 2000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error fetching active notice:', error);
        // Silently fail - no notice will be shown if API is unavailable
      }
    };

    fetchActiveNotice();
  }, []);

  // Auto-dismiss small notification after 3 seconds
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, isExpanded]);

  // Auto-dismiss after expansion
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleDismiss = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return 'bg-orange-500';
      case 'announcement': return 'bg-orange-600';
      case 'greeting': return 'bg-orange-500';
      case 'update': return 'bg-orange-600';
      default: return 'bg-orange-500';
    }
  };

  const getTypeIcon = (type: string) => {
    return '📢';
  };

  if (!currentNotice || !isVisible) {
    return null;
  }

  return (
    <div>
      {/* Drop-down notification (collapsed state) */}
      {!isExpanded && (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center">
          <div
            onClick={handleExpand}
            className={`
              transform transition-all duration-1000 ease-in-out cursor-pointer mt-32 sm:mt-28 animate-float
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
            `}
          >
            <div className={`
              ${getTypeColor(currentNotice.type)}
              rounded-2xl p-4 shadow-2xl hover:shadow-3xl
              flex items-center space-x-3 max-w-sm mx-4
              border-2 border-white/30 backdrop-blur-sm
              hover:scale-105 transition-transform duration-300
              animate-pulse-gentle relative overflow-hidden
            `}>
              {/* Enhanced floating particles background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-8 w-1 h-1 bg-white/40 rounded-full animate-ping delay-100"></div>
                <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-yellow-300/60 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-4 left-16 w-1 h-1 bg-white/50 rounded-full animate-ping delay-500"></div>
                <div className="absolute top-3 right-6 w-0.5 h-0.5 bg-orange-200/70 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-2 right-8 w-1 h-1 bg-amber-300/50 rounded-full animate-ping delay-1000"></div>
                <div className="absolute top-5 left-4 w-0.5 h-0.5 bg-yellow-400/60 rounded-full animate-pulse delay-1200"></div>
                <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-orange-300/40 rounded-full animate-bounce-gentle delay-800"></div>
              </div>

              {/* Enhanced decorative pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                <div className="absolute -top-2 -left-2 w-8 h-8 border border-white/20 rounded-full animate-spin-slow"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border border-white/15 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1 w-4 h-4 border-2 border-white/15 rounded-full transform -translate-y-1/2 animate-bounce-gentle"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-gradient-to-r from-white/20 to-orange-200/20 rounded-full transform -translate-x-1/2 animate-ping delay-300"></div>
              </div>

              {/* Drop shadow effect */}
              <div className="absolute inset-0 bg-black/10 rounded-2xl blur-sm transform translate-y-1"></div>

              <div className="relative flex items-center space-x-3 w-full z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-xl">{getTypeIcon(currentNotice.type)}</span>
                  {/* Enhanced icon glow effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-orange-200/10 rounded-full blur-md animate-pulse delay-300"></div>
                  {/* Rotating ring */}
                  <div className="absolute -inset-2 border border-white/10 rounded-full animate-spin-slow"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {currentNotice.title}
                  </p>
                  <p className="text-white/90 text-xs">
                    Tap to see message from saint
                  </p>
                </div>
                <div className="flex-shrink-0 relative">
                  <Sparkles className="w-5 h-5 text-white/80 animate-pulse" />
                  {/* Additional sparkle effects */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Enhanced charging-style indicator with more decoration */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-1 bg-white/40 rounded-full relative overflow-hidden">
                  <div className="w-full h-full bg-white/80 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                </div>
                {/* Side dots */}
                <div className="absolute -left-2 top-1/2 w-1 h-1 bg-white/50 rounded-full transform -translate-y-1/2 animate-pulse delay-200"></div>
                <div className="absolute -right-2 top-1/2 w-1 h-1 bg-white/50 rounded-full transform -translate-y-1/2 animate-pulse delay-400"></div>
              </div>

              {/* Enhanced corner decorations */}
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg animate-pulse delay-100"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg animate-pulse delay-300"></div>
              <div className="absolute top-1 left-1 w-2 h-2 border border-white/20 rounded-full animate-ping delay-600"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border border-white/20 rounded-full animate-ping delay-900"></div>
            </div>
          </div>
        </div>
      )}

      {/* Centered Modal - Saint Speaking */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-40 sm:pt-44 md:pt-4 md:items-center">
          {/* Enhanced Backdrop */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black/40 to-amber-900/20 backdrop-blur-md transition-all duration-500
              ${isExpanded ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={handleDismiss}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 w-2 h-2 bg-orange-300/20 rounded-full animate-ping"></div>
              <div className="absolute top-40 right-32 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-orange-400/25 rounded-full animate-ping delay-500"></div>
              <div className="absolute bottom-60 right-20 w-1 h-1 bg-yellow-300/20 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-60 left-60 w-1 h-1 bg-orange-200/30 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>

          {/* Modal Content */}
          <div className={`
            relative transform transition-all duration-700 ease-out
            ${isExpanded ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          `}>
            <Card className="w-full max-w-md md:max-w-lg mx-auto shadow-2xl border-0 overflow-hidden bg-orange-50 relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-orange-100/30 pointer-events-none"></div>

              {/* Elegant border glow */}
              <div className="absolute inset-0 rounded-2xl border border-orange-200/50 shadow-inner"></div>

              {/* Simplified Header */}
              <div className={`${getTypeColor(currentNotice.type)} px-6 py-4 relative`}>
                {/* Soft shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-50"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">{getTypeIcon(currentNotice.type)}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg md:text-xl">
                        {currentNotice.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        A message from SantVaani
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-white/80 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Saint Character & Speech Bubble */}
              <CardContent className="p-0 bg-transparent relative">
                {/* Clean background with subtle pattern */}
                <div className="absolute inset-0 bg-orange-50/80"></div>

                {/* Subtle floating elements */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute top-16 right-8 w-1 h-1 bg-orange-300 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-24 left-8 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-500"></div>
                </div>

                {/* Saint Character */}
                <div className="relative flex justify-center pt-8 pb-6">
                  <div className="relative">
                    {/* Enhanced soft glow behind saint */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 via-orange-100/10 to-transparent rounded-full scale-125 blur-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200/15 via-yellow-100/8 to-transparent rounded-full scale-150 blur-2xl animate-pulse"></div>

                    <img
                      src={`/${currentNotice.saintImage || 'Saint.png'}`}
                      alt="Saint Character"
                      className="w-56 h-56 md:w-64 md:h-64 object-contain relative z-10 filter drop-shadow-lg"
                    />

                    {/* Enhanced floating decorations with more elements */}
                    <div className="absolute -top-2 -right-2 animate-pulse">
                      <Heart className="w-5 h-5 text-red-400 fill-current opacity-70" />
                    </div>
                    <div className="absolute -top-3 -left-2 animate-pulse delay-700">
                      <Sparkles className="w-5 h-5 text-yellow-400 fill-current opacity-70" />
                    </div>
                    <div className="absolute -bottom-1 -left-3 animate-pulse delay-1000">
                      <Heart className="w-4 h-4 text-pink-400 fill-current opacity-60" />
                    </div>
                    <div className="absolute -bottom-2 -right-1 animate-pulse delay-1300">
                      <Sparkles className="w-4 h-4 text-orange-400 fill-current opacity-60" />
                    </div>

                    {/* Additional decorative elements */}
                    <div className="absolute top-4 -right-4 animate-bounce-gentle delay-500">
                      <div className="w-3 h-3 bg-gradient-to-br from-orange-300/40 to-yellow-300/40 rounded-full"></div>
                    </div>
                    <div className="absolute top-8 -left-4 animate-bounce-gentle delay-800">
                      <div className="w-2 h-2 bg-gradient-to-br from-pink-300/40 to-red-300/40 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-6 -right-3 animate-pulse delay-1500">
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-300/50 to-orange-300/50 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-4 -left-5 animate-pulse delay-1800">
                      <div className="w-2 h-2 bg-gradient-to-br from-yellow-300/40 to-orange-300/40 rounded-full"></div>
                    </div>

                    {/* Orbiting particles */}
                    <div className="absolute inset-0 animate-spin-slow">
                      <div className="absolute top-0 left-1/2 w-1 h-1 bg-orange-300/30 rounded-full transform -translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-300/30 rounded-full transform -translate-x-1/2"></div>
                      <div className="absolute left-0 top-1/2 w-1 h-1 bg-amber-300/30 rounded-full transform -translate-y-1/2"></div>
                      <div className="absolute right-0 top-1/2 w-1 h-1 bg-orange-300/30 rounded-full transform -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Speech Bubble */}
                <div className="px-6 pb-8">
                  <div className="relative bg-white/90 rounded-2xl p-6 shadow-lg border border-orange-100">
                    {/* Enhanced speech bubble arrow */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-white/90 border-l border-t border-orange-100 transform rotate-45"></div>
                    </div>

                    {/* Subtle decorative border glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-100/20 via-transparent to-orange-100/20 pointer-events-none"></div>

                    {/* Corner decorative elements */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-orange-200/30 rounded-full animate-pulse delay-200"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-200/30 rounded-full animate-pulse delay-500"></div>
                    <div className="absolute top-3 left-3 w-1 h-1 bg-yellow-300/40 rounded-full animate-ping delay-300"></div>
                    <div className="absolute bottom-3 right-3 w-1 h-1 bg-orange-300/40 rounded-full animate-ping delay-700"></div>

                    {/* Message */}
                    <div className="relative">
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg font-medium text-center">
                        "{currentNotice.messageHi || currentNotice.message}"
                      </p>

                      {/* Enhanced Footer */}
                      <div className="flex justify-center items-center pt-6 mt-4 border-t border-orange-100/50 relative">
                        {/* Side decorative elements */}
                        <div className="absolute left-0 top-1/2 w-8 h-px bg-gradient-to-r from-orange-200/50 to-transparent transform -translate-y-1/2"></div>
                        <div className="absolute right-0 top-1/2 w-8 h-px bg-gradient-to-l from-orange-200/50 to-transparent transform -translate-y-1/2"></div>

                        <span className="text-sm font-medium text-orange-500/70 relative">
                          🌸 SantVaani 🌸
                          {/* Small sparkles around text */}
                          <div className="absolute -top-1 -left-2 w-1 h-1 bg-orange-300/40 rounded-full animate-ping delay-100"></div>
                          <div className="absolute -top-1 -right-2 w-1 h-1 bg-amber-300/40 rounded-full animate-ping delay-400"></div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NoticeBoard;