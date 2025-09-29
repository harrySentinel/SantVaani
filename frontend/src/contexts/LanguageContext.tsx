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

    // Horoscope Page
    'horoscope.title': 'Daily Horoscope',
    'horoscope.subtitle': 'Discover what the stars have in store for you with our AI-powered spiritual horoscope readings',
    'horoscope.subtitle.hindi': 'आपके लिए ज्योतिषीय भविष्यवाणी और मार्गदर्शन',
    'horoscope.badge': '✨ AI-Powered Spiritual Guidance',
    'horoscope.select.title': 'Select Your Zodiac Sign',
    'horoscope.select.subtitle': 'Choose your birth sign to get personalized predictions',
    'horoscope.select.placeholder': '🌟 Choose your zodiac sign...',
    'horoscope.tabs.daily': 'Daily',
    'horoscope.tabs.weekly': 'Weekly',
    'horoscope.tabs.monthly': 'Monthly',
    'horoscope.loading': 'Reading the cosmic energies...',
    'horoscope.loading.hindi': 'कॉस्मिक ऊर्जा पढ़ी जा रही है...',
    'horoscope.welcome.title': 'Welcome to Your Cosmic Journey',
    'horoscope.welcome.description': 'Select your zodiac sign above to unlock personalized daily, weekly, and monthly horoscope readings powered by AI and ancient astrological wisdom.',
    'horoscope.welcome.hindi': 'अपनी राशि चुनकर व्यक्तिगत भविष्यवाणी प्राप्त करें',
    'horoscope.period.daily.title': 'Daily Horoscope for',
    'horoscope.period.weekly.title': 'Weekly Horoscope for',
    'horoscope.period.monthly.title': 'Monthly Horoscope for',
    'horoscope.period.daily.subtitle': 'Today\'s cosmic guidance',
    'horoscope.period.weekly.subtitle': 'This week\'s stellar insights',
    'horoscope.period.monthly.subtitle': 'This month\'s celestial wisdom',
    'horoscope.prediction.title': 'Cosmic Prediction',
    'horoscope.summary.prompt': 'Need a quick summary?',
    'horoscope.summary.button': 'Summarize with AI',
    'horoscope.summary.analyzing': 'Analyzing...',
    'horoscope.summary.title': 'संक्षेप में',
    'horoscope.spiritual.guidance': 'Spiritual Guidance:',
    'horoscope.lucky.color': 'Lucky Color / भाग्यशाली रंग',
    'horoscope.lucky.number': 'Lucky Number / भाग्यशाली संख्या',
    'horoscope.share.button': 'Share Your Horoscope',
    'horoscope.empty.daily': 'Select your sign to see today\'s horoscope',
    'horoscope.empty.weekly': 'Select your sign to see this week\'s horoscope',
    'horoscope.empty.monthly': 'Select your sign to see this month\'s horoscope',

    // Did You Know Section
    'didyouknow.title': 'Did You Know?',
    'didyouknow.loading': 'Loading spiritual wisdom...',

    // Daily Guide Page
    'dailyguide.title': 'Daily Spiritual Guide',
    'dailyguide.subtitle': 'Your personal companion for daily spiritual practice, Hindu calendar, and divine guidance',
    'dailyguide.notifications.title': 'Daily Blessings Notifications',
    'dailyguide.notifications.subtitle': 'Get reminded for morning prayers, evening aarti, and festivals',
    'dailyguide.notifications.disable': 'Disable Notifications',
    'dailyguide.notifications.enable': 'Enable Notifications',
    'dailyguide.notifications.morning': 'Morning Prayers',
    'dailyguide.notifications.evening': 'Evening Aarti',
    'dailyguide.notifications.festivals': 'Festival Reminders',
    'dailyguide.notifications.ekadashi': 'Ekadashi Alerts',
    'dailyguide.panchang.title': 'Today\'s Panchang',
    'dailyguide.panchang.live': 'Live',
    'dailyguide.panchang.tithi': 'Tithi',
    'dailyguide.panchang.sunrise': 'Sunrise',
    'dailyguide.panchang.sunset': 'Sunset',
    'dailyguide.panchang.nakshatra': 'Nakshatra',
    'dailyguide.panchang.muhurat': 'Muhurat',
    'dailyguide.panchang.moonphase': 'Moon Phase',
    'dailyguide.mantra.title': 'Today\'s Mantra',
    'dailyguide.mantra.listen': 'Listen',
    'dailyguide.wisdom.title': 'Spiritual Wisdom',
    'dailyguide.festivals.title': 'Upcoming Festivals',
    'dailyguide.festivals.loading': 'Loading upcoming festivals...',
    'dailyguide.festivals.today': 'Today!',
    'dailyguide.festivals.tomorrow': 'Tomorrow',
    'dailyguide.festivals.days': 'days',
    'dailyguide.horoscope.title': 'Daily Horoscope',
    'dailyguide.horoscope.subtitle': 'Discover what the stars have in store for you with personalized daily, weekly, and monthly predictions',
    'dailyguide.horoscope.button': 'View Your Horoscope',
    'dailyguide.horoscope.daily': 'Daily',
    'dailyguide.horoscope.weekly': 'Weekly',
    'dailyguide.horoscope.monthly': 'Monthly',

    // Events Page
    'events.title': 'Spiritual Events',
    'events.subtitle': 'Discover and join spiritual gatherings, bhajans, bhandaras, and satsangs organized by devotees in your community.',
    'events.create.title': 'Organize a Spiritual Event',
    'events.create.subtitle': 'Share your bhajan, bhandara, or satsang with the community',
    'events.create.button': 'Create Event',
    'events.upcoming.title': 'Upcoming Events',
    'events.upcoming.subtitle': 'Join these beautiful spiritual gatherings',
    'events.notify.button': 'Notify Me',
    'events.details.button': 'Details',
    'events.verified': 'Verified',
    'events.notification.on': 'Notification On',
    'events.login.notify': 'Login to Notify',
    'events.no.events.title': 'No Events Available',
    'events.no.events.subtitle': 'No approved events to display at the moment. Check back later!',
    'events.create.first': 'Create First Event',
    'events.community.title': 'Build Spiritual Community',
    'events.community.subtitle': 'Connect with like-minded devotees, share divine experiences, and strengthen our spiritual bonds through meaningful gatherings.',
    'events.community.quote.hindi': 'संगे शक्ति कलयुगे',
    'events.community.quote.english': 'In unity lies strength in this age',
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

    // Horoscope Page
    'horoscope.title': 'दैनिक राशिफल',
    'horoscope.subtitle': 'हमारे AI-संचालित आध्यात्मिक राशिफल पाठन के साथ जानें कि तारे आपके लिए क्या लेकर आए हैं',
    'horoscope.subtitle.hindi': 'आपके लिए ज्योतिषीय भविष्यवाणी और मार्गदर्शन',
    'horoscope.badge': '✨ AI-संचालित आध्यात्मिक मार्गदर्शन',
    'horoscope.select.title': 'अपनी राशि चुनें',
    'horoscope.select.subtitle': 'व्यक्तिगत भविष्यवाणी प्राप्त करने के लिए अपनी जन्म राशि चुनें',
    'horoscope.select.placeholder': '🌟 अपनी राशि चुनें...',
    'horoscope.tabs.daily': 'दैनिक',
    'horoscope.tabs.weekly': 'साप्ताहिक',
    'horoscope.tabs.monthly': 'मासिक',
    'horoscope.loading': 'कॉस्मिक ऊर्जा पढ़ी जा रही है...',
    'horoscope.loading.hindi': 'कॉस्मिक ऊर्जा पढ़ी जा रही है...',
    'horoscope.welcome.title': 'आपकी कॉस्मिक यात्रा में स्वागत है',
    'horoscope.welcome.description': 'AI और प्राचीन ज्योतिषीय ज्ञान द्वारा संचालित व्यक्तिगत दैनिक, साप्ताहिक और मासिक राशिफल पाठन को अनलॉक करने के लिए ऊपर अपनी राशि चुनें।',
    'horoscope.welcome.hindi': 'अपनी राशि चुनकर व्यक्तिगत भविष्यवाणी प्राप्त करें',
    'horoscope.period.daily.title': 'के लिए दैनिक राशिफल',
    'horoscope.period.weekly.title': 'के लिए साप्ताहिक राशिफल',
    'horoscope.period.monthly.title': 'के लिए मासिक राशिफल',
    'horoscope.period.daily.subtitle': 'आज का कॉस्मिक मार्गदर्शन',
    'horoscope.period.weekly.subtitle': 'इस सप्ताह की तारकीय अंतर्दृष्टि',
    'horoscope.period.monthly.subtitle': 'इस महीने की आकाशीय बुद्धि',
    'horoscope.prediction.title': 'कॉस्मिक भविष्यवाणी',
    'horoscope.summary.prompt': 'एक त्वरित सारांश चाहिए?',
    'horoscope.summary.button': 'AI के साथ सारांशित करें',
    'horoscope.summary.analyzing': 'विश्लेषण कर रहे हैं...',
    'horoscope.summary.title': 'संक्षेप में',
    'horoscope.spiritual.guidance': 'आध्यात्मिक मार्गदर्शन:',
    'horoscope.lucky.color': 'भाग्यशाली रंग',
    'horoscope.lucky.number': 'भाग्यशाली संख्या',
    'horoscope.share.button': 'अपना राशिफल साझा करें',
    'horoscope.empty.daily': 'आज का राशिफल देखने के लिए अपनी राशि चुनें',
    'horoscope.empty.weekly': 'इस सप्ताह का राशिफल देखने के लिए अपनी राशि चुनें',
    'horoscope.empty.monthly': 'इस महीने का राशिफल देखने के लिए अपनी राशि चुनें',

    // Did You Know Section
    'didyouknow.title': 'क्या आप जानते हैं?',
    'didyouknow.loading': 'आध्यात्मिक ज्ञान लोड हो रहा है...',

    // Daily Guide Page
    'dailyguide.title': 'दैनिक आध्यात्मिक मार्गदर्शक',
    'dailyguide.subtitle': 'दैनिक आध्यात्मिक अभ्यास, हिंदू पंचांग और दिव्य मार्गदर्शन के लिए आपका व्यक्तिगत साथी',
    'dailyguide.notifications.title': 'दैनिक आशीर्वाद सूचनाएं',
    'dailyguide.notifications.subtitle': 'सुबह की प्रार्थना, शाम की आरती और त्योहारों की याद दिलाने के लिए',
    'dailyguide.notifications.disable': 'सूचनाएं अक्षम करें',
    'dailyguide.notifications.enable': 'सूचनाएं सक्षम करें',
    'dailyguide.notifications.morning': 'सुबह की प्रार्थना',
    'dailyguide.notifications.evening': 'शाम की आरती',
    'dailyguide.notifications.festivals': 'त्योहार अनुस्मारक',
    'dailyguide.notifications.ekadashi': 'एकादशी अलर्ट',
    'dailyguide.panchang.title': 'आज का पंचांग',
    'dailyguide.panchang.live': 'लाइव',
    'dailyguide.panchang.tithi': 'तिथि',
    'dailyguide.panchang.sunrise': 'सूर्योदय',
    'dailyguide.panchang.sunset': 'सूर्यास्त',
    'dailyguide.panchang.nakshatra': 'नक्षत्र',
    'dailyguide.panchang.muhurat': 'मुहूर्त',
    'dailyguide.panchang.moonphase': 'चंद्र स्थिति',
    'dailyguide.mantra.title': 'आज का मंत्र',
    'dailyguide.mantra.listen': 'सुनें',
    'dailyguide.wisdom.title': 'आध्यात्मिक ज्ञान',
    'dailyguide.festivals.title': 'आगामी त्योहार',
    'dailyguide.festivals.loading': 'आगामी त्योहार लोड हो रहे हैं...',
    'dailyguide.festivals.today': 'आज!',
    'dailyguide.festivals.tomorrow': 'कल',
    'dailyguide.festivals.days': 'दिन',
    'dailyguide.horoscope.title': 'दैनिक राशिफल',
    'dailyguide.horoscope.subtitle': 'व्यक्तिगत दैनिक, साप्ताहिक और मासिक भविष्यवाणियों के साथ जानें कि तारे आपके लिए क्या लेकर आए हैं',
    'dailyguide.horoscope.button': 'अपना राशिफल देखें',
    'dailyguide.horoscope.daily': 'दैनिक',
    'dailyguide.horoscope.weekly': 'साप्ताहिक',
    'dailyguide.horoscope.monthly': 'मासिक',

    // Events Page
    'events.title': 'आध्यात्मिक कार्यक्रम',
    'events.subtitle': 'अपने समुदाय के भक्तों द्वारा आयोजित आध्यात्मिक सभाओं, भजनों, भंडारों और सत्संगों की खोज करें और उनमें शामिल हों।',
    'events.create.title': 'आध्यात्मिक कार्यक्रम आयोजित करें',
    'events.create.subtitle': 'अपने भजन, भंडारा या सत्संग को समुदाय के साथ साझा करें',
    'events.create.button': 'कार्यक्रम बनाएं',
    'events.upcoming.title': 'आगामी कार्यक्रम',
    'events.upcoming.subtitle': 'इन सुंदर आध्यात्मिक सभाओं में शामिल हों',
    'events.notify.button': 'मुझे सूचना दें',
    'events.details.button': 'विवरण',
    'events.verified': 'सत्यापित',
    'events.notification.on': 'सूचना चालू',
    'events.login.notify': 'सूचना के लिए लॉगिन करें',
    'events.no.events.title': 'कोई कार्यक्रम उपलब्ध नहीं',
    'events.no.events.subtitle': 'फिलहाल कोई अनुमोदित कार्यक्रम प्रदर्शित करने के लिए नहीं है। बाद में वापस जांचें!',
    'events.create.first': 'पहला कार्यक्रम बनाएं',
    'events.community.title': 'आध्यात्मिक समुदाय का निर्माण करें',
    'events.community.subtitle': 'समान विचारधारा वाले भक्तों से जुड़ें, दिव्य अनुभव साझा करें, और सार्थक सभाओं के माध्यम से हमारे आध्यात्मिक बंधन को मजबूत करें।',
    'events.community.quote.hindi': 'संगे शक्ति कलयुगे',
    'events.community.quote.english': 'इस युग में एकता में शक्ति है',
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