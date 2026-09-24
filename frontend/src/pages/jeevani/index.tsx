import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData, { BreadcrumbSchema } from '@/components/StructuredData';
import { MapPin, Flower2, Sparkles, HandHeart, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">{children}</p>
  </div>
);

const FACTS = [
  {
    icon: MapPin,
    label: { EN: 'Where', HI: 'स्थान' },
    value: { EN: 'Vrindavan, Uttar Pradesh', HI: 'वृंदावन, उत्तर प्रदेश' },
  },
  {
    icon: Flower2,
    label: { EN: 'Tradition', HI: 'परंपरा' },
    value: { EN: 'Vaishnav Bhakti · Radha-Krishna devotion', HI: 'वैष्णव भक्ति · राधा-कृष्ण उपासना' },
  },
  {
    icon: Sparkles,
    label: { EN: 'Known for', HI: 'प्रसिद्धि' },
    value: { EN: 'Daily satsang & spiritual guidance', HI: 'दैनिक सत्संग व आध्यात्मिक मार्गदर्शन' },
  },
];

const TEACHINGS = [
  {
    icon: HandHeart,
    title: { EN: 'Bhakti above all', HI: 'सर्वोपरि भक्ति' },
    text: {
      EN: 'His satsangs return again and again to one idea — that heartfelt devotion to Radha-Krishna, offered without expectation, is itself the path.',
      HI: 'उनके सत्संगों का केंद्र एक ही भाव है — बिना किसी अपेक्षा के राधा-कृष्ण के प्रति सच्ची भक्ति ही स्वयं मार्ग है।',
    },
  },
  {
    icon: Flower2,
    title: { EN: 'Simplicity & vairagya', HI: 'सरलता व वैराग्य' },
    text: {
      EN: 'He lives simply in Vrindavan, and speaks often of detachment from material comfort as something to be embraced gently, not forced.',
      HI: 'वे वृंदावन में सरल जीवन जीते हैं और भौतिक सुखों से वैराग्य को बलपूर्वक नहीं, सहजता से अपनाने की बात करते हैं।',
    },
  },
  {
    icon: BookOpen,
    title: { EN: 'Answers rooted in scripture', HI: 'शास्त्र आधारित उत्तर' },
    text: {
      EN: 'Seekers bring him everyday questions — grief, doubt, relationships — and his replies are grounded in the Bhagavad Gita and Bhakti tradition.',
      HI: 'साधक अपने रोज़मर्रा के प्रश्न — दुख, संशय, रिश्ते — लेकर आते हैं, और उनके उत्तर भगवद गीता व भक्ति परंपरा पर आधारित होते हैं।',
    },
  },
  {
    icon: Heart,
    title: { EN: 'Grace amid hardship', HI: 'कष्ट में भी समभाव' },
    text: {
      EN: 'He has lived for years with serious health challenges, yet continues his daily satsang — a quiet teaching on acceptance that his followers often speak of.',
      HI: 'वर्षों से गंभीर स्वास्थ्य कठिनाइयों के बावजूद वे नियमित सत्संग जारी रखते हैं — समभाव की यह शांत शिक्षा उनके अनुयायी अक्सर स्मरण करते हैं।',
    },
  },
];

