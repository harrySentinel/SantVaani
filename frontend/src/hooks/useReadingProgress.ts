import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getUserBookProgress,
  markChapterReading,
  markChapterCompleted,
  getChapterProgress,
  UserBookProgress,
  ChapterProgress
} from '@/lib/readingProgress'

/**
 * Hook to manage reading progress for a book
 */
export function useBookProgress(bookId: string | undefined) {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserBookProgress>({ summary: null, chapters: [] })
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user || !bookId) {
      setProgress({ summary: null, chapters: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getUserBookProgress(user.id, bookId)
      setProgress(data)
    } catch (error) {
      console.error('Error fetching book progress:', error)
    } finally {
      setLoading(false)
    }
  }, [user, bookId])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const getChapterStatus = useCallback((chapterId: string): 'not_started' | 'reading' | 'completed' => {
    const chapterProgress = progress.chapters.find(c => c.chapter_id === chapterId)
    return chapterProgress?.status || 'not_started'
  }, [progress])

  const isChapterCompleted = useCallback((chapterId: string): boolean => {
    return getChapterStatus(chapterId) === 'completed'
  }, [getChapterStatus])

  const isChapterReading = useCallback((chapterId: string): boolean => {
    return getChapterStatus(chapterId) === 'reading'
  }, [getChapterStatus])

  const markAsReading = useCallback(async (
    chapterId: string,
    scrollPosition: number = 0,
    readingPercentage: number = 0
  ) => {
    if (!user || !bookId) return { success: false }

    const result = await markChapterReading(
      user.id,
      chapterId,
      bookId,
      scrollPosition,
      readingPercentage
    )

    if (result.success) {
      await fetchProgress() // Refresh progress
    }

    return result
  }, [user, bookId, fetchProgress])

  const markAsCompleted = useCallback(async (chapterId: string) => {
    if (!user || !bookId) return { success: false }

    const result = await markChapterCompleted(user.id, chapterId, bookId)

    if (result.success) {
      await fetchProgress() // Refresh progress
    }

    return result
  }, [user, bookId, fetchProgress])

  return {
    progress,
    loading,
    getChapterStatus,
    isChapterCompleted,
    isChapterReading,
    markAsReading,
    markAsCompleted,
    refreshProgress: fetchProgress
  }
}

/**
 * Hook to manage reading progress for a single chapter
 */
export function useChapterProgress(chapterId: string | undefined) {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ChapterProgress | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user || !chapterId) {
      setProgress(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getChapterProgress(user.id, chapterId)
      setProgress(data)
    } catch (error) {
      console.error('Error fetching chapter progress:', error)
    } finally {
      setLoading(false)
    }
  }, [user, chapterId])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return {
    progress,
    loading,
    refreshProgress: fetchProgress
  }
}
