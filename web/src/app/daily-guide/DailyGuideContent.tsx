'use client';

import Image from 'next/image';
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
import { useNotifications } from '@/hooks/useNotifications';
import { usePanchang } from '@/hooks/usePanchang';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';

type Bilingual = { en: string; hi: string };

type WeekdayLens = Bilingual & {
  deity: Bilingual;
  mantra: string;
  meaning: Bilingual;
  practice: Bilingual;
  accent: string;
};

const WEEKDAY_LENSES: Record<number, WeekdayLens> = {
  0: { en: 'Sunday', hi: 'रविवार', deity: { en: 'Surya', hi: 'सूर्य देव' }, mantra: 'ॐ आदित्याय नमः', meaning: { en: 'A traditional lens for vitality, clarity, and gratitude.', hi: 'ऊर्जा, स्पष्टता और कृतज्ञता को देखने का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Begin with gratitude for the light and energy that sustain your life.', hi: 'अपने जीवन को संभालने वाले प्रकाश और ऊर्जा के लिए कृतज्ञता से दिन शुरू करें।' }, accent: '#b7791f' },
  1: { en: 'Monday', hi: 'सोमवार', deity: { en: 'Shiva', hi: 'भगवान शिव' }, mantra: 'ॐ नमः शिवाय', meaning: { en: 'A traditional lens for stillness, reflection, and inward attention.', hi: 'स्थिरता, चिंतन और भीतर लौटने का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Sit quietly for five minutes and let each exhalation soften one unnecessary thought.', hi: 'पाँच मिनट शांत बैठें और हर श्वास छोड़ते हुए एक अनावश्यक विचार को जाने दें।' }, accent: '#64748b' },
  2: { en: 'Tuesday', hi: 'मंगलवार', deity: { en: 'Hanuman', hi: 'हनुमान जी' }, mantra: 'ॐ हनुमते नमः', meaning: { en: 'A traditional lens for courage, discipline, and devoted action.', hi: 'साहस, अनुशासन और समर्पित कर्म का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Choose one difficult task and approach it with steadiness rather than force.', hi: 'एक कठिन कार्य चुनें और उसे जल्दबाज़ी नहीं, स्थिरता के साथ पूरा करें।' }, accent: '#b45309' },
  3: { en: 'Wednesday', hi: 'बुधवार', deity: { en: 'Ganesha', hi: 'गणेश जी' }, mantra: 'ॐ गं गणपतये नमः', meaning: { en: 'A traditional lens for learning, clarity, and removing small obstacles.', hi: 'सीखने, स्पष्टता और छोटे अवरोधों को दूर करने का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Read one page slowly, then write down the one insight you want to carry today.', hi: 'ज्ञान का एक पृष्ठ धीरे पढ़ें और आज साथ रखने वाली एक सीख लिखें।' }, accent: '#2f855a' },
  4: { en: 'Thursday', hi: 'गुरुवार', deity: { en: 'Guru', hi: 'गुरु तत्व' }, mantra: 'ॐ गुरवे नमः', meaning: { en: 'A traditional lens for wisdom, humility, and the light received from teachers.', hi: 'ज्ञान, विनम्रता और गुरु से मिले प्रकाश का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Offer respect to a teacher, elder, or book that has quietly shaped your life.', hi: 'किसी गुरु, बड़े या उस पुस्तक का सम्मान करें जिसने आपके जीवन को दिशा दी है।' }, accent: '#a16207' },
  5: { en: 'Friday', hi: 'शुक्रवार', deity: { en: 'Lakshmi', hi: 'माता लक्ष्मी' }, mantra: 'ॐ श्रीं महालक्ष्म्यै नमः', meaning: { en: 'A traditional lens for beauty with meaning, generosity, and gratitude.', hi: 'अर्थपूर्ण सौंदर्य, उदारता और कृतज्ञता का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Make one corner of your home beautiful, then share one quiet act of kindness.', hi: 'घर के एक कोने को सुंदर बनाएं और बिना बताए एक दयालु कर्म करें।' }, accent: '#be185d' },
  6: { en: 'Saturday', hi: 'शनिवार', deity: { en: 'Shani', hi: 'शनि देव' }, mantra: 'ॐ शं शनैश्चराय नमः', meaning: { en: 'A traditional lens for patience, service, and honest self-reflection.', hi: 'धैर्य, सेवा और ईमानदार आत्मचिंतन का एक पारंपरिक दृष्टिकोण।' }, practice: { en: 'Serve quietly, simplify one desire, and let patience become your strength.', hi: 'निस्वार्थ सेवा करें, एक इच्छा को सरल बनाएं और धैर्य को अपनी शक्ति बनने दें।' }, accent: '#4338ca' },
};

