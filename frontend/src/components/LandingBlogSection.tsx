import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
          .limit(8)

        if (!error && (!data || data.length === 0)) {
          const fallback = await supabase
            .from('blog_posts')
            .select(`id, title, excerpt, slug, published_at, reading_time, spiritual_quotes,
              blog_categories (id, name, icon, color)`)
            .order('published_at', { ascending: false })
            .limit(8)
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
      <section id="blog" className="py-12 md:py-16 relative scroll-mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-8 animate-pulse" />
          <BlogGridSkeleton count={3} />
        </div>
      </section>
    )
  }

  if (featuredPosts.length === 0) return null

  return (
    <section id="blog" className="py-12 md:py-16 relative scroll-mt-32 border-t border-gray-200">
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
              {language === 'HI' ? 'लेख' : 'Articles'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#241a12]">
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
        </motion.div>

        {/* Swipeable row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/post/${post.slug}`}
              className="group block w-64 sm:w-72 flex-shrink-0 snap-start"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.05 }}
                className="h-full bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${post.category.color}, transparent)` }}
                />
                <div className="p-4 space-y-2.5">
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

                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
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
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link to="/blog">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#241a12] border border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-full transition-colors">
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
