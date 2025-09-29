import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation type
type TranslationKeys = {
  [key: string]: string;
};

type Translations = {
  EN: TranslationKeys;
  HI: TranslationKeys;
};

// Translations for the landing page
const translations: Translations = {
  EN: {
    // Header
    'site.name': 'SantVaani',
    'beta.banner': '✨ Beta Version - Your feedback helps us improve',
    'beta.badge': 'Beta',

    // Hero Section
    'hero.welcome': 'Welcome to SantVaani',
    'hero.subtitle': 'Discover Divine Wisdom',
    'hero.description': 'Journey through the sacred teachings of India\'s greatest spiritual masters',
    'hero.tagline': 'Where Ancient Wisdom Meets Modern Hearts',
    'hero.description.main': 'Discover the profound teachings, inspiring stories, and divine bhakti of India\'s greatest saints. A digital sanctuary for spiritual seekers on their journey to enlightenment.',
    'hero.button.saints': 'Explore Saints',
    'hero.button.divine': 'Divine Forms',
    'hero.free.message': '🙏 Completely free • No registration required • Pure spiritual content 🙏',

    // Features Section
    'features.title': 'Explore Sacred Wisdom',
    'features.subtitle': 'Journey through the rich spiritual heritage of India through our carefully curated collection of saints, teachings, and divine forms.',
    'features.saints.title': 'Great Saints',
    'features.saints.description': 'Discover the life stories and teachings of legendary saints like Meera Bai, Kabir Das, and Tulsidas',
    'features.living.title': 'Living Saints',
    'features.living.description': 'Connect with contemporary spiritual masters who continue to spread divine wisdom',
    'features.divine.title': 'Divine Forms',
    'features.divine.description': 'Explore the sacred forms of the divine and understand their deeper meanings',
    'features.bhajans.title': 'Bhajans & Quotes',
    'features.bhajans.description': 'Immerse yourself in devotional songs and inspiring spiritual quotes',
    'features.horoscope.title': 'Daily Horoscope',
    'features.horoscope.description': 'Get personalized daily, weekly, and monthly astrological predictions',

    // Live Bhajan Section
    'live.title': '🎬 Live Bhajan Stream',
    'live.subtitle': 'Watch devotional bhajans and spiritual content streaming live',
    'live.button': 'Watch Live Bhajans',
    'live.description': 'Experience devotional bhajans and spiritual videos streaming live from YouTube',
    'live.status': 'LIVE NOW',

    // Mission Section
    'mission.title': 'Our Sacred Mission',
    'mission.description': 'SantVaani is dedicated to preserving and sharing the timeless wisdom of India\'s greatest spiritual masters. We believe that in today\'s fast-paced world, the teachings of these enlightened souls can provide guidance, peace, and direction to seekers on their spiritual journey.',
    'mission.beta.notice': '🛠️ Beta Version Notice: We are continuously improving SantVaani. Your feedback and suggestions help us enhance your spiritual journey experience.',
    'mission.quote.sanskrit': '"जहाँ भक्ति है, वहाँ शक्ति है"',
    'mission.quote.english': '"Where there is devotion, there is divine power"',
    'mission.learn.more': 'Learn More About Us',
    'mission.feedback': 'Share Feedback',

    // Feedback Form
    'feedback.title': 'Share Your Feedback',
    'feedback.subtitle': 'Your feedback helps us create a better spiritual experience for all devotees',
    'feedback.help.title': 'Help Us Serve Better',
    'feedback.help.description': 'Your thoughts and suggestions are invaluable to us. Click below to share your feedback through our secure Google Form.',
    'feedback.button.open': 'Open Feedback Form',
    'feedback.button.later': 'Maybe Later',
    'feedback.footer': '🔒 Your feedback is securely collected through Google Forms',

    // Footer
    'footer.description': 'Spreading the divine wisdom and teachings of great Indian saints across the world. A digital sanctuary for spiritual seekers.',
    'footer.links.title': 'Quick Links',
    'footer.links.saints': 'Saints',
    'footer.links.living': 'Living Saints',
    'footer.links.divine': 'Divine Forms',
    'footer.links.bhajans': 'Bhajans & Quotes',
    'footer.links.donation': 'Donation',
    'footer.connect.title': 'Connect',
    'footer.made.with': 'Made with',
    'footer.made.for': 'for spiritual seekers worldwide',
  },
  HI: {
    // Header
    'site.name': 'संतवाणी',
    'beta.banner': '✨ बीटा संस्करण - आपकी प्रतिक्रिया हमें बेहतर बनाती है',
    'beta.badge': 'बीटा',

    // Hero Section
    'hero.welcome': 'संतवाणी में आपका स्वागत है',
    'hero.subtitle': 'दिव्य ज्ञान की खोज करें',
    'hero.description': 'भारत के महानतम आध्यात्मिक गुरुओं की पवित्र शिक्षाओं के माध्यम से यात्रा करें',
    'hero.tagline': 'जहाँ प्राचीन ज्ञान मिलता है आधुनिक हृदयों से',
    'hero.description.main': 'भारत के महानतम संतों की गहन शिक्षाओं, प्रेरणादायक कहानियों और दिव्य भक्ति की खोज करें। आध्यात्मिक साधकों के लिए एक डिजिटल अभयारण्य, जो प्रबुद्धता की यात्रा पर हैं।',
    'hero.button.saints': 'संतों की खोज करें',
    'hero.button.divine': 'दिव्य रूप',
    'hero.free.message': '🙏 पूर्णतः निःशुल्क • पंजीकरण आवश्यक नहीं • शुद्ध आध्यात्मिक सामग्री 🙏',

    // Features Section
    'features.title': 'पवित्र ज्ञान की खोज करें',
    'features.subtitle': 'संतों, शिक्षाओं और दिव्य रूपों के हमारे सावधानीपूर्वक चुने गए संग्रह के माध्यम से भारत की समृद्ध आध्यात्मिक विरासत की यात्रा करें।',
    'features.saints.title': 'महान संत',
    'features.saints.description': 'मीरा बाई, कबीर दास और तुलसीदास जैसे महान संतों की जीवन गाथा और शिक्षाओं की खोज करें',
    'features.living.title': 'जीवित संत',
    'features.living.description': 'समकालीन आध्यात्मिक गुरुओं से जुड़ें जो दिव्य ज्ञान फैलाना जारी रखते हैं',
    'features.divine.title': 'दिव्य रूप',
    'features.divine.description': 'परमात्मा के पवित्र रूपों की खोज करें और उनके गहरे अर्थों को समझें',
    'features.bhajans.title': 'भजन और उद्धरण',
    'features.bhajans.description': 'भक्ति गीतों और प्रेरणादायक आध्यात्मिक उद्धरणों में खुद को डुबोएं',
    'features.horoscope.title': 'दैनिक राशिफल',
    'features.horoscope.description': 'व्यक्तिगत दैनिक, साप्ताहिक और मासिक ज्योतिषीय भविष्यवाणी प्राप्त करें',

    // Live Bhajan Section
    'live.title': '🎬 लाइव भजन स्ट्रीम',
    'live.subtitle': 'भक्ति भजन और आध्यात्मिक सामग्री लाइव स्ट्रीमिंग देखें',
    'live.button': 'लाइव भजन देखें',
    'live.description': 'YouTube से लाइव स्ट्रीमिंग भक्ति भजन और आध्यात्मिक वीडियो का अनुभव करें',
    'live.status': 'अभी लाइव',

    // Mission Section
    'mission.title': 'हमारा पवित्र मिशन',
    'mission.description': 'संतवाणी भारत के महानतम आध्यात्मिक गुरुओं के कालातीत ज्ञान को संरक्षित करने और साझा करने के लिए समर्पित है। हमारा मानना है कि आज की तेज़ गति वाली दुनिया में, इन प्रबुद्ध आत्माओं की शिक्षाएं साधकों को उनकी आध्यात्मिक यात्रा में मार्गदर्शन, शांति और दिशा प्रदान कर सकती हैं।',
    'mission.beta.notice': '🛠️ बीटा संस्करण सूचना: हम निरंतर संतवाणी को बेहतर बना रहे हैं। आपकी प्रतिक्रिया और सुझाव हमारे आध्यात्मिक यात्रा अनुभव को बेहतर बनाने में मदद करते हैं।',
    'mission.quote.sanskrit': '"जहाँ भक्ति है, वहाँ शक्ति है"',
    'mission.quote.english': '"जहाँ भक्ति है, वहाँ दिव्य शक्ति है"',
    'mission.learn.more': 'हमारे बारे में और जानें',
    'mission.feedback': 'प्रतिक्रिया साझा करें',

    // Feedback Form
    'feedback.title': 'अपनी प्रतिक्रिया साझा करें',
    'feedback.subtitle': 'आपकी प्रतिक्रिया हमें सभी भक्तों के लिए एक बेहतर आध्यात्मिक अनुभव बनाने में मदद करती है',
    'feedback.help.title': 'बेहतर सेवा में हमारी मदद करें',
    'feedback.help.description': 'आपके विचार और सुझाव हमारे लिए अमूल्य हैं। हमारे सुरक्षित गूगल फॉर्म के माध्यम से अपनी प्रतिक्रिया साझा करने के लिए नीचे क्लिक करें।',
    'feedback.button.open': 'प्रतिक्रिया फॉर्म खोलें',
    'feedback.button.later': 'बाद में शायद',
    'feedback.footer': '🔒 आपकी प्रतिक्रिया गूगल फॉर्म के माध्यम से सुरक्षित रूप से एकत्र की जाती है',

    // Footer
    'footer.description': 'महान भारतीय संतों के दिव्य ज्ञान और शिक्षाओं को दुनिया भर में फैलाना। आध्यात्मिक साधकों के लिए एक डिजिटल अभयारण्य।',
    'footer.links.title': 'त्वरित लिंक',
    'footer.links.saints': 'संत',
    'footer.links.living': 'जीवित संत',
    'footer.links.divine': 'दिव्य रूप',
    'footer.links.bhajans': 'भजन और उद्धरण',
    'footer.links.donation': 'दान',
    'footer.connect.title': 'जुड़ें',
    'footer.made.with': 'के साथ बनाया गया',
    'footer.made.for': 'दुनिया भर के आध्यात्मिक साधकों के लिए',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('santvaani-language') as Language;
    if (savedLanguage && (savedLanguage === 'EN' || savedLanguage === 'HI')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('santvaani-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(current => current === 'EN' ? 'HI' : 'EN');
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    // Fallback to English if key not found in current language
    const englishTranslation = translations['EN']?.[key];
    if (englishTranslation) {
      return englishTranslation;
    }
    // Last resort: return the key itself
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};