const pick = (value: Bilingual, hindi: boolean) => hindi ? value.hi : value.en;
const pad = (value: number) => String(value).padStart(2, '0');

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${dark ? 'text-white/45' : 'text-[#98704d]'}`}>{children}</p>;
}

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

  const today = useMemo(() => new Date(), []);
  const lens = WEEKDAY_LENSES[today.getDay()];
  const dateLabel = today.toLocaleDateString(hindi ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = today.toLocaleDateString(hindi ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short' });
  const festivals = todaysContent?.festivals ?? [];
  const todayEvent = festivals.find(festival => festival.daysLeft === 0);
  const isLoading = panchangLoading || contentLoading;
  const complete = practiceSeconds >= 300;
  const minutes = Math.floor(practiceSeconds / 60);
  const seconds = practiceSeconds % 60;

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

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const permission = await requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      scheduleNotifications({ morning: true, evening: true, festivals: true, ekadashi: true });
    }
  };

  const sharePage = async () => {
    const share = {
      title: hindi ? 'दैनिक धर्म — संतवाणी' : 'Daily Dharma — Santvaani',
      text: todayEvent ? pick({ en: todayEvent.significance, hi: todayEvent.significanceHi }, hindi) : pick(lens.meaning, hindi),
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(share);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // The native share sheet may be dismissed without an error.
    }
  };

  return (
    <div className="min-h-screen bg-[#f2eee5] text-[#211c18]">
      <Navbar />

      <main>
        <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#141211] text-[#fff8ea]">
          <div className="absolute inset-0 -z-30 bg-[#141211]" />
          <div className="absolute inset-0 -z-20 hidden md:block"><Image src="/daily-dharma-wide.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-65" /></div>
          <div className="absolute inset-0 -z-20 md:hidden"><Image src="/daily-dharma-tall.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-60" /></div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,13,11,0.98)_0%,rgba(20,16,13,0.82)_36%,rgba(20,16,13,0.18)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(16,13,11,0.96)_0%,transparent_42%,rgba(16,13,11,0.35)_100%)]" />

          <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1500px] flex-col justify-between px-5 pb-8 pt-8 sm:px-8 md:px-12 md:pb-10 md:pt-12">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55"><span>Santvaani / Daily Dharma</span><span className="hidden sm:block">{shortDate}</span></div>

            <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.42fr]">
              <div className="max-w-4xl">
                <div className="mb-7 flex items-center gap-3 text-xs text-[#e4c58e]"><span className="font-serif text-2xl">ॐ</span><span className="h-px w-10 bg-[#e4c58e]/70" />{hindi ? 'एक दिन, एक दृष्टि' : 'One day, one perspective'}</div>
                <h1 className="font-serif text-[clamp(4.8rem,13vw,12rem)] font-medium leading-[0.78] tracking-[-0.08em] text-[#fff8ea]">{hindi ? 'दैनिक\nधर्म' : <>Daily<br /><span className="text-[#e4c58e]">Dharma</span></>}</h1>
                <p className="mt-9 max-w-xl font-tiro text-2xl font-normal leading-relaxed tracking-normal text-[#f1d7ab] sm:text-3xl">{hindi ? 'आज के अर्थ को समझें। अपनी साधना चुनें।' : 'Understand the meaning of today. Choose your practice.'}</p>
                <div className="mt-8 flex flex-wrap gap-3"><a href="#meaning" className="inline-flex items-center gap-2 bg-[#e7c286] px-5 py-3 text-sm font-semibold text-[#302218] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#e7c286] focus:ring-offset-2 focus:ring-offset-[#141211]">{hindi ? 'आज की प्रविष्टि' : 'Today’s entry'} <ArrowDown className="h-4 w-4" /></a><button onClick={toggleNotifications} className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#e7c286]"><Bell className="h-4 w-4" />{notificationsEnabled ? (hindi ? 'स्मरण सक्रिय' : 'Reminders active') : (hindi ? 'दैनिक स्मरण' : 'Daily reminders')}</button></div>
              </div>

              <aside className="border-l border-white/20 pl-6 lg:mb-2 lg:pl-8"><Eyebrow dark>{hindi ? 'आज' : 'Today'}</Eyebrow><p className="mt-3 font-tiro text-3xl font-normal leading-tight tracking-normal text-[#fff8ea]">{dateLabel}</p><div className="mt-8 border-t border-white/20 pt-5"><Eyebrow dark>{hindi ? 'साप्ताहिक संदर्भ' : 'Weekday lens'}</Eyebrow><p className="mt-3 font-serif text-2xl text-[#e7c286]">{pick(lens, hindi)}</p><p className="mt-1 text-sm text-white/55">{hindi ? lens.deity.hi : `Traditionally associated with ${lens.deity.en}`}</p></div><div className="mt-8 flex items-center gap-2 text-xs text-white/45"><span className="h-2 w-2 rounded-full bg-[#e7c286]" />{todayEvent ? (hindi ? 'आज विशेष observance है' : 'A special observance today') : (hindi ? 'आज कोई प्रमुख पर्व नहीं' : 'No major observance today')}</div></aside>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-4 text-[10px] uppercase tracking-[0.2em] text-white/45"><span>{hindi ? 'परंपरा · अर्थ · साधना' : 'Tradition · meaning · practice'}</span><span className="hidden items-center gap-2 sm:flex">Scroll to explore <ArrowDown className="h-3 w-3" /></span></div>
          </div>
        </section>

        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 md:px-12">
          <section id="meaning" className="scroll-mt-24 border-b border-[#d8cec0] py-20 md:py-32">
            <div className="grid gap-12 lg:grid-cols-[0.28fr_1fr]">
              <div><Eyebrow>01 / {hindi ? 'आज का अर्थ' : 'The meaning of today'}</Eyebrow><h2 className="mt-5 max-w-xs font-serif text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-[#28221d] md:text-5xl">{hindi ? 'हर दिन में एक दृष्टि होती है।' : 'Every day carries a perspective.'}</h2></div>
              <div className="relative overflow-hidden bg-[#fff9ed] p-8 shadow-[0_25px_90px_rgba(74,52,33,0.1)] sm:p-12 md:p-16"><div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#e8c17f]/25 blur-3xl" /><div className="relative"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ded1c1] pb-5"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#91643c]">{todayEvent ? (hindi ? 'आज का पर्व / व्रत' : 'Today’s observance') : (hindi ? 'दैनिक संदर्भ' : 'Daily context')}</span><button onClick={sharePage} className="inline-flex items-center gap-2 text-xs font-semibold text-[#76502f] transition hover:text-[#241c16]">{shared ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}{shared ? (hindi ? 'लिंक कॉपी' : 'Copied') : (hindi ? 'साझा करें' : 'Share')}</button></div>{todayEvent && <p className="mt-7 text-sm font-semibold text-[#9b5f2b]">{hindi ? todayEvent.nameHi || todayEvent.name : todayEvent.name}</p>}<p className="mt-5 max-w-4xl font-tiro text-3xl font-normal leading-relaxed tracking-normal text-[#36291f] md:text-5xl">{todayEvent ? pick({ en: todayEvent.significance, hi: todayEvent.significanceHi }, hindi) : (hindi ? 'हर दिन किसी बड़े पर्व का नाम नहीं होता। फिर भी हर दिन ध्यान, कृतज्ञता और अच्छे कर्म के लिए स्थान रखता है।' : 'Not every day carries a major festival. Every day, however, can make room for attention, gratitude, and a good action.')}</p><p className="mt-7 max-w-2xl text-base leading-8 text-[#786958]">{todayEvent ? (hindi ? 'इस दिन की परंपराएं परिवार, क्षेत्र और संप्रदाय के अनुसार अलग हो सकती हैं। यहां दी गई जानकारी समझने और अपनी साधना चुनने के लिए है।' : 'Observances can vary by family, region, and tradition. This entry offers context so you can choose your practice with understanding.') : pick(lens.meaning, hindi)}</p><div className="mt-9 flex items-center gap-3 text-sm text-[#98704d]"><span className="h-px w-8 bg-[#ba8a54]" />{hindi ? `आज का साप्ताहिक भाव: ${lens.deity.hi}` : `This week’s lens: ${lens.deity.en}`}</div></div></div>
            </div>
          </section>

          <section className="grid border-b border-[#d8cec0] py-20 md:grid-cols-[1fr_0.7fr] md:py-28"><div className="max-w-2xl"><Eyebrow>02 / {hindi ? 'व्रत और परंपरा' : 'Vrat & tradition'}</Eyebrow><h2 className="mt-5 font-serif text-5xl font-medium leading-[0.95] tracking-[-0.05em] text-[#28221d] md:text-7xl">{todayEvent?.category === 'vrat' ? (hindi ? 'व्रत को समझकर अपनाएं।' : 'Observe with understanding.') : (hindi ? 'यदि आप आज व्रत रख रहे हैं।' : 'If you are observing a fast today.')}</h2><p className="mt-8 max-w-xl text-lg leading-8 text-[#786958]">{todayEvent?.category === 'vrat' ? (hindi ? 'व्रत केवल भोजन छोड़ने का नाम नहीं है। यह संकल्प, संयम, स्मरण और सेवा का अभ्यास भी हो सकता है। अपनी परंपरा और स्वास्थ्य के अनुसार इसका रूप चुनें।' : 'A vrat is not only about leaving food. It can be an exercise in intention, restraint, remembrance, and service. Follow the form that suits your tradition and health.') : (hindi ? 'हर दिन व्रत का दिन नहीं होता। यदि आपकी परंपरा आज उपवास कहती है, तो इसे समझदारी, पर्याप्त जल और अपने स्वास्थ्य का ध्यान रखते हुए करें।' : 'Every day is not a vrat day. If your tradition calls for a fast today, observe it with care, adequate hydration where appropriate, and attention to your health.')}</p></div><div className="mt-10 border-l border-[#d8cec0] pl-7 md:mt-0 md:pl-12"><Eyebrow>{hindi ? 'एक सरल संकल्प' : 'A simple intention'}</Eyebrow><p className="mt-6 font-tiro text-3xl font-normal leading-relaxed tracking-normal text-[#36291f]">“{pick(lens.practice, hindi)}”</p><div className="mt-9 space-y-4 border-t border-[#d8cec0] pt-6 text-sm leading-6 text-[#786958]"><p className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#9b642e]" />{hindi ? 'भोजन और वाणी में सजगता' : 'Bring awareness to food and speech.'}</p><p className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#9b642e]" />{hindi ? 'भक्ति को किसी अच्छे कर्म में बदलें' : 'Turn devotion into one good action.'}</p><p className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#9b642e]" />{hindi ? 'विधि अपनी परंपरा और स्वास्थ्य के अनुसार चुनें' : 'Choose the form that suits your tradition and health.'}</p></div></div></section>

          <section id="practice" className="scroll-mt-24 border-b border-[#d8cec0] py-20 md:py-28"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><Eyebrow>03 / {hindi ? 'आज की साधना' : 'Today’s practice'}</Eyebrow><h2 className="mt-5 font-serif text-5xl font-medium leading-[0.95] tracking-[-0.05em] text-[#28221d] md:text-7xl">{hindi ? 'पाँच मिनट लौटने के।' : 'Five minutes to return.'}</h2></div><p className="max-w-sm text-base leading-7 text-[#786958]">{hindi ? 'एक वैकल्पिक अभ्यास — आज के भाव से जुड़ने का शांत तरीका।' : 'An optional practice — a quiet way to connect with the spirit of the day.'}</p></div><div className="mt-12 grid overflow-hidden bg-[#211b17] text-[#fff4df] lg:grid-cols-[0.8fr_1fr]"><div className="relative flex min-h-[25rem] items-center justify-center overflow-hidden bg-[#2d2119] p-10"><div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at center, ${lens.accent} 0, transparent 45%)` }} /><div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#e7c286]/30 shadow-[0_0_0_22px_rgba(231,194,134,0.04),0_0_80px_rgba(231,194,134,0.12)]"><div className={`flex h-40 w-40 items-center justify-center rounded-full border border-[#e7c286]/35 bg-[#e7c286]/[0.07] transition-transform duration-[4000ms] ${practiceRunning ? 'scale-110' : 'scale-95'}`}><span className="font-mono text-2xl text-[#f0d4a9]">{pad(minutes)}:{pad(seconds)}</span></div></div><div className="absolute bottom-8 left-0 right-0 text-center text-xs uppercase tracking-[0.2em] text-white/45">{complete ? (hindi ? 'अभ्यास पूरा हुआ' : 'Practice complete') : practiceRunning ? (hindi ? 'श्वास को महसूस करें' : 'Notice the breath') : (hindi ? 'आरंभ करने के लिए तैयार' : 'Ready when you are')}</div></div><div className="p-8 sm:p-12 md:p-16"><Eyebrow dark>{hindi ? 'श्वास ध्यान' : 'Breath meditation'}</Eyebrow><p className="mt-7 max-w-xl font-tiro text-3xl font-normal leading-relaxed tracking-normal text-[#fff4df]">{hindi ? 'श्वास को बदलें नहीं — केवल महसूस करें। विचार आएं तो उन्हें जाने दें और धीरे से लौट आएं।' : 'Do not change the breath — simply notice it. When a thought arrives, let it pass and return gently.'}</p><div className="mt-10 grid gap-8 border-t border-white/15 pt-7 sm:grid-cols-2"><div><Eyebrow dark>{hindi ? 'आज का मंत्र' : 'Mantra for today'}</Eyebrow><p className="mt-3 font-mukta text-2xl text-[#e7c286]">{todaysContent?.mantra?.sanskrit || lens.mantra}</p><p className="mt-1 text-sm text-white/50">{todaysContent?.mantra?.transliteration || lens.mantra}</p></div><div><Eyebrow dark>{hindi ? 'अवधि' : 'Duration'}</Eyebrow><p className="mt-3 text-2xl text-[#fff4df]">05:00</p><p className="mt-1 text-sm text-white/50">{hindi ? 'अपनी गति से' : 'At your own pace'}</p></div></div><div className="mt-10 flex flex-wrap gap-3"><button onClick={() => setPracticeRunning(running => !running)} disabled={complete} className="inline-flex items-center gap-2 bg-[#e7c286] px-5 py-3 text-sm font-semibold text-[#302218] transition hover:bg-white disabled:opacity-60">{practiceRunning ? <Pause className="h-4 w-4" /> : complete ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}{practiceRunning ? (hindi ? 'रोकें' : 'Pause') : complete ? (hindi ? 'पूरा' : 'Complete') : (hindi ? 'शुरू करें' : 'Begin')}</button><button onClick={() => { setPracticeSeconds(0); setPracticeRunning(false); }} className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm text-white/65 transition hover:border-white/50 hover:text-white"><RotateCcw className="h-4 w-4" />{hindi ? 'फिर से' : 'Reset'}</button></div><div className="mt-8 flex items-center gap-2 text-xs text-white/40"><Volume2 className="h-4 w-4 text-[#e7c286]" />{hindi ? 'मंत्र को धीरे-धीरे दोहराएं' : 'Let the mantra be unhurried'}</div></div></div></section>

          <section className="border-b border-[#d8cec0] py-20 md:py-28"><div className="grid gap-12 lg:grid-cols-[0.28fr_1fr]"><div><Eyebrow>04 / {hindi ? 'पंचांग' : 'Panchang'}</Eyebrow><h2 className="mt-5 font-serif text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-[#28221d] md:text-5xl">{hindi ? 'दिन का आकाश।' : 'The day in the sky.'}</h2><p className="mt-6 text-base leading-7 text-[#786958]">{hindi ? 'समय और तिथि की जानकारी — दैनिक संदर्भ के लिए।' : 'The date and time markers that give the day its calendar context.'}</p></div><div>{isLoading ? <div className="grid animate-pulse grid-cols-2 gap-6 border-t border-[#d8cec0] pt-6 sm:grid-cols-4"><div className="h-14 bg-[#e4dacd]" /><div className="h-14 bg-[#e4dacd]" /><div className="h-14 bg-[#e4dacd]" /><div className="h-14 bg-[#e4dacd]" /></div> : <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[#d8cec0] pt-6 sm:grid-cols-3">{[{ icon: CalendarDays, label: hindi ? 'तिथि' : 'Tithi', value: panchang?.tithi || todaysContent?.specialDay?.name || '—' }, { icon: Sunrise, label: hindi ? 'सूर्योदय' : 'Sunrise', value: panchang?.sunrise || '—' }, { icon: Sunset, label: hindi ? 'सूर्यास्त' : 'Sunset', value: panchang?.sunset || '—' }, { icon: Moon, label: hindi ? 'नक्षत्र' : 'Nakshatra', value: panchang?.nakshatra || '—' }, { icon: Clock3, label: hindi ? 'मुहूर्त' : 'Muhurat', value: panchang?.muhurat || '—' }, { icon: Moon, label: hindi ? 'चंद्र स्थिति' : 'Moon phase', value: hindi ? 'चंद्र जानकारी' : 'Moon information' }].map(({ icon: Icon, label, value }) => <div key={label}><Icon className="h-4 w-4 text-[#9b642e]" strokeWidth={1.5} /><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#98704d]">{label}</p><p className="mt-1 text-sm font-semibold text-[#493629]">{value}</p></div>)}</div>}</div></div></section>

          <section className="py-20 md:py-28"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><Eyebrow>05 / {hindi ? 'आगे पढ़ें' : 'Continue deeper'}</Eyebrow><h2 className="mt-5 font-serif text-5xl font-medium leading-[0.95] tracking-[-0.05em] text-[#28221d] md:text-7xl">{hindi ? 'आज से आगे की यात्रा।' : 'Let today lead somewhere deeper.'}</h2></div><p className="max-w-sm text-base leading-7 text-[#786958]">{hindi ? 'इस दिन को केवल पढ़कर न छोड़ें। इसे किसी कथा, भजन या अभ्यास में आगे ले जाएं।' : 'Do not leave the day as something you only read. Carry it into a story, a song, or a practice.'}</p></div><div className="mt-12 grid overflow-hidden border border-[#d8cec0] bg-[#fff9ed] shadow-[0_20px_70px_rgba(74,52,33,0.07)] md:grid-cols-3"><SiteLink to="/prabhu-ki-leelaayen" className="group border-b border-[#d8cec0] p-7 transition hover:bg-[#eadbc5] md:border-b-0 md:border-r md:p-10"><BookOpen className="h-5 w-5 text-[#9b642e]" strokeWidth={1.5} /><h3 className="mt-16 font-serif text-3xl text-[#36291f]">{hindi ? 'कथा पढ़ें' : 'Read a story'}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#806f5e]">{hindi ? 'संतों और प्रभु की कथाओं में अर्थ खोजें।' : 'Find meaning in the lives and stories of the saints.'}</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'पुस्तकालय' : 'Open library'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink><SiteLink to="/bhajans" className="group border-b border-[#d8cec0] bg-[#f0e1e0] p-7 transition hover:bg-[#ead0d0] md:border-b-0 md:border-r md:p-10"><Heart className="h-5 w-5 text-[#9b642e]" strokeWidth={1.5} /><h3 className="mt-16 font-serif text-3xl text-[#36291f]">{hindi ? 'भजन सुनें' : 'Listen deeply'}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#806f5e]">{hindi ? 'आज के भाव के साथ एक भजन चुनें।' : 'Choose a bhajan that meets the mood of today.'}</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'भजन संग्रह' : 'Bhajan library'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink><SiteLink to="/naam-jap" className="group bg-[#dce9e2] p-7 transition hover:bg-[#cfe0d6] md:p-10"><Flame className="h-5 w-5 text-[#9b642e]" strokeWidth={1.5} /><h3 className="mt-16 font-serif text-3xl text-[#36291f]">{hindi ? 'जप करें' : 'Keep the practice'}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#806f5e]">{hindi ? 'नाम जप को अपनी दैनिक साधना बनाएं।' : 'Turn remembrance into a practice you can return to.'}</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'नाम जप ट्रैकर' : 'Naam Jap tracker'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></SiteLink></div></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
