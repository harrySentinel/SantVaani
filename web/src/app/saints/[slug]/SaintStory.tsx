'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { BookOpen, ChevronDown, ArrowRight } from 'lucide-react';
import { shareOnWhatsApp } from '@/utils/shareUtils';
import { trackUserBehavior } from '@/lib/analytics';
import type { Bilingual, SaintContent } from '@/content/saints/types';

type Lang = 'hi' | 'en';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]';
const pressable = 'transition-transform duration-150 active:scale-[0.97]';

// Both languages stay in the HTML (for search engines); only the chosen one is visible.
function Both({ value, lang, as: Tag = 'span', className = '' }: { value: Bilingual; lang: Lang; as?: 'span' | 'p' | 'h2' | 'h3'; className?: string }) {
  return (
    <>
      <Tag lang="hi" hidden={lang !== 'hi'} className={className}>{value.hi}</Tag>
      <Tag lang="en" hidden={lang !== 'en'} className={className}>{value.en}</Tag>
    </>
  );
}

const heading = 'font-tiro font-normal tracking-normal text-[1.9rem] leading-tight text-[#241a12]';

export default function SaintStory({ content, saintName, saintNameHi, saintId }: { content: SaintContent; saintName: string; saintNameHi: string | null; saintId: string }) {
  const [lang, setLang] = useState<Lang>('hi');
  const hi = lang === 'hi';
  const bodyText = `text-[17px] text-[#241a12]/85 ${hi ? 'leading-[1.95]' : 'leading-relaxed'}`;

  const shareVerse = (i: number) => {
    const v = content.verses[i];
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = [`🕉️ ${saintNameHi || saintName}`, '', v.text, '', `अर्थ: ${v.arth}`, '', url].join('\n');
    shareOnWhatsApp(encodeURIComponent(text));
    trackUserBehavior.socialShare('whatsapp', 'saint_verse', `${saintId}:${i}`);
  };

  return (
    <div className="mt-10">
      {/* Language for the whole story */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#7a6a5c]">{hi ? 'पढ़ने की भाषा' : 'Reading in'}</p>
        <div role="tablist" aria-label="Language" className="flex rounded-full bg-[#241a12]/[0.06] p-1">
          {(['hi', 'en'] as const).map(l => (
            <button
              key={l}
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${pressable} ${focusRing} ${
                lang === l ? 'bg-white shadow-sm text-[#241a12]' : 'text-[#7a6a5c] hover:text-[#241a12]'
              }`}
            >
              {l === 'hi' ? 'हिंदी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scene ── */}
      <section className="mt-8" aria-labelledby="scene-heading">
        <h2 id="scene-heading" className={heading}>
          <Both value={content.scene.heading} lang={lang} />
        </h2>
        {(['hi', 'en'] as const).map(l => (
          <div key={l} lang={l} hidden={lang !== l} className={`mt-5 space-y-5 ${bodyText}`}>
            {content.scene.paragraphs[l].map((p, i) => <p key={i}>{p}</p>)}
          </div>
        ))}
      </section>

      {/* ── Verses ── */}
      <section className="mt-14" aria-labelledby="verses-heading">
        <h2 id="verses-heading" className={heading}>
          <Both value={{ hi: `${saintNameHi || saintName} के दोहे, अर्थ सहित`, en: `${saintName}: verses with meaning` }} lang={lang} />
        </h2>
        <ul className="mt-6 -mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {content.verses.map((v, i) => (
            <li key={i} className="w-[86%] sm:w-[70%] md:w-full flex-shrink-0 snap-start">
              <article className="h-full flex flex-col rounded-3xl bg-white border border-[#241a12]/10 p-6 shadow-[0_12px_30px_-18px_rgba(36,26,18,0.35)]">
                <p lang="hi" className="font-tiro text-[1.12rem] sm:text-[1.3rem] leading-[1.8] text-center text-[#241a12] text-balance">
                  {v.text.split('\n').map((line, j) => <span key={j} className="block">{line}</span>)}
                </p>
                <div className="my-5 text-center text-[#c2410c]/70 font-tiro" aria-hidden="true">॥</div>
                <p className="text-[13px] font-semibold text-[#c2410c]">{hi ? 'अर्थ' : 'Meaning'}</p>
                <p lang="hi" hidden={!hi} className="mt-1 text-[16px] leading-[1.85] text-[#241a12]/85">{v.arth}</p>
                <p lang="en" hidden={hi} className="mt-1 text-[16px] leading-relaxed text-[#241a12]/85">{v.meaning}</p>
                {v.context && (
                  <p className="mt-3 text-[14px] italic text-[#7a6a5c]">
                    <Both value={v.context} lang={lang} />
                  </p>
                )}
                <div className="mt-auto pt-5 flex items-center justify-between">
                  <span className="text-xs text-[#7a6a5c]">{i + 1} / {content.verses.length}</span>
                  <button
                    onClick={() => shareVerse(i)}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-[#241a12]/15 px-3.5 py-1.5 text-[13px] font-medium hover:bg-[#faf8f5] ${pressable} ${focusRing}`}
                  >
                    {hi ? 'यह दोहा भेजें' : 'Share this verse'}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Timeline ── */}
      <section className="mt-14" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className={heading}>
          <Both value={{ hi: 'जीवन की झलक', en: 'Life at a glance' }} lang={lang} />
        </h2>
        <ol className="mt-6 relative border-l-2 border-[#ea580c]/25 ml-2 space-y-7">
          {content.timeline.map((t, i) => (
            <li key={i} className="relative pl-6">
              <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#faf8f5] border-2 border-[#ea580c]" aria-hidden="true" />
              <p className="text-[14px] font-semibold text-[#c2410c]"><Both value={t.when} lang={lang} /></p>
              <p className={`mt-1 ${bodyText}`}><Both value={t.text} lang={lang} /></p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Today ── */}
      <section className="mt-14 rounded-3xl bg-[#fff1e4] px-6 py-7" aria-labelledby="today-heading">
        <h2 id="today-heading" className={heading}>
          <Both value={{ hi: 'आज हमारे लिए', en: 'What it means for us today' }} lang={lang} />
        </h2>
        <p className={`mt-4 ${bodyText}`}><Both value={content.today} lang={lang} /></p>
      </section>

      {/* ── Related reading ── */}
      {content.links?.map(link => (
        <NextLink
          key={link.href}
          href={link.href}
          className={`mt-6 flex items-center gap-4 rounded-2xl bg-white border border-[#241a12]/10 p-4 ${pressable} ${focusRing}`}
        >
          <span className="w-11 h-11 rounded-full bg-[#fff1e4] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#c2410c]" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[16px] font-semibold"><Both value={link.label} lang={lang} /></span>
            <span className="block text-[13px] text-[#7a6a5c]"><Both value={link.note} lang={lang} /></span>
          </span>
          <ArrowRight className="w-5 h-5 text-[#7a6a5c]" />
        </NextLink>
      ))}

      {/* ── FAQ ── */}
      <section className="mt-14" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className={heading}>
          <Both value={{ hi: 'अक्सर पूछे जाने वाले प्रश्न', en: 'Frequently asked questions' }} lang={lang} />
        </h2>
        <div className="mt-5 divide-y divide-[#241a12]/10 border-y border-[#241a12]/10">
          {content.faq.map((f, i) => (
            <details key={i} className="group py-1">
              <summary className={`flex items-center justify-between gap-4 py-4 cursor-pointer list-none rounded ${focusRing} [&::-webkit-details-marker]:hidden`}>
                <span className="text-[16px] font-semibold leading-snug"><Both value={f.q} lang={lang} /></span>
                <ChevronDown className="w-5 h-5 flex-shrink-0 text-[#7a6a5c] transition-transform group-open:rotate-180" />
              </summary>
              <p className={`pb-4 ${bodyText}`}><Both value={f.a} lang={lang} /></p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
