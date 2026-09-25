'use client';

import NextLink from 'next/link';
import { BookOpen, Clock, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from '@/components/SiteLink';
import { useLanguage } from '@/contexts/LanguageContext';
import type { BlogPost } from '@/types/blog';

export interface CategoryChip {
  slug: string;
  name: string;
  color: string;
  count: number;
}

interface BlogListProps {
  posts: BlogPost[];
  categories: CategoryChip[];
  active: { language?: 'hi' | 'en'; category?: string };
  heading: string;
  intro: string;
}

const chip = (on: boolean) =>
  `flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
    on ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-700'
  }`;

export default function BlogList({ posts, categories, active, heading, intro }: BlogListProps) {
  const { language } = useLanguage();
  const HI = language === 'HI';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(HI ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 text-center">
        <span className="text-4xl text-orange-400 leading-none select-none font-serif" aria-hidden="true">ॐ</span>
        <h1 className="mt-4 text-3xl md:text-4xl font-light text-gray-800">{heading}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">{intro}</p>
      </header>

      <nav aria-label={HI ? 'फ़िल्टर' : 'Filter posts'} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NextLink href="/blog" className={chip(!active.language && !active.category)}>{HI ? 'सभी' : 'All'}</NextLink>
          <NextLink href="/blog/hindi" className={chip(active.language === 'hi')}>हिंदी</NextLink>
          <NextLink href="/blog/english" className={chip(active.language === 'en')}>English</NextLink>
          <span className="w-px flex-shrink-0 bg-gray-200 mx-1" aria-hidden="true" />
          {categories.map(c => (
            <NextLink key={c.slug} href={`/blog/category/${c.slug}`} className={chip(active.category === c.slug)}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
              {c.name}
              <span className={active.category === c.slug ? 'text-white/60' : 'text-gray-400'}>{c.count}</span>
            </NextLink>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map(post => (
              <li key={post.id}>
                <NextLink href={`/blog/post/${post.slug}`} lang={post.language} className="group block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                  <article className="h-full flex flex-col rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.featuredImage} alt="" className="h-40 w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-40 flex items-center justify-center" style={{ backgroundColor: `${post.category.color}20` }}>
                        <BookOpen className="w-10 h-10 opacity-40" style={{ color: post.category.color }} aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col p-6">
                      <span className="self-start text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}>
                        {post.category.name}
                      </span>
                      <h2 className="mt-3 text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                      <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{post.readingTime} {HI ? 'मिनट' : 'min read'}</span>
                        {!!post.viewCount && (
                          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" aria-hidden="true" />{post.viewCount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </NextLink>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-xl font-semibold text-gray-600">{HI ? 'अभी यहाँ कोई लेख नहीं है' : 'No posts here yet'}</p>
            <NextLink href="/blog" className="mt-4 inline-block text-orange-600 hover:underline">
              {HI ? 'सभी लेख देखें' : 'See all posts'}
            </NextLink>
          </div>
        )}

        <div className="text-center mt-16">
          <div className="rounded-2xl p-8 border border-orange-100 bg-white/60">
            <h2 className="text-xl font-light text-gray-800 mb-3">{HI ? 'अपनी यात्रा जारी रखें' : 'Continue your journey'}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/saints" className="inline-flex items-center justify-center px-6 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-colors text-sm">
                {HI ? 'संतों से मिलें' : 'Meet the saints'}
              </Link>
              <Link to="/prabhu-ki-leelaayen" className="inline-flex items-center justify-center px-6 py-2 border border-orange-400 text-orange-600 rounded-full hover:bg-orange-50 transition-colors text-sm">
                {HI ? 'दिव्य कथाएं पढ़ें' : 'Read divine stories'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
