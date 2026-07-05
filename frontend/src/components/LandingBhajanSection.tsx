import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight } from 'lucide-react';
import CompactBhajanCard from '@/components/bhajan/CompactBhajanCard';
import BhajanModal from '@/components/BhajanModal';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { BhajanGridSkeleton } from '@/components/SkeletonCards';

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
    const fetchBhajans = async () => {
      try {
        const { data, error } = await supabase
          .from('bhajans')
          .select('id, title, title_hi, category, youtube_url, author')
          .not('youtube_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6);
        if (error) throw error;
        setBhajans((data || []).map(b => ({ ...b, lyrics: '', lyrics_hi: '', meaning: '' })));
      } catch {
        setBhajans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBhajans();
  }, []);

  if (loading) {
    return (
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BhajanGridSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (bhajans.length === 0) return null;

  return (
    <>
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
                {language === 'HI' ? 'संगीत' : 'Music'}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {language === 'HI' ? 'पवित्र भजन' : 'Sacred Bhajans'}
              </h2>
            </div>
            <Link
              to="/bhajans"
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              {language === 'HI' ? 'सभी देखें' : 'View all'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bhajans.map((bhajan, index) => (
              <CompactBhajanCard
                key={bhajan.id}
                bhajan={bhajan}
                onClick={() => { setSelectedBhajan(bhajan); setIsModalOpen(true); }}
                playlist={bhajans}
                index={index}
              />
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Music className="w-4 h-4 text-orange-400" />
              {language === 'HI'
                ? 'गीत, अर्थ और YouTube प्लेयर के साथ'
                : 'Lyrics, meanings and YouTube playback'}
            </p>
            <Link to="/bhajans">
              <button className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2.5 rounded-full transition-colors">
                {language === 'HI' ? 'सभी भजन' : 'All Bhajans'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <BhajanModal
        bhajan={selectedBhajan}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBhajan(null); }}
      />
    </>
  );
};

export default LandingBhajanSection;
