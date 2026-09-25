'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Search, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DivineForm } from '@/lib/divine';

type GalleryForm = Pick<DivineForm, 'id' | 'slug' | 'name' | 'name_hi' | 'domain' | 'domain_hi' | 'image_url'>;

export default function DivineGallery({ forms }: { forms: GalleryForm[] }) {
  const { language } = useLanguage();
  const HI = language === 'HI';
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return forms;
    return forms.filter(f => [f.name, f.name_hi, f.domain, f.domain_hi].some(v => v?.toLowerCase().includes(q)));
  }, [forms, query]);

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <Navbar />

      <header
        className="px-5 pt-14 pb-8 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(147,51,234,0.14) 0%, rgba(240,150,50,0.06) 60%, #faf8f5 100%)' }}
      >
        <h1 className="font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15]">
          {HI ? 'देवी-देवता' : 'Divine Forms'}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
          {HI
            ? `${forms.length} दिव्य रूपों के अर्थ, मंत्र और महत्व, हिंदी और अंग्रेज़ी में।`
            : `The meaning, mantras and significance of ${forms.length} divine forms, in Hindi and English.`}
        </p>

        <div className="mt-7 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a6a5c]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={HI ? 'गणेश, शिव, दुर्गा खोजें' : 'Search a deity or domain'}
            aria-label={HI ? 'दिव्य रूप खोजें' : 'Search divine forms'}
            className="w-full h-12 rounded-full bg-white border border-[#241a12]/10 pl-12 pr-11 text-[16px] placeholder:text-[#7a6a5c] focus:outline-none focus:border-[#9333ea]/50 focus:ring-2 focus:ring-[#9333ea]/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label={HI ? 'खोज साफ़ करें' : 'Clear search'}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#7a6a5c] hover:bg-[#241a12]/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pt-6 pb-20">
        {/* Every divine form stays in the HTML; search only hides tiles, so all profile links remain crawlable. */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {forms.map(f => {
            const shown = visible.includes(f);
            return (
              <li key={f.id} hidden={!shown}>
                <NextLink
                  href={`/divine/${f.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-[#f1e7d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9333ea] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                >
                  {f.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full aspect-[3/4] object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center font-tiro text-5xl text-[#9333ea]">ॐ</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-14">
                    <p className="font-tiro text-white text-[1.15rem] leading-tight">{HI ? f.name_hi || f.name : f.name}</p>
                    <p className="mt-0.5 text-[12px] text-white/75 line-clamp-1">{HI ? f.domain_hi || f.domain : f.domain}</p>
                  </div>
                </NextLink>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-tiro text-2xl">{HI ? 'कोई दिव्य रूप नहीं मिला' : 'No divine forms found'}</p>
            <button onClick={() => setQuery('')} className="mt-4 text-[#9333ea] font-medium hover:underline">
              {HI ? 'सभी दिखाएं' : 'Show all'}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
