import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpiritualFact {
  id: string;
  text: string;
  text_hi?: string;
  category: string;
  icon: string;
  source?: string;
}

const FALLBACK_FACTS: SpiritualFact[] = [
  {
    id: '1',
    text: "In the Ramayana, Hanuman's heart contains an image of Rama and Sita, discovered when his chest was opened by the gods to verify his devotion.",
    text_hi: "रामायण में, हनुमान के हृदय में राम और सीता की छवि है, जो उनकी भक्ति को सत्यापित करने के लिए देवताओं द्वारा उनकी छाती खोले जाने पर खोजी गई।",
    category: "Ramayana",
    icon: ""
  },
  {
    id: '2',
    text: "Lord Ganesha wrote the entire Mahabharata as Sage Vyasa dictated it, breaking his tusk to use as a pen when the original one broke.",
    text_hi: "भगवान गणेश ने संपूर्ण महाभारत को महर्षि व्यास के कहे अनुसार लिखा, जब उनकी मूल कलम टूट गई तो अपना दांत तोड़कर कलम के रूप में इस्तेमाल किया।",
    category: "Hindu Deities",
    icon: ""
  },
];

const SpiritualFactBox = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [facts, setFacts] = useState<SpiritualFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const { data, error } = await supabase
          .from('spiritual_facts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error || !data?.length) throw new Error();
        setFacts(data);
      } catch {
        setFacts(FALLBACK_FACTS);
      } finally {
        setLoading(false);
      }
    };
    fetchFacts();
  }, []);

  useEffect(() => {
    if (facts.length < 2) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % facts.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, [facts.length]);

  if (loading || facts.length === 0) return null;

  const fact = facts[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest">{t('didyouknow.title')}</p>
            <p className="text-xs text-orange-400">{fact.category}</p>
          </div>
        </div>

        <div
          className="transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <p className="text-gray-800 text-lg leading-relaxed font-medium">
            {language === 'EN' ? fact.text : (fact.text_hi || fact.text)}
          </p>
        </div>

        {facts.length > 1 && (
          <div className="flex gap-1.5 mt-6">
            {facts.slice(0, Math.min(facts.length, 6)).map((_, i) => (
              <button
                key={i}
                onClick={() => { setVisible(false); setTimeout(() => { setCurrentIndex(i); setVisible(true); }, 400); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-orange-200 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpiritualFactBox;
