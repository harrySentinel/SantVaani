'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Flame,
  Gift,
  Heart,
  Leaf,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Volume2,
  Wind,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteLink from '@/components/SiteLink';
import { usePanchang } from '@/hooks/usePanchang';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/contexts/LanguageContext';

type DayTheme = {
  en: string;
  hi: string;
  deity: string;
  deityHi: string;
  color: string;
  soft: string;
  icon: typeof Sun;
  significance: string;
  significanceHi: string;
  vrat: string;
  vratHi: string;
  practice: string;
  practiceHi: string;
  mantra: string;
};

const DAY_THEMES: Record<number, DayTheme> = {
  0: {
    en: 'Sunday', hi: 'रविवार', deity: 'Surya', deityHi: 'सूर्य देव', color: '#d97706', soft: '#fff7df', icon: Sun,
    significance: 'A day for vitality, gratitude, and bringing more light into your actions.',
    significanceHi: 'ऊर्जा, कृतज्ञता और अपने कर्मों में अधिक प्रकाश लाने का दिन।',
    vrat: 'Ravivar Vrat', vratHi: 'रविवार व्रत', practice: 'Begin with three moments of gratitude and face the morning light in silence.', practiceHi: 'तीन कृतज्ञताओं के साथ दिन शुरू करें और प्रातः के प्रकाश में कुछ क्षण मौन रहें।', mantra: 'ॐ आदित्याय नमः',
  },
  1: {
    en: 'Monday', hi: 'सोमवार', deity: 'Shiva', deityHi: 'भगवान शिव', color: '#2563eb', soft: '#eef5ff', icon: Moon,
    significance: 'A day to soften the mind, turn inward, and remember the stillness within.',
    significanceHi: 'मन को शांत करने, भीतर लौटने और अपने अंतर की स्थिरता को याद करने का दिन।',
    vrat: 'Somvar Vrat', vratHi: 'सोमवार व्रत', practice: 'Sit quietly for five minutes. Let each exhalation carry away one unnecessary thought.', practiceHi: 'पाँच मिनट शांत बैठें। हर श्वास छोड़ते हुए एक अनावश्यक विचार को जाने दें।', mantra: 'ॐ नमः शिवाय',
  },
  2: {
    en: 'Tuesday', hi: 'मंगलवार', deity: 'Hanuman', deityHi: 'हनुमान जी', color: '#dc2626', soft: '#fff0ed', icon: Flame,
    significance: 'A day for courage, disciplined effort, and devotion that becomes action.',
    significanceHi: 'साहस, अनुशासित प्रयास और कर्म में बदलने वाली भक्ति का दिन।',
    vrat: 'Mangalvar Vrat', vratHi: 'मंगलवार व्रत', practice: 'Choose one difficult task and approach it with steadiness rather than force.', practiceHi: 'एक कठिन कार्य चुनें और उसे जल्दबाज़ी नहीं, स्थिरता के साथ पूरा करें।', mantra: 'ॐ हनुमते नमः',
  },
  3: {
    en: 'Wednesday', hi: 'बुधवार', deity: 'Ganesha', deityHi: 'गणेश जी', color: '#059669', soft: '#ecfdf5', icon: Leaf,
    significance: 'A day for clarity, learning, and removing the small obstacles that cloud the path.',
    significanceHi: 'स्पष्टता, सीखने और मार्ग में आए छोटे अवरोधों को दूर करने का दिन।',
    vrat: 'Budhvar Vrat', vratHi: 'बुधवार व्रत', practice: 'Read one page of wisdom slowly, then write the one insight you want to carry today.', practiceHi: 'ज्ञान का एक पृष्ठ धीरे-धीरे पढ़ें और आज साथ रखने वाली एक सीख लिखें।', mantra: 'ॐ गं गणपतये नमः',
  },
  4: {
    en: 'Thursday', hi: 'गुरुवार', deity: 'Guru', deityHi: 'गुरु तत्व', color: '#b45309', soft: '#fffbeb', icon: BookOpen,
    significance: 'A day to honour teachers, wisdom, humility, and the light received from those before us.',
    significanceHi: 'गुरु, ज्ञान, विनम्रता और पूर्वजों से मिले प्रकाश का सम्मान करने का दिन।',
    vrat: 'Guruvar Vrat', vratHi: 'गुरुवार व्रत', practice: 'Offer respect to a teacher, elder, or book that has quietly shaped your life.', practiceHi: 'किसी गुरु, बड़े या उस पुस्तक का सम्मान करें जिसने आपके जीवन को दिशा दी है।', mantra: 'ॐ गुरवे नमः',
  },
  5: {
    en: 'Friday', hi: 'शुक्रवार', deity: 'Lakshmi', deityHi: 'माता लक्ष्मी', color: '#db2777', soft: '#fdf2f8', icon: Heart,
    significance: 'A day for beauty with meaning, generous hearts, and gratitude for what is already present.',
    significanceHi: 'अर्थपूर्ण सौंदर्य, उदार हृदय और जीवन में उपस्थित समृद्धि के लिए कृतज्ञता का दिन।',
    vrat: 'Shukravar Vrat', vratHi: 'शुक्रवार व्रत', practice: 'Make one corner of your home beautiful, then share one act of kindness without announcement.', practiceHi: 'घर के एक कोने को सुंदर बनाएं और बिना बताए एक दयालु कर्म करें।', mantra: 'ॐ श्रीं महालक्ष्म्यै नमः',
  },
  6: {
    en: 'Saturday', hi: 'शनिवार', deity: 'Shani', deityHi: 'शनि देव', color: '#4f46e5', soft: '#eef2ff', icon: Moon,
    significance: 'A day for patience, honest self-reflection, service, and the dignity of steady work.',
    significanceHi: 'धैर्य, ईमानदार आत्मचिंतन, सेवा और निरंतर कर्म की गरिमा का दिन।',
    vrat: 'Shanivar Vrat', vratHi: 'शनिवार व्रत', practice: 'Serve quietly, simplify one desire, and let patience become your strength today.', practiceHi: 'निस्वार्थ सेवा करें, एक इच्छा को सरल बनाएं और धैर्य को अपनी शक्ति बनने दें।', mantra: 'ॐ शं शनैश्चराय नमः',
  },
};

