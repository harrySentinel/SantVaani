import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Lightbulb, Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SpiritualFact {
  id: string;
  text: string;
  text_hi?: string;
  category: string;
  icon: string;
  source?: string;
}

const SpiritualFactBox = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [facts, setFacts] = useState<SpiritualFact[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch facts from database
  const fetchFacts = async () => {
    try {
      const { data, error } = await supabase
        .from('spiritual_facts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching facts:', error);
        // Fallback to mock data if database fails
        setFacts([
          {
            id: '1',
            text: "In the Ramayana, Hanuman's heart contains an image of Rama and Sita, discovered when his chest was opened by the gods to verify his devotion.",
            category: "Ramayana",
            icon: "🏹"
          },
          {
            id: '2', 
            text: "The Mahabharata mentions that Krishna lifted Govardhan hill for 7 days straight, protecting the villagers from Indra's torrential rains.",
            category: "Mahabharata",
            icon: "⚔️"
          },
          {
            id: '3',
            text: "Lord Ganesha wrote the entire Mahabharata as Sage Vyasa dictated it, breaking his tusk to use as a pen when his original one broke.",
            category: "Hindu Deities",
            icon: "🕉️"
          }
        ]);
      } else {
        setFacts(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch facts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load facts on component mount
  useEffect(() => {
    fetchFacts();
  }, []);

  // Simple fact rotation with fixed interval
  useEffect(() => {
    if (facts.length === 0) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
        setIsAnimating(false);
      }, 500);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, [facts.length]);

  // Show loading state if no facts loaded yet
  if (loading || facts.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-4 shadow-xl animate-pulse mx-auto w-fit mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <p className="text-orange-600 font-medium">Loading spiritual wisdom...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentFact = facts[currentFactIndex];

  return (
    <div className="w-full px-4 md:px-8 lg:px-16">
      <div className="relative overflow-hidden">
        
        {/* Background Pattern - matches your theme */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className={`relative bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 rounded-3xl p-8 md:p-12 lg:p-16 border border-orange-300 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-700 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 rounded-3xl opacity-25 blur-sm"></div>
          <div className="relative bg-gradient-to-br from-white/80 via-orange-50 to-white/80 rounded-2xl p-8 md:p-10 lg:p-12 backdrop-blur-lg border border-orange-200">
            
            {/* Header with enhanced design */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-4 shadow-xl animate-bounce">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-2">
                Did You Know?
              </h3>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-3xl animate-pulse">{currentFact.icon}</span>
                <span className="text-orange-600 font-semibold text-lg">{currentFact.category}</span>
                <span className="text-3xl animate-pulse">{currentFact.icon}</span>
              </div>
              
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto"></div>
            </div>

            {/* Fact Content with enhanced styling */}
            <div className="mb-8">
              <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg border border-orange-200 max-w-5xl mx-auto ring-1 ring-orange-300/60">
                  <p className="text-gray-900 text-lg md:text-xl leading-relaxed font-semibold text-center max-w-4xl mx-auto tracking-wide">
                    {currentFact.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple bottom section */}
            <div className="flex items-center justify-center pt-6 border-t border-white/30">
              <div className="flex space-x-3">
                {facts.slice(0, Math.min(5, facts.length)).map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-700 ease-out ${
                      index === currentFactIndex % facts.length
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 w-10 h-3 shadow-md' 
                        : 'bg-orange-200/60 w-3 h-3 hover:bg-orange-300/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute top-6 right-6 opacity-20">
              <Sparkles className="w-16 h-16 text-orange-500 animate-pulse" />
            </div>
            <div className="absolute bottom-6 left-6 opacity-20">
              <Sparkles className="w-12 h-12 text-orange-400 animate-pulse delay-500" />
            </div>
            <div className="absolute top-1/2 left-6 opacity-10">
              <Sparkles className="w-8 h-8 text-orange-600 animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualFactBox;