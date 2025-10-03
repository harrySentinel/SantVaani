import { supabase } from '@/lib/supabaseClient'

export interface UserProfile {
  id: string
  username: string
  full_name: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

/**
 * Get user profile by user ID
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { success: true, profile: data }
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    return { success: false, profile: null, error: error.message }
  }
}

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    username?: string
    full_name?: string
    bio?: string
    avatar_url?: string
  }
) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, profile: data }
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (username: string, currentUserId?: string) => {
  try {
    let query = supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)

    // If checking for current user, exclude their own username
    if (currentUserId) {
      query = query.neq('id', currentUserId)
    }

    const { data, error } = await query.single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

    // If data exists, username is taken
    return { success: true, available: !data }
  } catch (error: any) {
    console.error('Error checking username:', error)
    return { success: false, available: false, error: error.message }
  }
}

/**
 * Create user profile (for existing users without profiles)
 */
export const createUserProfile = async (
  userId: string,
  username: string,
  fullName: string
) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username,
        full_name: fullName
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, profile: data }
  } catch (error: any) {
    console.error('Error creating user profile:', error)
    return { success: false, error: error.message }
  }
}
