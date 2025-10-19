import { useState, useEffect } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  addComment,
  getPostComments,
  getCommentsCount,
} from '@/services/blogSocialService'
import { supabase } from '@/lib/supabaseClient'
import CommentItem from './CommentItem'

interface CommentsSectionProps {
  postId: string
  className?: string
}

export default function CommentsSection({
  postId,
  className = '',
}: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch comments
  useEffect(() => {
    fetchComments()
    fetchCommentsCount()
  }, [postId])

  // Real-time subscription for new comments
  useEffect(() => {
    const channel = supabase
      .channel(`comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_comments',
          filter: `blog_post_id=eq.${postId}`,
        },
        () => {
          fetchComments()
          fetchCommentsCount()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'blog_comments',
          filter: `blog_post_id=eq.${postId}`,
        },
        () => {
          fetchComments()
          fetchCommentsCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId])

  const fetchComments = async () => {
    setIsFetching(true)
    const result = await getPostComments(postId)
    if (result.success) {
      console.log('📝 Comments fetched:', result.comments)
      setComments(result.comments)
    } else {
      console.error('❌ Error fetching comments:', result.error)
    }
    setIsFetching(false)
  }

  const fetchCommentsCount = async () => {
    const result = await getCommentsCount(postId)
    if (result.success) {
      setCommentsCount(result.count)
    }
  }

  const handleAddComment = async () => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to comment',
        variant: 'destructive',
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    const result = await addComment(
      postId,
      currentUser.id,
      newComment.trim(),
      null
    )

    if (result.success) {
      setNewComment('')
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      })
      fetchComments()
      fetchCommentsCount()
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to add comment',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
  }

  const handleReply = async (parentCommentId: string) => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      })
      return
    }

    if (!replyText.trim()) {
      toast({
        title: 'Error',
        description: 'Reply cannot be empty',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    const result = await addComment(
      postId,
      currentUser.id,
      replyText.trim(),
      parentCommentId
    )

    if (result.success) {
      setReplyText('')
      setReplyingTo(null)
      toast({
        title: 'Success',
        description: 'Reply added successfully',
      })
      fetchComments()
      fetchCommentsCount()
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to add reply',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
  }

  return (
    <div className={`${className}`}>
      {/* Comments Header */}
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-6 h-6 text-orange-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({commentsCount})
        </h3>
      </div>

      {/* Add New Comment */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <Textarea
          placeholder={
            currentUser
              ? 'Share your thoughts...'
              : 'Sign in to leave a comment'
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] mb-4"
          disabled={!currentUser || isLoading}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!currentUser || isLoading || !newComment.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {isFetching ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No comments yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={currentUser?.id || null}
                onReply={(commentId) => setReplyingTo(commentId)}
                onDelete={fetchComments}
                onUpdate={fetchComments}
              />

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-8 mt-4 bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    Replying to {comment.users?.email?.split('@')[0] || 'user'}
                  </p>
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px] mb-2 bg-white"
                    disabled={isLoading}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={isLoading || !replyText.trim()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isLoading ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText('')
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