const Jeevani = () => {
  const { language } = useLanguage();
  const L = language === 'HI' ? 'HI' : 'EN';

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <SEO
        title="Premanand Ji Maharaj — Life & Teachings | Jeevani"
        description="The life, teachings, and daily satsang of Premanand Ji Maharaj — a Vrindavan-based Vaishnav bhakti saint known for guiding seekers with wisdom rooted in the Bhagavad Gita and devotion to Radha-Krishna."
        canonical="https://santvaani.com/jeevani"
        keywords="Premanand Ji Maharaj, Vrindavan saint, bhakti, Radha Krishna, satsang, jeevani, spiritual teacher, vaishnav sant"
      />
      <StructuredData
        type="person"
        name="Premanand Ji Maharaj"
        alternateName="प्रेमानंद जी महाराज"
        description="A Vrindavan-based Vaishnav bhakti saint known for his daily satsang and spiritual guidance rooted in devotion to Radha-Krishna."
        knowsAbout={['Bhakti Yoga', 'Vaishnav Tradition', 'Bhagavad Gita', 'Vrindavan Spirituality']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://santvaani.com' },
          { name: 'Jeevani', url: 'https://santvaani.com/jeevani' },
        ]}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-14">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[130px] opacity-40" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[420px] h-[420px] bg-amber-200 rounded-full blur-[120px] opacity-30" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-200 ring-4 ring-white">
                <span className="text-4xl text-white select-none" style={{ fontFamily: 'serif' }}>ॐ</span>
              </div>
            </div>

            <SectionLabel>{L === 'HI' ? 'जीवनी' : 'Jeevani'}</SectionLabel>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Premanand Ji Maharaj
            </h1>
            <p className="text-lg md:text-xl text-orange-600 font-medium mt-1">
              प्रेमानंद जी महाराज
            </p>

            <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mt-5">
              {L === 'HI'
                ? 'वृंदावन के एक भक्ति संत, जो अपने दैनिक सत्संग और सरल, गीता-आधारित मार्गदर्शन के लिए जाने जाते हैं।'
                : 'A Vrindavan-based bhakti saint, known for daily satsang and simple, scripture-rooted guidance to seekers.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Quick facts ── */}
      <section className="relative pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FACTS.map((fact, idx) => {
              const Icon = fact.icon;
              return (
                <motion.div
                  key={fact.label.EN}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: idx * 0.08 }}
                  className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">{fact.label[L]}</p>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{fact.value[L]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Sticky section nav ── */}
      <div className="sticky top-16 z-20 bg-[#faf8f5]/90 backdrop-blur-md border-b border-orange-100/60 mt-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'story', label: { EN: 'Story', HI: 'जीवन कथा' } },
              { id: 'teachings', label: { EN: 'Teachings', HI: 'शिक्षाएं' } },
              { id: 'legacy', label: { EN: 'Legacy', HI: 'विरासत' } },
            ].map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex-shrink-0 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors rounded-full px-4 py-2"
              >
                {item.label[L]}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Story ── */}
      <section id="story" className="relative py-14 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel>{L === 'HI' ? 'जीवन कथा' : 'The Story'}</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
            {L === 'HI' ? 'भक्ति की ओर एक यात्रा' : 'A Life Turned Toward Bhakti'}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="bg-white/70 backdrop-blur-md border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-gray-700 leading-relaxed"
          >
            <p>
              <span className="float-left text-6xl leading-[0.8] font-bold text-orange-400 mr-3 mt-1" style={{ fontFamily: 'serif' }}>
                {L === 'HI' ? 'प्रे' : 'P'}
              </span>
              {L === 'HI'
                ? 'मानंद जी महाराज वर्तमान समय के उन संतों में से हैं जिन्होंने अपना जीवन पूर्णतः वृंदावन और राधा-कृष्ण भक्ति को समर्पित कर दिया है। वे श्री हित राधा केली कुंज आश्रम से जुड़े हैं, जहाँ वे नियमित रूप से सत्संग करते हैं और दूर-दूर से आए साधकों के प्रश्नों का उत्तर देते हैं।'
                : 'remanand Ji Maharaj is among today\'s Vrindavan-based saints who has devoted his life fully to bhakti — devotion to Radha-Krishna. He is associated with the Sri Hit Radha Keli Kunj ashram, where he holds regular satsang and answers questions from seekers who travel to hear him.'}
            </p>
            <p>
              {L === 'HI'
                ? 'उनकी बातचीत का ढंग सीधा और सरल है — वे जटिल शास्त्रीय विचारों को रोज़मर्रा के उदाहरणों से समझाते हैं, जिससे उनकी बात हर उम्र और पृष्ठभूमि के लोगों तक पहुँचती है। यही सरलता उनके सत्संग को इतना लोकप्रिय बनाती है।'
                : 'His manner of speaking is direct and unadorned — he explains complex scriptural ideas through everyday examples, which is part of why his satsang resonates with people across ages and backgrounds. That simplicity has made his teaching widely followed, especially online.'}
            </p>
            <p className="text-sm text-gray-400 italic">
              {L === 'HI'
                ? '(यह जीवनी सार्वजनिक रूप से ज्ञात जानकारी पर आधारित है। सटीक तिथियों व विवरणों की पुष्टि शीघ्र जोड़ी जाएगी।)'
                : "(This account is drawn from widely known public information. Precise dates and further detail will be added and verified soon.)"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Teachings ── */}
      <section id="teachings" className="relative py-14 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel>{L === 'HI' ? 'शिक्षाएं' : 'Teachings'}</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
            {L === 'HI' ? 'सत्संग के केंद्रीय भाव' : 'Themes from His Satsang'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {TEACHINGS.map((teaching, idx) => {
              const Icon = teaching.icon;
              return (
                <motion.div
                  key={teaching.title.EN}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: idx * 0.08 }}
                  className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-3 shadow-md shadow-orange-200">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{teaching.title[L]}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{teaching.text[L]}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Legacy ── */}
      <section id="legacy" className="relative py-14 scroll-mt-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 md:p-10 text-center text-white shadow-[0_12px_40px_rgba(249,115,22,0.25)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <SectionLabel>
              <span className="text-white/80">{L === 'HI' ? 'विरासत' : 'Legacy'}</span>
            </SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {L === 'HI' ? 'सरलता में एक बढ़ती हुई पहचान' : 'A Growing Following, Held Simply'}
            </h2>
            <p className="text-white/85 max-w-xl mx-auto leading-relaxed">
              {L === 'HI'
                ? 'सोशल मीडिया के माध्यम से लाखों साधकों तक पहुँचने के बावजूद, वे वृंदावन में अपने सरल जीवन में स्थिर हैं — उनकी शिक्षाओं की पहुँच जितनी बढ़ी है, उनका जीवन उतना ही सरल बना हुआ है।'
                : "Even as satsang clips carry his teaching to millions online, his life in Vrindavan has stayed simple — the reach of his words has grown far more than his lifestyle ever has."}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jeevani;
