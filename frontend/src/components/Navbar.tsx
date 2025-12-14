'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Users, Heart, Sparkles, Book, Info, IndianRupee, Calendar, Star, ChevronDown, CalendarDays, LogIn, UserPlus, User, LogOut, BookOpen, BookMarked, Quote, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Primary navigation items (most important)
  const primaryItems = [
    // { to: '/daily-guide', label: 'Daily Guide', labelHi: 'दैनिक मार्गदर्शन', icon: Calendar }, // Hidden - Under development
    { to: '/horoscope', label: 'Horoscope', labelHi: 'राशिफल', icon: Star },
    { to: '/events', label: 'Events', labelHi: 'कार्यक्रम', icon: CalendarDays },
    { to: '/saints', label: 'Saints', labelHi: 'संत', icon: Users },
    { to: '/santvaani-space', label: 'Space', labelHi: 'स्पेस', icon: Share2 },
    { to: '/blog', label: 'Blog', labelHi: 'ब्लॉग', icon: BookOpen },
    { to: '/prabhu-ki-leelaayen', label: 'Divine Stories', labelHi: 'दिव्य कथाएं', icon: BookMarked },
  ];

  // Secondary navigation items (in dropdown/mobile menu)
  const secondaryItems = [
    { to: '/living-saints', label: 'Contemporary Saints', labelHi: 'समकालीन संत', icon: Heart },
    { to: '/divine', label: 'Divine Forms', labelHi: 'दिव्य रूप', icon: Sparkles },
    { to: '/bhajans', label: 'Bhajans', labelHi: 'भजन', icon: Book },
    { to: '/quotes', label: 'Quotes', labelHi: 'उद्धरण', icon: Quote },
    { to: '/donation', label: 'Donation', labelHi: 'दान', icon: IndianRupee },
    { to: '/about', label: 'About', labelHi: 'हमारे बारे में', icon: Info },
  ];

  const allMenuItems = [...primaryItems, ...secondaryItems];

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
              {language === 'EN' ? 'Santvaani' : 'संतवाणी'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {primaryItems.map((item) => {
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

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <span className="text-sm font-medium">
                  {language === 'EN' ? 'More' : 'और'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-orange-100 py-2 z-50">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 px-4 py-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {language === 'EN' ? item.label : item.labelHi}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden md:inline">{user.user_metadata?.name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await signOut();
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login" className="flex items-center space-x-1">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    <Link to="/signup" className="flex items-center space-x-1">
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
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
            <div className="lg:hidden">
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
          <div className="lg:hidden pb-4 border-t border-orange-100 mt-2">
            <div className="flex flex-col space-y-2 pt-4">
              {allMenuItems.map((item) => {
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

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-orange-100 mt-4">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-3"></div>
                ) : user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await signOut();
                          setIsOpen(false);
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="font-medium">Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50 border border-orange-200"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}