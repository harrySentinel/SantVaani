import { supabase } from './supabaseClient'

export interface ChapterProgress {
  chapter_id: string
  status: 'not_started' | 'reading' | 'completed'
  reading_percentage: number
  last_read_at: string
  completed_at?: string
  scroll_position?: number
}

export interface BookProgressSummary {
  total_chapters: number
  chapters_read: number
  chapters_completed: number
  progress_percentage: number
  last_read_at?: string
}

export interface UserBookProgress {
  summary: BookProgressSummary | null
  chapters: ChapterProgress[]
}

/**
 * Mark a chapter as being read (auto-saves progress)
 */
export async function markChapterReading(
  userId: string,
  chapterId: string,
  bookId: string,
  scrollPosition: number = 0,
  readingPercentage: number = 0
) {
  try {
    const { data, error } = await supabase.rpc('mark_chapter_reading', {
      p_user_id: userId,
      p_chapter_id: chapterId,
      p_book_id: bookId,
      p_scroll_position: scrollPosition,
      p_reading_percentage: readingPercentage
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error marking chapter as reading:', error)
    return { success: false, error }
  }
}

/**
 * Mark a chapter as completed
 */
export async function markChapterCompleted(
  userId: string,
  chapterId: string,
  bookId: string
) {
  try {
    const { data, error } = await supabase.rpc('mark_chapter_completed', {
      p_user_id: userId,
      p_chapter_id: chapterId,
      p_book_id: bookId
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error marking chapter as completed:', error)
    return { success: false, error }
  }
}

/**
 * Get user's reading progress for a book
 */
export async function getUserBookProgress(
  userId: string,
  bookId: string
): Promise<UserBookProgress> {
  try {
    const { data, error } = await supabase.rpc('get_user_book_progress', {
      p_user_id: userId,
      p_book_id: bookId
    })

    if (error) throw error

    return data || { summary: null, chapters: [] }
  } catch (error) {
    console.error('Error getting book progress:', error)
    return { summary: null, chapters: [] }
  }
}

/**
 * Get progress for a specific chapter
 */
export async function getChapterProgress(
  userId: string,
  chapterId: string
): Promise<ChapterProgress | null> {
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data || null
  } catch (error) {
    console.error('Error getting chapter progress:', error)
    return null
  }
}

/**
 * Get all books progress for a user (for dashboard/profile)
 */
export async function getUserAllBooksProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('book_progress_summary')
      .select(`
        *,
        book:leelaayen_books!book_progress_summary_book_id_fkey (
          id,
          title,
          title_hi,
          slug,
          cover_image,
          total_chapters
        )
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting all books progress:', error)
    return []
  }
}

/**
 * Delete reading progress for a chapter (reset)
 */
export async function resetChapterProgress(
  userId: string,
  chapterId: string
) {
  try {
    const { error } = await supabase
      .from('reading_progress')
      .delete()
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error resetting chapter progress:', error)
    return { success: false, error }
  }
}

/**
 * Calculate reading percentage based on scroll position
 */
export function calculateReadingPercentage(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  if (scrollHeight <= clientHeight) return 100
  const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
  return Math.min(100, Math.max(0, percentage))
}
