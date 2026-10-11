'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Flame,
  Heart,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sunrise,
  Sunset,
  Volume2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteLink from '@/components/SiteLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePanchang } from '@/hooks/usePanchang';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';
import { useNotifications } from '@/hooks/useNotifications';

type LanguageText = { en: string; hi: string };

type WeekdayLens = LanguageText & {
  deity: LanguageText;
  mantra: string;
  practice: LanguageText;
  meaning: LanguageText;
  accent: string;
};

const WEEKDAY_LENSES: Record<number, WeekdayLens> = {
  0: {
    en: 'Sunday', hi: 'रविवार', deity: { en: 'Surya', hi: 'सूर्य देव' }, mantra: 'ॐ आदित्याय नमः',
    practice: { en: 'Begin with gratitude for the light and energy that sustain your life.', hi: 'अपने जीवन को संभालने वाले प्रकाश और ऊर्जा के लिए कृतज्ञता से दिन शुरू करें।' },
    meaning: { en: 'A traditional lens for vitality, clarity, and gratitude.', hi: 'ऊर्जा, स्पष्टता और कृतज्ञता को देखने का एक पारंपरिक दृष्टिकोण।' }, accent: '#a16207',
  },
  1: {
    en: 'Monday', hi: 'सोमवार', deity: { en: 'Shiva', hi: 'भगवान शिव' }, mantra: 'ॐ नमः शिवाय',
    practice: { en: 'Sit quietly for five minutes and let each exhalation soften one unnecessary thought.', hi: 'पाँच मिनट शांत बैठें और हर श्वास छोड़ते हुए एक अनावश्यक विचार को जाने दें।' },
    meaning: { en: 'A traditional lens for stillness, reflection, and inward attention.', hi: 'स्थिरता, चिंतन और भीतर लौटने का एक पारंपरिक दृष्टिकोण।' }, accent: '#1d4ed8',
  },
  2: {
    en: 'Tuesday', hi: 'मंगलवार', deity: { en: 'Hanuman', hi: 'हनुमान जी' }, mantra: 'ॐ हनुमते नमः',
    practice: { en: 'Choose one difficult task and approach it with steadiness rather than force.', hi: 'एक कठिन कार्य चुनें और उसे जल्दबाज़ी नहीं, स्थिरता के साथ पूरा करें।' },
    meaning: { en: 'A traditional lens for courage, discipline, and devoted action.', hi: 'साहस, अनुशासन और समर्पित कर्म का एक पारंपरिक दृष्टिकोण।' }, accent: '#b91c1c',
  },
  3: {
    en: 'Wednesday', hi: 'बुधवार', deity: { en: 'Ganesha', hi: 'गणेश जी' }, mantra: 'ॐ गं गणपतये नमः',
    practice: { en: 'Read one page slowly, then write down the one insight you want to carry today.', hi: 'ज्ञान का एक पृष्ठ धीरे पढ़ें और आज साथ रखने वाली एक सीख लिखें।' },
    meaning: { en: 'A traditional lens for learning, clarity, and removing small obstacles.', hi: 'सीखने, स्पष्टता और छोटे अवरोधों को दूर करने का एक पारंपरिक दृष्टिकोण।' }, accent: '#047857',
  },
  4: {
    en: 'Thursday', hi: 'गुरुवार', deity: { en: 'Guru', hi: 'गुरु तत्व' }, mantra: 'ॐ गुरवे नमः',
    practice: { en: 'Offer respect to a teacher, elder, or book that has quietly shaped your life.', hi: 'किसी गुरु, बड़े या उस पुस्तक का सम्मान करें जिसने आपके जीवन को दिशा दी है।' },
    meaning: { en: 'A traditional lens for wisdom, humility, and the light received from teachers.', hi: 'ज्ञान, विनम्रता और गुरु से मिले प्रकाश का एक पारंपरिक दृष्टिकोण।' }, accent: '#92400e',
  },
  5: {
    en: 'Friday', hi: 'शुक्रवार', deity: { en: 'Lakshmi', hi: 'माता लक्ष्मी' }, mantra: 'ॐ श्रीं महालक्ष्म्यै नमः',
    practice: { en: 'Make one corner of your home beautiful, then share one quiet act of kindness.', hi: 'घर के एक कोने को सुंदर बनाएं और बिना बताए एक दयालु कर्म करें।' },
    meaning: { en: 'A traditional lens for beauty with meaning, generosity, and gratitude.', hi: 'अर्थपूर्ण सौंदर्य, उदारता और कृतज्ञता का एक पारंपरिक दृष्टिकोण।' }, accent: '#be185d',
  },
  6: {
    en: 'Saturday', hi: 'शनिवार', deity: { en: 'Shani', hi: 'शनि देव' }, mantra: 'ॐ शं शनैश्चराय नमः',
    practice: { en: 'Serve quietly, simplify one desire, and let patience become your strength.', hi: 'निस्वार्थ सेवा करें, एक इच्छा को सरल बनाएं और धैर्य को अपनी शक्ति बनने दें।' },
    meaning: { en: 'A traditional lens for patience, service, and honest self-reflection.', hi: 'धैर्य, सेवा और ईमानदार आत्मचिंतन का एक पारंपरिक दृष्टिकोण।' }, accent: '#4338ca',
  },
};

