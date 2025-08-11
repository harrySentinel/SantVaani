
'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Heart, Shield, Users, Unlock } from 'lucide-react';

export default function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0);

  const spiritualQuotes = [
    {
      text: "The guru's grace illuminates the path to divine truth",
      textHi: "गुरु की कृपा दिव्य सत्य का मार्ग प्रकाशित करती है",
      author: "- Ancient Wisdom"
    },
    {
      text: "In devotion, the soul finds its eternal home",
      textHi: "भक्ति में आत्मा को अपना शाश्वत घर मिलता है",
      author: "- Spiritual Teaching"
    },
    {
      text: "Love is the bridge between the seeker and the divine",
      textHi: "प्रेम साधक और परमात्मा के बीच का सेतु है",
      author: "- Sacred Text"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % spiritualQuotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [spiritualQuotes.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
              <span className="text-5xl">ॐ</span>
              <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent leading-tight">
              SantVaani
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              संतवाणी
            </p>
          </div>

          {/* Tagline */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 font-semibold leading-relaxed">
              Where Ancient Wisdom Meets
              <span className="text-orange-600"> Modern Hearts</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Discover the profound teachings, inspiring stories, and divine bhakti of India's greatest saints. 
              A digital sanctuary for spiritual seekers on their journey to enlightenment.
            </p>
          </div>


          {/* Rotating Quotes */}
          <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="space-y-3 min-h-[100px] flex flex-col justify-center">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "{spiritualQuotes[currentQuote].text}"
              </p>
              <p className="text-sm text-orange-600 font-medium">
                {spiritualQuotes[currentQuote].author}
              </p>
            </div>
            
            {/* Quote indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {spiritualQuotes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote ? 'bg-orange-500' : 'bg-orange-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/saints">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                Explore Saints
              </Button>
            </Link>
            
            <Link to="/divine">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Divine Forms
              </Button>
            </Link>
          </div>

          {/* Simple Free Access Message */}
          <div className="max-w-3xl mx-auto pt-6">
            <p className="text-center text-gray-600 font-medium">
              🙏 <em>Completely free • No registration required • Pure spiritual content</em> 🙏
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <ArrowDown className="w-6 h-6 text-orange-500 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
