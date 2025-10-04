import { supabase } from '@/lib/supabaseClient'

// ============================================
// TYPES
// ============================================

export interface BlogLike {
  id: string
  user_id: string
  blog_post_id: string
  created_at: string
}

export interface BlogBookmark {
  id: string
  user_id: string
  blog_post_id: string
  created_at: string
}

export interface BlogComment {
  id: string
  blog_post_id: string
  user_id: string
  parent_comment_id: string | null
  comment_text: string
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: {
    email: string
    user_profiles?: {
      username?: string
      full_name?: string
      avatar_url?: string
    }
  }
  replies?: BlogComment[]
}

export interface BlogView {
  id: string
  blog_post_id: string
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  viewed_at: string
}

// ============================================
// LIKES
// ============================================

/**
 * Like a blog post
 */
export const likeBlogPost = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_likes')
      .insert({ blog_post_id: postId, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Error liking post:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Unlike a blog post
 */
export const unlikeBlogPost = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Error unliking post:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if user has liked a post
 */
export const checkIfLiked = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_post_id', postId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { success: true, isLiked: !!data }
  } catch (error: any) {
    console.error('Error checking like status:', error)
    return { success: false, isLiked: false, error: error.message }
  }
}

/**
 * Get total likes count for a post
 */
export const getLikesCount = async (postId: string) => {
  try {
    const { count, error } = await supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', postId)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error: any) {
    console.error('Error getting likes count:', error)
    return { success: false, count: 0, error: error.message }
  }
}

// ============================================
// BOOKMARKS
// ============================================

/**
 * Bookmark a blog post
 */
export const bookmarkBlogPost = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_bookmarks')
      .insert({ blog_post_id: postId, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Error bookmarking post:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Remove bookmark from a post
 */
export const unbookmarkBlogPost = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('blog_bookmarks')
      .delete()
      .eq('blog_post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Error removing bookmark:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if user has bookmarked a post
 */
export const checkIfBookmarked = async (postId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_bookmarks')
      .select('id')
      .eq('blog_post_id', postId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return { success: true, isBookmarked: !!data }
  } catch (error: any) {
    console.error('Error checking bookmark status:', error)
    return { success: false, isBookmarked: false, error: error.message }
  }
}

/**
 * Get user's bookmarked posts
 */
export const getUserBookmarks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_bookmarks')
      .select(`
        id,
        created_at,
        blog_post_id,
        blog_posts (
          id,
          title,
          slug,
          excerpt,
          featured_image,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, bookmarks: data || [] }
  } catch (error: any) {
    console.error('Error getting user bookmarks:', error)
    return { success: false, bookmarks: [], error: error.message }
  }
}

// ============================================
// COMMENTS
// ============================================

/**
 * Add a comment to a blog post
 */
export const addComment = async (
  postId: string,
  userId: string,
  commentText: string,
  parentCommentId: string | null = null
) => {
  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        blog_post_id: postId,
        user_id: userId,
        comment_text: commentText,
        parent_comment_id: parentCommentId,
        is_approved: true, // Auto-approve comments (admins can still delete if needed)
      })
      .select('*')
      .single()

    if (error) throw error
    return { success: true, comment: data }
  } catch (error: any) {
    console.error('Error adding comment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all comments for a blog post with nested replies
 */
export const getPostComments = async (postId: string) => {
  try {
    // Get all comments with user data
    const { data, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        user:user_id (
          email,
          user_profiles (
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('blog_post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Organize comments into parent-child structure
    const comments = data || []
    const commentMap: { [key: string]: any } = {}
    const rootComments: any[] = []

    // First pass: create comment objects
    comments.forEach((comment: any) => {
      commentMap[comment.id] = { ...comment, replies: [] }
    })

    // Second pass: build tree structure
    comments.forEach((comment: any) => {
      if (comment.parent_comment_id) {
        const parent = commentMap[comment.parent_comment_id]
        if (parent) {
          parent.replies.push(commentMap[comment.id])
        }
      } else {
        rootComments.push(commentMap[comment.id])
      }
    })

    return { success: true, comments: rootComments }
  } catch (error: any) {
    console.error('Error getting comments:', error)
    return { success: false, comments: [], error: error.message }
  }
}

/**
 * Update a comment (user can only edit their own)
 */
export const updateComment = async (
  commentId: string,
  userId: string,
  newText: string
) => {
  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ comment_text: newText })
      .eq('id', commentId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, comment: data }
  } catch (error: any) {
    console.error('Error updating comment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a comment (user can only delete their own)
 */
export const deleteComment = async (commentId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting comment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get comments count for a post
 */
export const getCommentsCount = async (postId: string) => {
  try {
    const { count, error } = await supabase
      .from('blog_comments')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', postId)
      .eq('is_approved', true)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error: any) {
    console.error('Error getting comments count:', error)
    return { success: false, count: 0, error: error.message }
  }
}

// ============================================
// VIEWS
// ============================================

/**
 * Track a view for a blog post
 */
export const trackBlogView = async (
  postId: string,
  userId: string | null = null
) => {
  try {
    const userAgent = navigator.userAgent

    const { data, error } = await supabase
      .from('blog_views')
      .insert({
        blog_post_id: postId,
        user_id: userId,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Error tracking view:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get views count for a post
 */
export const getViewsCount = async (postId: string) => {
  try {
    const { count, error } = await supabase
      .from('blog_views')
      .select('*', { count: 'exact', head: true })
      .eq('blog_post_id', postId)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error: any) {
    console.error('Error getting views count:', error)
    return { success: false, count: 0, error: error.message }
  }
}

// ============================================
// COMBINED STATS
// ============================================

/**
 * Get all stats for a blog post (likes, comments, views, bookmarks)
 */
export const getBlogPostStats = async (postId: string, userId: string | null = null) => {
  try {
    const [likes, comments, views, isLiked, isBookmarked] = await Promise.all([
      getLikesCount(postId),
      getCommentsCount(postId),
      getViewsCount(postId),
      userId ? checkIfLiked(postId, userId) : Promise.resolve({ isLiked: false }),
      userId ? checkIfBookmarked(postId, userId) : Promise.resolve({ isBookmarked: false }),
    ])

    return {
      success: true,
      stats: {
        likes: likes.count,
        comments: comments.count,
        views: views.count,
        isLiked: isLiked.isLiked,
        isBookmarked: isBookmarked.isBookmarked,
      },
    }
  } catch (error: any) {
    console.error('Error getting blog post stats:', error)
    return {
      success: false,
      stats: {
        likes: 0,
        comments: 0,
        views: 0,
        isLiked: false,
        isBookmarked: false,
      },
      error: error.message,
    }
  }
}
