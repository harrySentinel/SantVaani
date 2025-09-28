import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NoticeData {
  id: string;
  title: string;
  message: string;
  messageHi?: string; // Hindi message option
  type: 'festival' | 'announcement' | 'greeting' | 'update';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

const NoticeBoard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<NoticeData | null>(null);

  // Sample notice data (later will come from API)
  const sampleNotices: NoticeData[] = [
    {
      id: '1',
      title: 'Navratri Wishes 🌸',
      message: 'Heartfelt Navratri wishes to all! May Mata Rani fill your lives with joy and blessings. In these 9 sacred days, let us strengthen our spiritual journey together. Jai Mata Di! 🙏',
      messageHi: 'नवरात्रि की हार्दिक शुभकामनाएं! माता रानी आप सभी को खुशियों से भर दें। इन 9 पवित्र दिनों में अपनी आध्यात्मिक यात्रा को और भी मजबूत बनाएं। जय माता दी! 🙏',
      type: 'festival',
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Check for active notices
  useEffect(() => {
    const activeNotice = sampleNotices.find(notice =>
      notice.isActive &&
      (!notice.expiresAt || new Date(notice.expiresAt) > new Date())
    );

    if (activeNotice) {
      setCurrentNotice(activeNotice);
      // Show notification after 2 seconds of page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

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
      case 'festival': return 'from-orange-400 to-amber-500';
      case 'announcement': return 'from-blue-400 to-indigo-500';
      case 'greeting': return 'from-green-400 to-emerald-500';
      case 'update': return 'from-purple-400 to-violet-500';
      default: return 'from-orange-400 to-amber-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'festival': return '🎉';
      case 'announcement': return '📢';
      case 'greeting': return '🙏';
      case 'update': return '✨';
      default: return '🔔';
    }
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
              transform transition-all duration-1000 ease-in-out cursor-pointer mt-32 sm:mt-28
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
            `}
          >
            <div className={`
              bg-gradient-to-r ${getTypeColor(currentNotice.type)}
              rounded-2xl p-4 shadow-2xl hover:shadow-3xl
              flex items-center space-x-3 max-w-sm mx-4
              border-2 border-white/30 backdrop-blur-sm
              hover:scale-105 transition-transform duration-300
              animate-pulse-gentle relative
            `}>
              {/* Drop shadow effect */}
              <div className="absolute inset-0 bg-black/10 rounded-2xl blur-sm transform translate-y-1"></div>

              <div className="relative flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{getTypeIcon(currentNotice.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {currentNotice.title}
                  </p>
                  <p className="text-white/90 text-xs">
                    Tap to see message from saint
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white/80 animate-pulse" />
                </div>
              </div>

              {/* Charging-style indicator */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-1 bg-white/40 rounded-full">
                  <div className="w-full h-full bg-white/80 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Centered Modal - Saint Speaking */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-40 sm:pt-44 md:pt-4 md:items-center">
          {/* Backdrop */}
          <div
            className={`
              absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500
              ${isExpanded ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={handleDismiss}
          />

          {/* Modal Content */}
          <div className={`
            relative transform transition-all duration-700 ease-out
            ${isExpanded ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          `}>
            <Card className="w-full max-w-md md:max-w-lg mx-auto shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
              {/* Header */}
              <div className={`bg-gradient-to-r ${getTypeColor(currentNotice.type)} px-4 md:px-6 py-3 md:py-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
                </div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">{getTypeIcon(currentNotice.type)}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base md:text-lg">
                        {currentNotice.title}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm">
                        A message from SantVaani
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Saint Character & Speech Bubble */}
              <CardContent className="p-0 bg-gradient-to-br from-orange-50 to-amber-50 relative">
                {/* Saint Character */}
                <div className="flex justify-center pt-6 md:pt-8 pb-4">
                  <div className="relative">
                    <img
                      src="/Saint.png"
                      alt="Saint Character"
                      className="w-40 h-40 md:w-48 md:h-48 object-contain animate-bounce-gentle filter drop-shadow-lg"
                    />
                    {/* Floating hearts animation */}
                    <div className="absolute -top-2 -right-2 animate-pulse">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                    </div>
                    <div className="absolute -top-4 -left-1 animate-pulse delay-500">
                      <Sparkles className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="px-4 md:px-6 pb-6 md:pb-8">
                  <div className="relative bg-gradient-to-br from-white to-orange-50/30 rounded-3xl p-4 md:p-6 shadow-xl border-2 border-orange-200/50 backdrop-blur-sm">
                    {/* Speech bubble arrow */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-gradient-to-br from-white to-orange-50/30 border-l-2 border-t-2 border-orange-200/50 transform rotate-45 shadow-lg"></div>
                    </div>


                    {/* Message */}
                    <div className="relative">
                      <p className="text-gray-800 leading-relaxed text-sm md:text-base font-medium text-center italic">
                        "{currentNotice.messageHi || currentNotice.message}"
                      </p>

                      {/* Simple Footer */}
                      <div className="flex justify-end pt-4 mt-4">
                        <span className="text-xs text-orange-400/60">
                          ✨ Auto-closing soon...
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

      <style jsx>{`
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default NoticeBoard;