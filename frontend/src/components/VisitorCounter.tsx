import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  count: number;
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ count, className = '' }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger visibility for fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (count === 0) return;

    const duration = 2000; // 2 seconds animation
    const steps = 60; // 60 frames for smooth animation
    const increment = count / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), count);
      setDisplayCount(current);

      if (current >= count) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      <div 
        className={`transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Main counter display - perfectly centered card */}
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-300 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
          
          {/* Main card */}
          <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-orange-100/50 min-w-[320px] max-w-md mx-auto">
            {/* Header with icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Counter display - perfectly centered */}
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent leading-tight">
                {formatNumber(displayCount)}
              </div>
              <div className="text-lg text-orange-600/80 font-semibold tracking-wide uppercase">
                Visitors
              </div>
            </div>

            {/* Decorative line */}
            <div className="flex justify-center my-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>

            {/* Subtext - perfectly centered */}
            <div className="text-center">
              <p className="text-gray-600 text-base font-medium leading-relaxed">
                🙏 <span className="text-orange-600 font-bold">{displayCount.toLocaleString()}</span> souls have found
              </p>
              <p className="text-gray-600 text-base font-medium">
                their way to <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-bold">SantVaani</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div 
        className={`flex items-center space-x-3 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Floating dots with different animations */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce delay-200"></div>
        </div>
        
        {/* Om symbol with glow */}
        <div className="text-2xl text-orange-500 animate-pulse mx-4 filter drop-shadow-lg">
          ॐ
        </div>
        
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Subtle blessing text */}
      <div 
        className={`transition-all duration-1000 delay-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-orange-400/60 text-sm font-medium italic text-center">
          "हर आत्मा का स्वागत है" - Every soul is welcome
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;