'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { ChevronLeft, ChevronRight, Hourglass, MapPin, Sparkles, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { nativeShare, copyToClipboard, shareOnWhatsApp } from '@/utils/shareUtils';
import { trackUserBehavior } from '@/lib/analytics';
import type { Saint } from '@/lib/saints';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';

// Biographies in the database use markdown emphasis (**bold**, *italic*); render it instead of showing asterisks.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i} className="font-semibold text-[#241a12]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}

const paragraphs = (text: string | null) =>
  (text || '').split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);

interface SaintDetailProps {
  saint: Saint;
  related: Saint[];
  prev: Saint;
  next: Saint;
}

const pressable = 'transition-transform duration-150 active:scale-[0.97]';

export default function SaintDetail({ saint, related, prev, next }: SaintDetailProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const HI = language === 'HI';
  const hasHi = paragraphs(saint.biography_hi).length > 0;
  const hasEn = paragraphs(saint.biography).length > 0;
  const [bioLang, setBioLang] = useState<'hi' | 'en' | null>(null);
  const shownLang = bioLang ?? (HI ? (hasHi ? 'hi' : 'en') : (hasEn ? 'en' : 'hi'));

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

  const primaryName = HI ? saint.name_hi || saint.name : saint.name;
  const secondaryName = HI ? saint.name : saint.name_hi;
  const specialty = HI ? saint.specialty_hi || saint.specialty : saint.specialty;
  const description = HI ? saint.description_hi || saint.description : saint.description;
  const sameRegion = related.length > 0 && !!saint.region && related[0].region === saint.region;

  const pageUrl = () => `${window.location.origin}/saints/${saint.slug}`;

  const shareWhatsApp = () => {
    const text = [
      `🕉️ *${saint.name}*${saint.name_hi ? ` (${saint.name_hi})` : ''}`,
      ...(saint.specialty_hi || saint.specialty ? [`"${saint.specialty_hi || saint.specialty}"`] : []),
      '',
      `पूरी जीवन गाथा पढ़ें: ${pageUrl()}`,
    ].join('\n');
    shareOnWhatsApp(encodeURIComponent(text));
    trackUserBehavior.socialShare('whatsapp', 'saint', saint.id);
  };

  const shareOther = async () => {
    const shared = await nativeShare({ title: saint.name, description: description || saint.name, url: pageUrl() });
    if (!shared && (await copyToClipboard(pageUrl()))) toast({ title: HI ? 'लिंक कॉपी हो गया' : 'Link copied' });
    trackUserBehavior.socialShare(shared ? 'native' : 'copy_link', 'saint', saint.id);
  };

  const facts = [
    saint.period && { icon: Hourglass, label: HI ? 'काल' : 'Era', value: saint.period },
    saint.region && { icon: MapPin, label: HI ? 'क्षेत्र' : 'Region', value: saint.region },
    specialty && { icon: Sparkles, label: HI ? 'प्रसिद्धि' : 'Known for', value: specialty },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  const bioTabs = [
    hasHi && { key: 'hi' as const, label: 'हिंदी में', text: saint.biography_hi },
    hasEn && { key: 'en' as const, label: 'In English', text: saint.biography },
  ].filter(Boolean) as { key: 'hi' | 'en'; label: string; text: string | null }[];

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
          <NextLink href="/saints" tabIndex={pastHero ? 0 : -1} aria-label={HI ? 'सभी संत' : 'All saints'} className={`w-10 h-10 rounded-full flex items-center justify-center ${pressable} ${focusRing}`}>
            <ChevronLeft className="w-5 h-5" />
          </NextLink>
          <p className="flex-1 min-w-0 truncate text-center font-tiro text-lg">{primaryName}</p>
          <button onClick={shareOther} tabIndex={pastHero ? 0 : -1} aria-label={HI ? 'साझा करें' : 'Share'} className={`w-10 h-10 rounded-full flex items-center justify-center ${pressable} ${focusRing}`}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="md:max-w-6xl md:mx-auto md:px-8 md:pt-10 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        {/* ── Portrait ── */}
        <div className="md:sticky md:top-24 md:self-start">
          <div ref={heroRef} className="relative">
            {saint.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={saint.image_url}
                alt={saint.name}
                className="w-full h-[68vh] min-h-[420px] max-h-[620px] object-cover object-top md:h-auto md:max-h-none md:aspect-[4/5] md:rounded-3xl md:shadow-[0_30px_60px_-20px_rgba(36,26,18,0.45)]"
              />
            ) : (
              <div className="w-full h-[50vh] md:h-auto md:aspect-[4/5] md:rounded-3xl bg-[#f1e7d8] flex items-center justify-center font-tiro text-7xl text-[#c2410c]">ॐ</div>
            )}
            {/* Fades the photo into the page so the name can sit on it (phones only). */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-[#faf8f5]/70 to-[#faf8f5] md:hidden" />
            <div className="md:hidden absolute inset-x-0 top-0 px-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between">
              <NextLink
                href="/saints"
                aria-label={HI ? 'सभी संत' : 'All saints'}
                className={`w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow-sm flex items-center justify-center text-[#241a12] ${pressable} ${focusRing}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </NextLink>
              <button
                onClick={shareOther}
                aria-label={HI ? 'साझा करें' : 'Share'}
                className={`w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow-sm flex items-center justify-center text-[#241a12] ${pressable} ${focusRing}`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 px-5 pb-2 md:hidden">
              <h1 className="font-tiro font-normal tracking-normal text-[2.6rem] leading-[1.1]">{primaryName}</h1>
              {secondaryName && <p className="mt-1 font-tiro text-xl text-[#c2410c]">{secondaryName}</p>}
            </div>
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="px-5 md:px-0 pb-28 md:pb-20">
          <NextLink
            href="/saints"
            className={`hidden md:inline-flex items-center gap-1 -ml-1 rounded-full px-1 py-1 text-sm text-[#7a6a5c] hover:text-[#241a12] transition-colors ${focusRing}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {HI ? 'सभी संत' : 'All saints'}
          </NextLink>
          <div className="hidden md:block mt-6">
            <h1 className="font-tiro font-normal tracking-normal text-6xl leading-[1.05]">{primaryName}</h1>
            {secondaryName && <p className="mt-2 font-tiro text-2xl text-[#c2410c]">{secondaryName}</p>}
          </div>

          <div className="hidden md:flex mt-5 items-center gap-3">
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

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3">
              {facts.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className={`rounded-2xl bg-white border border-[#241a12]/10 px-4 py-3.5 ${i === facts.length - 1 && facts.length % 2 === 1 ? 'col-span-2' : ''}`}
                >
                  <dt className="flex items-center gap-1.5 text-[13px] text-[#7a6a5c]">
                    <Icon className="w-4 h-4 text-[#c2410c]" strokeWidth={1.75} />
                    {label}
                  </dt>
                  <dd className="mt-1 text-[16px] font-semibold leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {description && (
            <blockquote
              lang={HI && saint.description_hi ? 'hi' : 'en'}
              className="mt-10 border-l-2 border-[#ea580c] pl-5 font-tiro text-[1.35rem] leading-[1.6] text-[#241a12]"
            >
              <Rich text={description} />
            </blockquote>
          )}

          {bioTabs.length > 0 && (
            <section className="mt-12" aria-labelledby="life-story">
              <div className="flex items-end justify-between gap-4">
                <h2 id="life-story" className="font-tiro font-normal tracking-normal text-[1.9rem] leading-tight">
                  {HI ? 'जीवन गाथा' : 'Life story'}
                </h2>
                {bioTabs.length > 1 && (
                  <div role="tablist" aria-label={HI ? 'भाषा' : 'Language'} className="flex rounded-full bg-[#241a12]/[0.06] p-1">
                    {bioTabs.map(t => (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={shownLang === t.key}
                        aria-controls={`bio-${t.key}`}
                        onClick={() => setBioLang(t.key)}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-[0.97] ${focusRing} ${
                          shownLang === t.key ? 'bg-white shadow-sm text-[#241a12]' : 'text-[#7a6a5c] hover:text-[#241a12]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Both languages stay in the HTML for search engines; only one is shown at a time. */}
              {bioTabs.map(t => (
                <div
                  key={t.key}
                  id={`bio-${t.key}`}
                  role="tabpanel"
                  lang={t.key}
                  hidden={shownLang !== t.key}
                  className={`mt-5 space-y-4 text-[17px] text-[#241a12]/85 ${t.key === 'hi' ? 'leading-[1.9]' : 'leading-relaxed'}`}
                >
                  {paragraphs(t.text).map((p, i) => <p key={i}><Rich text={p} /></p>)}
                </div>
              ))}
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="more-saints">
              <h2 id="more-saints" className="font-mukta tracking-normal text-xl font-semibold">
                {sameRegion
                  ? (HI ? `${saint.region} के और संत` : `More saints from ${saint.region}`)
                  : (HI ? 'और संत' : 'More saints')}
              </h2>
              <ul className="mt-5 -mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 flex gap-5 overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {related.map(r => (
                  <li key={r.id} className="w-20 flex-shrink-0 snap-start text-center">
                    <NextLink href={`/saints/${r.slug}`} className={`group block rounded-2xl ${pressable} ${focusRing}`}>
                      {r.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.image_url} alt="" loading="lazy" className="w-20 h-20 rounded-full object-cover object-top ring-2 ring-white shadow-md" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#f1e7d8] flex items-center justify-center font-tiro text-2xl text-[#c2410c]">ॐ</div>
                      )}
                      <p className="mt-2 text-[13px] font-medium leading-tight line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                        {HI ? r.name_hi || r.name : r.name}
                      </p>
                    </NextLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <nav aria-label={HI ? 'और संत देखें' : 'Browse saints'} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{ s: prev, dir: 'prev' as const }, { s: next, dir: 'next' as const }].map(({ s: other, dir }) => (
              <NextLink
                key={dir}
                href={`/saints/${other.slug}`}
                className={`group flex items-center gap-3 rounded-2xl bg-white border border-[#241a12]/10 p-3 ${dir === 'next' ? 'flex-row-reverse text-right' : ''} ${pressable} ${focusRing}`}
              >
                {other.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={other.image_url} alt="" loading="lazy" className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#f1e7d8] flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`flex items-center gap-0.5 text-[12px] text-[#7a6a5c] ${dir === 'next' ? 'justify-end' : ''}`}>
                    {dir === 'prev' && <ChevronLeft className="w-3.5 h-3.5" />}
                    {dir === 'prev' ? (HI ? 'पिछले' : 'Previous') : (HI ? 'अगले' : 'Next')}
                    {dir === 'next' && <ChevronRight className="w-3.5 h-3.5" />}
                  </p>
                  <p className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                    {HI ? other.name_hi || other.name : other.name}
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
