'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { nativeShare, copyToClipboard, shareOnWhatsApp } from '@/utils/shareUtils';
import { trackUserBehavior } from '@/lib/analytics';
import type { DivineForm } from '@/lib/divine';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9333ea] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';
const pressable = 'transition-transform duration-150 active:scale-[0.97]';

interface DivineDetailProps {
  form: DivineForm;
  related: DivineForm[];
  prev: DivineForm;
  next: DivineForm;
}

export default function DivineDetail({ form, related, prev, next }: DivineDetailProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const HI = language === 'HI';

  const hasHi = !!form.description_hi?.trim();
  const hasEn = !!form.description?.trim();
  const [descLang, setDescLang] = useState<'hi' | 'en' | null>(null);
  const shownLang = descLang ?? (HI ? (hasHi ? 'hi' : 'en') : (hasEn ? 'en' : 'hi'));

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

  const primaryName = HI ? form.name_hi || form.name : form.name;
  const secondaryName = HI ? form.name : form.name_hi;
  const domain = HI ? form.domain_hi || form.domain : form.domain;

  const pageUrl = () => `${window.location.origin}/divine/${form.slug}`;

  const shareWhatsApp = () => {
    const attrs = (form.attributes || []).slice(0, 3).join(', ');
    const text = [
      `🕉️ *${form.name}*${form.name_hi ? ` (${form.name_hi})` : ''}`,
      ...(domain ? [`"${domain}"`] : []),
      ...(form.mantra ? [`🙏 मंत्र: ${form.mantra}`] : []),
      ...(attrs ? [`✨ गुण: ${attrs}`] : []),
      '',
      `पूर्ण विवरण पढ़ें: ${pageUrl()}`,
    ].join('\n');
    shareOnWhatsApp(encodeURIComponent(text));
    trackUserBehavior.socialShare('whatsapp', 'divine_form', String(form.id));
  };

  const shareOther = async () => {
    const shared = await nativeShare({ title: form.name, description: form.description || form.name, url: pageUrl() });
    if (!shared && (await copyToClipboard(pageUrl()))) toast({ title: HI ? 'लिंक कॉपी हो गया' : 'Link copied' });
    trackUserBehavior.socialShare(shared ? 'native' : 'copy_link', 'divine_form', String(form.id));
  };

  const descTabs = [
    hasHi && { key: 'hi' as const, label: 'हिंदी में', text: form.description_hi },
    hasEn && { key: 'en' as const, label: 'In English', text: form.description },
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
          <NextLink href="/divine" tabIndex={pastHero ? 0 : -1} aria-label={HI ? 'सभी दिव्य रूप' : 'All divine forms'} className={`w-10 h-10 rounded-full flex items-center justify-center ${pressable} ${focusRing}`}>
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
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt={form.name}
                className="w-full h-[68vh] min-h-[420px] max-h-[620px] object-cover object-top md:h-auto md:max-h-none md:aspect-[4/5] md:rounded-3xl md:shadow-[0_30px_60px_-20px_rgba(36,26,18,0.45)]"
              />
            ) : (
              <div className="w-full h-[50vh] md:h-auto md:aspect-[4/5] md:rounded-3xl bg-[#f1e7d8] flex items-center justify-center font-tiro text-7xl text-[#9333ea]">ॐ</div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-[#faf8f5]/70 to-[#faf8f5] md:hidden" />
            <div className="md:hidden absolute inset-x-0 top-0 px-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between">
              <NextLink
                href="/divine"
                aria-label={HI ? 'सभी दिव्य रूप' : 'All divine forms'}
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
              {secondaryName && <p className="mt-1 font-tiro text-xl text-[#9333ea]">{secondaryName}</p>}
            </div>
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="px-5 md:px-0 pb-28 md:pb-20">
          <NextLink
            href="/divine"
            className={`hidden md:inline-flex items-center gap-1 -ml-1 rounded-full px-1 py-1 text-sm text-[#7a6a5c] hover:text-[#241a12] transition-colors ${focusRing}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {HI ? 'सभी दिव्य रूप' : 'All divine forms'}
          </NextLink>
          <div className="hidden md:block mt-6">
            <h1 className="font-tiro font-normal tracking-normal text-6xl leading-[1.05]">{primaryName}</h1>
            {secondaryName && <p className="mt-2 font-tiro text-2xl text-[#9333ea]">{secondaryName}</p>}
          </div>

          <div className="hidden md:flex mt-5 items-center gap-3">
            <button
              onClick={shareWhatsApp}
              className={`h-11 px-5 rounded-full bg-[#9333ea] hover:bg-[#7e22ce] text-white text-[15px] font-semibold transition-colors ${focusRing}`}
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

          {domain && (
            <div className="mt-8 rounded-2xl bg-white border border-[#241a12]/10 px-4 py-3.5">
              <dt className="flex items-center gap-1.5 text-[13px] text-[#7a6a5c]">
                <Sparkles className="w-4 h-4 text-[#9333ea]" strokeWidth={1.75} />
                {HI ? 'क्षेत्र' : 'Domain'}
              </dt>
              <dd className="mt-1 text-[16px] font-semibold leading-snug">{domain}</dd>
            </div>
          )}

          {form.mantra && (
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-purple-50 to-orange-50 border border-[#9333ea]/15 px-5 py-4">
              <p className="text-[13px] font-medium text-[#9333ea]">{HI ? 'पवित्र मंत्र' : 'Sacred Mantra'}</p>
              <p className="mt-1 font-tiro text-xl leading-relaxed">{form.mantra}</p>
            </div>
          )}

          {form.attributes && form.attributes.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {form.attributes.map(attr => (
                <span key={attr} className="text-xs font-medium border border-[#9333ea]/25 text-[#7e22ce] rounded-full px-3 py-1.5">
                  {attr}
                </span>
              ))}
            </div>
          )}

          {descTabs.length > 0 && (
            <section className="mt-10" aria-labelledby="about">
              <div className="flex items-end justify-between gap-4">
                <h2 id="about" className="font-tiro font-normal tracking-normal text-[1.9rem] leading-tight">
                  {HI ? 'परिचय' : 'About'}
                </h2>
                {descTabs.length > 1 && (
                  <div role="tablist" aria-label={HI ? 'भाषा' : 'Language'} className="flex rounded-full bg-[#241a12]/[0.06] p-1">
                    {descTabs.map(t => (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={shownLang === t.key}
                        aria-controls={`desc-${t.key}`}
                        onClick={() => setDescLang(t.key)}
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
              {descTabs.map(t => (
                <div
                  key={t.key}
                  id={`desc-${t.key}`}
                  role="tabpanel"
                  lang={t.key}
                  hidden={shownLang !== t.key}
                  className={`mt-5 text-[17px] text-[#241a12]/85 ${t.key === 'hi' ? 'leading-[1.9]' : 'leading-relaxed'}`}
                >
                  <p>{t.text}</p>
                </div>
              ))}
            </section>
          )}

          {form.significance && (
            <section className="mt-10" aria-labelledby="significance">
              <h2 id="significance" className="font-mukta tracking-normal text-xl font-semibold">
                {HI ? 'महत्व' : 'Significance'}
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[#241a12]/85">{form.significance}</p>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16" aria-labelledby="more-forms">
              <h2 id="more-forms" className="font-mukta tracking-normal text-xl font-semibold">
                {HI ? 'और दिव्य रूप' : 'More divine forms'}
              </h2>
              <ul className="mt-5 -mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 flex gap-5 overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {related.map(r => (
                  <li key={r.id} className="w-20 flex-shrink-0 snap-start text-center">
                    <NextLink href={`/divine/${r.slug}`} className={`group block rounded-2xl ${pressable} ${focusRing}`}>
                      {r.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.image_url} alt="" loading="lazy" className="w-20 h-20 rounded-full object-cover object-top ring-2 ring-white shadow-md" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#f1e7d8] flex items-center justify-center font-tiro text-2xl text-[#9333ea]">ॐ</div>
                      )}
                      <p className="mt-2 text-[13px] font-medium leading-tight line-clamp-2 group-hover:text-[#9333ea] transition-colors">
                        {HI ? r.name_hi || r.name : r.name}
                      </p>
                    </NextLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <nav aria-label={HI ? 'और दिव्य रूप देखें' : 'Browse divine forms'} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{ f: prev, dir: 'prev' as const }, { f: next, dir: 'next' as const }].map(({ f: other, dir }) => (
              <NextLink
                key={dir}
                href={`/divine/${other.slug}`}
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
                  <p className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-[#9333ea] transition-colors">
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
            className={`flex-1 h-12 rounded-full bg-[#9333ea] text-white text-[16px] font-semibold ${pressable} ${focusRing}`}
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
