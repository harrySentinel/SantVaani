import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Share2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface MockPostProps {
  initials: string;
  name: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  className?: string;
  delay?: number;
}

const MockPost = ({ initials, name, time, text, likes, comments, className = '', delay = 0 }: MockPostProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, ease: 'easeOut', delay }}
    className={`bg-white rounded-2xl border border-gray-100 shadow-[0_8px_28px_rgba(0,0,0,0.08)] p-4 space-y-3 ${className}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {initials}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{name}</p>
        <p className="text-[11px] text-gray-400">{time}</p>
      </div>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span className="flex items-center gap-1">
        <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
        {likes}
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle className="w-3.5 h-3.5" />
        {comments}
      </span>
    </div>
  </motion.div>
);

const LandingSantvaaniSpaceSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-8 md:p-10 shadow-md"
        >
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-3 shadow-md mx-auto md:mx-0">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
                {language === 'HI' ? 'समुदाय' : 'Community'}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {language === 'HI' ? 'संतवाणी स्पेस' : 'Santvaani Space'}
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto md:mx-0">
                {language === 'HI'
                  ? 'आध्यात्मिक सोशल फीड। प्रेरक पोस्ट, कहानियां और ज्ञान साझा करें।'
                  : 'A spiritual social feed. Share posts, stories, and wisdom with fellow seekers.'}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap justify-center md:justify-start">
                {['Jai Shri Ram', 'Meditation', 'Bhagavad Gita'].map(tag => (
                  <span key={tag} className="text-xs bg-orange-50/80 border border-orange-100 text-orange-500 px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
              <div className="pt-3">
                <Link to="/santvaani-space">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full gap-2 shadow-md shadow-orange-200"
                  >
                    {language === 'HI' ? 'स्पेस देखें' : 'Explore Space'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stacked mock posts */}
            <div className="relative pb-6">
              <MockPost
                initials="AS"
                name="Ananya Sharma"
                time={language === 'HI' ? '2 घंटे पहले' : '2h ago'}
                text={language === 'HI'
                  ? 'सुबह की शुरुआत जय श्री राम के 108 जाप के साथ की। यह शांति पूरे दिन आपके साथ रहती है।'
                  : 'Started my morning with 108 chants of Jai Shri Ram. The calm stays with you all day.'}
                likes={128}
                comments={24}
                className="relative z-10 -rotate-1"
                delay={0.15}
              />
              <MockPost
                initials="RK"
                name="Ravi Kumar"
                time={language === 'HI' ? '5 घंटे पहले' : '5h ago'}
                text={language === 'HI'
                  ? 'कबीर दास का यह दोहा आज मेरे मन को बहुत भा गया — साझा कर रहा हूँ।'
                  : 'Sharing a Kabir Das doha that stayed with me all week — simple words, deep truth.'}
                likes={96}
                comments={12}
                className="rotate-2 -mt-5 ml-8 mr-2"
                delay={0.3}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingSantvaaniSpaceSection;
