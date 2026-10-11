'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Clock3, Heart, Pause, Play, RotateCcw, Sparkles, Wind } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteLink from '@/components/SiteLink';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpiritualContent } from '@/hooks/useSpiritualContent';

type Bilingual = { en: string; hi: string };
type Practice = {
  id: string;
  eyebrow: Bilingual;
  title: Bilingual;
  description: Bilingual;
  instruction: Bilingual;
  duration: number;
  accent: string;
  symbol: string;
};

const PRACTICES: Practice[] = [
  {
    id: 'breath',
    eyebrow: { en: 'The beginning', hi: 'आरंभ' },
    title: { en: 'Return to the breath', hi: 'श्वास पर लौटें' },
    description: { en: 'A quiet practice for meeting the mind without trying to change it.', hi: 'मन को बदलने की कोशिश किए बिना उसके पास बैठने का शांत अभ्यास।' },
    instruction: { en: 'Feel the breath arrive. Feel it leave. Nothing else is required.', hi: 'श्वास को आते हुए महसूस करें। जाते हुए महसूस करें। और कुछ करने की आवश्यकता नहीं है।' },
    duration: 5,
    accent: '#d3a56d',
    symbol: 'प्राण',
  },
  {
    id: 'mantra',
    eyebrow: { en: 'The remembered word', hi: 'स्मरण' },
    title: { en: 'Let the mantra carry you', hi: 'मंत्र को अपना सहारा बनने दें' },
    description: { en: 'Repeat a sacred sound slowly until the space around it becomes still.', hi: 'पवित्र ध्वनि को धीरे दोहराएं, जब तक उसके चारों ओर का स्थान शांत न हो जाए।' },
    instruction: { en: 'Hear the mantra within. Let each repetition be softer than the one before.', hi: 'मंत्र को भीतर सुनें। हर उच्चारण को पिछले से थोड़ा शांत होने दें।' },
    duration: 10,
    accent: '#a892c4',
    symbol: 'ॐ',
  },
  {
    id: 'stillness',
    eyebrow: { en: 'The open field', hi: 'विस्तार' },
    title: { en: 'Make room for stillness', hi: 'शांति के लिए स्थान बनाएं' },
    description: { en: 'A longer pause for observing thought, sensation, and silence with kindness.', hi: 'विचार, संवेदना और मौन को करुणा के साथ देखने का थोड़ा लंबा विराम।' },
    instruction: { en: 'You do not have to hold on to anything. Let the whole moment be enough.', hi: 'आपको किसी चीज़ को पकड़कर रखने की आवश्यकता नहीं। इस पूरे क्षण को पर्याप्त होने दें।' },
    duration: 15,
    accent: '#8bb7ad',
    symbol: 'शांति',
  },
  {
    id: 'gratitude',
    eyebrow: { en: 'The offering', hi: 'अर्पण' },
    title: { en: 'Sit with gratitude', hi: 'कृतज्ञता में बैठें' },
    description: { en: 'A warm practice for noticing what has quietly supported you today.', hi: 'आज आपको चुपचाप सहारा देने वाली चीज़ों को पहचानने का कोमल अभ्यास।' },
    instruction: { en: 'Bring one person, place, or blessing to mind. Let gratitude become a feeling, not a list.', hi: 'किसी व्यक्ति, स्थान या आशीर्वाद को स्मरण करें। कृतज्ञता को सूची नहीं, अनुभव बनने दें।' },
    duration: 5,
    accent: '#d69a82',
    symbol: 'धन्यवाद',
  },
];

