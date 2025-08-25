import { useState, useEffect } from 'react';

export interface MantraContent {
  id: string;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  meaningHi: string;
  deity: string;
  deityHi: string;
  benefits: string;
  benefitsHi: string;
  audioUrl?: string;
  category: 'morning' | 'evening' | 'meditation' | 'protection' | 'prosperity';
}

export interface SpiritualQuote {
  id: string;
  quote: string;
  quoteHi?: string;
  author: string;
  authorHi?: string;
  source?: string;
  category: string;
}

export interface FestivalInfo {
  id: string;
  name: string;
  nameHi: string;
  date: string;
  daysLeft: number;
  significance: string;
  significanceHi: string;
  rituals: string[];
  ritualsHi: string[];
  category: 'major' | 'regional' | 'vrat' | 'seasonal';
}

export interface TodaysContent {
  mantra: MantraContent;
  quote: SpiritualQuote;
  festivals: FestivalInfo[];
  specialDay?: {
    name: string;
    nameHi: string;
    description: string;
    descriptionHi: string;
  };
}

export const useSpiritualContent = () => {
  const [todaysContent, setTodaysContent] = useState<TodaysContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Curated mantras for different times
  const mantras: MantraContent[] = [
    {
      id: 'om-namah-shivaya',
      sanskrit: 'ॐ नमः शिवाय',
      transliteration: 'Om Namah Shivaya',
      meaning: 'I bow to Shiva, the supreme consciousness',
      meaningHi: 'मैं शिव को नमन करता हूँ, जो परम चेतना हैं',
      deity: 'Lord Shiva',
      deityHi: 'भगवान शिव',
      benefits: 'Inner peace, spiritual awakening, removal of negative energy',
      benefitsHi: 'आंतरिक शांति, आध्यात्मिक जागृति, नकारात्मक ऊर्जा का नाश',
      category: 'meditation'
    },
    {
      id: 'gayatri-mantra',
      sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      transliteration: 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Prachodayāt',
      meaning: 'We meditate on the divine light that illuminates all realms',
      meaningHi: 'हम उस दिव्य प्रकाश पर ध्यान करते हैं जो सभी लोकों को प्रकाशित करता है',
      deity: 'Goddess Gayatri',
      deityHi: 'माता गायत्री',
      benefits: 'Wisdom, spiritual illumination, mental clarity',
      benefitsHi: 'बुद्धि, आध्यात्मिक प्रकाश, मानसिक स्पष्टता',
      category: 'morning'
    },
    {
      id: 'maha-mrityunjaya',
      sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्',
      transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
      meaning: 'We worship the three-eyed Lord who is fragrant and nourishes all',
      meaningHi: 'हम त्रिनेत्रधारी प्रभु की पूजा करते हैं जो सुगंधित हैं और सभी का पोषण करते हैं',
      deity: 'Lord Shiva',
      deityHi: 'भगवान शिव',
      benefits: 'Healing, protection from diseases, spiritual strength',
      benefitsHi: 'उपचार, रोगों से सुरक्षा, आध्यात्मिक शक्ति',
      category: 'protection'
    }
  ];

  const quotes: SpiritualQuote[] = [
    {
      id: 'buddha-mind',
      quote: 'The mind is everything. What you think you become.',
      quoteHi: 'मन ही सब कुछ है। आप जो सोचते हैं, वही बन जाते हैं।',
      author: 'Buddha',
      authorHi: 'बुद्ध',
      category: 'wisdom'
    },
    {
      id: 'krishna-dharma',
      quote: 'It is better to live your own dharma imperfectly than to live an imitation of somebody else\'s life with perfection.',
      quoteHi: 'अपने धर्म का अपूर्ण रूप से पालन करना किसी और के जीवन की पूर्ण नकल से बेहतर है।',
      author: 'Lord Krishna',
      authorHi: 'भगवान कृष्ण',
      source: 'Bhagavad Gita',
      category: 'dharma'
    },
    {
      id: 'rumi-love',
      quote: 'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.',
      author: 'Rumi',
      category: 'love'
    },
    {
      id: 'kabir-truth',
      quote: 'Wherever you are, and whatever you do, be in love.',
      quoteHi: 'जहाँ भी हों, जो भी करें, प्रेम में रहें।',
      author: 'Kabir Das',
      authorHi: 'कबीर दास',
      category: 'love'
    }
  ];

  const upcomingFestivals: FestivalInfo[] = [
    {
      id: 'diwali-2024',
      name: 'Diwali',
      nameHi: 'दिवाली',
      date: '2024-11-01',
      daysLeft: 15,
      significance: 'Festival of Lights celebrating the victory of light over darkness',
      significanceHi: 'प्रकाश का त्योहार जो अंधकार पर प्रकाश की विजय मनाता है',
      rituals: ['Light diyas', 'Lakshmi Puja', 'Share sweets', 'Clean homes'],
      ritualsHi: ['दीप जलाना', 'लक्ष्मी पूजा', 'मिठाई बांटना', 'घर की सफाई'],
      category: 'major'
    },
    {
      id: 'karva-chauth-2024',
      name: 'Karva Chauth',
      nameHi: 'करवा चौथ',
      date: '2024-10-25',
      daysLeft: 8,
      significance: 'Fast observed by married women for husband\'s long life',
      significanceHi: 'विवाहित महिलाओं द्वारा पति की दीर्घायु के लिए मनाया जाने वाला व्रत',
      rituals: ['Fast from sunrise to moonrise', 'Mehendi', 'Traditional attire', 'Moon worship'],
      ritualsHi: ['सूर्योदय से चांद्रोदय तक उपवास', 'मेहंदी', 'पारंपरिक वस्त्र', 'चंद्र पूजा'],
      category: 'vrat'
    }
  ];

  useEffect(() => {
    const fetchTodaysContent = async () => {
      try {
        setLoading(true);
        
        // Fetch from your backend API
        const response = await fetch('http://localhost:5000/api/daily-guide/complete');
        const data = await response.json();
        
        if (data.success) {
          console.log('🔥 Backend data received:', data.data);
          
          // Transform backend festival data to match frontend interface
          const transformedFestivals = (data.data.upcomingFestivals || []).map((festival: any) => ({
            id: festival.name.toLowerCase().replace(/\s+/g, '-'),
            name: festival.name,
            nameHi: festival.name, // Use same for now
            date: festival.date,
            daysLeft: festival.days,
            significance: festival.description || festival.significance,
            significanceHi: festival.description || festival.significance,
            rituals: ['Traditional prayers', 'Special offerings', 'Family gatherings'],
            ritualsHi: ['पारंपरिक प्रार्थना', 'विशेष प्रसाद', 'पारिवारिक सभा'],
            category: festival.type === 'Major Festival' ? 'major' as const : 
                     festival.type === 'Vrat' ? 'vrat' as const : 'regional' as const,
            isToday: festival.isToday,
            isTomorrow: festival.isTomorrow,
            isThisWeek: festival.isThisWeek
          }));


          // Transform backend mantra data
          const transformedMantra = data.data.todaysMantra ? {
            id: 'backend-mantra',
            sanskrit: data.data.todaysMantra.text || data.data.todaysMantra.sanskrit,
            transliteration: data.data.todaysMantra.text_english || data.data.todaysMantra.transliteration,
            meaning: data.data.todaysMantra.meaning || 'Divine blessing for today',
            meaningHi: data.data.todaysMantra.meaning_hi || 'आज का दिव्य आशीर्वाद',
            deity: 'Divine',
            deityHi: 'दिव्य',
            benefits: 'Spiritual growth and inner peace',
            benefitsHi: 'आध्यात्मिक विकास और आंतरिक शांति',
            category: 'morning' as const
          } : mantras[0];

          // Use real backend data
          const content: TodaysContent = {
            mantra: transformedMantra,
            quote: quotes[new Date().getDay() % quotes.length], // Keep quotes as mock for now
            festivals: transformedFestivals,
            specialDay: data.data.specialMessage ? {
              name: 'Today\'s Blessing',
              nameHi: 'आज का आशीर्वाद',
              description: data.data.specialMessage,
              descriptionHi: data.data.specialMessage
            } : getSpecialDay(new Date())
          };
          
          console.log('✅ Transformed content:', content);
          setTodaysContent(content);
        } else {
          // Fallback to mock data
          const today = new Date();
          const dayIndex = today.getDay();
          const content: TodaysContent = {
            mantra: mantras[dayIndex % mantras.length],
            quote: quotes[dayIndex % quotes.length],
            festivals: upcomingFestivals,
            specialDay: getSpecialDay(today)
          };
          setTodaysContent(content);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('API Error, using fallback data:', err);
        // Fallback to mock data
        const today = new Date();
        const dayIndex = today.getDay();
        const content: TodaysContent = {
          mantra: mantras[dayIndex % mantras.length],
          quote: quotes[dayIndex % quotes.length],
          festivals: upcomingFestivals,
          specialDay: getSpecialDay(today)
        };
        setTodaysContent(content);
        setError('Using offline data');
        setLoading(false);
      }
    };

    fetchTodaysContent();
  }, []);

  const getSpecialDay = (date: Date) => {
    const day = date.getDay();
    const dayOfMonth = date.getDate();
    
    // Check for Ekadashi (11th day of lunar month - simplified)
    if (dayOfMonth === 11 || dayOfMonth === 26) {
      return {
        name: 'Ekadashi',
        nameHi: 'एकादशी',
        description: 'Auspicious day for fasting and spiritual practices',
        descriptionHi: 'उपवास और आध्यात्मिक साधना के लिए शुभ दिन'
      };
    }
    
    // Check for special weekdays
    if (day === 1) { // Monday
      return {
        name: 'Somvar',
        nameHi: 'सोमवार',
        description: 'Day dedicated to Lord Shiva',
        descriptionHi: 'भगवान शिव को समर्पित दिन'
      };
    }
    
    if (day === 5) { // Friday
      return {
        name: 'Shukravar',
        nameHi: 'शुक्रवार',
        description: 'Day dedicated to Goddess Lakshmi',
        descriptionHi: 'माता लक्ष्मी को समर्पित दिन'
      };
    }
    
    return undefined;
  };

  const getMantraByCategory = (category: MantraContent['category']) => {
    return mantras.filter(mantra => mantra.category === category);
  };

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return {
    todaysContent,
    loading,
    error,
    getMantraByCategory,
    getRandomQuote,
    mantras,
    quotes,
    festivals: upcomingFestivals
  };
};