import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Quote, Heart, Loader2, Search, Sparkles } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabaseClient';
import { usePagination } from '@/hooks/usePagination';
import BhajanPagination from '@/components/BhajanPagination';
import { QuickCopyButton } from '@/components/ui/copy-button';

interface QuoteItem {
  id: string;
  text: string;
  text_hi: string;
  author: string;
  category: string;
}

const Quotes = () => {
  const { t, language } = useLanguage();
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quotes from Supabase
  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setQuotes(data || []);
      setFilteredQuotes(data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes');
      setFilteredQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchQuotes();
  }, []);

  // Filter quotes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredQuotes(quotes);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = quotes.filter(quote => {
      return (
        quote.text?.toLowerCase().includes(query) ||
        quote.text_hi?.toLowerCase().includes(query) ||
        quote.author?.toLowerCase().includes(query) ||
        quote.category?.toLowerCase().includes(query)
      );
    });

    setFilteredQuotes(filtered);
  }, [searchQuery, quotes]);

  // Pagination for quotes
  const quotesPagination = usePagination({
    items: filteredQuotes,
    itemsPerPage: 12, // 3x4 grid for desktop
    initialPage: 1,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleQuotesPageChange = (page: number) => {
    quotesPagination.goToPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto" />
            <p className="text-lg text-gray-600">Loading divine wisdom...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-purple-100 via-orange-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
              <Quote className="w-10 h-10 text-orange-500" />
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-orange-600 to-pink-600 bg-clip-text text-transparent pt-2">
              Divine Quotes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Timeless wisdom from saints and spiritual masters to inspire and guide your journey
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {searchQuery
                  ? `${quotesPagination.totalItems} of ${quotes.length}`
                  : `${quotes.length}`
                } Quotes
                {quotesPagination.totalPages > 1 && ` • Page ${quotesPagination.currentPage} of ${quotesPagination.totalPages}`}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={language === 'EN' ? 'खोजें: ज्ञान, प्रेम, शांति... (Search: wisdom, love, peace...)' : 'Search quotes by keyword, author, or category...'}
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-sm">Clear</span>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                {quotesPagination.totalItems === 0
                  ? `No quotes found for "${searchQuery}"`
                  : `Found ${quotesPagination.totalItems} quote${quotesPagination.totalItems !== 1 ? 's' : ''} matching "${searchQuery}"`
                }
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Quotes Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {quotesPagination.totalItems === 0 && searchQuery ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500">No quotes match your search "{searchQuery}". Try different keywords.</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No quotes available yet</p>
              <p className="text-gray-400 text-sm">Check back soon for divine wisdom</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Masonry-style grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotesPagination.currentItems.map((quote, index) => (
                  <Card
                    key={quote.id}
                    className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <CardContent className="p-6 space-y-4 h-full flex flex-col">
                      <div className="flex items-start justify-between">
                        <Badge
                          variant="outline"
                          className="border-orange-200 text-orange-600 bg-orange-50"
                        >
                          {quote.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Quote className="w-5 h-5 text-orange-500" />
                          <QuickCopyButton
                            text={quote.text}
                            textHi={quote.text_hi}
                            author={quote.author}
                            category={quote.category}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex-grow space-y-3">
                        <blockquote className="text-lg text-gray-700 leading-relaxed italic">
                          "{quote.text}"
                        </blockquote>

                        <p className="text-base text-orange-600 font-medium">
                          "{quote.text_hi}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">- {quote.author}</p>
                        <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {quotesPagination.totalItems > 0 && (
                <BhajanPagination
                  currentPage={quotesPagination.currentPage}
                  totalPages={quotesPagination.totalPages}
                  totalItems={quotesPagination.totalItems}
                  itemsPerPage={quotesPagination.itemsPerPage}
                  startIndex={quotesPagination.startIndex}
                  endIndex={quotesPagination.endIndex}
                  hasNextPage={quotesPagination.hasNextPage}
                  hasPreviousPage={quotesPagination.hasPreviousPage}
                  visiblePages={quotesPagination.visiblePages}
                  onPageChange={handleQuotesPageChange}
                  showStats={true}
                  showFirstLast={true}
                  theme="orange"
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Inspirational Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 via-orange-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Words That Transform
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Each quote is a seed of wisdom. Let it take root in your heart,
              and watch it blossom into understanding and peace.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "शब्द में शक्ति है, विचार में सत्य है"
            </blockquote>
            <p className="text-lg text-orange-600 mt-2">
              "In words there is power, in thoughts there is truth"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
              Explore Saints
            </a>
            <a href="/bhajans" className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 transition-colors">
              Listen to Bhajans
            </a>
          </div>
        </div>
      </section>

      {/* Toast notifications */}
      <Toaster />

      <Footer />
    </div>
  );
};

export default Quotes;
