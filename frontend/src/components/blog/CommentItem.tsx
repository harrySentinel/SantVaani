import { useState } from 'react'
import { MessageSquare, Edit, Trash2, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateComment, deleteComment } from '@/services/blogSocialService'
import { formatDistanceToNow } from 'date-fns'

interface CommentItemProps {
  comment: any
  currentUserId: string | null
  onReply: (commentId: string) => void
  onDelete: () => void
  onUpdate: (newText: string) => void
  level?: number
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onDelete,
  onUpdate,
  level = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.comment_text)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isOwner = currentUserId === comment.user_id
  const maxLevel = 3 // Maximum nesting level

  const handleUpdate = async () => {
    if (!editText.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    const result = await updateComment(comment.id, comment.user_id, editText.trim())

    if (result.success) {
      onUpdate(editText.trim())
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Comment updated successfully',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update comment',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsLoading(true)

    const result = await deleteComment(comment.id, comment.user_id)

    if (result.success) {
      onDelete()
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete comment',
        variant: 'destructive',
      })
    }

    setIsLoading(false)
  }

  const getUserDisplay = () => {
    // Try to get username from user_profiles, fallback to email
    if (comment.user?.user_profiles?.[0]?.username) {
      return comment.user.user_profiles[0].username
    }
    if (comment.user?.user_profiles?.[0]?.full_name) {
      return comment.user.user_profiles[0].full_name
    }
    if (comment.user?.email) {
      return comment.user.email.split('@')[0]
    }
    return 'Anonymous'
  }

  return (
    <div
      className={`
        ${level > 0 ? 'ml-8 mt-4' : 'mt-6'}
        ${level > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}
      `}
    >
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
              {getUserDisplay().charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-gray-900">{getUserDisplay()}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
                {comment.updated_at !== comment.created_at && ' (edited)'}
              </p>
            </div>
          </div>

          {/* Actions for comment owner */}
          {isOwner && !isEditing && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[80px]"
              disabled={isLoading}
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isLoading || !editText.trim()}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditText(comment.comment_text)
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 whitespace-pre-wrap">
              {comment.comment_text}
            </p>

            {/* Reply Button */}
            {level < maxLevel && currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="mt-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
            )}
          </>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
