import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight, Play, Flame, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompactBhajanCard from '@/components/bhajan/CompactBhajanCard';
import BhajanModal from '@/components/BhajanModal';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

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

const LandingBhajanSection = () => {
  const { language } = useLanguage();
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBhajans();
  }, []);

  const fetchFeaturedBhajans = async () => {
    try {
      setLoading(true);

      // Fetch recent bhajans directly from Supabase (faster than trending API)
      const { data, error } = await supabase
        .from('bhajans')
        .select('id, title, title_hi, category, youtube_url, author')
        .not('youtube_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Add minimal required fields for display
      const formattedData = (data || []).map(bhajan => ({
        ...bhajan,
        lyrics: '',
        lyrics_hi: '',
        meaning: ''
      }));

      setBhajans(formattedData);
    } catch (error) {
      console.error('Error fetching bhajans:', error);
      // Silent fail - just show empty section
      setBhajans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBhajanClick = (bhajan: Bhajan) => {
    setSelectedBhajan(bhajan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBhajan(null);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        </div>
      </section>
    );
  }

  if (bhajans.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Music className="w-8 h-8 text-green-600 animate-pulse" />
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <span className="text-4xl">🎵</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              {language === 'HI' ? 'पवित्र भजन' : 'Sacred Bhajans'}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {language === 'HI'
                ? 'दिव्य संगीत में डूब जाइए। हमारे खूबसूरती से सजाए गए भजन संग्रह का अनुभव करें।'
                : 'Immerse yourself in divine melodies. Experience our beautifully revamped bhajan collection.'}
            </p>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                {language === 'HI' ? 'इस सप्ताह ट्रेंडिंग' : 'Trending this week'}
              </span>
            </div>
          </div>

          {/* Bhajan Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 mb-12">
            {bhajans.map((bhajan, index) => (
              <div key={bhajan.id} className="transform transition-all duration-300 hover:scale-105">
                <CompactBhajanCard
                  bhajan={bhajan}
                  onClick={() => handleBhajanClick(bhajan)}
                  playlist={bhajans}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 max-w-3xl mx-auto border border-orange-200 shadow-lg">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Play className="w-6 h-6 text-green-600" />
                <Music className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {language === 'HI' ? 'पूरा संग्रह देखें' : 'Explore Complete Collection'}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {language === 'HI'
                  ? 'गीत, अर्थ और YouTube प्लेबैक के साथ सैकड़ों भक्ति गीत खोजें।'
                  : 'Discover hundreds of devotional songs with lyrics, meanings, and YouTube playback.'}
              </p>

              <Link to="/bhajans">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
                >
                  <Music className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {language === 'HI' ? 'सभी भजन देखें' : 'View All Bhajans'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-4">
                <strong className="text-green-600">{bhajans.length}+</strong> {language === 'HI' ? 'भजन और बढ़ रहे हैं' : 'bhajans and growing'}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Music className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'पूर्ण गीत' : 'Full Lyrics'}</span>
                </div>
                <p className="text-xs text-gray-600">{language === 'HI' ? 'अर्थ के साथ हिंदी और अंग्रेजी' : 'English & Hindi with meanings'}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Play className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'YouTube प्लेयर' : 'YouTube Player'}</span>
                </div>
                <p className="text-xs text-gray-600">{language === 'HI' ? 'बिल्ट-इन म्यूज़िक प्लेयर' : 'Built-in music player'}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'ट्रेंडिंग' : 'Trending'}</span>
                </div>
                <p className="text-xs text-gray-600">{language === 'HI' ? 'लोकप्रिय भजन खोजें' : 'Discover popular bhajans'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bhajan Modal */}
      <BhajanModal
        bhajan={selectedBhajan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default LandingBhajanSection;
