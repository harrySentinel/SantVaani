import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  bookmarkBlogPost,
  unbookmarkBlogPost,
  checkIfBookmarked,
} from '@/services/blogSocialService'
import { supabase } from '@/lib/supabaseClient'

interface BookmarkButtonProps {
  postId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function BookmarkButton({
  postId,
  size = 'md',
  showText = false,
  className = '',
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  // Get current user and bookmark status
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      // If user is logged in, check if they've bookmarked this post
      if (user) {
        const result = await checkIfBookmarked(postId, user.id)
        if (result.success) {
          setIsBookmarked(result.isBookmarked)
        }
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
      if (session?.user) {
        checkIfBookmarked(postId, session.user.id).then((result) => {
          if (result.success) {
            setIsBookmarked(result.isBookmarked)
          }
        })
      } else {
        setIsBookmarked(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [postId])

  // Subscribe to real-time bookmark changes
  useEffect(() => {
    if (!currentUser) return

    const channel = supabase
      .channel(`user_bookmarks_${currentUser.id}_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_bookmarks',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (payload.new && (payload.new as any).blog_post_id === postId) {
            setIsBookmarked(true)
          } else if (payload.old && (payload.old as any).blog_post_id === postId) {
            setIsBookmarked(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, postId])

  const handleBookmarkToggle = async () => {
    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to bookmark this post',
        variant: 'destructive',
      })
      return
    }

    // Optimistic UI update
    const previousBookmarked = isBookmarked

    setIsLoading(true)
    setIsBookmarked(!isBookmarked)

    try {
      let result

      if (isBookmarked) {
        result = await unbookmarkBlogPost(postId, currentUser.id)
        if (result.success) {
          toast({
            title: 'Bookmark Removed',
            description: 'Post removed from your saved collection',
          })
        }
      } else {
        result = await bookmarkBlogPost(postId, currentUser.id)
        if (result.success) {
          toast({
            title: 'Post Bookmarked',
            description: 'Post saved to your collection',
          })
        }
      }

      if (!result.success) {
        // Revert on failure
        setIsBookmarked(previousBookmarked)

        toast({
          title: 'Error',
          description: result.error || 'Failed to update bookmark',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      // Revert on error
      setIsBookmarked(previousBookmarked)

      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      variant={isBookmarked ? 'default' : 'outline'}
      className={`
        ${sizeClasses[size]}
        ${className}
        transition-all duration-300 ease-in-out
        ${
          isBookmarked
            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
            : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-500'
        }
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        group
      `}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
    >
      <Bookmark
        className={`
          ${iconSizes[size]}
          transition-all duration-300
          ${isBookmarked ? 'fill-current scale-110' : 'group-hover:scale-110'}
          ${isLoading ? 'animate-pulse' : ''}
        `}
      />
      {showText && (
        <span className="ml-2 font-semibold">
          {isBookmarked ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  )
}
