import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookMarked, BookOpen, Eye, ArrowRight, Sparkles, Crown } from 'lucide-react'
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
          .limit(3)

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
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-4 w-64 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-12 w-96 mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredBooks.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-200 rounded-full filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-4 border border-orange-200">
            <Crown className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">
              {language === 'HI' ? 'विशेष संग्रह' : 'Exclusive Collection'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}>
            {language === 'HI'
              ? 'प्रभु की दिव्य कथाएं'
              : 'Divine Stories of the Lord'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'HI'
              ? 'महाभारत, रामायण और अन्य पवित्र ग्रंथों की कहानियां - पढ़ें और अपने जीवन को धन्य करें'
              : 'Sacred tales from Mahabharata, Ramayana and divine scriptures - Read and enrich your spiritual journey'}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredBooks.map((book, index) => (
            <Link key={book.id} to={`/prabhu-ki-leelaayen/book/${book.slug}`} className="group">
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white overflow-hidden relative">
                {/* Premium Badge for First Book */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Crown className="w-3 h-3" />
                      {language === 'HI' ? 'लोकप्रिय' : 'Popular'}
                    </div>
                  </div>
                )}

                {/* Book Cover */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={language === 'HI' ? book.title_hi : book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-600">
                      <BookOpen className="w-20 h-20 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Chapter Count Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-orange-600 flex items-center gap-1">
                      <BookMarked className="w-3 h-3" />
                      {book.total_chapters} {language === 'HI' ? 'अध्याय' : 'Chapters'}
                    </div>
                  </div>
                </div>

                {/* Book Info */}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {/* Author */}
                    <p className="text-sm text-orange-600 font-medium">
                      {language === 'HI' ? book.author_hi : book.author}
                    </p>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2"
                      style={{ fontFamily: language === 'HI' ? "'Noto Sans Devanagari', sans-serif" : 'inherit' }}
                    >
                      {language === 'HI' ? book.title_hi : book.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {language === 'HI' ? book.description_hi : book.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{book.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
                        <span>{language === 'HI' ? 'पढ़ें' : 'Read Now'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/prabhu-ki-leelaayen">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <BookMarked className="w-5 h-5 mr-2" />
              {language === 'HI' ? 'सभी कहानियां देखें' : 'Explore All Stories'}
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            {language === 'HI'
              ? 'अपनी आध्यात्मिक यात्रा शुरू करें - निःशुल्क!'
              : 'Start your spiritual journey - Completely Free!'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LandingStoriesSection
