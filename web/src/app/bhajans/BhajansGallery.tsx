'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Search, X, BookOpen, Youtube } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGradientClass } from '@/utils/categoryGradients';
import type { Bhajan } from '@/lib/bhajans';

type GalleryBhajan = Pick<Bhajan, 'id' | 'slug' | 'title' | 'title_hi' | 'category' | 'author' | 'youtube_url'>;

export default function BhajansGallery({ bhajans }: { bhajans: GalleryBhajan[] }) {
  const { language } = useLanguage();
  const HI = language === 'HI';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    bhajans.forEach(b => {
      if (b.category) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [bhajans]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bhajans.filter(b => {
      if (category && b.category !== category) return false;
      if (!q) return true;
      return [b.title, b.title_hi, b.category, b.author].some(v => v?.toLowerCase().includes(q));
    });
  }, [bhajans, query, category]);

  const chip = (on: boolean) =>
    `flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] ${
      on ? 'bg-[#241a12] text-white' : 'bg-white border border-[#241a12]/10 text-[#241a12]/80 hover:border-[#ea580c]/40'
    }`;

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <Navbar />

      <header
        className="px-5 pt-14 pb-8 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(240,150,50,0.16) 0%, rgba(240,150,50,0.05) 60%, #faf8f5 100%)' }}
      >
        <h1 className="font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15]">
          {HI ? 'भजन के बोल' : 'Bhajan Lyrics'}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
          {HI
            ? `${bhajans.length} भजनों के बोल, देवनागरी और अंग्रेज़ी में, अर्थ सहित।`
            : `The lyrics of ${bhajans.length} bhajans, in Devanagari and transliteration, with meaning.`}
        </p>

        <div className="mt-7 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a6a5c]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={HI ? 'भजन, देवता या रचयिता खोजें' : 'Search a bhajan, deity or author'}
            aria-label={HI ? 'भजन खोजें' : 'Search bhajans'}
            className="w-full h-12 rounded-full bg-white border border-[#241a12]/10 pl-12 pr-11 text-[16px] placeholder:text-[#7a6a5c] focus:outline-none focus:border-[#ea580c]/50 focus:ring-2 focus:ring-[#ea580c]/20"
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

      <nav aria-label={HI ? 'श्रेणियाँ' : 'Categories'} className="max-w-6xl mx-auto px-5">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
          <button onClick={() => setCategory(null)} className={chip(category === null)} aria-pressed={category === null}>
            {HI ? 'सभी' : 'All'}
          </button>
          {categories.map(([c, n]) => (
            <button key={c} onClick={() => setCategory(category === c ? null : c)} className={chip(category === c)} aria-pressed={category === c}>
              {c} <span className={category === c ? 'text-white/60' : 'text-[#7a6a5c]'}>{n}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 pt-6 pb-20">
        {/* Every bhajan stays in the HTML; filtering only hides tiles, so all lyric pages remain crawlable. */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {bhajans.map(b => {
            const shown = visible.includes(b);
            const gradientClass = getGradientClass(b.category);
            return (
              <li key={b.id} hidden={!shown}>
                <NextLink
                  href={`/bhajans/${b.slug}`}
                  className="group relative block overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                >
                  <div className={`${gradientClass} aspect-square flex items-center justify-center relative`}>
                    <BookOpen className="w-12 h-12 text-white/25" />
                    {b.youtube_url && (
                      <span className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 text-red-600 shadow">
                        <Youtube className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="bg-white p-3 space-y-1">
                    <p className="font-semibold text-[#241a12] text-sm line-clamp-1 group-hover:text-[#ea580c] transition-colors">
                      {HI ? b.title_hi || b.title : b.title}
                    </p>
                    <p className="text-xs text-[#ea580c] line-clamp-1 font-medium">{HI ? b.title : b.title_hi}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-[#7a6a5c] bg-[#faf8f5] border border-[#241a12]/10 px-2 py-0.5 rounded-full truncate">
                        {b.category}
                      </span>
                    </div>
                  </div>
                </NextLink>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-tiro text-2xl">{HI ? 'कोई भजन नहीं मिला' : 'No bhajans found'}</p>
            <button
              onClick={() => { setQuery(''); setCategory(null); }}
              className="mt-4 text-[#c2410c] font-medium hover:underline"
            >
              {HI ? 'सभी भजन दिखाएं' : 'Show all bhajans'}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
