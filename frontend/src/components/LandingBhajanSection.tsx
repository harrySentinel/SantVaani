import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
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
          .select('*')
          .order('created_at', { ascending: true })
          .limit(10);
        if (error) throw error;
        setBhajans(data || []);
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
      <section id="bhajans" className="py-12 md:py-16 relative scroll-mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BhajanGridSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (bhajans.length === 0) return null;

  return (
    <>
      <section id="bhajans" className="py-12 md:py-16 relative scroll-mt-32 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-end justify-between mb-8"
          >
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-orange-600 tracking-wide">
                {language === 'HI' ? 'पाठ संग्रह' : 'Lyrics Library'}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241a12]">
                {language === 'HI' ? 'पवित्र भजन साहित्य' : 'Sacred Bhajan Lyrics'}
              </h2>
            </div>
            <Link
              to="/bhajans"
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              {language === 'HI' ? 'सभी देखें' : 'View all'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Swipeable row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {bhajans.map((bhajan, index) => (
              <div key={bhajan.id} className="w-40 sm:w-44 md:w-48 flex-shrink-0 snap-start">
                <CompactBhajanCard
                  bhajan={bhajan}
                  onClick={() => { setSelectedBhajan(bhajan); setIsModalOpen(true); }}
                  index={index}
                />
              </div>
            ))}
          </motion.div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-400" />
              {language === 'HI'
                ? 'देवनागरी और transliteration में अर्थ सहित पढ़ें'
                : 'Read in देवनागरी & transliteration, with meanings'}
            </p>
            <Link to="/bhajans">
              <button className="flex items-center gap-2 text-sm font-semibold text-white bg-[#241a12] hover:bg-[#3a2b1c] px-5 py-2.5 rounded-full transition-colors">
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
