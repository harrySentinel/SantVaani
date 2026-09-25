'use client';

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
    'site.name': 'Santvaani',
    'beta.banner': '✨ Beta Version - Your feedback helps us improve',
    'beta.badge': 'Beta',

    // Hero Section
    'hero.welcome': 'Welcome to Santvaani',
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
    'mission.description': 'Santvaani is dedicated to preserving and sharing the timeless wisdom of India\'s greatest spiritual masters. We believe that in today\'s fast-paced world, the teachings of these enlightened souls can provide guidance, peace, and direction to seekers on their spiritual journey.',
    'mission.beta.notice': '🛠️ Beta Version Notice: We are continuously improving Santvaani. Your feedback and suggestions help us enhance your spiritual journey experience.',
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

    // Bhajans Page
    'bhajans.title': 'Sacred Bhajans',
    'bhajans.subtitle': 'Immerse yourself in sacred melodies through our collection of devotional songs from the great masters.',
    'bhajans.loading': 'Loading sacred content...',
    'bhajans.error.title': 'Error Loading Content',
    'bhajans.error.message': 'Unable to load bhajans. Please try again later.',
    'bhajans.error.retry': 'Try Again',
    'bhajans.songs.count': 'Sacred Songs',
    'bhajans.quotes.count': 'Divine Quotes',
    'bhajans.tab.bhajans': 'Bhajans',
    'bhajans.tab.quotes': 'Quotes',
    'bhajans.section.title': 'Sacred Bhajans',
    'bhajans.section.subtitle': 'Devotional songs that have echoed through temples and hearts for centuries, carrying the divine vibrations of love and surrender.',
    'bhajans.search.placeholder': 'Search by title, author, category, lyrics',
    'bhajans.search.clear': 'Clear',
    'bhajans.search.no.results': 'No bhajans found for',
    'bhajans.search.results': 'Found',
    'bhajans.search.showing': 'Showing',
    'bhajans.quotes.section.title': 'Sacred Quotes',
    'bhajans.quotes.section.subtitle': 'Timeless wisdom and divine teachings from enlightened masters, offering guidance and inspiration for the spiritual journey.',
    'bhajans.card.author': 'by',
    'bhajans.card.meaning': 'Meaning',

    // Contemporary Saints Page
    'livingsaints.title': 'Contemporary Saints',
    'livingsaints.subtitle': 'Connect with contemporary spiritual masters who continue to illuminate the path of devotion, spreading divine wisdom and compassion in our modern world.',
    'livingsaints.loading': 'Loading contemporary saints...',
    'livingsaints.error.title': 'Something went wrong',
    'livingsaints.error.retry': 'Try Again',
    'livingsaints.guides.count': 'Contemporary Guides',
    'livingsaints.search.placeholder': 'Search by name, organization, location, teachings',
    'livingsaints.search.clear': 'Clear',
    'livingsaints.search.no.results': 'No contemporary saints found for',
    'livingsaints.search.results': 'Found',
    'livingsaints.search.showing': 'Showing',
    'livingsaints.card.visit': 'Visit Website',
    'livingsaints.card.learn.more': 'Learn More',
    'livingsaints.empty.title': 'No Contemporary Saints Found',
    'livingsaints.empty.subtitle': 'We\'re working on adding contemporary spiritual masters to our collection.',

    // Divine Forms Page
    'divine.title': 'Divine Forms',
    'divine.subtitle': 'Explore the sacred manifestations of the divine and understand the profound meanings behind each form that has guided humanity for millennia.',
    'divine.loading': 'Loading divine forms...',
    'divine.error.retry': 'Try Again',
    'divine.forms.count': 'Sacred Forms',
    'divine.search.placeholder': 'Search by name, domain, attributes, significance',
    'divine.search.clear': 'Clear',
    'divine.search.no.results': 'No divine forms found for',
    'divine.search.results': 'Found',
    'divine.search.showing': 'Showing',
    'divine.card.learn.more': 'Learn More',
    'divine.empty.title': 'No Divine Forms Found',
    'divine.empty.subtitle': 'We\'re working on adding more sacred forms to our collection.',

    // Saints Page
    'saints.title': 'Great Saints',
    'saints.subtitle': 'Discover the profound wisdom and divine teachings of India\'s most revered spiritual masters who have guided humanity on the path of devotion and enlightenment.',
    'saints.loading.badge': 'Loading Sacred Biographies...',
    'saints.error.title': 'Temporary Issue',
    'saints.error.message': 'We\'re experiencing some technical difficulties. Please try refreshing the page.',
    'saints.error.button': 'Refresh Page',
    'saints.biographies.count': 'Sacred Biographies',
    'saints.page.info': 'Page',
    'saints.page.of': 'of',
    'saints.search.placeholder': 'खोजें: मीरा बाई, कबीर दास, तुलसीदास... (Search by name, region, specialty)',
    'saints.search.clear': 'Clear',
    'saints.search.no.results': 'No saints found for',
    'saints.search.results.found': 'Found',
    'saints.search.results.saint': 'saint',
    'saints.search.results.saints': 'saints',
    'saints.search.results.matching': 'matching',
    'saints.search.results.showing': 'Showing',
    'saints.card.read.more': 'Read More',
    'saints.cta.title': 'Continue Your Spiritual Journey',
    'saints.cta.subtitle': 'Explore more aspects of divine wisdom through our other sections',
    'saints.cta.living.saints': 'Living Saints',
    'saints.cta.divine.forms': 'Divine Forms',

    // Naam Jap Tracker
    'naamjap.title': 'Naam Jap Tracker',
    'naamjap.subtitle': 'Track your spiritual practice and build consistency',
    'naamjap.login.required': 'Login Required',
    'naamjap.login.description': 'To track your Naam Jap journey and keep your data synced across all your devices, please login to your account.',
    'naamjap.login.benefits': 'With login you get:',
    'naamjap.login.benefit.sync': 'Data synced across all devices',
    'naamjap.login.benefit.streak': 'Accurate streak tracking',
    'naamjap.login.benefit.backup': 'Secure cloud backup',
    'naamjap.login.benefit.preservation': 'Lifetime data preservation',
    'naamjap.login.button': 'Login',
    'naamjap.signup.button': 'Sign Up',
    'naamjap.signup.info': 'Create free account • Takes only 30 seconds',
    'naamjap.form.title': 'Log Today\'s Entry',
    'naamjap.form.date': 'Date (Today Only)',
    'naamjap.form.date.locked': '⚠️ Cannot add entries for past dates',
    'naamjap.form.count': 'Naam Jap Count',
    'naamjap.form.count.placeholder': 'e.g., 1080',
    'naamjap.form.count.help': 'How many times did you chant today?',
    'naamjap.form.notes': 'Notes (Optional)',
    'naamjap.form.notes.placeholder': 'Write about your experience...',
    'naamjap.form.save': 'Save Entry',
    'naamjap.form.update': 'Update Entry',
    'naamjap.form.saving': 'Saving...',
    'naamjap.stats.current.streak': 'Current Streak',
    'naamjap.stats.days': 'days',
    'naamjap.stats.day': 'day',
    'naamjap.stats.total.count': 'Total Count',
    'naamjap.stats.longest.streak': 'Longest Streak',
    'naamjap.stats.this.month': 'This Month',
    'naamjap.stats.avg.per.day': 'Avg per Day',
    'naamjap.stats.milestones': 'Milestones',
    'naamjap.stats.achieved': 'Achieved!',
    'naamjap.recent.entries': 'Recent Entries',
    'naamjap.empty.title': 'No entries yet. Start your journey!',
    'naamjap.empty.subtitle': 'Your data is securely stored in the database',
    'naamjap.loading': 'Loading...',
    'naamjap.loading.entries': 'Loading entries...',
    'naamjap.error': 'Error',
    'naamjap.error.invalid': 'Invalid Input',
    'naamjap.error.invalid.number': 'Please enter a valid number',
    'naamjap.error.failed.load': 'Failed to load entries',
    'naamjap.error.failed.save': 'Failed to save entry',
    'naamjap.success.saved': 'Saved Successfully!',
    'naamjap.success.saved.description': 'Your entry has been recorded',
    'naamjap.success.updated': 'Updated Successfully!',
    'naamjap.success.updated.description': 'Your entry has been updated',
    'naamjap.instructions.title': 'How It Works',
    'naamjap.instructions.rule1.title': 'Today Only',
    'naamjap.instructions.rule1.description': 'You can only add or update your entry for today. Once the day passes, it\'s locked forever.',
    'naamjap.instructions.rule2.title': 'One Entry Per Day',
    'naamjap.instructions.rule2.description': 'Add your count for today, and update it anytime during the day. Tomorrow, you start fresh.',
    'naamjap.instructions.rule3.title': 'Authentic Streaks',
    'naamjap.instructions.rule3.description': 'No backdating allowed. If you miss a day, your streak breaks. This ensures genuine daily practice.',
    'naamjap.instructions.rule4.title': 'Daily Discipline',
    'naamjap.instructions.rule4.description': 'Build consistency through daily commitment. Your spiritual journey deserves dedication.',
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

    // Bhajans Page
    'bhajans.title': 'पवित्र भजन',
    'bhajans.subtitle': 'महान गुरुओं के भक्ति गीतों के हमारे संग्रह के माध्यम से पवित्र मधुर स्वरों में डूब जाइए।',
    'bhajans.loading': 'पवित्र सामग्री लोड हो रही है...',
    'bhajans.error.title': 'सामग्री लोड करने में त्रुटि',
    'bhajans.error.message': 'भजन लोड करने में असमर्थ। कृपया बाद में पुनः प्रयास करें।',
    'bhajans.error.retry': 'पुनः प्रयास करें',
    'bhajans.songs.count': 'पवित्र गीत',
    'bhajans.quotes.count': 'दिव्य उद्धरण',
    'bhajans.tab.bhajans': 'भजन',
    'bhajans.tab.quotes': 'उद्धरण',
    'bhajans.section.title': 'पवित्र भजन',
    'bhajans.section.subtitle': 'भक्ति गीत जो सदियों से मंदिरों और हृदयों में गूंजते आए हैं, प्रेम और समर्पण की दिव्य कंपन लेकर।',
    'bhajans.search.placeholder': 'शीर्षक, लेखक, श्रेणी, बोल द्वारा खोजें',
    'bhajans.search.clear': 'साफ़ करें',
    'bhajans.search.no.results': 'के लिए कोई भजन नहीं मिला',
    'bhajans.search.results': 'मिले',
    'bhajans.search.showing': 'दिखाया जा रहा',
    'bhajans.quotes.section.title': 'पवित्र उद्धरण',
    'bhajans.quotes.section.subtitle': 'प्रबुद्ध गुरुओं से कालातीत ज्ञान और दिव्य शिक्षाएं, आध्यात्मिक यात्रा के लिए मार्गदर्शन और प्रेरणा प्रदान करती हैं।',
    'bhajans.card.author': 'द्वारा',
    'bhajans.card.meaning': 'अर्थ',

    // Contemporary Saints Page
    'livingsaints.title': 'समकालीन संत',
    'livingsaints.subtitle': 'समकालीन आध्यात्मिक गुरुओं से जुड़ें जो भक्ति के मार्ग को रोशन करना जारी रखते हैं, हमारी आधुनिक दुनिया में दिव्य ज्ञान और करुणा फैलाते हैं।',
    'livingsaints.loading': 'समकालीन संत लोड हो रहे हैं...',
    'livingsaints.error.title': 'कुछ गलत हुआ',
    'livingsaints.error.retry': 'पुनः प्रयास करें',
    'livingsaints.guides.count': 'समकालीन गुरु',
    'livingsaints.search.placeholder': 'नाम, संगठन, स्थान, शिक्षाओं द्वारा खोजें',
    'livingsaints.search.clear': 'साफ़ करें',
    'livingsaints.search.no.results': 'के लिए कोई समकालीन संत नहीं मिले',
    'livingsaints.search.results': 'मिले',
    'livingsaints.search.showing': 'दिखाया जा रहा',
    'livingsaints.card.visit': 'वेबसाइट पर जाएं',
    'livingsaints.card.learn.more': 'और जानें',
    'livingsaints.empty.title': 'कोई समकालीन संत नहीं मिले',
    'livingsaints.empty.subtitle': 'हम अपने संग्रह में समकालीन आध्यात्मिक गुरुओं को जोड़ने पर काम कर रहे हैं।',

    // Divine Forms Page
    'divine.title': 'दिव्य रूप',
    'divine.subtitle': 'दिव्य की पवित्र अभिव्यक्तियों का अन्वेषण करें और उन प्रत्येक रूप के गहन अर्थों को समझें जिन्होंने सहस्राब्दियों से मानवता का मार्गदर्शन किया है।',
    'divine.loading': 'दिव्य रूप लोड हो रहे हैं...',
    'divine.error.retry': 'पुनः प्रयास करें',
    'divine.forms.count': 'पवित्र रूप',
    'divine.search.placeholder': 'नाम, क्षेत्र, गुण, महत्व द्वारा खोजें',
    'divine.search.clear': 'साफ़ करें',
    'divine.search.no.results': 'के लिए कोई दिव्य रूप नहीं मिले',
    'divine.search.results': 'मिले',
    'divine.search.showing': 'दिखाया जा रहा',
    'divine.card.learn.more': 'और जानें',
    'divine.empty.title': 'कोई दिव्य रूप नहीं मिले',
    'divine.empty.subtitle': 'हम अपने संग्रह में और अधिक पवित्र रूप जोड़ने पर काम कर रहे हैं।',

    // Saints Page
    'saints.title': 'महान संत',
    'saints.subtitle': 'भारत के सबसे सम्मानित आध्यात्मिक गुरुओं की गहन बुद्धि और दिव्य शिक्षाओं की खोज करें जिन्होंने भक्ति और प्रबोधन के पथ पर मानवता का मार्गदर्शन किया है।',
    'saints.loading.badge': 'पवित्र जीवनियां लोड हो रही हैं...',
    'saints.error.title': 'अस्थायी समस्या',
    'saints.error.message': 'हमें कुछ तकनीकी कठिनाइयों का सामना हो रहा है। कृपया पेज को रीफ्रेश करने का प्रयास करें।',
    'saints.error.button': 'पेज रीफ्रेश करें',
    'saints.biographies.count': 'पवित्र जीवनियां',
    'saints.page.info': 'पेज',
    'saints.page.of': 'का',
    'saints.search.placeholder': 'खोजें: मीरा बाई, कबीर दास, तुलसीदास... (नाम, क्षेत्र, विशेषता द्वारा खोजें)',
    'saints.search.clear': 'साफ़ करें',
    'saints.search.no.results': 'के लिए कोई संत नहीं मिले',
    'saints.search.results.found': 'मिले',
    'saints.search.results.saint': 'संत',
    'saints.search.results.saints': 'संत',
    'saints.search.results.matching': 'मेल खाते हुए',
    'saints.search.results.showing': 'दिखाया जा रहा',
    'saints.card.read.more': 'और पढ़ें',
    'saints.cta.title': 'अपनी आध्यात्मिक यात्रा जारी रखें',
    'saints.cta.subtitle': 'हमारे अन्य अनुभागों के माध्यम से दिव्य ज्ञान के और पहलुओं का अन्वेषण करें',
    'saints.cta.living.saints': 'जीवित संत',
    'saints.cta.divine.forms': 'दिव्य रूप',

    // Naam Jap Tracker
    'naamjap.title': 'नाम जप ट्रैकर',
    'naamjap.subtitle': 'अपनी आध्यात्मिक साधना को ट्रैक करें और निरंतरता बनाएं',
    'naamjap.login.required': 'लॉगिन आवश्यक है',
    'naamjap.login.description': 'अपनी नाम जप यात्रा को ट्रैक करने और अपने सभी उपकरणों में डेटा को सिंक रखने के लिए, कृपया अपने खाते में लॉगिन करें।',
    'naamjap.login.benefits': 'लॉगिन करने से आप पाएंगे:',
    'naamjap.login.benefit.sync': 'सभी उपकरणों में सिंक किया गया डेटा',
    'naamjap.login.benefit.streak': 'सटीक स्ट्रीक ट्रैकिंग',
    'naamjap.login.benefit.backup': 'सुरक्षित क्लाउड बैकअप',
    'naamjap.login.benefit.preservation': 'जीवन भर का डेटा संरक्षण',
    'naamjap.login.button': 'लॉगिन करें',
    'naamjap.signup.button': 'साइन अप करें',
    'naamjap.signup.info': 'मुफ्त खाता बनाएं • केवल 30 सेकंड लगते हैं',
    'naamjap.form.title': 'आज की प्रविष्टि दर्ज करें',
    'naamjap.form.date': 'तारीख (केवल आज)',
    'naamjap.form.date.locked': '⚠️ पिछली तारीखों के लिए एंट्री नहीं जोड़ी जा सकती',
    'naamjap.form.count': 'नाम जप गिनती',
    'naamjap.form.count.placeholder': 'जैसे: 1080',
    'naamjap.form.count.help': 'आज आपने कितनी बार नाम जप किया?',
    'naamjap.form.notes': 'नोट्स (वैकल्पिक)',
    'naamjap.form.notes.placeholder': 'अपने अनुभव के बारे में कुछ लिखें...',
    'naamjap.form.save': 'प्रविष्टि सहेजें',
    'naamjap.form.update': 'प्रविष्टि अपडेट करें',
    'naamjap.form.saving': 'सहेजा जा रहा है...',
    'naamjap.stats.current.streak': 'वर्तमान स्ट्रीक',
    'naamjap.stats.days': 'दिन',
    'naamjap.stats.day': 'दिन',
    'naamjap.stats.total.count': 'कुल गिनती',
    'naamjap.stats.longest.streak': 'सबसे लंबी स्ट्रीक',
    'naamjap.stats.this.month': 'इस महीने',
    'naamjap.stats.avg.per.day': 'औसत प्रति दिन',
    'naamjap.stats.milestones': 'माइलस्टोन',
    'naamjap.stats.achieved': 'प्राप्त!',
    'naamjap.recent.entries': 'हाल की प्रविष्टियां',
    'naamjap.empty.title': 'अभी तक कोई प्रविष्टि नहीं। अपनी यात्रा शुरू करें!',
    'naamjap.empty.subtitle': 'आपका डेटा सुरक्षित रूप से डेटाबेस में संग्रहीत है',
    'naamjap.loading': 'लोड हो रहा है...',
    'naamjap.loading.entries': 'एंट्रीज़ लोड हो रही हैं...',
    'naamjap.error': 'त्रुटि',
    'naamjap.error.invalid': 'अमान्य इनपुट',
    'naamjap.error.invalid.number': 'कृपया एक मान्य संख्या दर्ज करें',
    'naamjap.error.failed.load': 'एंट्रीज़ लोड करने में विफल',
    'naamjap.error.failed.save': 'प्रविष्टि सहेजने में विफल',
    'naamjap.success.saved': 'सफलतापूर्वक सहेजा गया!',
    'naamjap.success.saved.description': 'आपकी प्रविष्टि दर्ज की गई',
    'naamjap.success.updated': 'सफलतापूर्वक अपडेट किया गया!',
    'naamjap.success.updated.description': 'आपकी प्रविष्टि अपडेट की गई',
    'naamjap.instructions.title': 'यह कैसे काम करता है',
    'naamjap.instructions.rule1.title': 'केवल आज',
    'naamjap.instructions.rule1.description': 'आप केवल आज की प्रविष्टि जोड़ या अपडेट कर सकते हैं। दिन बीत जाने के बाद, यह हमेशा के लिए लॉक हो जाती है।',
    'naamjap.instructions.rule2.title': 'दिन में एक बार',
    'naamjap.instructions.rule2.description': 'आज की गिनती जोड़ें, और दिन के दौरान कभी भी इसे अपडेट करें। कल, आप नए सिरे से शुरू करेंगे।',
    'naamjap.instructions.rule3.title': 'प्रामाणिक स्ट्रीक',
    'naamjap.instructions.rule3.description': 'पिछली तारीख की एंट्री नहीं। यदि आप एक दिन चूक जाते हैं, तो आपकी स्ट्रीक टूट जाती है। यह वास्तविक दैनिक अभ्यास सुनिश्चित करता है।',
    'naamjap.instructions.rule4.title': 'दैनिक अनुशासन',
    'naamjap.instructions.rule4.description': 'दैनिक प्रतिबद्धता के माध्यम से निरंतरता बनाएं। आपकी आध्यात्मिक यात्रा समर्पण की मांग करती है।',
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