const pick = (value: Bilingual, hindi: boolean) => hindi ? value.hi : value.en;
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${light ? 'text-white/45' : 'text-[#927052]'}`}>{children}</p>;
}

export default function MeditationContent() {
  const { language } = useLanguage();
  const hindi = language === 'HI';
  const { todaysContent, loading: contentLoading } = useSpiritualContent();
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const recommendedPracticeId = hour < 12 ? 'breath' : hour < 18 ? 'stillness' : 'gratitude';
  const [selectedId, setSelectedId] = useState(recommendedPracticeId);
  const [duration, setDuration] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [hasReturned, setHasReturned] = useState(false);

  const currentPractice = PRACTICES.find(practice => practice.id === selectedId) ?? PRACTICES[0];
  const currentDuration = duration * 60;
  const complete = seconds >= currentDuration;
  const progress = Math.min(100, (seconds / currentDuration) * 100);
  const dateLabel = now.toLocaleDateString(hindi ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeLabel = hour < 12 ? { en: 'Morning practice', hi: 'प्रातः साधना' } : hour < 18 ? { en: 'Afternoon pause', hi: 'दोपहर का विराम' } : { en: 'Evening practice', hi: 'संध्या साधना' };
  const timeDescription = hour < 12
    ? { en: 'Begin before the day gathers speed.', hi: 'दिन की गति बढ़ने से पहले आरंभ करें।' }
    : hour < 18
      ? { en: 'A small return can change the shape of the afternoon.', hi: 'एक छोटा विराम दोपहर का स्वर बदल सकता है।' }
      : { en: 'Set the day down gently before you rest.', hi: 'विश्राम से पहले दिन को धीरे से रख दें।' };

  useEffect(() => {
    const readReturnState = window.setTimeout(() => {
      try {
        setHasReturned(localStorage.getItem('santvaani-meditation-returned') === new Date().toISOString().slice(0, 10));
      } catch {
        setHasReturned(false);
      }
    }, 0);
    return () => window.clearTimeout(readReturnState);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds(current => {
        if (current >= currentDuration) {
          setRunning(false);
          setHasReturned(true);
          try { localStorage.setItem('santvaani-meditation-returned', new Date().toISOString().slice(0, 10)); } catch { /* private mode */ }
          return currentDuration;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [currentDuration, running]);

  const choosePractice = (practice: Practice) => {
    setSelectedId(practice.id);
    setDuration(practice.duration);
    setSeconds(0);
    setRunning(false);
  };

  const reset = () => {
    setSeconds(0);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#171513] text-[#fff7e9]">
      <Navbar />
      <main>
        <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#171513]">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_68%_42%,rgba(166,124,88,0.28),transparent_25%),radial-gradient(circle_at_35%_80%,rgba(83,77,119,0.18),transparent_35%),#171513]" />
          <div className="absolute inset-y-0 right-[-14rem] -z-10 w-[50rem] rounded-full border border-[#d7ac75]/10 sm:right-[-8rem]" />
          <div className="absolute inset-y-12 right-[-5rem] -z-10 w-[34rem] rounded-full border border-[#d7ac75]/[0.08]" />
          <div className="absolute bottom-[-13rem] left-[14%] -z-10 h-[32rem] w-[32rem] rounded-full bg-[#b27862]/10 blur-3xl" />
          <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1500px] flex-col justify-between px-5 pb-8 pt-8 sm:px-8 md:px-12 md:pb-10 md:pt-12">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"><span>Santvaani / Meditation</span><span className="hidden sm:block">{dateLabel}</span></div>
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.68fr]">
              <div className="max-w-3xl"><div className="mb-7 flex items-center gap-3 text-xs text-[#e4c18d]"><span className="font-serif text-2xl">ॐ</span><span className="h-px w-10 bg-[#e4c18d]/70" />{pick(timeLabel, hindi)}</div><h1 className="font-serif text-[clamp(4.8rem,12vw,11rem)] font-medium leading-[0.78] tracking-[-0.08em] text-[#fff7e9]">{hindi ? <>ध्यान<br /><span className="text-[#e4c18d]">का स्थान</span></> : <>A place<br /><span className="text-[#e4c18d]">to return</span></>}</h1><p className="mt-9 max-w-xl font-tiro text-2xl leading-relaxed tracking-normal text-[#e6cfab] sm:text-3xl">{pick(timeDescription, hindi)}</p><a href="#begin" className="mt-9 inline-flex items-center gap-2 bg-[#e4c18d] px-5 py-3 text-sm font-semibold text-[#302218] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4c18d] focus:ring-offset-2 focus:ring-offset-[#171513]">{hindi ? 'अभ्यास चुनें' : 'Choose a practice'} <ArrowDown className="h-4 w-4" /></a></div>
              <div className="relative mx-auto flex h-[19rem] w-[19rem] items-center justify-center sm:h-[25rem] sm:w-[25rem]"><div className="absolute inset-0 rounded-full border border-[#e4c18d]/20" /><div className="absolute inset-7 rounded-full border border-[#e4c18d]/15" /><div className="absolute inset-16 rounded-full border border-[#e4c18d]/20 bg-[#e4c18d]/[0.035] shadow-[0_0_100px_rgba(228,193,141,0.12)]" /><div className="relative text-center"><p className="font-tiro text-5xl text-[#e4c18d]">{contentLoading ? '…' : todaysContent?.mantra?.sanskrit || 'ॐ नमः शिवाय'}</p><p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">{hindi ? 'आज का मंत्र' : 'Today’s mantra'}</p></div></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/15 pt-4 text-[10px] uppercase tracking-[0.2em] text-white/40"><span>{hasReturned ? (hindi ? 'आज लौट चुके हैं' : 'You have returned today') : (hindi ? 'एक श्वास से आरंभ करें' : 'Begin with one breath')}</span><span className="hidden items-center gap-2 sm:flex">Scroll to begin <ArrowDown className="h-3 w-3" /></span></div>
          </div>
        </section>

        <section id="begin" className="scroll-mt-24 bg-[#f1ece3] text-[#211c18]"><div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 md:py-32"><div className="grid gap-12 lg:grid-cols-[0.3fr_1fr]"><div><Eyebrow>01 / {hindi ? 'आज की दिशा' : 'Today’s direction'}</Eyebrow><h2 className="mt-5 max-w-sm font-serif text-5xl font-medium leading-[0.92] tracking-[-0.06em] text-[#28221d] md:text-7xl">{hindi ? 'आपको अभी किस चीज़ की आवश्यकता है?' : 'What does this moment need?'}</h2><p className="mt-7 max-w-xs text-base leading-7 text-[#786958]">{hindi ? 'कोई सही अभ्यास नहीं है। केवल वह अभ्यास है जिस पर आप आज लौट सकते हैं।' : 'There is no perfect practice. There is only the one you can return to today.'}</p></div><div><div className="grid gap-px overflow-hidden border border-[#d5c9ba] bg-[#d5c9ba] sm:grid-cols-2">{PRACTICES.map(practice => { const active = practice.id === selectedId; return <button key={practice.id} onClick={() => choosePractice(practice)} className={`group relative min-h-[15rem] p-7 text-left transition sm:p-9 ${active ? 'bg-[#fff8eb]' : 'bg-[#ede5d9] hover:bg-[#f8f1e6]'}`}><span className="text-3xl" style={{ color: practice.accent }}>{practice.symbol}</span><span className="mt-12 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#927052]">{pick(practice.eyebrow, hindi)}</span><span className="mt-3 block font-serif text-3xl leading-none tracking-[-0.04em] text-[#36291f]">{pick(practice.title, hindi)}</span><span className="mt-4 block max-w-xs text-sm leading-6 text-[#786958]">{pick(practice.description, hindi)}</span><span className={`absolute right-7 top-7 h-3 w-3 rounded-full border ${active ? 'border-[#9b642e] bg-[#d3a56d]' : 'border-[#bca995]'}`} /></button>; })}</div><div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#d5c9ba] pt-5 text-sm text-[#786958]"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#9b642e]" />{hindi ? 'अवधि चुनें' : 'Set your duration'}</span><div className="flex gap-2">{[5, 10, 15].map(value => <button key={value} onClick={() => { setDuration(value); setSeconds(0); setRunning(false); }} className={`px-4 py-2 text-xs font-semibold transition ${duration === value ? 'bg-[#2a211b] text-[#fff7e9]' : 'border border-[#cdbfae] text-[#655444] hover:bg-[#fff8eb]'}`}>{value} {hindi ? 'मिनट' : 'min'}</button>)}</div></div></div></div></div></section>

          <section className="bg-[#241d19] px-5 py-20 text-[#fff7e9] sm:px-8 md:px-12 md:py-32"><div className="mx-auto max-w-[1500px]"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><Eyebrow light>02 / {hindi ? 'अभ्यास' : 'The practice'}</Eyebrow><h2 className="mt-5 max-w-3xl font-serif text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-8xl">{pick(currentPractice.title, hindi)}</h2></div><p className="max-w-sm text-base leading-7 text-white/50">{pick(currentPractice.instruction, hindi)}</p></div><div className="mt-14 grid overflow-hidden border border-white/10 lg:grid-cols-[0.7fr_1fr]"><div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden bg-[#2e251f] p-8"><div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at center, ${currentPractice.accent} 0, transparent 46%)` }} /><div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-[#e4c18d]/25 shadow-[0_0_0_28px_rgba(228,193,141,0.035),0_0_90px_rgba(228,193,141,0.12)] sm:h-80 sm:w-80"><div className={`flex h-56 w-56 items-center justify-center rounded-full border border-[#e4c18d]/30 bg-white/[0.025] transition-transform duration-[5000ms] ${running ? 'scale-110' : 'scale-95'}`}><div className="text-center"><p className="font-mono text-4xl tracking-tight text-[#f1d3a2]">{formatTime(Math.max(0, currentDuration - seconds))}</p><p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/40">{complete ? (hindi ? 'अभ्यास पूरा' : 'Complete') : running ? (hindi ? 'श्वास के साथ' : 'With the breath') : (hindi ? 'आरंभ के लिए तैयार' : 'Ready to begin')}</p></div></div></div><div className="absolute bottom-7 left-8 right-8 h-px bg-white/10"><div className="h-px bg-[#e4c18d] transition-[width] duration-1000" style={{ width: `${progress}%` }} /></div></div><div className="p-8 sm:p-12 md:p-16"><div className="flex items-start justify-between gap-5"><div><Eyebrow light>{pick(currentPractice.eyebrow, hindi)}</Eyebrow><p className="mt-6 max-w-xl font-tiro text-3xl leading-relaxed tracking-normal text-[#fff7e9]">{pick(currentPractice.instruction, hindi)}</p></div><Wind className="mt-1 hidden h-8 w-8 text-[#e4c18d]/60 sm:block" strokeWidth={1} /></div><div className="mt-12 grid gap-7 border-t border-white/15 pt-6 sm:grid-cols-2"><div><Eyebrow light>{hindi ? 'आज का मंत्र' : 'Today’s mantra'}</Eyebrow><p className="mt-3 font-tiro text-2xl text-[#e4c18d]">{todaysContent?.mantra?.sanskrit || 'ॐ नमः शिवाय'}</p></div><div><Eyebrow light>{hindi ? 'पूर्णता' : 'Progress'}</Eyebrow><p className="mt-3 text-2xl text-[#fff7e9]">{Math.round(progress)}%</p></div></div><div className="mt-11 flex flex-wrap gap-3"><button onClick={() => { if (complete) reset(); else setRunning(value => !value); }} className="inline-flex items-center gap-2 bg-[#e4c18d] px-5 py-3 text-sm font-semibold text-[#302218] transition hover:bg-white">{complete ? <RotateCcw className="h-4 w-4" /> : running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}{complete ? (hindi ? 'फिर से शुरू' : 'Begin again') : running ? (hindi ? 'रोकें' : 'Pause') : (hindi ? 'शुरू करें' : 'Begin')}</button><button onClick={reset} className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm text-white/65 transition hover:border-white/50 hover:text-white"><RotateCcw className="h-4 w-4" />{hindi ? 'रीसेट' : 'Reset'}</button></div></div></div></div></section>

        <section className="bg-[#f1ece3] px-5 py-20 text-[#211c18] sm:px-8 md:px-12 md:py-32"><div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[0.35fr_1fr]"><div><Eyebrow>03 / {hindi ? 'साथ रखने के लिए' : 'Carry this with you'}</Eyebrow><h2 className="mt-5 max-w-sm font-serif text-5xl font-medium leading-[0.92] tracking-[-0.06em] md:text-6xl">{hindi ? 'ध्यान आसन तक सीमित नहीं है।' : 'Meditation does not end at the cushion.'}</h2></div><div className="grid gap-px border border-[#d5c9ba] bg-[#d5c9ba] md:grid-cols-2"><div className="bg-[#fff8eb] p-8 sm:p-12"><Heart className="h-5 w-5 text-[#9b642e]" strokeWidth={1.5} /><p className="mt-16 font-tiro text-3xl leading-relaxed tracking-normal text-[#36291f]">{todaysContent?.quote?.quoteHi && hindi ? `“${todaysContent.quote.quoteHi}”` : `“${todaysContent?.quote?.quote || 'The mind becomes quiet when we stop asking it to be somewhere else.'}”`}</p><p className="mt-7 text-sm uppercase tracking-[0.16em] text-[#927052]">— {hindi ? todaysContent?.quote?.authorHi || todaysContent?.quote?.author : todaysContent?.quote?.author || 'A quiet reminder'}</p></div><div className="bg-[#dfe8e2] p-8 sm:p-12"><Sparkles className="h-5 w-5 text-[#9b642e]" strokeWidth={1.5} /><p className="mt-16 font-serif text-3xl leading-tight tracking-[-0.04em] text-[#36291f]">{hindi ? 'कल फिर से लौटने के लिए कोई बड़ा कारण नहीं चाहिए।' : 'You do not need a grand reason to return tomorrow.'}</p><p className="mt-7 text-base leading-7 text-[#786958]">{hindi ? 'अपने अभ्यास को छोटा, सच्चा और दोहराने योग्य रखें। यही निरंतरता है।' : 'Keep the practice small, honest, and repeatable. This is how continuity begins.'}</p></div></div></div></section>

        <section className="bg-[#f1ece3] px-5 pb-24 sm:px-8 md:px-12"><div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-6 border-t border-[#d5c9ba] pt-8 sm:flex-row sm:items-center"><p className="text-sm text-[#786958]">{hindi ? 'आज की साधना को अपनी दैनिक धर्म यात्रा से जोड़ें।' : 'Carry today’s practice into your Daily Dharma journey.'}</p><SiteLink to="/daily-guide" className="inline-flex items-center gap-2 text-sm font-semibold text-[#754619]">{hindi ? 'दैनिक धर्म पढ़ें' : 'Open Daily Dharma'} <ArrowRight className="h-4 w-4" /></SiteLink></div></section>
      </main>
      <Footer />
    </div>
  );
}
