import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BhajanModal from '@/components/BhajanModal';
import BhajanShareButton from '@/components/BhajanShareButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Heart, Quote, Music, Loader2, Search } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabaseClient';
import { usePagination } from '@/hooks/usePagination';
import BhajanPagination from '@/components/BhajanPagination';
import { QuickCopyButton } from '@/components/ui/copy-button';

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

interface QuoteItem {
  id: string;
  text: string;
  text_hi: string;
  author: string;
  category: string;
}

const Bhajans = () => {
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [filteredBhajans, setFilteredBhajans] = useState<Bhajan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(8); // 2x4 grid for bhajans

  // Fetch bhajans from Supabase
  const fetchBhajans = async () => {
    try {
      const { data, error } = await supabase
        .from('bhajans')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBhajans(data || []);
      setFilteredBhajans(data || []); // Initialize filtered bhajans
    } catch (err) {
      console.error('Error fetching bhajans:', err);
      setError('Failed to load bhajans');
      setFilteredBhajans([]);
    }
  };

  // Fetch quotes from Supabase
  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setQuotes(data || []);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quotes');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBhajans(), fetchQuotes()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter bhajans based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBhajans(bhajans);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = bhajans.filter(bhajan => {
      return (
        bhajan.title?.toLowerCase().includes(query) ||
        bhajan.title_hi?.toLowerCase().includes(query) ||
        bhajan.category?.toLowerCase().includes(query) ||
        bhajan.author?.toLowerCase().includes(query) ||
        bhajan.lyrics?.toLowerCase().includes(query) ||
        bhajan.lyrics_hi?.toLowerCase().includes(query) ||
        bhajan.meaning?.toLowerCase().includes(query)
      );
    });

    setFilteredBhajans(filtered);
  }, [searchQuery, bhajans]);

  // Pagination for bhajans
  const bhajanPagination = usePagination({
    items: filteredBhajans,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
  });

  // Pagination for quotes
  const quotesPagination = usePagination({
    items: quotes,
    itemsPerPage: 12, // 3x4 grid for quotes
    initialPage: 1,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  const handleBhajanPageChange = (page: number) => {
    bhajanPagination.goToPage(page);
    // Smooth scroll to bhajans section
    const bhajansSection = document.querySelector('#bhajans-grid');
    if (bhajansSection) {
      bhajansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuotesPageChange = (page: number) => {
    quotesPagination.goToPage(page);
    // Smooth scroll to quotes section
    const quotesSection = document.querySelector('#quotes-grid');
    if (quotesSection) {
      quotesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBhajanClick = (bhajan: Bhajan) => {
    console.log('Bhajan clicked:', bhajan.title);
    setSelectedBhajan(bhajan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedBhajan(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
            <p className="text-lg text-gray-600">Loading sacred content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-green-500 animate-pulse" />
              <span className="text-3xl">🎵</span>
              <Quote className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Bhajans & Quotes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in sacred melodies and profound wisdom through our collection of 
              devotional songs and inspiring spiritual quotes from the great masters.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
                {searchQuery 
                  ? `${bhajanPagination.totalItems} of ${bhajans.length}` 
                  : `${bhajans.length}`
                } Sacred Songs
                {bhajanPagination.totalPages > 1 && ` • Page ${bhajanPagination.currentPage} of ${bhajanPagination.totalPages}`}
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {quotes.length} Divine Quotes
                {quotesPagination.totalPages > 1 && ` • Page ${quotesPagination.currentPage} of ${quotesPagination.totalPages}`}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="bhajans" className="space-y-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="bhajans" className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Bhajans</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center space-x-2">
                <Quote className="w-4 h-4" />
                <span>Quotes</span>
              </TabsTrigger>
            </TabsList>

            {/* Bhajans Tab */}
            <TabsContent value="bhajans" className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Sacred Bhajans</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Devotional songs that have echoed through temples and hearts for centuries, 
                  carrying the divine vibrations of love and surrender.
                </p>
              </div>

              {/* Bhajans Search Section */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="खोजें: हनुमान चालीसा, राम भजन, कृष्ण... (Search by title, author, category, lyrics)"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm"
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
                    {bhajanPagination.totalItems === 0 
                      ? `No bhajans found for "${searchQuery}"`
                      : `Found ${bhajanPagination.totalItems} bhajan${bhajanPagination.totalItems !== 1 ? 's' : ''} matching "${searchQuery}"`
                    }
                    {bhajanPagination.totalPages > 1 && ` • Showing ${bhajanPagination.startIndex}-${bhajanPagination.endIndex}`}
                  </p>
                )}
              </div>

              {bhajanPagination.totalItems === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-500">No bhajans match your search "{searchQuery}". Try different keywords.</p>
                </div>
              ) : bhajans.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No bhajans available yet</p>
                  <p className="text-gray-400 text-sm">Check back soon for sacred melodies</p>
                </div>
              ) : (
                <div id="bhajans-grid" className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {bhajanPagination.currentItems.map((bhajan) => (
                    <Card 
                      key={bhajan.id} 
                      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm cursor-pointer"
                      onClick={() => handleBhajanClick(bhajan)}
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                              {bhajan.title}
                            </h3>
                            <p className="text-sm text-green-600 font-medium">
                              {bhajan.title_hi}
                            </p>
                            <Badge variant="outline" className="border-green-200 text-green-600">
                              {bhajan.category}
                            </Badge>
                          </div>
                          <Music className="w-6 h-6 text-green-500" />
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-lg p-4 border border-green-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                            <div className="space-y-2">
                              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-medium leading-relaxed line-clamp-3">
                                {bhajan.lyrics.split('\n').slice(0, 4).join('\n')}...
                              </pre>
                              <pre className="text-sm text-green-600 whitespace-pre-wrap font-medium leading-relaxed line-clamp-3">
                                {bhajan.lyrics_hi.split('\n').slice(0, 4).join('\n')}...
                              </pre>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Meaning:</p>
                            <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-2">
                              {bhajan.meaning}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-gray-500">- {bhajan.author}</p>
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">Read Full</span>
                              </button>
                              
                              <div onClick={(e) => e.stopPropagation()}>
                                <BhajanShareButton 
                                  bhajan={{
                                    id: bhajan.id,
                                    title: bhajan.title,
                                    title_hi: bhajan.title_hi,
                                    category: bhajan.category,
                                    lyrics: bhajan.lyrics,
                                    lyrics_hi: bhajan.lyrics_hi,
                                    author: bhajan.author,
                                    meaning: bhajan.meaning
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                  
                  {/* Bhajans Pagination */}
                  {bhajanPagination.totalItems > 0 && (
                    <BhajanPagination
                      currentPage={bhajanPagination.currentPage}
                      totalPages={bhajanPagination.totalPages}
                      totalItems={bhajanPagination.totalItems}
                      itemsPerPage={bhajanPagination.itemsPerPage}
                      startIndex={bhajanPagination.startIndex}
                      endIndex={bhajanPagination.endIndex}
                      hasNextPage={bhajanPagination.hasNextPage}
                      hasPreviousPage={bhajanPagination.hasPreviousPage}
                      visiblePages={bhajanPagination.visiblePages}
                      onPageChange={handleBhajanPageChange}
                      showStats={true}
                      showFirstLast={true}
                      theme="green"
                    />
                  )}
                </div>
              )}
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Divine Wisdom</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Timeless words of wisdom from enlightened masters, scriptures, and saints 
                  that illuminate the path to spiritual awakening.
                </p>
              </div>

              {quotes.length === 0 ? (
                <div className="text-center py-12">
                  <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No quotes available yet</p>
                  <p className="text-gray-400 text-sm">Check back soon for divine wisdom</p>
                </div>
              ) : (
                <div id="quotes-grid" className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotesPagination.currentItems.map((quote) => (
                    <Card key={quote.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-4 h-full flex flex-col">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="border-orange-200 text-orange-600">
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
                          <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                  
                  {/* Quotes Pagination */}
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
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Daily Inspiration */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Daily Spiritual Nourishment
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Let these sacred sounds and words be your daily companions on the spiritual journey. 
              Each bhajan and quote carries the power to transform the heart and elevate consciousness.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "संगीत ही सबसे बड़ा धर्म है"
            </blockquote>
            <p className="text-lg text-green-600 mt-2">
              "Music is the greatest religion"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <Book className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Daily Bhajan</h3>
              <p className="text-sm text-gray-600">Start your day with a sacred song</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <Quote className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quote of the Day</h3>
              <p className="text-sm text-gray-600">Wisdom to guide your spiritual practice</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              Saints' Teachings
            </a>
            <a href="/divine" className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors">
              Divine Forms
            </a>
          </div>
        </div>
      </section>

      {/* Bhajan Modal */}
      <BhajanModal
        bhajan={selectedBhajan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast notifications */}
      <Toaster />

      <Footer />
    </div>
  );
};

export default Bhajans;