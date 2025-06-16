'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Users, Heart, Sparkles, Book, Info, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'HI' : 'EN');
  };

  const menuItems = [
    { to: '/', label: 'Home', labelHi: 'होम', icon: Home },
    { to: '/saints', label: 'Saints', labelHi: 'संत', icon: Users },
    { to: '/living-saints', label: 'Living Saints', labelHi: 'जीवित संत', icon: Heart },
    { to: '/divine', label: 'Divine Forms', labelHi: 'दिव्य रूप', icon: Sparkles },
    { to: '/bhajans', label: 'Bhajans & Quotes', labelHi: 'भजन और उद्धरण', icon: Book },
    { to: '/donation', label: 'Donation', labelHi: 'दान', icon: IndianRupee },
    { to: '/about', label: 'About', labelHi: 'हमारे बारे में', icon: Info },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">ॐ</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {language === 'EN' ? 'SantVaani' : 'संतवाणी'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {language === 'EN' ? item.label : item.labelHi}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              {language}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                size="sm"
                className="text-gray-700"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-orange-100 mt-2">
            <div className="flex flex-col space-y-2 pt-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">
                      {language === 'EN' ? item.label : item.labelHi}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}