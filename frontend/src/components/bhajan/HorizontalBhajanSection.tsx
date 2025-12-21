import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompactBhajanCard from './CompactBhajanCard';

interface Bhajan {
  id: string;
  title: string;
  title_hi: string;
  category: string;
  lyrics: string;
  lyrics_hi: string;
  meaning: string;
  author: string;
  youtube_url?: string;
}

interface HorizontalBhajanSectionProps {
  title: string;
  icon?: React.ReactNode;
  bhajans: any[];
  onBhajanClick: (bhajan: Bhajan) => void;
  bgClass?: string;
}

const HorizontalBhajanSection: React.FC<HorizontalBhajanSectionProps> = ({
  title,
  icon,
  bhajans,
  onBhajanClick,
  bgClass = 'bg-gradient-to-r from-orange-50 to-yellow-50'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (bhajans.length === 0) return null;

  return (
    <section className={`py-8 ${bgClass}`}>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {title}
            </h2>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex space-x-4 min-w-min">
            {bhajans.map((item, index) => {
              // Handle both direct bhajan objects and nested structures
              const bhajan = item.bhajans || item;
              return (
                <div key={bhajan.id} className="flex-none w-[200px] sm:w-[220px] md:w-[240px]">
                  <CompactBhajanCard
                    bhajan={bhajan}
                    onClick={() => onBhajanClick(bhajan)}
                    playlist={bhajans.map(b => b.bhajans || b)}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="md:hidden text-center mt-2">
          <p className="text-xs text-gray-500">
            Swipe to see more →
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HorizontalBhajanSection;
