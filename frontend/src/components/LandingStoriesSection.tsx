import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookMarked, BookOpen, Eye, ArrowRight, Crown } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageContext'

interface Book {
  id: string
  title: string
  title_hi: string
  slug: string
  description: string
  description_hi: string
  cover_image?: string
  author: string
  author_hi: string
  total_chapters: number
  views: number
}

const LandingStoriesSection = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('leelaayen_books')
          .select('*')
          .eq('published', true)
          .order('views', { ascending: false })
          .limit(8)

        if (error) throw error
        setFeaturedBooks(data || [])
      } catch (error) {
        console.error('Error fetching featured books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedBooks()
  }, [])

  if (isLoading) {
    return (
      <section id="stories" className="py-12 md:py-16 relative scroll-mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-8 animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-40 sm:w-44 md:w-48 flex-shrink-0 h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredBooks.length === 0) return null

  return (
    <section id="stories" className="py-12 md:py-16 relative scroll-mt-32 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-end justify-between mb-8"
        >
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-orange-600 tracking-wide">
              {language === 'HI' ? 'विशेष संग्रह' : 'Exclusive Collection'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241a12]">
              {language === 'HI' ? 'प्रभु की दिव्य कथाएं' : 'Divine Stories of the Lord'}
            </h2>
          </div>
          <Link
            to="/prabhu-ki-leelaayen"
            className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            {language === 'HI' ? 'सभी देखें' : 'View all'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Swipeable row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredBooks.map((book, index) => (
            <Link
              key={book.id}
              to={`/prabhu-ki-leelaayen/book/${book.slug}`}
              className="group block w-40 sm:w-44 md:w-48 flex-shrink-0 snap-start"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative aspect-[3/4] bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={language === 'HI' ? book.title_hi : book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-600">
                      <BookOpen className="w-10 h-10 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {index === 0 && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow">
                      <Crown className="w-2.5 h-2.5" />
                      {language === 'HI' ? 'लोकप्रिय' : 'Popular'}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 space-y-0.5">
                    <p className="text-[10px] text-orange-200 font-medium line-clamp-1">
                      {language === 'HI' ? book.author_hi : book.author}
                    </p>
                    <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
                      {language === 'HI' ? book.title_hi : book.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-white/70 pt-0.5">
                      <span className="flex items-center gap-1">
                        <BookMarked className="w-2.5 h-2.5" />
                        {book.total_chapters}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {book.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-400" />
            {language === 'HI'
              ? 'महाभारत, रामायण और अन्य पवित्र ग्रंथों की कहानियां'
              : 'Sacred tales from Mahabharata, Ramayana & scriptures'}
          </p>
          <Link to="/prabhu-ki-leelaayen">
            <button className="flex items-center gap-2 text-sm font-semibold text-white bg-[#241a12] hover:bg-[#3a2b1c] px-5 py-2.5 rounded-full transition-colors">
              {language === 'HI' ? 'सभी कहानियां' : 'All Stories'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LandingStoriesSection
