import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SaintModal from '@/components/SaintModal';
import ShareButton from '@/components/ShareButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { usePagination } from '@/hooks/usePagination';
import BeautifulPagination from '@/components/BeautifulPagination';

const Saints = () => {
  const [selectedSaint, setSelectedSaint] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saints, setSaints] = useState<any[]>([]);
  const [filteredSaints, setFilteredSaints] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch saints from Supabase
  useEffect(() => {
    const fetchSaints = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('saints')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Format the data to match your original structure exactly
        const formatted = data ? data.map((s) => ({
          id: s.id,
          name: s.name,
          nameHi: s.name_hi,
          period: s.period,
          region: s.region,
          image: s.image_url,
          description: s.description,
          descriptionHi: s.description_hi,
          specialty: s.specialty,
          specialtyHi: s.specialty_hi,
          biography: s.biography,
          biographyHi: s.biography_hi,
        })) : [];

        setSaints(formatted);
        setFilteredSaints(formatted); // Initialize filtered saints
      } catch (err) {
        console.error('Error fetching saints:', err);
        setError(err.message);
        // Fallback to empty array to prevent UI breaking
        setSaints([]);
        setFilteredSaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaints();
  }, []);

  // Filter saints based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSaints(saints);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = saints.filter(saint => {
      return (
        saint.name?.toLowerCase().includes(query) ||
        saint.nameHi?.toLowerCase().includes(query) ||
        saint.specialty?.toLowerCase().includes(query) ||
        saint.specialtyHi?.toLowerCase().includes(query) ||
        saint.region?.toLowerCase().includes(query) ||
        saint.period?.toLowerCase().includes(query) ||
        saint.description?.toLowerCase().includes(query) ||
        saint.descriptionHi?.toLowerCase().includes(query)
      );
    });

    setFilteredSaints(filtered);
  }, [searchQuery, saints]);

  // Pagination hook
  const pagination = usePagination({
    items: filteredSaints,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  const handlePageChange = (page: number) => {
    pagination.goToPage(page);
    // Smooth scroll to top of saints grid
    const saintsSection = document.querySelector('#saints-grid');
    if (saintsSection) {
      saintsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaintClick = (saint: any) => {
    setSelectedSaint(saint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSaint(null), 300); // Delay to allow exit animation
  };

  // Loading state - matches your existing UI structure
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <Navbar />
        
        {/* Header */}
        <section className="pt-20 pb-12 bg-gradient-to-r from-orange-100 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Great Saints
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the profound wisdom and divine teachings of India's most revered spiritual masters 
                who have guided humanity on the path of devotion and enlightenment.
              </p>
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                  Loading Sacred Biographies...
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Loading Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className="bg-gray-300 w-full h-48"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Error state - matches your existing UI structure
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <Navbar />
        
        {/* Header */}
        <section className="pt-20 pb-12 bg-gradient-to-r from-orange-100 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Great Saints
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the profound wisdom and divine teachings of India's most revered spiritual masters 
                who have guided humanity on the path of devotion and enlightenment.
              </p>
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
                  Unable to load content
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Error Message */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Temporary Issue
            </h2>
            <p className="text-lg text-gray-600">
              We're experiencing some technical difficulties. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Main component - EXACTLY the same as your original
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-orange-100 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Great Saints
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the profound wisdom and divine teachings of India's most revered spiritual masters 
              who have guided humanity on the path of devotion and enlightenment.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2">
                {searchQuery 
                  ? `${pagination.totalItems} of ${saints.length}` 
                  : `${saints.length}`
                } Sacred Biographies
                {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="खोजें: मीरा बाई, कबीर दास, तुलसीदास... (Search by name, region, specialty)"
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
              {pagination.totalItems === 0 
                ? `No saints found for "${searchQuery}"`
                : `Found ${pagination.totalItems} saint${pagination.totalItems !== 1 ? 's' : ''} matching "${searchQuery}"`
              }
              {pagination.totalPages > 1 && ` • Showing ${pagination.startIndex}-${pagination.endIndex}`}
            </p>
          )}
        </div>
      </section>

      {/* Saints Grid */}
      <section id="saints-grid" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pagination.currentItems.map((saint, index) => (
              <motion.div
                key={saint.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => handleSaintClick(saint)}
                >
                  <div className="relative">
                    <img 
                      src={saint.image} 
                      alt={saint.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-orange-700">
                        {saint.specialty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {saint.name}
                      </h3>
                      <p className="text-sm text-orange-600 font-medium">
                        {saint.nameHi}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{saint.period}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{saint.region}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {saint.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Read More</span>
                      </button>
                      
                      <ShareButton 
                        saint={{
                          name: saint.name,
                          nameHi: saint.nameHi,
                          specialty: saint.specialty,
                          specialtyHi: saint.specialtyHi,
                          description: saint.description,
                          descriptionHi: saint.descriptionHi,
                          id: saint.id
                        }}
                        variant="ghost"
                        size="sm"
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <BeautifulPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          visiblePages={pagination.visiblePages}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={false}
          showStats={true}
          showFirstLast={true}
        />
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Continue Your Spiritual Journey
          </h2>
          <p className="text-lg text-gray-600">
            Explore more aspects of divine wisdom through our other sections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/living-saints" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors">
              Living Saints
            </a>
            <a href="/divine" className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 transition-colors">
              Divine Forms
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Saint Modal */}
      <SaintModal
        saint={selectedSaint}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Saints;