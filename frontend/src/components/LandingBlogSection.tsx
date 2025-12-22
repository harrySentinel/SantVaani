import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageContext'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  readingTime: number
  category: {
    name: string
    icon: string
    color: string
  }
  spiritualQuotes?: string[]
}

const LandingBlogSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setIsLoading(true)
        const contentLanguage = language === 'HI' ? 'hi' : 'en'

        // Fetch directly from Supabase for faster loading
        // Try with language filter first
        let { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, slug, published_at, reading_time, category, spiritual_quotes')
          .eq('language', contentLanguage)
          .order('published_at', { ascending: false })
          .limit(3)

        // If no posts found for current language, fetch any posts
        if (!error && (!data || data.length === 0)) {
          const fallback = await supabase
            .from('blog_posts')
            .select('id, title, excerpt, slug, published_at, reading_time, category, spiritual_quotes')
            .order('published_at', { ascending: false })
            .limit(3)

          data = fallback.data
          error = fallback.error
        }

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        // Format the data to match BlogPost interface
        const formattedPosts = (data || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          publishedAt: post.published_at,
          readingTime: post.reading_time || 5,
          category: typeof post.category === 'string' ? JSON.parse(post.category) : post.category,
          spiritualQuotes: post.spiritual_quotes || []
        }))

        setFeaturedPosts(formattedPosts)
      } catch (error) {
        console.error('Error fetching featured posts:', error)
        setFeaturedPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [language])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
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

  // Show section even if no posts, just with a message
  if (featuredPosts.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-orange-25 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'HI' ? 'आध्यात्मिक ब्लॉग' : 'Spiritual Blog'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'HI'
                ? 'जल्द ही नए लेख आ रहे हैं...'
                : 'New articles coming soon...'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-orange-25 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">
              {language === 'HI' ? 'आध्यात्मिक ब्लॉग' : 'Spiritual Blog'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'HI'
              ? 'आध्यात्मिक ज्ञान की यात्रा'
              : 'Journey Through Spiritual Wisdom'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'HI'
              ? 'प्राचीन संतों की शिक्षाओं से प्रेरित आधुनिक जीवन के लिए आध्यात्मिक मार्गदर्शन'
              : 'Daily spiritual guidance inspired by ancient teachings of saints for modern life'}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post) => (
            <Link key={post.id} to={`/blog/post/${post.slug}`} className="group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white overflow-hidden">
                {/* Category Badge */}
                <div className="relative p-6 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{
                      backgroundColor: `${post.category.color}15`,
                      color: post.category.color
                    }}>
                    <span>{post.category.icon}</span>
                    <span>{post.category.name}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Featured Quote */}
                  {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-3 rounded-r-lg mb-4">
                      <p className="text-xs italic text-orange-800 line-clamp-2">
                        "{post.spiritualQuotes[0]}"
                      </p>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} {language === 'HI' ? 'मिनट' : 'min'}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/blog">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {language === 'HI' ? 'सभी लेख पढ़ें' : 'Read All Articles'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LandingBlogSection
