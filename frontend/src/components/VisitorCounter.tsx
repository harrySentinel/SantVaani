import React, { useState, useEffect, useRef } from 'react';
import { Users, Sparkles, Star } from 'lucide-react';

interface VisitorCounterProps {
  count: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ count = 125847, className = '' }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Particle system
  useEffect(() => {
    // Background particle creation (separate from click particles)
  const createParticleForBackground = (): Particle => ({
    id: Math.random(),
    x: Math.random() * 600,
    y: 600,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.3 + 0.1,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -Math.random() * 1.5 - 0.3,
    life: 0,
    maxLife: Math.random() * 180 + 120,
    color: ['#fb923c', '#f97316', '#ea580c', '#fdba74'][Math.floor(Math.random() * 4)]
  });

  const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * 600,
      y: 600,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 2 - 0.5,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      color: ['#fb923c', '#f97316', '#ea580c', '#fdba74'][Math.floor(Math.random() * 4)]
    });

    const updateParticles = () => {
      setParticles(prev => {
        let newParticles = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX * 0.8,
          y: particle.y + particle.speedY * 0.8,
          life: particle.life + 0.8,
          opacity: particle.opacity * (1 - particle.life / particle.maxLife)
        })).filter(particle => particle.life < particle.maxLife);

        if (Math.random() < 0.05 && newParticles.length < 15) {
          newParticles.push(createParticleForBackground());
        }

        return newParticles;
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    animationRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (count === 0) return;

    const duration = 3000;
    const steps = 100;
    const increment = count / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      current = Math.min(Math.floor(count * easeOut), count);
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

  const handleClick = () => {
    const newParticles = Array.from({ length: 15 }, () => createClickParticle());
    setParticles(prev => [...prev, ...newParticles]);
  };

  const createClickParticle = (): Particle => ({
    id: Math.random(),
    x: 300 + (Math.random() - 0.5) * 200,
    y: 300 + (Math.random() - 0.5) * 150,
    size: Math.random() * 6 + 4,
    opacity: 0.9,
    speedX: (Math.random() - 0.5) * 3,
    speedY: (Math.random() - 0.5) * 4 - 1,
    life: 0,
    maxLife: Math.random() * 140 + 100,
    color: ['#fbbf24', '#f59e0b', '#d97706', '#fb923c', '#ea580c'][Math.floor(Math.random() * 5)]
  });

  return (
    <div className={`relative flex flex-col items-center justify-center space-y-6 py-8 overflow-hidden ${className}`}>
      
    <div className={`flex flex-col items-center justify-center space-y-8 ${className}`}>
      
      <div 
        className={`transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Main counter display - MUCH LARGER */}
        <div className="relative">
          {/* Enhanced glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-300 rounded-3xl blur-xl opacity-25 animate-pulse"></div>
          
                      {/* Main card - Perfect balanced size with enhanced roundness */}
          <div 
            className={`relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-orange-100/60 min-w-[320px] max-w-md mx-auto transition-all duration-500 cursor-pointer overflow-hidden ${isHovering ? 'scale-105 shadow-3xl border-orange-200/80 bg-white/98' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleClick}
          >
            {/* Enhanced hover wave effect */}
            <div className={`absolute inset-0 bg-gradient-to-t from-orange-100/40 via-amber-100/30 to-transparent rounded-3xl transition-all duration-700 ${isHovering ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}></div>
            
            {/* Secondary wave effect */}
            <div className={`absolute inset-0 bg-gradient-to-t from-orange-200/30 via-transparent to-transparent rounded-3xl transition-all duration-500 delay-100 ${isHovering ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}></div>
            
            {/* Shimmer effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-3xl transition-all duration-1000 ${isHovering ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'}`}></div>
            
            {/* Header with perfectly sized icon */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className={`w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 ${isHovering ? 'rotate-12 shadow-xl scale-110' : 'rotate-3'}`}>
                <Users className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-lg" />
                {isHovering && (
                  <div className="absolute -top-1 -right-1 animate-bounce">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Perfectly sized Counter display */}
            <div className="text-center space-y-3 relative z-10">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent leading-tight drop-shadow-sm">
                {formatNumber(displayCount)}
              </div>
              <div className="text-lg sm:text-xl text-orange-600/80 font-semibold tracking-wide uppercase">
                Visitors
              </div>
            </div>

            {/* Decorative line */}
            <div className="flex justify-center my-5">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"></div>
            </div>

            {/* Subtext - perfectly sized */}
            <div className="text-center relative z-10 space-y-1">
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

      {/* Enhanced decorative elements - LARGER */}
      <div 
        className={`flex items-center space-x-6 sm:space-x-8 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Floating dots with different animations - BIGGER */}
        <div className="flex space-x-3 sm:space-x-4">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce delay-200"></div>
        </div>
        
        {/* Om symbol with glow - LARGER */}
        <div className="text-3xl sm:text-4xl lg:text-5xl text-orange-500 animate-pulse mx-6 sm:mx-8 filter drop-shadow-lg">
          ॐ
        </div>
        
        <div className="flex space-x-3 sm:space-x-4">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Blessing text - LARGER */}
      <div 
        className={`transition-all duration-1000 delay-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-orange-400/60 text-base sm:text-lg lg:text-xl font-medium italic text-center">
          "हर आत्मा का स्वागत है" - Every soul is welcome
        </p>
      </div>

      {/* Enhanced particle effects */}
      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                transform: `scale(${1 + particle.life / particle.maxLife * 0.5})`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`
              }}
            />
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default VisitorCounter;