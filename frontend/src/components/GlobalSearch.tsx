import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Heart, Sparkles, Music, Quote, Loader2, TrendingUp, ArrowRight } from 'lucide-react';
import { searchService, SearchResult } from '@/services/searchService';
import { useLanguage } from '@/contexts/LanguageContext';

const TYPE_META: Record<SearchResult['type'], {
  icon: React.ElementType;
  label: string;
  labelHi: string;
  path: string;
  color: string;
}> = {
  saints:       { icon: Users,    label: 'Saint',            labelHi: 'संत',          path: '/saints',        color: 'text-orange-600 bg-orange-50' },
  living_saints:{ icon: Heart,    label: 'Contemporary Saint', labelHi: 'समकालीन संत', path: '/living-saints', color: 'text-red-500 bg-red-50' },
  divine_forms: { icon: Sparkles, label: 'Divine Form',      labelHi: 'दिव्य रूप',    path: '/divine',        color: 'text-amber-600 bg-amber-50' },
  bhajans:      { icon: Music,    label: 'Bhajan',           labelHi: 'भजन',          path: '/bhajans',       color: 'text-green-600 bg-green-50' },
  quotes:       { icon: Quote,    label: 'Quote',            labelHi: 'उद्धरण',       path: '/quotes',        color: 'text-purple-600 bg-purple-50' },
};

const POPULAR = ['Meera Bai', 'Kabir Das', 'Hanuman Chalisa', 'Krishna', 'Tulsidas', 'Shiva', 'Ganga Aarti', 'Radha Krishna'];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await searchService.search({ query: q, limit: 20 });
      setResults(res.results);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(val), 300);
  };

  const navigateTo = (result: SearchResult) => {
    navigate(TYPE_META[result.type].path);
    onClose();
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    runSearch(term);
  };

  // Keyboard navigation through results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigateTo(results[activeIndex]);
    }
  };

  if (!isOpen) return null;

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const flatIndexMap: SearchResult[] = results; // for keyboard nav

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          {loading
            ? <Loader2 className="w-5 h-5 text-orange-500 animate-spin flex-shrink-0" />
            : <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={language === 'EN' ? 'Search saints, bhajans, quotes…' : 'संत, भजन, उद्धरण खोजें…'}
            className="flex-1 text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-400 text-xs font-mono">
            esc
          </kbd>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">

          {/* No query — show popular searches */}
          {!query && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                {language === 'EN' ? 'Popular Searches' : 'लोकप्रिय खोजें'}
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(term => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="px-3 py-1.5 rounded-full text-sm bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query too short */}
          {query && query.trim().length < 2 && (
            <div className="py-12 text-center text-sm text-gray-400">
              {language === 'EN' ? 'Type at least 2 characters…' : 'कम से कम 2 अक्षर लिखें…'}
            </div>
          )}

          {/* Loading */}
          {loading && query.trim().length >= 2 && (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
            </div>
          )}

          {/* No results */}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-gray-500 font-medium">
                {language === 'EN' ? `No results for "${query}"` : `"${query}" के लिए कोई परिणाम नहीं`}
              </p>
              <p className="text-sm text-gray-400">
                {language === 'EN' ? 'Try a saint name, bhajan, or quote keyword' : 'संत का नाम, भजन, या उद्धरण खोजें'}
              </p>
            </div>
          )}

          {/* Grouped results */}
          {!loading && Object.entries(grouped).map(([type, items]) => {
            const meta = TYPE_META[type as SearchResult['type']];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <div key={type} className="border-t border-gray-50 first:border-t-0">
                {/* Group header */}
                <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
                    <Icon className="w-3 h-3" />
                    {language === 'EN' ? meta.label : meta.labelHi}
                  </span>
                  <span className="text-xs text-gray-400">{items.length} result{items.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Items */}
                {items.map(result => {
                  const flatIdx = flatIndexMap.indexOf(result);
                  const isActive = flatIdx === activeIndex;
                  const displayTitle = language === 'EN' ? result.title : (result.title_hi || result.title);
                  const displayDesc = language === 'EN' ? result.description : (result.description_hi || result.description);
                  return (
                    <button
                      key={result.id}
                      onClick={() => navigateTo(result)}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group ${
                        isActive ? 'bg-orange-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-orange-700' : 'text-gray-800'}`}>
                          {displayTitle}
                        </p>
                        {displayDesc && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {displayDesc.length > 80 ? displayDesc.slice(0, 80) + '…' : displayDesc}
                          </p>
                        )}
                      </div>
                      <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-all ${isActive ? 'text-orange-500 translate-x-0.5' : 'text-gray-300 group-hover:text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
