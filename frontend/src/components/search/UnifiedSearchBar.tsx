import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSearch, useSearchHistory } from '@/hooks/useSearch';
import { SearchResult } from '@/services/searchService';
import { cn } from '@/lib/utils';

// ===============================================
// INTERFACES
// ===============================================

interface UnifiedSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  showHistory?: boolean;
  compact?: boolean;
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function UnifiedSearchBar({
  placeholder = "खोजें: संत, भजन, दिव्य रूप...",
  className,
  onSearch,
  onResultSelect,
  autoFocus = false,
  showSuggestions = true,
  showHistory = true,
  compact = false
}: UnifiedSearchBarProps) {
  // State
  const [localQuery, setLocalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { 
    search, 
    suggestions, 
    popularSearches, 
    isLoading,
    query: currentQuery 
  } = useSearch({ autoSearch: false });
  
  const { 
    history, 
    addToHistory, 
    removeFromHistory, 
    clearHistory 
  } = useSearchHistory();

  // Effects
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setShowDropdown(value.length >= 2 || isFocused);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicks on suggestions
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleSearch = (searchQuery: string = localQuery) => {
    if (!searchQuery.trim()) return;

    // Add to search history
    addToHistory(searchQuery.trim());
    
    // Perform search
    search(searchQuery.trim());
    
    // Call external onSearch callback
    onSearch?.(searchQuery.trim());
    
    // Hide dropdown
    setShowDropdown(false);
    
    // Update local query
    setLocalQuery(searchQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClearInput = () => {
    setLocalQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleHistoryItemRemove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(item);
  };

  // Show suggestions or history based on input
  const showHistorySection = showHistory && history.length > 0 && localQuery.length === 0;
  const showSuggestionsSection = showSuggestions && suggestions.length > 0 && localQuery.length >= 2;
  const showPopularSection = popularSearches.length > 0 && localQuery.length === 0 && !showHistorySection;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center",
        compact ? "h-10" : "h-12"
      )}>
        <div className="absolute left-3 z-10">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 border-2 border-orange-200 focus:border-orange-400 rounded-full",
            "text-gray-700 placeholder-gray-400",
            "transition-all duration-200",
            isFocused && "shadow-lg ring-2 ring-orange-100",
            compact ? "h-10 text-sm" : "h-12"
          )}
        />
        
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearInput}
            className="absolute right-2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && (showHistorySection || showSuggestionsSection || showPopularSection) && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 shadow-xl border-0 bg-white/95 backdrop-blur-sm"
        >
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {/* Search History */}
            {showHistorySection && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 h-6 px-2"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer group"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleHistoryItemRemove(item, e)}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-gray-200"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestionsSection && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.slice(0, 6).map((suggestion, index) => (
                    <div
                      key={`${suggestion}-${index}`}
                      className="p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {showPopularSection && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 8).map((popular, index) => (
                    <Badge
                      key={`${popular}-${index}`}
                      variant="secondary"
                      className="cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                      onClick={() => handleSuggestionClick(popular)}
                    >
                      {popular}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}