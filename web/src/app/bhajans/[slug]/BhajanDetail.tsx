'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { ChevronLeft, ChevronRight, Copy, Share2, Youtube, Quote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { nativeShare, copyToClipboard, shareOnWhatsApp } from '@/utils/shareUtils';
import { trackUserBehavior } from '@/lib/analytics';
import { CopyToClipboard } from '@/utils/copyUtils';
import { getGradientClass, getCategoryIcon } from '@/utils/categoryGradients';
import FavoriteButton from '@/components/bhajan/FavoriteButton';
import type { Bhajan } from '@/lib/bhajans';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';
const pressable = 'transition-transform duration-150 active:scale-[0.97]';

interface BhajanDetailProps {
  bhajan: Bhajan;
  related: Bhajan[];
  prev: Bhajan;
  next: Bhajan;
}

export default function BhajanDetail({ bhajan, related, prev, next }: BhajanDetailProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const HI = language === 'HI';

  const heroRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      if (hero) setPastHero(hero.getBoundingClientRect().bottom < 64);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const end = endRef.current;
    const observer = end ? new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting)) : null;
    if (end && observer) observer.observe(end);
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, []);

  const gradientClass = getGradientClass(bhajan.category);
  const categoryIcon = getCategoryIcon(bhajan.category);
  const primaryTitle = HI ? bhajan.title_hi || bhajan.title : bhajan.title;
  const secondaryTitle = HI ? bhajan.title : bhajan.title_hi;

  const pageUrl = () => `${window.location.origin}/bhajans/${bhajan.slug}`;

  const shareWhatsApp = () => {
    const text = [
      `🎵 *${bhajan.title}*${bhajan.title_hi ? ` (${bhajan.title_hi})` : ''}`,
      ...(bhajan.category ? [`"${bhajan.category}"`] : []),
      '',
      `पूरे बोल पढ़ें: ${pageUrl()}`,
    ].join('\n');
    shareOnWhatsApp(encodeURIComponent(text));
    trackUserBehavior.socialShare('whatsapp', 'bhajan', bhajan.id);
  };

  const shareOther = async () => {
    const shared = await nativeShare({ title: bhajan.title, description: bhajan.meaning || bhajan.title, url: pageUrl() });
    if (!shared && (await copyToClipboard(pageUrl()))) toast({ title: HI ? 'लिंक कॉपी हो गया' : 'Link copied' });
    trackUserBehavior.socialShare(shared ? 'native' : 'copy_link', 'bhajan', bhajan.id);
  };

  const handleCopyLyrics = async () => {
    const formattedText = CopyToClipboard.formatBhajanForSharing({
      title: bhajan.title,
      title_hi: bhajan.title_hi,
      lyrics: bhajan.lyrics,
      lyrics_hi: bhajan.lyrics_hi,
      meaning: bhajan.meaning,
      author: bhajan.author,
      category: bhajan.category,
    });
    const success = await copyToClipboard(formattedText);
    toast(
      success
        ? { title: '🎵 Bhajan Copied!', description: CopyToClipboard.getSuccessMessage() }
        : { title: 'Copy Failed', description: CopyToClipboard.getErrorMessage(), variant: 'destructive' }
    );
  };

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <header
        className={`md:hidden fixed inset-x-0 top-0 z-40 bg-[#faf8f5]/95 backdrop-blur border-b border-[#241a12]/10 pt-[env(safe-area-inset-top)] transition-transform duration-300 ${
          pastHero ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!pastHero}
      >
        <div className="h-14 px-2 flex items-center gap-1">
          <NextLink href="/bhajans" tabIndex={pastHero ? 0 : -1} aria-label={HI ? 'सभी भजन' : 'All bhajans'} className={`w-10 h-10 rounded-full flex items-center justify-center ${pressable} ${focusRing}`}>
            <ChevronLeft className="w-5 h-5" />
          </NextLink>
          <p className="flex-1 min-w-0 truncate text-center font-tiro text-lg">{primaryTitle}</p>
          <button onClick={shareOther} tabIndex={pastHero ? 0 : -1} aria-label={HI ? 'साझा करें' : 'Share'} className={`w-10 h-10 rounded-full flex items-center justify-center ${pressable} ${focusRing}`}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="md:max-w-5xl md:mx-auto md:px-8 md:pt-10">
        {/* ── Gradient hero ── */}
        <div ref={heroRef} className={`relative ${gradientClass} px-5 pt-[max(3.5rem,env(safe-area-inset-top))] pb-8 md:rounded-3xl md:pt-12 md:pb-10`}>
          <div className="absolute inset-0 opacity-20 flex items-center justify-center overflow-hidden md:rounded-3xl">
            <span className="text-9xl">{categoryIcon}</span>
          </div>
          <div className="md:hidden absolute inset-x-0 top-0 px-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between">
            <NextLink
              href="/bhajans"
              aria-label={HI ? 'सभी भजन' : 'All bhajans'}
              className={`w-10 h-10 rounded-full bg-black/20 backdrop-blur flex items-center justify-center text-white ${pressable} ${focusRing}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </NextLink>
            <button
              onClick={shareOther}
              aria-label={HI ? 'साझा करें' : 'Share'}
              className={`w-10 h-10 rounded-full bg-black/20 backdrop-blur flex items-center justify-center text-white ${pressable} ${focusRing}`}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 text-white space-y-3">
            <NextLink
              href="/bhajans"
              className={`hidden md:inline-flex items-center gap-1 -ml-1 rounded-full px-1 py-1 text-sm text-white/80 hover:text-white transition-colors ${focusRing}`}
            >
              <ChevronLeft className="w-4 h-4" />
              {HI ? 'सभी भजन' : 'All bhajans'}
            </NextLink>
            <span className="inline-block text-xs font-medium bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-3 py-1">
              {bhajan.category}
            </span>
            <h1 className="font-tiro font-normal tracking-normal text-4xl md:text-5xl leading-[1.1] drop-shadow">{primaryTitle}</h1>
            {secondaryTitle && <p className="font-tiro text-xl md:text-2xl opacity-90">{secondaryTitle}</p>}
            {bhajan.author && <p className="text-sm opacity-80">{HI ? 'रचयिता' : 'by'} {bhajan.author}</p>}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div onClick={e => e.stopPropagation()}>
                <FavoriteButton bhajanId={bhajan.id} bhajanTitle={bhajan.title} size="lg" variant="default" />
              </div>
              <button
                onClick={handleCopyLyrics}
                className={`flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2.5 text-sm font-medium hover:bg-white/30 transition-colors ${focusRing}`}
              >
                <Copy className="w-4 h-4" />
                {HI ? 'कॉपी करें' : 'Copy'}
              </button>
              {bhajan.youtube_url && (
                <a
                  href={bhajan.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2.5 text-sm font-medium hover:bg-white/30 transition-colors ${focusRing}`}
                >
                  <Youtube className="w-4 h-4" />
                  {HI ? 'सुनें' : 'Listen'}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-5 md:px-0 pt-8 pb-28 md:pb-20">
          <section aria-labelledby="lyrics">
            <h2 id="lyrics" className="font-tiro font-normal tracking-normal text-[1.9rem] leading-tight">
              {HI ? 'पवित्र बोल' : 'Sacred Lyrics'}
            </h2>
            <div className="mt-5 grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#241a12]/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${gradientClass}`} />
                  <h3 className="text-[15px] font-semibold">देवनागरी</h3>
                </div>
                <p className="whitespace-pre-wrap text-[16px] leading-[1.9] text-[#241a12]/85 font-medium" lang="hi">
                  {bhajan.lyrics_hi}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#241a12]/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${gradientClass}`} />
                  <h3 className="text-[15px] font-semibold">{HI ? 'लिप्यंतरण' : 'Transliteration'}</h3>
                </div>
                <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-[#241a12]/85">{bhajan.lyrics}</p>
              </div>
            </div>
          </section>

          {bhajan.meaning && (
            <section className="mt-8 rounded-2xl bg-gradient-to-br from-orange-50 to-green-50 border border-orange-200/50 p-5 md:p-6" aria-labelledby="meaning">
              <div className="flex items-center gap-2 mb-3">
                <Quote className="w-5 h-5 text-[#ea580c]" />
                <h2 id="meaning" className="text-lg font-semibold">
                  {HI ? 'आध्यात्मिक अर्थ' : 'Spiritual Meaning'}
                </h2>
              </div>
              <p className="text-[16px] leading-relaxed text-[#241a12]/85 italic">{bhajan.meaning}</p>
            </section>
          )}

          <div className="hidden md:flex mt-8 items-center gap-3">
            <button
              onClick={shareWhatsApp}
              className={`h-11 px-5 rounded-full bg-[#ea580c] hover:bg-[#d24e0a] text-white text-[15px] font-semibold transition-colors ${focusRing}`}
            >
              {HI ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}
            </button>
            <button
              onClick={shareOther}
              aria-label={HI ? 'साझा करें' : 'Share'}
              className={`w-11 h-11 rounded-full border border-[#241a12]/15 flex items-center justify-center hover:bg-white transition-colors ${focusRing}`}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="more-bhajans">
              <h2 id="more-bhajans" className="font-mukta tracking-normal text-xl font-semibold">
                {HI ? 'और भजन' : 'More bhajans'}
              </h2>
              <ul className="mt-5 -mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 flex gap-4 overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {related.map(r => {
                  const rGradient = getGradientClass(r.category);
                  return (
                    <li key={r.id} className="w-28 flex-shrink-0 snap-start">
                      <NextLink href={`/bhajans/${r.slug}`} className={`group block rounded-2xl overflow-hidden ${pressable} ${focusRing}`}>
                        <div className={`${rGradient} aspect-square rounded-2xl flex items-center justify-center`}>
                          <span className="text-2xl">{getCategoryIcon(r.category)}</span>
                        </div>
                        <p className="mt-2 text-[13px] font-medium leading-tight line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                          {HI ? r.title_hi || r.title : r.title}
                        </p>
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <nav aria-label={HI ? 'और भजन देखें' : 'Browse bhajans'} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{ b: prev, dir: 'prev' as const }, { b: next, dir: 'next' as const }].map(({ b: other, dir }) => (
              <NextLink
                key={dir}
                href={`/bhajans/${other.slug}`}
                className={`group flex items-center gap-3 rounded-2xl bg-white border border-[#241a12]/10 p-3 ${dir === 'next' ? 'flex-row-reverse text-right' : ''} ${pressable} ${focusRing}`}
              >
                <div className={`${getGradientClass(other.category)} w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg`}>
                  {getCategoryIcon(other.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`flex items-center gap-0.5 text-[12px] text-[#7a6a5c] ${dir === 'next' ? 'justify-end' : ''}`}>
                    {dir === 'prev' && <ChevronLeft className="w-3.5 h-3.5" />}
                    {dir === 'prev' ? (HI ? 'पिछले' : 'Previous') : (HI ? 'अगले' : 'Next')}
                    {dir === 'next' && <ChevronRight className="w-3.5 h-3.5" />}
                  </p>
                  <p className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                    {HI ? other.title_hi || other.title : other.title}
                  </p>
                </div>
              </NextLink>
            ))}
          </nav>
          <div ref={endRef} aria-hidden="true" />
        </div>
      </div>

      {/* Phones: the main action lives in a bottom bar, like an app. */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#faf8f5]/95 backdrop-blur border-t border-[#241a12]/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
          atEnd ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={shareWhatsApp}
            className={`flex-1 h-12 rounded-full bg-[#ea580c] text-white text-[16px] font-semibold ${pressable} ${focusRing}`}
          >
            {HI ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}
          </button>
          <button
            onClick={shareOther}
            aria-label={HI ? 'साझा करें' : 'Share'}
            className={`w-12 h-12 rounded-full border border-[#241a12]/15 bg-white flex items-center justify-center ${pressable} ${focusRing}`}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
