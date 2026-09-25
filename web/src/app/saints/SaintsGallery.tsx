'use client';

import { useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Saint } from '@/lib/saints';

type GallerySaint = Pick<Saint, 'id' | 'slug' | 'name' | 'name_hi' | 'region' | 'specialty' | 'specialty_hi' | 'period' | 'image_url'>;

// "Uttar Pradesh" and "Varanasi, Uttar Pradesh" should filter together.
const regionKey = (region: string | null) => (region || '').split(',').pop()!.trim();

export default function SaintsGallery({ saints }: { saints: GallerySaint[] }) {
  const { language } = useLanguage();
  const router = useRouter();
  const HI = language === 'HI';
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string | null>(null);

  // Links shared from the old site point to /saints#<id>; send them to that saint's page.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const match = saints.find(s => s.id === id);
    if (match) router.replace(`/saints/${match.slug}`);
  }, [saints, router]);

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    saints.forEach(s => {
      const key = regionKey(s.region);
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
  }, [saints]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return saints.filter(s => {
      if (region && regionKey(s.region) !== region) return false;
      if (!q) return true;
      return [s.name, s.name_hi, s.region, s.specialty, s.specialty_hi, s.period].some(v => v?.toLowerCase().includes(q));
    });
  }, [saints, query, region]);

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
          {HI ? 'भारत के संत' : 'Saints of India'}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
          {HI
            ? `${saints.length} संतों का जीवन परिचय और शिक्षाएं, हिंदी और अंग्रेज़ी में।`
            : `The lives and teachings of ${saints.length} saints, in Hindi and English.`}
        </p>

        <div className="mt-7 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a6a5c]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={HI ? 'संत, क्षेत्र या परंपरा खोजें' : 'Search a saint, region or tradition'}
            aria-label={HI ? 'संत खोजें' : 'Search saints'}
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

      <nav aria-label={HI ? 'क्षेत्र' : 'Regions'} className="max-w-6xl mx-auto px-5">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
          <button onClick={() => setRegion(null)} className={chip(region === null)} aria-pressed={region === null}>
            {HI ? 'सभी' : 'All'}
          </button>
          {regions.map(([r, n]) => (
            <button key={r} onClick={() => setRegion(region === r ? null : r)} className={chip(region === r)} aria-pressed={region === r}>
              {r} <span className={region === r ? 'text-white/60' : 'text-[#7a6a5c]'}>{n}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 pt-6 pb-20">
        {/* Every saint stays in the HTML; filtering only hides tiles, so all profile links remain crawlable. */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {saints.map(s => {
            const shown = visible.includes(s);
            return (
              <li key={s.id} hidden={!shown}>
                <NextLink
                  href={`/saints/${s.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-[#f1e7d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
                >
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full aspect-[3/4] object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center font-tiro text-5xl text-[#c2410c]">ॐ</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-14">
                    <p className="font-tiro text-white text-[1.15rem] leading-tight">{HI ? s.name_hi || s.name : s.name}</p>
                    <p className="mt-0.5 text-[12px] text-white/75 line-clamp-1">{HI ? s.specialty_hi || s.specialty : s.specialty}</p>
                  </div>
                </NextLink>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-tiro text-2xl">{HI ? 'कोई संत नहीं मिले' : 'No saints found'}</p>
            <button
              onClick={() => { setQuery(''); setRegion(null); }}
              className="mt-4 text-[#c2410c] font-medium hover:underline"
            >
              {HI ? 'सभी संत दिखाएं' : 'Show all saints'}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
