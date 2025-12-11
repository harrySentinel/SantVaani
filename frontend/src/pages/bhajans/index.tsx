import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import BhajanModal from '@/components/BhajanModal';
import BhajanShareButton from '@/components/BhajanShareButton';
import FavoriteButton from '@/components/bhajan/FavoriteButton';
import BhajanStats from '@/components/bhajan/BhajanStats';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Music, Loader2, Search, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabaseClient';
import { usePagination } from '@/hooks/usePagination';
import BhajanPagination from '@/components/BhajanPagination';
import { getTrendingBhajans, getPopularBhajans, recordBhajanPlay } from '@/services/bhajanEngagementService';

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

const Bhajans = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [filteredBhajans, setFilteredBhajans] = useState<Bhajan[]>([]);
  const [trendingBhajans, setTrendingBhajans] = useState<any[]>([]);
  const [popularBhajans, setPopularBhajans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Fetch bhajans from Supabase
  const fetchBhajans = async () => {
    try {
      const { data, error } = await supabase
        .from('bhajans')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBhajans(data || []);
      setFilteredBhajans(data || []);
    } catch (err) {
      console.error('Error fetching bhajans:', err);
      setError('Failed to load bhajans');
      setFilteredBhajans([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending and popular bhajans
  const fetchEngagementData = async () => {
    try {
      const [trendingData, popularData] = await Promise.all([
        getTrendingBhajans(6),
        getPopularBhajans(6)
      ]);

      setTrendingBhajans(trendingData.trending || []);
      setPopularBhajans(popularData.popular || []);
    } catch (err) {
      console.error('Error fetching engagement data:', err);
    }
  };

  useEffect(() => {
    fetchBhajans();
    fetchEngagementData();
  }, []);

  // Filter bhajans
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

  const bhajanPagination = usePagination({
    items: filteredBhajans,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBhajanPageChange = (page: number) => {
    bhajanPagination.goToPage(page);
    const bhajansSection = document.querySelector('#bhajans-grid');
    if (bhajansSection) {
      bhajansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBhajanClick = async (bhajan: Bhajan) => {
    console.log('Bhajan clicked:', bhajan.title);
    setSelectedBhajan(bhajan);
    setIsModalOpen(true);

    // Record play event (non-blocking)
    try {
      await recordBhajanPlay(bhajan.id);
    } catch (err) {
      console.error('Error recording play:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBhajan(null);
  };

  // Render bhajan card
  const renderBhajanCard = (bhajan: Bhajan, index?: number) => (
    <Card
      key={bhajan.id}
      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm cursor-pointer"
      onClick={() => handleBhajanClick(bhajan)}
      style={index !== undefined ? { animationDelay: `${index * 50}ms` } : undefined}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
              {bhajan.title}
            </h3>
            <p className="text-sm text-green-600 font-medium">
              {bhajan.title_hi}
            </p>
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="outline" className="border-green-200 text-green-600">
                {bhajan.category}
              </Badge>
              <BhajanStats bhajanId={bhajan.id} variant="badge" />
            </div>
          </div>
          <Music className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
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
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  bhajanId={bhajan.id}
                  bhajanTitle={bhajan.title}
                  size="sm"
                  variant="minimal"
                />
              </div>

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
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
            <p className="text-lg text-gray-600">{t('bhajans.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <Music className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent pt-2">
              {t('bhajans.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('bhajans.subtitle')}
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
                {searchQuery
                  ? `${bhajanPagination.totalItems} of ${bhajans.length}`
                  : `${bhajans.length}`
                } {t('bhajans.songs.count')}
                {bhajanPagination.totalPages > 1 && ` • Page ${bhajanPagination.currentPage} of ${bhajanPagination.totalPages}`}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingBhajans.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 mb-6">
              <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800">Trending This Week</h2>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingBhajans.slice(0, 6).map((item, index) => renderBhajanCard(item.bhajans, index))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Section */}
      {popularBhajans.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">Most Popular</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBhajans.slice(0, 6).map((item, index) => renderBhajanCard(item.bhajans, index))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">All Bhajans</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our complete collection of devotional songs
              </p>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder={language === 'EN' ? 'खोजें: हनुमान चालीसा, राम भजन, कृष्ण... (' + t('bhajans.search.placeholder') + ')' : t('bhajans.search.placeholder')}
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
                    ? `No results for "${searchQuery}"`
                    : `Found ${bhajanPagination.totalItems} bhajan${bhajanPagination.totalItems !== 1 ? 's' : ''} matching "${searchQuery}"`
                  }
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
                  {bhajanPagination.currentItems.map((bhajan) => renderBhajanCard(bhajan))}
                </div>

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
          </div>
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
              Let these sacred sounds be your daily companions on the spiritual journey.
              Each bhajan carries the power to transform the heart and elevate consciousness.
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              Saints' Teachings
            </a>
            <a href="/quotes" className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors">
              Divine Quotes
            </a>
          </div>
        </div>
      </section>

      <BhajanModal
        bhajan={selectedBhajan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Toaster />
      <Footer />
    </div>
  );
};

export default Bhajans;
