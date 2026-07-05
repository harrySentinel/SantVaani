import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Heart, Sparkles, Book, Info, IndianRupee, Star, ChevronDown, ChevronRight, CalendarDays, LogIn, UserPlus, User, LogOut, BookOpen, BookMarked, Quote, Share2, Settings, Search } from 'lucide-react';
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
import GlobalSearch from '@/components/GlobalSearch';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryItems = [
    { to: '/horoscope', label: 'Horoscope', labelHi: 'राशिफल', icon: Star },
    { to: '/events', label: 'Events', labelHi: 'कार्यक्रम', icon: CalendarDays },
    { to: '/saints', label: 'Saints', labelHi: 'संत', icon: Users },
    { to: '/santvaani-space', label: 'Space', labelHi: 'स्पेस', icon: Share2 },
    { to: '/blog', label: 'Blog', labelHi: 'ब्लॉग', icon: BookOpen },
    { to: '/prabhu-ki-leelaayen', label: 'Divine Stories', labelHi: 'दिव्य कथाएं', icon: BookMarked },
  ];

  const secondaryItems = [
    { to: '/living-saints', label: 'Contemporary Saints', labelHi: 'समकालीन संत', icon: Heart },
    { to: '/divine', label: 'Divine Forms', labelHi: 'दिव्य रूप', icon: Sparkles },
    { to: '/bhajans', label: 'Bhajans', labelHi: 'भजन', icon: Book },
    { to: '/quotes', label: 'Quotes', labelHi: 'उद्धरण', icon: Quote },
    { to: '/donation', label: 'Donation', labelHi: 'दान', icon: IndianRupee },
    { to: '/about', label: 'About', labelHi: 'हमारे बारे में', icon: Info },
  ];

  const allMenuItems = [...primaryItems, ...secondaryItems];

  const navLinkClass = (path: string) =>
    `flex items-center space-x-1 transition-colors duration-200 px-3 py-2 rounded-lg text-sm font-medium ${
      isActive(path)
        ? 'text-orange-600 bg-orange-50 font-semibold'
        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
    }`;

  const mobileNavLinkClass = (path: string) =>
    `flex items-center space-x-2 transition-colors duration-200 px-3 py-2 rounded-lg font-medium ${
      isActive(path)
        ? 'text-orange-600 bg-orange-50 font-semibold'
        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
    }`;

  return (
    <>
    <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">ॐ</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {language === 'EN' ? 'Santvaani' : 'संतवाणी'}
            </span>
          </Link>

          {/* Desktop search pill */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 text-gray-400 hover:text-orange-500 text-sm transition-all duration-200 group"
          >
            <Search className="w-4 h-4" />
            <span className="text-gray-400 group-hover:text-orange-400">
              {language === 'EN' ? 'Search…' : 'खोजें…'}
            </span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-gray-200 text-xs font-mono text-gray-400 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className={navLinkClass(item.to)}>
                  <Icon className="w-4 h-4" />
                  <span>{language === 'EN' ? item.label : item.labelHi}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  secondaryItems.some((i) => isActive(i.to))
                    ? 'text-orange-600 bg-orange-50 font-semibold'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <span>{language === 'EN' ? 'More' : 'और'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-orange-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMoreOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-150 ${
                          isActive(item.to)
                            ? 'text-orange-600 bg-orange-50 font-semibold'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{language === 'EN' ? item.label : item.labelHi}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auth */}
            <div className="flex items-center space-x-2 ml-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                        {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-sm font-medium text-gray-700">
                        {user.user_metadata?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs text-gray-500 font-normal truncate">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile-settings" className="flex items-center cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
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
                      className="text-red-600 focus:text-red-600 cursor-pointer"
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
                  <Button asChild size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
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
            {/* Mobile search icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-semibold"
            >
              {language === 'EN' ? 'हिं' : 'EN'}
            </Button>

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

      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>

      {/* Full-screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />

        {/* Panel — slides in from right */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-orange-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-12 pb-6">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ॐ</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                {language === 'EN' ? 'Santvaani' : 'संतवाणी'}
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {allMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors duration-150 ${
                    active
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'bg-white text-gray-800 hover:bg-orange-100 border border-gray-100'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-white/20' : 'bg-orange-50 border border-orange-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="flex-1 font-medium text-[15px]">
                    {language === 'EN' ? item.label : item.labelHi}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${active ? 'text-white/70' : 'text-gray-300'}`} />
                </Link>
              );
            })}

            {/* Auth section */}
            <div className="pt-2 border-t border-orange-100 mt-2 space-y-2">
              {loading ? (
                <div className="h-14 bg-white rounded-2xl animate-pulse border border-gray-100" />
              ) : user ? (
                <>
                  {/* User card */}
                  <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.user_metadata?.name || 'Account'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 bg-white border border-gray-100 text-gray-800 hover:bg-orange-50 px-4 py-3.5 rounded-2xl transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="flex-1 font-medium text-[15px]">Dashboard</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                  <Link
                    to="/profile-settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 bg-white border border-gray-100 text-gray-800 hover:bg-orange-50 px-4 py-3.5 rounded-2xl transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <Settings className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="flex-1 font-medium text-[15px]">Profile Settings</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        setIsOpen(false);
                        await signOut();
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    className="flex items-center gap-4 bg-white border border-red-100 text-red-600 hover:bg-red-50 px-4 py-3.5 rounded-2xl transition-colors w-full text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="flex-1 font-medium text-[15px]">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 bg-white border border-gray-100 text-gray-800 hover:bg-orange-50 px-4 py-3.5 rounded-2xl transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <LogIn className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="flex-1 font-medium text-[15px]">Login</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 bg-orange-500 text-white hover:bg-orange-600 px-4 py-3.5 rounded-2xl transition-colors shadow-md shadow-orange-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <span className="flex-1 font-medium text-[15px]">Sign Up</span>
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Footer tagline */}
          <div className="px-5 py-5 text-center border-t border-orange-100">
            <p className="text-xs font-semibold text-orange-400 tracking-widest uppercase">
              {language === 'EN' ? 'Peace · Wisdom · Devotion' : 'शांति · ज्ञान · भक्ति'}
            </p>
          </div>
        </div>
      </div>

    </>
  );
}