const formatNumber = (value: number) => String(value).padStart(2, '0');

export default function DailyGuideContent() {
  const { language } = useLanguage();
  const HI = language === 'HI';
  const { panchang, loading: panchangLoading } = usePanchang();
  const { todaysContent, loading: contentLoading } = useSpiritualContent();
  const { requestPermission, scheduleNotifications } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const [practiceRunning, setPracticeRunning] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState({ morning: true, evening: true, festivals: true, ekadashi: true });

  const now = useMemo(() => new Date(), []);
  const theme = DAY_THEMES[now.getDay()];
  const ThemeIcon = theme.icon;
  const today = now.toLocaleDateString(HI ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const festivals = todaysContent?.festivals || [];
  const mantra = todaysContent?.mantra;
  const quote = todaysContent?.quote;
  const isLoading = panchangLoading || contentLoading;
  const practiceMinutes = Math.floor(practiceSeconds / 60);
  const practiceRemainder = practiceSeconds % 60;
  const practiceComplete = practiceSeconds >= 300;

  useEffect(() => {
    if (!practiceRunning) return;
    const timer = window.setInterval(() => {
      setPracticeSeconds(current => {
        if (current >= 300) {
          setPracticeRunning(false);
          return 300;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [practiceRunning]);

  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const permission = await requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      scheduleNotifications(selectedReminders);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: HI ? 'आज — संतवाणी' : 'Aaj — Santvaani',
      text: HI ? `${theme.hi}: ${theme.significanceHi}` : `${theme.en}: ${theme.significance}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // Sharing can be cancelled by the user; no error state is needed for that interaction.
    }
  };

  const reminderLabels = [
    { key: 'morning' as const, en: 'Morning stillness', hi: 'प्रातः साधना', time: '6:00 AM' },
    { key: 'evening' as const, en: 'Evening reflection', hi: 'संध्या चिंतन', time: '6:00 PM' },
    { key: 'festivals' as const, en: 'Festival reminders', hi: 'त्योहार स्मरण', time: HI ? 'ज़रूरत पर' : 'As needed' },
    { key: 'ekadashi' as const, en: 'Ekadashi alerts', hi: 'एकादशी अलर्ट', time: HI ? 'मासिक' : 'Monthly' },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f0e7] text-[#251b16] selection:bg-orange-200">
      <Navbar />

      <main>
        {/* The masthead is intentionally atmospheric: Aaj should feel like opening a daily journal. */}
        <section className="relative isolate overflow-hidden bg-[#191511] text-[#fff9ed]">
          <div className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at 75% 18%, ${theme.color}55 0, transparent 28%), radial-gradient(circle at 15% 90%, #b4530938 0, transparent 32%), linear-gradient(125deg, #191511 0%, #2d2118 52%, #17120f 100%)` }} />
          <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-20 h-[22rem] w-[22rem] rounded-full border border-white/10" />
          <div className="absolute right-16 top-16 h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_40px_16px_rgba(251,191,36,0.35)]" />
          <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#f6f0e7] to-transparent" />

          <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8 md:pb-32 md:pt-20">
            <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="mb-10 flex items-center gap-3 text-sm text-amber-100/65">
                  <span className="font-serif text-2xl text-amber-200">ॐ</span>
                  <span className="h-px w-12 bg-amber-200/40" />
                  <span>{HI ? 'संतवाणी का दैनिक पृष्ठ' : 'Santvaani’s daily page'}</span>
                </div>
                <p className="font-mukta text-5xl leading-none text-amber-200 sm:text-7xl md:text-8xl">{HI ? 'आज' : 'Aaj'}</p>
                <h1 className="mt-5 max-w-3xl font-tiro text-4xl font-normal leading-[1.08] tracking-normal text-white sm:text-5xl md:text-6xl">
                  {HI ? 'आज को थोड़ा अधिक अर्थपूर्ण बनाएं।' : 'Make today a little more meaningful.'}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                  {HI ? 'आज के दिन की परंपरा, उसका भाव और एक छोटी साधना — सब एक शांत जगह पर।' : 'The meaning of today, the wisdom behind it, and one small practice — gathered in one quiet place.'}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href="#today" className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-[#3b2616] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-[#191511]">
                    {HI ? 'आज का भाव जानें' : 'Meet today'} <ArrowRight className="h-4 w-4" />
                  </a>
                  <button onClick={handleNotificationToggle} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-200">
                    <Bell className="h-4 w-4" /> {notificationsEnabled ? (HI ? 'स्मरण चालू है' : 'Reminders on') : (HI ? 'दैनिक स्मरण' : 'Daily reminders')}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="relative mx-auto w-full max-w-sm lg:ml-auto">
                <div className="relative aspect-square rounded-full border border-amber-100/20 bg-[#fff7df]/[0.06] p-5 shadow-2xl backdrop-blur-sm">
                  <div className="flex h-full flex-col items-center justify-center rounded-full border border-amber-100/20 bg-[#f6d58b]/[0.08] text-center">
                    <ThemeIcon className="mb-5 h-8 w-8 text-amber-200" strokeWidth={1.2} />
                    <p className="font-mukta text-3xl text-amber-100">{theme.hi}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/45">{theme.en}</p>
                    <div className="my-5 h-px w-12 bg-amber-100/30" />
                    <p className="font-serif text-2xl text-white">{theme.deity}</p>
                    <p className="mt-1 text-sm text-white/55">{theme.deityHi}</p>
                  </div>
                  <span className="absolute left-2 top-1/2 h-2 w-2 rounded-full bg-amber-200" />
                  <span className="absolute right-7 top-12 h-1.5 w-1.5 rounded-full bg-white/60" />
                  <span className="absolute bottom-12 left-12 h-1.5 w-1.5 rounded-full bg-orange-300" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/65 backdrop-blur-md">
                  {today}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div id="today" className="relative mx-auto -mt-8 max-w-7xl px-5 pb-20 sm:px-8">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.25 }} className="relative overflow-hidden rounded-[2rem] bg-[#fffaf1] shadow-[0_24px_80px_rgba(83,52,22,0.12)] ring-1 ring-[#dbc8aa]/70">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_70%_30%,rgba(234,88,12,0.13),transparent_60%)]" />
            <div className="relative grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-7 sm:p-10 md:p-14">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  <Sparkles className="h-4 w-4" /> {HI ? 'आज का भाव' : 'The spirit of today'}
                </div>
                <h2 className="mt-5 max-w-2xl font-tiro text-3xl font-normal leading-tight tracking-normal text-[#2b1c13] sm:text-4xl md:text-5xl">
                  {HI ? `${theme.hi} — ${theme.deityHi} को समर्पित एक शांत शुरुआत` : `${theme.en} — a quiet beginning in the spirit of ${theme.deity}`}
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6f5b49]">
                  {HI ? theme.significanceHi : theme.significance}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f5e6c7] px-3 py-1.5 text-xs font-semibold text-[#7c4a1d]">{HI ? theme.vratHi : theme.vrat}</span>
                  <span className="rounded-full bg-[#f3eee5] px-3 py-1.5 text-xs font-medium text-[#7b6b5c]">{HI ? 'दैनिक चिंतन' : 'Daily reflection'}</span>
                </div>
              </div>
              <div className="relative flex min-h-[18rem] flex-col justify-between bg-[#2f241b] p-7 text-[#fff8ea] sm:p-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">{HI ? 'आज का संकल्प' : 'A small intention'}</p>
                  <p className="mt-5 font-tiro text-2xl font-normal leading-relaxed tracking-normal text-amber-50">“{HI ? theme.practiceHi : theme.practice}”</p>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/45">{HI ? 'आज का मंत्र' : 'Mantra for today'}</p>
                    <p className="mt-1 text-lg text-amber-100">{theme.mantra}</p>
                  </div>
                  <ThemeIcon className="h-11 w-11 text-amber-200/60" strokeWidth={1} />
                </div>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-6 py-10 md:grid-cols-3">
            <article className="rounded-[1.5rem] bg-[#e9f0eb] p-7 ring-1 ring-[#c8d9cc]">
              <div className="flex items-center justify-between"><Wind className="h-6 w-6 text-emerald-700" strokeWidth={1.5} /><span className="text-xs font-semibold text-emerald-800">01</span></div>
              <h3 className="mt-8 font-tiro text-2xl font-normal tracking-normal text-[#21382b]">{HI ? 'थोड़ा ठहरें' : 'Pause for a moment'}</h3>
              <p className="mt-3 text-sm leading-7 text-[#4d6655]">{HI ? 'आज की भागदौड़ के बीच पाँच मिनट अपने लिए रखें।' : 'Give yourself five unhurried minutes between the noise of the day.'}</p>
              <a href="#practice" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">{HI ? 'अभ्यास शुरू करें' : 'Begin the practice'} <ArrowRight className="h-4 w-4" /></a>
            </article>
            <article className="rounded-[1.5rem] bg-[#eee9f5] p-7 ring-1 ring-[#d9cce9]">
              <div className="flex items-center justify-between"><BookOpen className="h-6 w-6 text-violet-700" strokeWidth={1.5} /><span className="text-xs font-semibold text-violet-800">02</span></div>
              <h3 className="mt-8 font-tiro text-2xl font-normal tracking-normal text-[#332548]">{HI ? 'थोड़ा पढ़ें' : 'Read a little deeper'}</h3>
              <p className="mt-3 text-sm leading-7 text-[#665777]">{HI ? 'आज के भाव से जुड़ी किसी संत की सीख या कथा पढ़ें।' : 'Let today’s theme lead you into a saint’s teaching or a longer story.'}</p>
              <SiteLink to="/prabhu-ki-leelaayen" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-800">{HI ? 'कथाएं खोलें' : 'Explore the stories'} <ArrowRight className="h-4 w-4" /></SiteLink>
            </article>
            <article className="rounded-[1.5rem] bg-[#f7e9d8] p-7 ring-1 ring-[#e8cbaa]">
              <div className="flex items-center justify-between"><Heart className="h-6 w-6 text-orange-700" strokeWidth={1.5} /><span className="text-xs font-semibold text-orange-800">03</span></div>
              <h3 className="mt-8 font-tiro text-2xl font-normal tracking-normal text-[#482718]">{HI ? 'थोड़ा सुनें' : 'Listen with attention'}</h3>
              <p className="mt-3 text-sm leading-7 text-[#765642]">{HI ? 'अपने मन के अनुकूल एक भजन के साथ दिन को कोमल बनाएं।' : 'Let one bhajan soften the edges of the day and bring you back to yourself.'}</p>
              <SiteLink to="/bhajans" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-800">{HI ? 'भजन सुनें' : 'Find a bhajan'} <ArrowRight className="h-4 w-4" /></SiteLink>
            </article>
          </section>

          <section id="practice" className="grid scroll-mt-24 gap-7 lg:grid-cols-[1fr_0.72fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#1f2923] p-7 text-white sm:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-emerald-100/10" />
              <div className="relative z-10 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/70">{HI ? 'आज का अभ्यास' : 'Practice of the day'}</p>
                  <h2 className="mt-3 font-tiro text-3xl font-normal tracking-normal text-emerald-50">{HI ? 'श्वास में लौटना' : 'Return to the breath'}</h2>
                  <p className="mt-2 text-sm text-white/55">{HI ? 'पाँच मिनट · बिना किसी तैयारी के' : 'Five minutes · no preparation needed'}</p>
                </div>
                <div className="rounded-full border border-emerald-100/20 bg-emerald-100/10 px-3 py-1.5 text-xs text-emerald-100">{practiceComplete ? (HI ? 'पूरा हुआ' : 'Complete') : (HI ? 'आरंभिक' : 'Beginner')}</div>
              </div>
              <div className="relative z-10 mt-9 grid items-center gap-8 sm:grid-cols-[auto_1fr]">
                <div className={`relative flex h-36 w-36 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-100/[0.08] ${practiceRunning ? 'shadow-[0_0_0_18px_rgba(167,243,208,0.04),0_0_80px_rgba(167,243,208,0.16)]' : ''}`}>
                  <div className={`absolute inset-5 rounded-full border border-emerald-200/20 bg-emerald-100/[0.08] transition-transform duration-[4000ms] ${practiceRunning ? 'scale-110' : 'scale-95'}`} />
                  <span className="relative z-10 font-mono text-xl text-emerald-100">{formatNumber(practiceMinutes)}:{formatNumber(practiceRemainder)}</span>
                </div>
                <div>
                  <p className="max-w-md text-base leading-7 text-white/70">{HI ? 'आराम से बैठें। श्वास को बदलें नहीं — केवल महसूस करें। विचार आएं तो उन्हें जाने दें और धीरे से श्वास पर लौटें।' : 'Sit comfortably. Do not change the breath — simply notice it. When a thought arrives, let it pass and return gently to the next breath.'}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setPracticeRunning(current => !current)} disabled={practiceComplete} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-3 text-sm font-semibold text-[#1f2923] transition hover:bg-white disabled:cursor-default disabled:opacity-70">
                      {practiceRunning ? <Pause className="h-4 w-4" /> : practiceComplete ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                      {practiceRunning ? (HI ? 'रोकें' : 'Pause') : practiceComplete ? (HI ? 'अभ्यास पूरा' : 'Practice complete') : (HI ? 'शुरू करें' : 'Start practice')}
                    </button>
                    <button onClick={() => { setPracticeSeconds(0); setPracticeRunning(false); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 text-sm text-white/65 transition hover:border-white/35 hover:text-white"><RotateCcw className="h-4 w-4" /> {HI ? 'फिर से' : 'Reset'}</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#fffaf1] p-7 ring-1 ring-[#dbc8aa]/70 sm:p-9">
              <div className="flex items-center gap-2 text-orange-700"><Sparkles className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{HI ? 'आज का मंत्र' : 'Mantra for today'}</span></div>
              <p className="mt-9 font-mukta text-3xl leading-relaxed text-[#3d281b]">{mantra?.sanskrit || theme.mantra}</p>
              <p className="mt-3 text-sm font-medium text-orange-800">{mantra?.transliteration || theme.mantra}</p>
              <p className="mt-5 text-sm leading-7 text-[#776453]">{HI ? mantra?.meaningHi || 'आज के अभ्यास के साथ इस मंत्र को श्रद्धा से दोहराएं।' : mantra?.meaning || 'Repeat this gently with the practice of the day, without rushing toward an outcome.'}</p>
              <div className="mt-7 flex items-center gap-2 border-t border-[#eadcc8] pt-5 text-xs text-[#927c67]"><Volume2 className="h-4 w-4 text-orange-600" /> {HI ? 'मंत्र को धीरे-धीरे दोहराएं' : 'Let the mantra be unhurried'}</div>
            </div>
          </section>

          <section className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[#fffaf1] p-7 ring-1 ring-[#dbc8aa]/70 sm:p-9">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#745b42]"><CalendarDays className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{HI ? 'आज का आकाश' : 'Today’s sky'}</span></div><span className="rounded-full bg-[#f3eadb] px-2.5 py-1 text-[10px] font-semibold text-[#856b50]">{HI ? 'पंचांग' : 'Panchang'}</span></div>
              {isLoading ? <div className="mt-8 space-y-4 animate-pulse"><div className="h-6 w-3/4 rounded bg-[#eee3d2]" /><div className="h-4 w-1/2 rounded bg-[#eee3d2]" /><div className="grid grid-cols-2 gap-3"><div className="h-20 rounded-xl bg-[#eee3d2]" /><div className="h-20 rounded-xl bg-[#eee3d2]" /></div></div> : <>
                <p className="mt-8 font-tiro text-2xl font-normal tracking-normal text-[#342318]">{panchang?.tithi || todaysContent?.specialDay?.name || (HI ? 'आज की तिथि' : 'Today’s tithi')}</p>
                <p className="mt-1 text-sm text-[#8a725c]">{panchang?.nakshatra || (HI ? 'नक्षत्र जानकारी' : 'Nakshatra information')}</p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    { icon: Sunrise, label: HI ? 'सूर्योदय' : 'Sunrise', value: panchang?.sunrise || '6:15 AM' },
                    { icon: Sunset, label: HI ? 'सूर्यास्त' : 'Sunset', value: panchang?.sunset || '6:45 PM' },
                    { icon: Moon, label: HI ? 'चंद्र स्थिति' : 'Moon phase', value: HI ? 'बढ़ता हुआ' : 'Waxing' },
                    { icon: Clock3, label: HI ? 'शुभ समय' : 'Auspicious window', value: panchang?.muhurat || '8:30 AM' },
                  ].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl bg-[#f6efe3] p-4"><Icon className="h-4 w-4 text-orange-700" strokeWidth={1.5} /><p className="mt-4 text-[11px] text-[#947c65]">{label}</p><p className="mt-1 text-sm font-semibold text-[#4b3524]">{value}</p></div>)}
                </div>
              </>}
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[#34241b] p-7 text-white sm:p-9">
              <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="relative flex items-center gap-2 text-amber-200"><Heart className="h-5 w-5" fill="currentColor" strokeWidth={1.5} /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{HI ? 'आज की याद' : 'A thought to carry'}</span></div>
              <blockquote className="relative mt-9 max-w-2xl font-tiro text-2xl font-normal leading-relaxed tracking-normal text-[#fff4df] sm:text-3xl">“{HI ? quote?.quoteHi || quote?.quote || 'मन को शांत करें और सत्य के निकट आएं।' : quote?.quote || 'The mind is everything. What you think, you become.'}”</blockquote>
              <p className="relative mt-6 text-sm font-medium text-amber-200/75">— {HI ? quote?.authorHi || quote?.author || 'Santvaani' : quote?.author || 'Santvaani'}</p>
              <div className="relative mt-10 flex flex-wrap gap-3"><SiteLink to="/bhajans" className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2.5 text-sm font-semibold text-[#3b291c] transition hover:bg-white">{HI ? 'एक भजन चुनें' : 'Choose a bhajan'} <ArrowRight className="h-4 w-4" /></SiteLink><button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-white/70 transition hover:border-white/40 hover:text-white">{shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {shared ? (HI ? 'कॉपी हो गया' : 'Copied') : (HI ? 'साझा करें' : 'Share today')}</button></div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-[#dbc8aa] bg-[#efe1cd] p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="flex items-center gap-2 text-[#976327]"><Gift className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{HI ? 'आने वाले पर्व' : 'Coming into focus'}</span></div><h2 className="mt-3 font-tiro text-3xl font-normal tracking-normal text-[#3b291d]">{HI ? 'आने वाले विशेष दिन' : 'Days worth remembering'}</h2></div><p className="max-w-sm text-sm leading-6 text-[#765d45]">{HI ? 'कैलेंडर को केवल तारीखों की सूची नहीं, एक तैयारी का अवसर बनाएं।' : 'Let the calendar become an invitation to prepare, not just a list of dates.'}</p></div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">{festivals.length ? festivals.slice(0, 3).map((festival, index) => <div key={`${festival.id}-${index}`} className="rounded-2xl bg-[#fff9ef]/70 p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-lg font-semibold text-[#402c1d]">{HI ? festival.nameHi || festival.name : festival.name}</h3><span className="whitespace-nowrap rounded-full bg-[#f0d4a9] px-2 py-1 text-[10px] font-bold text-[#7a4a1c]">{festival.daysLeft === 0 ? (HI ? 'आज' : 'Today') : festival.daysLeft === 1 ? (HI ? 'कल' : 'Tomorrow') : `${festival.daysLeft} ${HI ? 'दिन' : 'days'}`}</span></div><p className="mt-3 text-sm leading-6 text-[#806954]">{HI ? festival.significanceHi || festival.significance : festival.significance}</p></div>) : <div className="rounded-2xl bg-[#fff9ef]/70 p-5 text-sm text-[#806954]">{HI ? 'विशेष दिनों की जानकारी शीघ्र आएगी।' : 'Special days will appear here as the calendar unfolds.'}</div>}</div>
          </section>

          <section className="mt-8 grid gap-7 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-[2rem] bg-[#fffaf1] p-7 ring-1 ring-[#dbc8aa]/70 sm:p-9">
              <div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-orange-700"><Flame className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">{HI ? 'व्रत और परंपरा' : 'Vrat & tradition'}</span></div><h2 className="mt-4 font-tiro text-3xl font-normal tracking-normal text-[#362419]">{HI ? `${theme.vratHi} का भाव` : 'Considering a fast today?'}</h2></div><div className="hidden rounded-full bg-[#f5e6c7] p-4 sm:block"><ThemeIcon className="h-6 w-6 text-[#9b5f21]" /></div></div>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#745f4c]">{HI ? `${theme.vratHi} ${theme.deityHi} से जुड़ी एक पारंपरिक साधना है। इसे अपनी क्षमता, स्वास्थ्य और परिवार की परंपरा के अनुसार समझदारी से अपनाएं।` : `${theme.vrat} is a traditional observance connected with ${theme.deity}. Let it be a personal act of attention, adapted respectfully to your health, capacity, and family tradition.`}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#f8f0e2] p-4"><Check className="h-4 w-4 text-orange-700" /><p className="mt-3 text-sm font-semibold text-[#4d3625]">{HI ? 'संकल्प' : 'Intention'}</p><p className="mt-1 text-xs leading-5 text-[#907963]">{HI ? 'मन को एक दिशा दें' : 'Give the mind one direction'}</p></div><div className="rounded-2xl bg-[#f8f0e2] p-4"><Check className="h-4 w-4 text-orange-700" /><p className="mt-3 text-sm font-semibold text-[#4d3625]">{HI ? 'संयम' : 'Simplicity'}</p><p className="mt-1 text-xs leading-5 text-[#907963]">{HI ? 'भोजन और वाणी में सजगता' : 'Awareness in food and speech'}</p></div><div className="rounded-2xl bg-[#f8f0e2] p-4"><Check className="h-4 w-4 text-orange-700" /><p className="mt-3 text-sm font-semibold text-[#4d3625]">{HI ? 'सेवा' : 'Seva'}</p><p className="mt-1 text-xs leading-5 text-[#907963]">{HI ? 'भक्ति को कर्म बनाएं' : 'Let devotion become action'}</p></div></div>
              <p className="mt-6 text-xs leading-5 text-[#9b846e]">{HI ? 'व्रत की विधियां क्षेत्र और परंपरा के अनुसार बदल सकती हैं। स्वास्थ्य संबंधी निर्णय के लिए अपने चिकित्सक की सलाह लें।' : 'Fasting practices vary by region and tradition. For health-related decisions, follow advice from a qualified medical professional.'}</p>
            </div>

            <div className="rounded-[2rem] bg-[#e6edf4] p-7 ring-1 ring-[#c8d8e6] sm:p-9">
              <div className="flex items-center justify-between"><Bell className="h-6 w-6 text-sky-700" strokeWidth={1.5} /><button onClick={() => setRemindersOpen(open => !open)} className="rounded-full p-2 text-sky-700 transition hover:bg-white/60" aria-label={HI ? 'स्मरण सेटिंग खोलें' : 'Open reminder settings'}><ChevronDown className={`h-5 w-5 transition-transform ${remindersOpen ? 'rotate-180' : ''}`} /></button></div>
              <h2 className="mt-8 font-tiro text-2xl font-normal tracking-normal text-[#263746]">{HI ? 'कल फिर मिलें' : 'Return tomorrow'}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d7181]">{HI ? 'सुबह की शांति, शाम का चिंतन और विशेष दिनों की याद — अपने समय पर।' : 'A morning pause, an evening reflection, and a gentle reminder when a special day arrives.'}</p>
              <button onClick={handleNotificationToggle} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#263746] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b2934]">{notificationsEnabled ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4" />} {notificationsEnabled ? (HI ? 'स्मरण सक्रिय' : 'Reminders active') : (HI ? 'स्मरण शुरू करें' : 'Set reminders')}</button>
              {remindersOpen && <div className="mt-6 space-y-2 border-t border-sky-900/10 pt-5">{reminderLabels.map(item => <label key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-white/55 px-3 py-2.5 text-sm text-[#4d6271]"><span>{HI ? item.hi : item.en}<small className="ml-2 text-xs text-[#8195a4]">{item.time}</small></span><input type="checkbox" checked={selectedReminders[item.key]} onChange={event => setSelectedReminders(previous => ({ ...previous, [item.key]: event.target.checked }))} className="h-4 w-4 accent-sky-700" /></label>)}</div>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
