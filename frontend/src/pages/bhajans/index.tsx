import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import BhajanModal from '@/components/BhajanModal';
import CompactBhajanCard from '@/components/bhajan/CompactBhajanCard';
import HorizontalBhajanSection from '@/components/bhajan/HorizontalBhajanSection';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Loader2, Search, Flame, TrendingUp, Sparkles, LibraryBig } from 'lucide-react';
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
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [filteredBhajans, setFilteredBhajans] = useState<Bhajan[]>([]);
  const [trendingBhajans, setTrendingBhajans] = useState<any[]>([]);
  const [popularBhajans, setPopularBhajans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage] = useState(16); // 4 columns x 4 rows

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
        getTrendingBhajans(10),
        getPopularBhajans(10)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Header - Spotify Style */}
      <section className="pt-20 pb-8 bg-gradient-to-b from-green-600 to-green-500">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <Music className="w-10 h-10 text-white/90" />
              <span className="text-4xl">🎵</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
              {t('bhajans.title')}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
              {t('bhajans.subtitle')}
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-base border-white/30">
              {bhajans.length} {t('bhajans.songs.count')}
            </Badge>
          </div>
        </div>
      </section>

      {/* Trending Section - Horizontal Scroll */}
      {trendingBhajans.length > 0 && (
        <HorizontalBhajanSection
          title="Trending This Week"
          icon={<Flame className="w-7 h-7 text-orange-500 animate-pulse" />}
          bhajans={trendingBhajans}
          onBhajanClick={handleBhajanClick}
          bgClass="bg-gradient-to-r from-orange-50 via-yellow-50 to-amber-50"
        />
      )}

      {/* Popular Section - Horizontal Scroll */}
      {popularBhajans.length > 0 && (
        <HorizontalBhajanSection
          title="Most Popular"
          icon={<TrendingUp className="w-7 h-7 text-purple-500" />}
          bhajans={popularBhajans}
          onBhajanClick={handleBhajanClick}
          bgClass="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50"
        />
      )}

      {/* Main Content - All Bhajans Grid */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LibraryBig className="w-7 h-7 text-gray-700" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  All Bhajans
                </h2>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder={language === 'EN' ? 'Search bhajans... (हनुमान चालीसा, राम भजन, कृष्ण)' : 'Search bhajans...'}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block w-full pl-12 pr-4 py-6 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white shadow-sm text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600 text-sm font-medium">Clear</span>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600">
                  {bhajanPagination.totalItems === 0
                    ? `No results for "${searchQuery}"`
                    : `${bhajanPagination.totalItems} result${bhajanPagination.totalItems !== 1 ? 's' : ''} found`
                  }
                </p>
              )}
            </div>

            {/* Results */}
            {bhajanPagination.totalItems === 0 && searchQuery ? (
              <div className="text-center py-20">
                <div className="text-gray-300 text-7xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                <p className="text-gray-500">Try different keywords or browse all bhajans</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  Show All Bhajans
                </button>
              </div>
            ) : bhajans.length === 0 ? (
              <div className="text-center py-20">
                <Music className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-lg">No bhajans available yet</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for sacred melodies</p>
              </div>
            ) : (
              <div id="bhajans-grid" className="space-y-8">
                {/* 4-Column Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                  {bhajanPagination.currentItems.map((bhajan, index) => (
                    <CompactBhajanCard
                      key={bhajan.id}
                      bhajan={bhajan}
                      onClick={() => handleBhajanClick(bhajan)}
                      playlist={filteredBhajans}
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {bhajanPagination.totalPages > 1 && (
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
