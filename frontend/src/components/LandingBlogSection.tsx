import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useLanguage } from '@/contexts/LanguageContext'
import { BlogGridSkeleton } from '@/components/SkeletonCards'

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

        let { data, error } = await supabase
          .from('blog_posts')
          .select(`id, title, excerpt, slug, published_at, reading_time, spiritual_quotes,
            blog_categories (id, name, icon, color)`)
          .eq('language', contentLanguage)
          .order('published_at', { ascending: false })
          .limit(3)

        if (!error && (!data || data.length === 0)) {
          const fallback = await supabase
            .from('blog_posts')
            .select(`id, title, excerpt, slug, published_at, reading_time, spiritual_quotes,
              blog_categories (id, name, icon, color)`)
            .order('published_at', { ascending: false })
            .limit(3)
          data = fallback.data
          error = fallback.error
        }

        if (error) throw error

        setFeaturedPosts((data || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          publishedAt: post.published_at,
          readingTime: post.reading_time || 5,
          category: post.blog_categories || { name: 'Spiritual', icon: '', color: '#f97316' },
          spiritualQuotes: post.spiritual_quotes || [],
        })))
      } catch {
        setFeaturedPosts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeaturedPosts()
  }, [language])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-8 animate-pulse" />
          <BlogGridSkeleton count={3} />
        </div>
      </section>
    )
  }

  if (featuredPosts.length === 0) return null

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
              {language === 'HI' ? 'लेख' : 'Articles'}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'HI' ? 'आध्यात्मिक ब्लॉग' : 'Spiritual Blog'}
            </h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            {language === 'HI' ? 'सभी लेख' : 'All articles'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map(post => (
            <Link key={post.id} to={`/blog/post/${post.slug}`} className="group">
              <Card className="h-full hover:shadow-md transition-shadow duration-200 border border-gray-200 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  {/* Category */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${post.category.color}18`,
                      color: post.category.color,
                    }}
                  >
                    <BookOpen className="w-3 h-3" />
                    {post.category.name}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Quote */}
                  {post.spiritualQuotes && post.spiritualQuotes.length > 0 && (
                    <div className="border-l-2 border-orange-300 pl-3">
                      <p className="text-xs italic text-orange-700 line-clamp-2">
                        "{post.spiritualQuotes[0]}"
                      </p>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} {language === 'HI' ? 'मिनट' : 'min'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link to="/blog">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 border border-orange-300 hover:bg-orange-50 px-6 py-2.5 rounded-full transition-colors">
              <BookOpen className="w-4 h-4" />
              {language === 'HI' ? 'सभी लेख पढ़ें' : 'Read all articles'}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LandingBlogSection
