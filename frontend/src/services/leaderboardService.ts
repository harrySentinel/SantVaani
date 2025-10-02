import { supabase } from '@/lib/supabaseClient'

export interface LeaderboardUser {
  user_id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  total_posts: number
  total_likes_received: number
  total_comments_received: number
  total_views_received: number
  total_badges: number
  rank: number
}

/**
 * Get top contributors for the blog leaderboard
 */
export const getTopContributors = async (limit: number = 10) => {
  try {
    // Get users with their stats
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, username, full_name, avatar_url, total_points')
      .order('total_points', { ascending: false })
      .limit(limit)

    if (usersError) throw usersError

    if (!users || users.length === 0) {
      return { success: true, leaderboard: [] }
    }

    // Get detailed stats for each user
    const leaderboard: LeaderboardUser[] = []

    for (const user of users) {
      // Get posts count
      const { count: postsCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)
        .eq('status', 'published')

      // Get likes received
      const { data: likesData } = await supabase
        .from('blog_likes')
        .select('blog_post_id')
        .in(
          'blog_post_id',
          (await supabase
            .from('blog_posts')
            .select('id')
            .eq('author_id', user.id)
            .eq('status', 'published')).data?.map(p => p.id) || []
        )

      // Get comments received
      const { data: commentsData } = await supabase
        .from('blog_comments')
        .select('blog_post_id')
        .in(
          'blog_post_id',
          (await supabase
            .from('blog_posts')
            .select('id')
            .eq('author_id', user.id)
            .eq('status', 'published')).data?.map(p => p.id) || []
        )

      // Get views received
      const { data: viewsData } = await supabase
        .from('blog_views')
        .select('blog_post_id')
        .in(
          'blog_post_id',
          (await supabase
            .from('blog_posts')
            .select('id')
            .eq('author_id', user.id)
            .eq('status', 'published')).data?.map(p => p.id) || []
        )

      // Get badges count
      const { count: badgesCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      leaderboard.push({
        user_id: user.id,
        username: user.username || user.full_name || 'Anonymous',
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        total_posts: postsCount || 0,
        total_likes_received: likesData?.length || 0,
        total_comments_received: commentsData?.length || 0,
        total_views_received: viewsData?.length || 0,
        total_badges: badgesCount || 0,
        rank: 0, // Will be set below
      })
    }

    // Assign ranks
    leaderboard.forEach((user, index) => {
      user.rank = index + 1
    })

    return { success: true, leaderboard }
  } catch (error: any) {
    console.error('Error getting top contributors:', error)
    return { success: false, leaderboard: [], error: error.message }
  }
}

/**
 * Get user's rank and stats
 */
export const getUserRank = async (userId: string) => {
  try {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('id, username, full_name, avatar_url, total_points')
      .eq('id', userId)
      .single()

    if (error) throw error

    // Get all users ranked by points
    const { data: allUsers, error: rankError } = await supabase
      .from('user_profiles')
      .select('id, total_points')
      .order('total_points', { ascending: false })

    if (rankError) throw rankError

    // Find user's rank
    const rank = (allUsers?.findIndex(u => u.id === userId) || 0) + 1

    // Get user's stats
    const { count: postsCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'published')

    const { count: badgesCount } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    return {
      success: true,
      userRank: {
        user_id: userId,
        username: userProfile.username || userProfile.full_name || 'Anonymous',
        full_name: userProfile.full_name,
        avatar_url: userProfile.avatar_url,
        total_posts: postsCount || 0,
        total_badges: badgesCount || 0,
        rank,
        total_points: userProfile.total_points,
      },
    }
  } catch (error: any) {
    console.error('Error getting user rank:', error)
    return { success: false, error: error.message }
  }
}
