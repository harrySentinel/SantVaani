import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';
import LivingSaintModal from '@/components/LivingSaintModal';
import LivingSaintShareButton from '@/components/LivingSaintShareButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Users, Globe, Heart, Loader2, Search } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import BeautifulPagination from '@/components/BeautifulPagination';

const LivingSaints = () => {
  const { t, language } = useLanguage();
  const [selectedSaint, setSelectedSaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livingSaints, setLivingSaints] = useState([]);
  const [filteredSaints, setFilteredSaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch living saints from Supabase
  useEffect(() => {
    const fetchLivingSaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('living_saints')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform the data to match the expected structure
        const transformedData = data.map(saint => ({
          id: saint.id,
          name: saint.name,
          nameHi: saint.name_hi,
          organization: saint.organization,
          specialty: saint.specialty,
          specialtyHi: saint.specialty_hi,
          image: saint.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", // fallback image
          description: saint.description,
          descriptionHi: saint.description_hi,
          website: saint.website,
          followers: saint.followers,
          teachings: saint.teachings || [],
          birthPlace: saint.birth_place,
          birthPlaceHi: saint.birth_place_hi,
          currentLocation: saint.current_location,
          currentLocationHi: saint.current_location_hi,
          biography: saint.biography,
          biographyHi: saint.biography_hi,
          spiritualJourney: saint.spiritual_journey,
          spiritualJourneyHi: saint.spiritual_journey_hi,
          keyTeachings: saint.key_teachings || [],
          keyTeachingsHi: saint.key_teachings_hi || [],
          quotes: saint.quotes || [],
          quotesHi: saint.quotes_hi || [],
          ashram: saint.ashram,
          ashramHi: saint.ashram_hi,
          lineage: saint.lineage,
          lineageHi: saint.lineage_hi
        }));

        setLivingSaints(transformedData);
        setFilteredSaints(transformedData); // Initialize filtered saints
      } catch (err) {
        console.error('Error fetching living saints:', err);
        setError('Failed to load living saints. Please try again later.');
        setFilteredSaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLivingSaints();
  }, []);

  // Filter living saints based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSaints(livingSaints);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = livingSaints.filter(saint => {
      return (
        saint.name?.toLowerCase().includes(query) ||
        saint.nameHi?.toLowerCase().includes(query) ||
        saint.organization?.toLowerCase().includes(query) ||
        saint.specialty?.toLowerCase().includes(query) ||
        saint.specialtyHi?.toLowerCase().includes(query) ||
        saint.currentLocation?.toLowerCase().includes(query) ||
        saint.currentLocationHi?.toLowerCase().includes(query) ||
        saint.birthPlace?.toLowerCase().includes(query) ||
        saint.birthPlaceHi?.toLowerCase().includes(query) ||
        saint.description?.toLowerCase().includes(query) ||
        saint.descriptionHi?.toLowerCase().includes(query) ||
        saint.ashram?.toLowerCase().includes(query) ||
        saint.ashramHi?.toLowerCase().includes(query) ||
        saint.lineage?.toLowerCase().includes(query) ||
        saint.lineageHi?.toLowerCase().includes(query) ||
        (saint.teachings && saint.teachings.some(teaching => 
          teaching.toLowerCase().includes(query)
        ))
      );
    });

    setFilteredSaints(filtered);
  }, [searchQuery, livingSaints]);

  // Pagination for living saints
  const pagination = usePagination({
    items: filteredSaints,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    pagination.goToPage(page);
    const saintsSection = document.querySelector('#living-saints-grid');
    if (saintsSection) {
      saintsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCardClick = (saint) => {
    setSelectedSaint(saint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSaint(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <p className="text-gray-600">{t('livingsaints.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('livingsaints.error.title')}</h2>
            <p className="text-gray-600 max-w-md">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              {t('livingsaints.error.retry')}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-red-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent pt-2">
              {t('livingsaints.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('livingsaints.subtitle')}
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-red-100 text-red-700 px-4 py-2">
                {searchQuery 
                  ? `${pagination.totalItems} of ${livingSaints.length}` 
                  : `${livingSaints.length}`
                } {t('livingsaints.guides.count')}
                {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
              </Badge>
            </div>
          </div>
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
              placeholder={language === 'EN' ? 'खोजें: समसाधि, शिवानंद आश्रम, योग... (' + t('livingsaints.search.placeholder') + ')' : t('livingsaints.search.placeholder')}
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600 text-sm">{t('livingsaints.search.clear')}</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              {pagination.totalItems === 0
                ? `No contemporary saints found for "${searchQuery}"`
                : `Found ${pagination.totalItems} contemporary saint${pagination.totalItems !== 1 ? 's' : ''} matching "${searchQuery}"`
              }
              {pagination.totalPages > 1 && ` • Showing ${pagination.startIndex}-${pagination.endIndex}`}
            </p>
          )}
        </div>
      </section>

      {/* Contemporary Saints Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pagination.totalItems === 0 && searchQuery ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500">No contemporary saints match your search "{searchQuery}". Try different keywords.</p>
            </div>
          ) : livingSaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🙏</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Contemporary Saints Found</h3>
              <p className="text-gray-500">Please check back later or contact support.</p>
            </div>
          ) : (
            <div id="living-saints-grid" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagination.currentItems.map((saint) => (
                <Card 
                  key={saint.id} 
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(saint)}
                >
                  <div className="relative">
                    <img 
                      src={saint.image} 
                      alt={saint.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-red-700">
                        {saint.specialty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-1 text-white text-sm">
                        <Users className="w-4 h-4" />
                        <span>{saint.followers}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                        {saint.name}
                      </h3>
                      {saint.nameHi && (
                        <p className="text-sm text-red-600 font-medium">
                          {saint.nameHi}
                        </p>
                      )}
                      {saint.organization && (
                        <p className="text-sm text-gray-500">
                          {saint.organization}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {saint.description}
                    </p>
                    
                    {/* Teachings Tags */}
                    {saint.teachings && saint.teachings.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {saint.teachings.slice(0, 3).map((teaching, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                            {teaching}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors group">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Learn More</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        {saint.website && (
                          <a 
                            href={saint.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent card click
                          >
                            <Globe className="w-4 h-4" />
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        
                        <div onClick={(e) => e.stopPropagation()}>
                          <LivingSaintShareButton 
                            saint={{
                              name: saint.name,
                              nameHi: saint.nameHi,
                              organization: saint.organization,
                              specialty: saint.specialty,
                              specialtyHi: saint.specialtyHi,
                              description: saint.description,
                              descriptionHi: saint.descriptionHi,
                              currentLocation: saint.currentLocation,
                              currentLocationHi: saint.currentLocationHi,
                              id: saint.id
                            }}
                            variant="ghost"
                            size="sm"
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
              
              {/* Living Saints Pagination */}
              {pagination.totalItems > 0 && (
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
                  showStats={true}
                  showFirstLast={true}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-gradient-to-r from-red-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Living Wisdom for Modern Times
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              These contemporary spiritual masters bridge ancient wisdom with modern challenges, 
              offering practical guidance for today's seekers. Their teachings continue to transform lives 
              and spread peace across the globe.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
            <blockquote className="text-xl md:text-2xl text-gray-700 italic font-medium leading-relaxed">
              "In the company of the wise, ignorance disappears"
            </blockquote>
            <p className="text-lg text-red-600 mt-2">
              "सज्जनों की संगति में अज्ञान मिट जाता है"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/saints" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
              Great Saints
            </a>
            <a href="/bhajans" className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors">
              Bhajans & Quotes
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Saint Modal */}
      <LivingSaintModal
        saint={selectedSaint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LivingSaints;