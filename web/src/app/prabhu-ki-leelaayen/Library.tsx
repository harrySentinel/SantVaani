'use client';

import NextLink from 'next/link';
import { BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookCover from '@/components/leelaayen/BookCover';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Book } from '@/lib/leelaayen';

export default function Library({ books }: { books: Book[] }) {
  const { language } = useLanguage();
  const HI = language === 'HI';

  return (
    <div className="min-h-screen font-mukta text-[#241a12] bg-[#faf8f5]">
      <Navbar />

      <header
        className="px-5 pt-14 pb-12 md:pt-20 md:pb-16 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(240,150,50,0.16) 0%, rgba(240,150,50,0.05) 60%, #faf8f5 100%)' }}
      >
        <h1 className="font-tiro font-normal tracking-normal text-[2.6rem] sm:text-5xl leading-[1.15]">
          {HI ? 'प्रभु की लीलाएं' : 'Divine Stories'}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-[17px] leading-relaxed text-[#241a12]/75">
          {HI
            ? 'संतों और देवताओं की पवित्र कथाएं, हिंदी और अंग्रेज़ी में, अध्याय दर अध्याय पढ़ें।'
            : 'Sacred stories of saints and the divine, in Hindi and English, to read chapter by chapter.'}
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-5 pb-20">
        {books.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-8">
            {books.map(book => {
              const title = HI ? book.title_hi || book.title : book.title;
              const author = HI ? book.author_hi || book.author : book.author;
              const house = book.is_santvaani_original || /santvaani|संतवाणी/i.test(author || '');
              return (
                <li key={book.id}>
                  <NextLink
                    href={`/prabhu-ki-leelaayen/book/${book.slug}`}
                    className="group block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf8f5]"
                  >
                    <div className="transition-transform duration-300 group-hover:-translate-y-1">
                      {book.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={book.cover_image}
                          alt={title}
                          className="w-full aspect-[2/3] object-cover rounded-md shadow-[0_18px_36px_-14px_rgba(36,26,18,0.45)]"
                        />
                      ) : (
                        <BookCover title={title} author={house ? 'Santvaani' : author} />
                      )}
                    </div>
                    <h2 className="mt-4 font-mukta tracking-normal text-[17px] font-semibold leading-snug line-clamp-2 group-hover:text-[#c2410c] transition-colors">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-[#7a6a5c]">
                      {book.total_chapters} {HI ? 'अध्याय' : book.total_chapters === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </NextLink>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-[#c2410c]/60" strokeWidth={1.5} />
            <p className="mt-4 font-tiro text-2xl">{HI ? 'जल्द आ रहा है' : 'Coming soon'}</p>
            <p className="mt-2 text-[#7a6a5c]">{HI ? 'नई कथाएं जल्द ही जोड़ी जाएंगी।' : 'New stories will be added soon.'}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