const text = (value: LanguageText, hindi: boolean) => hindi ? value.hi : value.en;
const pad = (value: number) => String(value).padStart(2, '0');

export default function DailyGuideContent() {
  const { language } = useLanguage();
  const hindi = language === 'HI';
  const { panchang, loading: panchangLoading } = usePanchang();
  const { todaysContent, loading: contentLoading } = useSpiritualContent();
  const { requestPermission, scheduleNotifications } = useNotifications();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [practiceRunning, setPracticeRunning] = useState(false);
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const [shared, setShared] = useState(false);
  const reminders = { morning: true, evening: true, festivals: true, ekadashi: true };

  const today = useMemo(() => new Date(), []);
  const lens = WEEKDAY_LENSES[today.getDay()];
  const dateLabel = today.toLocaleDateString(hindi ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const festivals = todaysContent?.festivals ?? [];
  const todayEvent = festivals.find(festival => festival.daysLeft === 0);
  const nextFestival = festivals.find(festival => festival.daysLeft > 0);
  const isLoading = panchangLoading || contentLoading;
  const complete = practiceSeconds >= 300;
  const minutes = Math.floor(practiceSeconds / 60);
  const seconds = practiceSeconds % 60;

  useEffect(() => {
    if (!practiceRunning) return;
    const timer = window.setInterval(() => {
      setPracticeSeconds(value => {
        if (value >= 300) {
          setPracticeRunning(false);
          return 300;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [practiceRunning]);

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const permission = await requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      scheduleNotifications(reminders);
    }
  };

  const sharePage = async () => {
    const share = {
      title: hindi ? 'दैनिक धर्म — संतवाणी' : 'Daily Dharma — Santvaani',
      text: todayEvent ? text({ en: todayEvent.significance, hi: todayEvent.significanceHi }, hindi) : text(lens.meaning, hindi),
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(share);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // The share sheet can be dismissed without requiring an error message.
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#29231e]">
      <Navbar />
      <main>
        <header className="border-b border-[#d9d0c3] bg-[#f4f0e8]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1fr_0.62fr] md:pb-24 md:pt-20">
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a5d20]">
                <span className="font-serif text-xl normal-case">ॐ</span>
                <span className="h-px w-10 bg-[#caa77c]" />
                {hindi ? 'संतवाणी का आध्यात्मिक पंचांग' : 'Santvaani’s spiritual almanac'}
              </div>
              <h1 className="mt-9 max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-[#29231e] sm:text-7xl md:text-8xl">
                {hindi ? 'दैनिक धर्म' : 'Daily Dharma'}
              </h1>
              <p className="mt-7 max-w-xl font-tiro text-2xl font-normal leading-relaxed tracking-normal text-[#624f3d] sm:text-3xl">
                {hindi ? 'आज के अर्थ को समझें। अपनी साधना चुनें।' : 'Understand the meaning of today. Choose your practice.'}
              </p>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#776858]">
                {hindi ? 'पर्व, व्रत, परंपरा और दैनिक चिंतन को एक विश्वसनीय, शांत और गहरे अनुभव में पढ़ें।' : 'A considered guide to observances, traditions, and daily reflection — with room for both context and practice.'}
              </p>
              <a href="#significance" className="mt-8 inline-flex items-center gap-2 border-b border-[#9a5d20] pb-1 text-sm font-semibold text-[#754619] transition hover:border-[#29231e] hover:text-[#29231e]">
                {hindi ? 'आज की जानकारी पढ़ें' : 'Read today’s entry'} <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <div className="flex flex-col justify-end border-l border-[#d9d0c3] pl-6 md:pl-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#927964]">{hindi ? 'आज' : 'Today'}</p>
              <p className="mt-3 font-tiro text-3xl font-normal tracking-normal text-[#29231e]">{dateLabel}</p>
              <div className="mt-8 border-t border-[#d9d0c3] pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#927964]">{hindi ? 'साप्ताहिक संदर्भ' : 'Weekday context'}</p>
                <p className="mt-2 font-serif text-2xl text-[#29231e]">{text(lens, hindi)}</p>
                <p className="mt-1 text-sm text-[#786858]">{hindi ? `परंपरागत रूप से ${lens.deity.hi} से जुड़ा` : `Traditionally associated with ${lens.deity.en}`}</p>
              </div>
              <button onClick={toggleNotifications} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#bca78e] px-4 py-2.5 text-sm font-semibold text-[#68492f] transition hover:bg-[#e9dfd1] focus:outline-none focus:ring-2 focus:ring-[#9a5d20]">
                <Bell className="h-4 w-4" /> {notificationsEnabled ? (hindi ? 'स्मरण सक्रिय' : 'Reminders active') : (hindi ? 'दैनिक स्मरण पाएं' : 'Receive daily reminders')}
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <section id="significance" className="scroll-mt-24 border-b border-[#d9d0c3] py-14 md:py-20">
            <div className="grid gap-10 md:grid-cols-[0.38fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">01 / {hindi ? 'आज का संदर्भ' : 'Today’s context'}</p>
                <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-[#29231e] md:text-4xl">{hindi ? 'आज विशेष क्यों है?' : 'What is meaningful today?'}</h2>
              </div>
              <div className="max-w-3xl">
                {todayEvent ? (
                  <>
                    <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-[#e6d4bc] px-3 py-1.5 text-xs font-semibold text-[#70451f]">{hindi ? 'आज का पर्व / व्रत' : 'Today’s observance'}</span><span className="text-sm text-[#806f5e]">{hindi ? todayEvent.nameHi || todayEvent.name : todayEvent.name}</span></div>
                    <p className="mt-7 font-tiro text-3xl font-normal leading-relaxed tracking-normal text-[#3d3025] md:text-4xl">{hindi ? todayEvent.significanceHi || todayEvent.significance : todayEvent.significance}</p>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-[#776858]">{hindi ? 'इस दिन की परंपराएं परिवार, क्षेत्र और संप्रदाय के अनुसार अलग हो सकती हैं। यहां दी गई जानकारी समझने और अपनी साधना चुनने के लिए है।' : 'Observances can vary by family, region, and tradition. This entry is here to offer context so you can choose your practice with understanding.'}</p>
                  </>
                ) : (
                  <>
                    <p className="font-tiro text-3xl font-normal leading-relaxed tracking-normal text-[#3d3025] md:text-4xl">{hindi ? 'हर दिन किसी बड़े पर्व का नाम नहीं होता। फिर भी हर दिन ध्यान, कृतज्ञता और अच्छे कर्म के लिए स्थान रखता है।' : 'Not every day carries a major festival. Every day, however, can make room for attention, gratitude, and a good action.'}</p>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-[#776858]">{hindi ? lens.meaning.hi : lens.meaning.en} {hindi ? 'इसे किसी अनिवार्य नियम की तरह नहीं, एक वैकल्पिक चिंतन की तरह पढ़ें।' : 'Read this as an optional traditional lens, not as a universal rule.'}</p>
                  </>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-4"><button onClick={sharePage} className="inline-flex items-center gap-2 text-sm font-semibold text-[#754619] hover:text-[#29231e]">{shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {shared ? (hindi ? 'लिंक कॉपी हो गया' : 'Link copied') : (hindi ? 'आज साझा करें' : 'Share today')}</button><span className="h-4 w-px bg-[#cfc1b1]" /><span className="text-sm text-[#907e6b]">{hindi ? `आज का संदर्भ: ${lens.deity.hi}` : `Weekday lens: ${lens.deity.en}`}</span></div>
              </div>
            </div>
          </section>

          <section className="grid gap-10 border-b border-[#d9d0c3] py-14 md:grid-cols-[1fr_0.8fr] md:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">02 / {hindi ? 'व्रत और परंपरा' : 'Vrat & tradition'}</p>
              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-[#29231e] md:text-4xl">{todayEvent?.category === 'vrat' ? (hindi ? 'आज के व्रत को समझें' : 'Understanding today’s vrat') : (hindi ? 'यदि आप आज व्रत रख रहे हैं' : 'If you are observing a fast')}</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#776858]">{todayEvent?.category === 'vrat' ? (hindi ? 'व्रत केवल भोजन छोड़ने का नाम नहीं है। यह संकल्प, संयम, स्मरण और सेवा का अभ्यास भी हो सकता है। अपनी परंपरा और स्वास्थ्य के अनुसार इसका रूप चुनें।' : 'A vrat is not only about leaving food. It can also be an exercise in intention, restraint, remembrance, and service. Follow the form that suits your tradition and health.') : (hindi ? 'हर दिन व्रत का दिन नहीं होता। यदि आप अपनी परंपरा के अनुसार आज उपवास कर रहे हैं, तो इसे समझदारी, पर्याप्त जल और अपने स्वास्थ्य का ध्यान रखते हुए करें।' : 'Every day is not a vrat day. If your tradition calls for a fast today, observe it with care, adequate hydration where appropriate, and attention to your health.')}</p>
              <p className="mt-5 text-xs leading-6 text-[#9a8978]">{hindi ? 'व्रत की विधियां क्षेत्र और परंपरा के अनुसार बदलती हैं। स्वास्थ्य संबंधी निर्णय के लिए योग्य चिकित्सक की सलाह लें।' : 'Fasting practices vary across regions and traditions. Seek qualified medical advice for health-related decisions.'}</p>
            </div>
            <div className="border-t border-[#d9d0c3] pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <p className="text-xs uppercase tracking-[0.18em] text-[#927964]">{hindi ? 'सरल संकल्प' : 'A simple intention'}</p>
              <p className="mt-5 font-tiro text-2xl font-normal leading-relaxed tracking-normal text-[#3d3025]">“{text(lens.practice, hindi)}”</p>
              <div className="mt-7 space-y-3 text-sm text-[#786858]"><p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9a5d20]" />{hindi ? 'भोजन और वाणी में सजगता' : 'Bring awareness to food and speech.'}</p><p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9a5d20]" />{hindi ? 'भक्ति को किसी अच्छे कर्म में बदलें' : 'Turn devotion into one good action.'}</p><p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9a5d20]" />{hindi ? 'इसे प्रदर्शन नहीं, निजी साधना रखें' : 'Keep it as a personal practice, not a performance.'}</p></div>
            </div>
          </section>

          <section id="practice" className="scroll-mt-24 border-b border-[#d9d0c3] py-14 md:py-20">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">03 / {hindi ? 'आज की साधना' : 'Today’s practice'}</p><h2 className="mt-4 font-serif text-3xl font-medium text-[#29231e] md:text-4xl">{hindi ? 'पाँच मिनट अपने लिए' : 'Five minutes for yourself'}</h2></div><p className="max-w-md text-sm leading-7 text-[#776858]">{hindi ? 'यह एक वैकल्पिक अभ्यास है — आज के भाव से जुड़ने का शांत तरीका।' : 'An optional practice: a quiet way to connect with the spirit of the day.'}</p></div>
            <div className="mt-10 grid gap-10 lg:grid-cols-[0.82fr_1fr]">
              <div className="flex min-h-[20rem] items-center justify-center bg-[#2e2924] p-8 text-center text-[#f6ead8]">
                <div><div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-[#d7b887]/50 ${practiceRunning ? 'shadow-[0_0_0_20px_rgba(215,184,135,0.08)]' : ''}`}><div className={`flex h-24 w-24 items-center justify-center rounded-full border border-[#d7b887]/30 transition-transform duration-[4000ms] ${practiceRunning ? 'scale-110' : 'scale-95'}`}><span className="font-mono text-lg">{pad(minutes)}:{pad(seconds)}</span></div></div><p className="mt-7 text-sm text-[#e0cba9]">{complete ? (hindi ? 'अभ्यास पूरा हुआ' : 'Practice complete') : practiceRunning ? (hindi ? 'श्वास को महसूस करें' : 'Notice the breath') : (hindi ? 'आरंभ करने के लिए तैयार' : 'Ready when you are')}</p><div className="mt-5 flex justify-center gap-3"><button onClick={() => setPracticeRunning(running => !running)} disabled={complete} className="inline-flex items-center gap-2 rounded-full bg-[#f0d4a9] px-5 py-2.5 text-sm font-semibold text-[#34271c] transition hover:bg-white disabled:opacity-60">{practiceRunning ? <Pause className="h-4 w-4" /> : complete ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}{practiceRunning ? (hindi ? 'रोकें' : 'Pause') : complete ? (hindi ? 'पूरा' : 'Complete') : (hindi ? 'शुरू करें' : 'Begin')}</button><button onClick={() => { setPracticeSeconds(0); setPracticeRunning(false); }} className="rounded-full border border-white/20 p-2.5 text-[#e0cba9] transition hover:border-white/50 hover:text-white" aria-label={hindi ? 'अभ्यास फिर से शुरू करें' : 'Reset practice'}><RotateCcw className="h-4 w-4" /></button></div></div>
              </div>
              <div className="max-w-2xl py-2"><p className="font-tiro text-2xl font-normal leading-relaxed tracking-normal text-[#3d3025]">{hindi ? 'आराम से बैठें। श्वास को बदलें नहीं — केवल महसूस करें। विचार आएं तो उन्हें जाने दें और धीरे से लौट आएं।' : 'Sit comfortably. Do not change the breath — simply notice it. When a thought arrives, let it pass and return gently.'}</p><div className="mt-8 grid gap-5 border-t border-[#d9d0c3] pt-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-[0.18em] text-[#927964]">{hindi ? 'आज का मंत्र' : 'Mantra for today'}</p><p className="mt-3 font-mukta text-2xl text-[#754619]">{todaysContent?.mantra?.sanskrit || lens.mantra}</p><p className="mt-1 text-sm text-[#806f5e]">{todaysContent?.mantra?.transliteration || lens.mantra}</p></div><div><p className="text-xs uppercase tracking-[0.18em] text-[#927964]">{hindi ? 'साधना का भाव' : 'Practice intention'}</p><p className="mt-3 text-sm leading-7 text-[#776858]">{hindi ? lens.practice.hi : lens.practice.en}</p></div></div><div className="mt-7 flex items-center gap-2 text-xs text-[#927964]"><Volume2 className="h-4 w-4 text-[#9a5d20]" />{hindi ? 'मंत्र को धीरे-धीरे दोहराएं' : 'Let the mantra be unhurried'}</div></div>
            </div>
          </section>

          <section className="grid gap-10 border-b border-[#d9d0c3] py-14 md:grid-cols-[0.38fr_1fr] md:py-20">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">04 / {hindi ? 'पंचांग' : 'Panchang'}</p><h2 className="mt-4 font-serif text-3xl font-medium text-[#29231e] md:text-4xl">{hindi ? 'आज का आकाश' : 'The day in the sky'}</h2><p className="mt-5 text-sm leading-7 text-[#776858]">{hindi ? 'समय और तिथि की जानकारी — दैनिक संदर्भ के लिए।' : 'The date and time markers that provide the day’s calendar context.'}</p></div>
            <div>{isLoading ? <div className="grid animate-pulse grid-cols-2 gap-x-8 gap-y-6 border-t border-[#d9d0c3] pt-6 sm:grid-cols-4"><div className="h-12 rounded bg-[#e8dfd3]" /><div className="h-12 rounded bg-[#e8dfd3]" /><div className="h-12 rounded bg-[#e8dfd3]" /><div className="h-12 rounded bg-[#e8dfd3]" /></div> : <div className="grid grid-cols-2 gap-x-8 gap-y-7 border-t border-[#d9d0c3] pt-6 sm:grid-cols-4">{[{ icon: CalendarDays, label: hindi ? 'तिथि' : 'Tithi', value: panchang?.tithi || todaysContent?.specialDay?.name || '—' }, { icon: Sunrise, label: hindi ? 'सूर्योदय' : 'Sunrise', value: panchang?.sunrise || '—' }, { icon: Sunset, label: hindi ? 'सूर्यास्त' : 'Sunset', value: panchang?.sunset || '—' }, { icon: Moon, label: hindi ? 'नक्षत्र' : 'Nakshatra', value: panchang?.nakshatra || '—' }, { icon: Clock3, label: hindi ? 'मुहूर्त' : 'Muhurat', value: panchang?.muhurat || '—' }, { icon: Moon, label: hindi ? 'चंद्र स्थिति' : 'Moon phase', value: hindi ? 'चंद्र जानकारी' : 'Moon information' }].map(({ icon: Icon, label, value }) => <div key={label}><Icon className="h-4 w-4 text-[#9a5d20]" strokeWidth={1.5} /><p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#927964]">{label}</p><p className="mt-1 text-sm font-semibold text-[#493629]">{value}</p></div>)}</div>}</div>
          </section>

          <section className="border-b border-[#d9d0c3] py-14 md:py-20"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">05 / {hindi ? 'आगे पढ़ें' : 'Continue deeper'}</p><h2 className="mt-4 font-serif text-3xl font-medium text-[#29231e] md:text-4xl">{hindi ? 'आज से आगे की यात्रा' : 'Let today lead somewhere deeper'}</h2></div><p className="max-w-md text-sm leading-7 text-[#776858]">{hindi ? 'इस दिन को केवल पढ़कर न छोड़ें। इसे किसी कथा, भजन या अभ्यास में आगे ले जाएं।' : 'Do not leave the day as something you only read. Carry it into a story, a song, or a practice.'}</p></div><div className="mt-10 grid divide-y divide-[#d9d0c3] border-y border-[#d9d0c3] md:grid-cols-3 md:divide-x md:divide-y-0"><SiteLink to="/prabhu-ki-leelaayen" className="group p-6 transition hover:bg-[#ebe3d8] md:p-8"><BookOpen className="h-5 w-5 text-[#9a5d20]" strokeWidth={1.5} /><h3 className="mt-8 font-serif text-2xl text-[#3d3025]">{hindi ? 'कथा पढ़ें' : 'Read a story'}</h3><p className="mt-2 text-sm leading-6 text-[#806f5e]">{hindi ? 'संतों और प्रभु की कथाओं में अर्थ खोजें।' : 'Find meaning in the lives and stories of the saints.'}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'पुस्तकालय' : 'Open library'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink><SiteLink to="/bhajans" className="group p-6 transition hover:bg-[#ebe3d8] md:p-8"><Heart className="h-5 w-5 text-[#9a5d20]" strokeWidth={1.5} /><h3 className="mt-8 font-serif text-2xl text-[#3d3025]">{hindi ? 'भजन सुनें' : 'Listen deeply'}</h3><p className="mt-2 text-sm leading-6 text-[#806f5e]">{hindi ? 'आज के भाव के साथ एक भजन चुनें।' : 'Choose a bhajan that meets the mood of today.'}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'भजन संग्रह' : 'Bhajan library'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink><SiteLink to="/naam-jap" className="group p-6 transition hover:bg-[#ebe3d8] md:p-8"><Flame className="h-5 w-5 text-[#9a5d20]" strokeWidth={1.5} /><h3 className="mt-8 font-serif text-2xl text-[#3d3025]">{hindi ? 'जप करें' : 'Keep the practice'}</h3><p className="mt-2 text-sm leading-6 text-[#806f5e]">{hindi ? 'नाम जप को अपनी दैनिक साधना बनाएं।' : 'Turn remembrance into a practice you can return to.'}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'नाम जप ट्रैकर' : 'Naam Jap tracker'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink></div></section>

          {nextFestival && <section className="py-14 md:py-20"><div className="grid gap-8 md:grid-cols-[0.38fr_1fr] md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a5d20]">06 / {hindi ? 'कैलेंडर में आगे' : 'On the horizon'}</p><h2 className="mt-4 font-serif text-3xl font-medium text-[#29231e]">{hindi ? 'आने वाला विशेष दिन' : 'The next observance'}</h2></div><div className="flex flex-col justify-between gap-5 border-l border-[#d9d0c3] pl-6 sm:flex-row sm:items-center sm:pl-10"><div><p className="font-serif text-2xl text-[#3d3025]">{hindi ? nextFestival.nameHi || nextFestival.name : nextFestival.name}</p><p className="mt-2 max-w-xl text-sm leading-7 text-[#806f5e]">{hindi ? nextFestival.significanceHi || nextFestival.significance : nextFestival.significance}</p></div><span className="shrink-0 border border-[#bca78e] px-4 py-2 text-xs font-semibold text-[#754619]">{nextFestival.daysLeft === 1 ? (hindi ? 'कल' : 'Tomorrow') : `${nextFestival.daysLeft} ${hindi ? 'दिन बाद' : 'days away'}`}</span></div></div></section>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
