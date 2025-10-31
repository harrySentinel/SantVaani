import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Robust Blog View Tracking Hook
 *
 * Features:
 * - Tracks unique views (prevents duplicate counting)
 * - Uses fingerprinting for anonymous users
 * - Stores view session in localStorage
 * - Only counts views after 5 seconds (prevents bounce inflation)
 * - Handles both logged-in and anonymous users
 * - Mobile optimized
 */

interface ViewSession {
  postId: string
  viewedAt: number
  sessionId: string
}

const VIEW_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const MIN_READ_TIME_MS = 5000 // 5 seconds minimum

// Generate a simple browser fingerprint for anonymous tracking
const getBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('fingerprint', 2, 2)
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasData: canvas.toDataURL()
  }

  // Create a simple hash
  const str = JSON.stringify(fingerprint)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `fp_${Math.abs(hash)}`
}

// Check if this post was already viewed recently
const hasRecentView = (postId: string): boolean => {
  try {
    const viewsJson = localStorage.getItem('blog_views_session')
    if (!viewsJson) return false

    const views: ViewSession[] = JSON.parse(viewsJson)
    const now = Date.now()

    // Clean up old views
    const validViews = views.filter(v => now - v.viewedAt < VIEW_DURATION_MS)
    localStorage.setItem('blog_views_session', JSON.stringify(validViews))

    // Check if current post was viewed recently
    return validViews.some(v => v.postId === postId)
  } catch (error) {
    console.error('Error checking view session:', error)
    return false
  }
}

// Record view in localStorage
const recordViewSession = (postId: string, sessionId: string) => {
  try {
    const viewsJson = localStorage.getItem('blog_views_session')
    const views: ViewSession[] = viewsJson ? JSON.parse(viewsJson) : []

    views.push({
      postId,
      viewedAt: Date.now(),
      sessionId
    })

    localStorage.setItem('blog_views_session', JSON.stringify(views))
  } catch (error) {
    console.error('Error recording view session:', error)
  }
}

export const useRobustBlogView = (postId: string) => {
  const hasTracked = useRef(false)
  const startTime = useRef(Date.now())
  const [viewRecorded, setViewRecorded] = useState(false)

  useEffect(() => {
    if (!postId || hasTracked.current) return

    // Check if already viewed recently - this is critical!
    if (hasRecentView(postId)) {
      console.log('📊 Blog view: Already counted recently (skipping)')
      hasTracked.current = true // Mark as tracked to prevent re-runs
      return
    }

    const trackView = async () => {
      try {
        // Double-check before tracking (in case of race conditions)
        if (hasRecentView(postId)) {
          console.log('📊 Blog view: Already counted (double-check)')
          hasTracked.current = true
          return
        }

        // Get user if logged in
        const { data: { user } } = await supabase.auth.getUser()

        // Generate session identifier
        const sessionId = user?.id || getBrowserFingerprint()

        // Check if user spent minimum time on page
        const timeSpent = Date.now() - startTime.current
        if (timeSpent < MIN_READ_TIME_MS) {
          console.log('📊 Blog view: Insufficient read time')
          return
        }

        console.log('📊 Tracking blog view:', { postId, sessionId, timeSpent })

        // Record in localStorage BEFORE making the API call to prevent race conditions
        recordViewSession(postId, sessionId)
        hasTracked.current = true

        // Insert view record
        const { error: viewError } = await supabase
          .from('blog_views')
          .insert({
            blog_post_id: postId,
            user_id: user?.id || null,
            ip_address: null, // Will be set by database trigger if available
            user_agent: navigator.userAgent,
            session_id: sessionId,
            time_spent_seconds: Math.floor(timeSpent / 1000)
          })

        if (viewError) {
          // Check if it's a unique constraint violation (already counted)
          if (viewError.code === '23505') {
            console.log('📊 Blog view: Already counted (duplicate prevented)')
            return
          }
          throw viewError
        }

        // Increment view count using RPC function
        const { error: rpcError } = await supabase
          .rpc('increment_blog_view_count', { post_id: postId })

        if (rpcError) {
          console.error('Error incrementing view count:', rpcError)
        }

        setViewRecorded(true)

        console.log('✅ Blog view tracked successfully')

      } catch (error) {
        console.error('Error tracking blog view:', error)
      }
    }

    // Track view after minimum read time
    const timer = setTimeout(trackView, MIN_READ_TIME_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [postId])

  return { viewRecorded }
}
