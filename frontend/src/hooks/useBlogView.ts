import { useEffect, useRef } from 'react'
import { trackBlogView } from '@/services/blogSocialService'
import { supabase } from '@/lib/supabaseClient'

/**
 * Hook to automatically track blog post views
 * Tracks view once when component mounts and user has been on page for 3+ seconds
 */
export const useBlogView = (postId: string) => {
  const hasTracked = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!postId || hasTracked.current) return

    // Track view after user has been on page for 3 seconds
    // This prevents inflated view counts from users who immediately bounce
    timeoutRef.current = setTimeout(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        await trackBlogView(postId, user?.id || null)
        hasTracked.current = true
      } catch (error) {
        console.error('Error tracking blog view:', error)
      }
    }, 3000) // 3 second delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [postId])
}
