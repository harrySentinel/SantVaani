import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  likeBlogPost,
  unlikeBlogPost,
  checkIfLiked,
  getLikesCount,
} from '@/services/blogSocialService'
import { supabase } from '@/lib/supabaseClient'

interface LikeButtonProps {
  postId: string
  initialLikesCount?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LikeButton({
  postId,
  initialLikesCount = 0,
  showCount = true,
  size = 'md',
  className = '',
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
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

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      // If user is logged in, check if they've liked this post
      if (user) {
        const result = await checkIfLiked(postId, user.id)
        if (result.success) {
          setIsLiked(result.isLiked)
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
        checkIfLiked(postId, session.user.id).then((result) => {
          if (result.success) {
            setIsLiked(result.isLiked)
          }
        })
      } else {
        setIsLiked(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [postId])

  // Fetch latest likes count
  useEffect(() => {
    const fetchCount = async () => {
      const result = await getLikesCount(postId)
      if (result.success) {
        setLikesCount(result.count)
      }
    }

    fetchCount()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`blog_likes_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_likes',
          filter: `blog_post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikesCount((prev) => prev + 1)
          } else if (payload.eventType === 'DELETE') {
            setLikesCount((prev) => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  const handleLikeToggle = async () => {
    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like this post',
        variant: 'destructive',
      })
      return
    }

    // Optimistic UI update
    const previousLiked = isLiked
    const previousCount = likesCount

    setIsLoading(true)
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      let result

      if (isLiked) {
        result = await unlikeBlogPost(postId, currentUser.id)
      } else {
        result = await likeBlogPost(postId, currentUser.id)
      }

      if (!result.success) {
        // Revert on failure
        setIsLiked(previousLiked)
        setLikesCount(previousCount)

        toast({
          title: 'Error',
          description: result.error || 'Failed to update like',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      // Revert on error
      setIsLiked(previousLiked)
      setLikesCount(previousCount)

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
      onClick={handleLikeToggle}
      disabled={isLoading}
      variant={isLiked ? 'default' : 'outline'}
      className={`
        ${sizeClasses[size]}
        ${className}
        transition-all duration-300 ease-in-out
        ${
          isLiked
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
            : 'hover:bg-red-50 hover:text-red-500 hover:border-red-500'
        }
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        group
      `}
      aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-300
          ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}
          ${isLoading ? 'animate-pulse' : ''}
        `}
      />
      {showCount && (
        <span
          className={`
          ml-2 font-semibold transition-all duration-300
          ${isLiked ? 'scale-110' : ''}
        `}
        >
          {likesCount}
        </span>
      )}
    </Button>
  )
}
