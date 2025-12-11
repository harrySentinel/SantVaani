import { supabase } from '@/lib/supabaseClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth header
const getAuthHeader = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
};

// =====================================================
// FAVORITES
// =====================================================

export const toggleBhajanFavorite = async (bhajanId: string) => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/api/bhajans/${bhajanId}/favorite`,
    {},
    { headers }
  );
  return response.data;
};

export const getUserFavorites = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/favorites/${userId}`);
  return response.data;
};

export const getBhajanFavoriteCount = async (bhajanId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/${bhajanId}/favorite-count`);
  return response.data;
};

export const checkIfFavorited = async (bhajanId: string, userId: string) => {
  const { data, error } = await supabase
    .from('bhajan_favorites')
    .select('id')
    .eq('bhajan_id', bhajanId)
    .eq('user_id', userId)
    .single();

  return !error && data !== null;
};

// =====================================================
// PLAY TRACKING
// =====================================================

export const recordBhajanPlay = async (
  bhajanId: string,
  duration_seconds?: number,
  completed?: boolean,
  source?: string
) => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/api/bhajans/${bhajanId}/play`,
    { duration_seconds, completed, source: source || 'web' },
    { headers }
  );
  return response.data;
};

export const getBhajanStats = async (bhajanId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/${bhajanId}/stats`);
  return response.data;
};

export const getTrendingBhajans = async (limit: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/trending?limit=${limit}`);
  return response.data;
};

export const getPopularBhajans = async (limit: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/popular?limit=${limit}`);
  return response.data;
};

// =====================================================
// LEARNING PROGRESS
// =====================================================

export const updateLearningProgress = async (
  bhajanId: string,
  data: {
    memorization_level?: number;
    practice_count?: number;
    notes?: string;
    mastered?: boolean;
  }
) => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/api/bhajans/${bhajanId}/learning`,
    data,
    { headers }
  );
  return response.data;
};

export const getUserLearningProgress = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/learning/${userId}`);
  return response.data;
};

export const markBhajanAsMastered = async (bhajanId: string) => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/api/bhajans/${bhajanId}/mark-mastered`,
    {},
    { headers }
  );
  return response.data;
};

// =====================================================
// ACHIEVEMENTS
// =====================================================

export const getUserAchievements = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/bhajans/achievements/${userId}`);
  return response.data;
};

export const checkAchievements = async () => {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${API_BASE_URL}/api/bhajans/check-achievements`,
    {},
    { headers }
  );
  return response.data;
};

// =====================================================
// BULK OPERATIONS (for performance)
// =====================================================

export const getBhajansWithStats = async (bhajanIds: string[]) => {
  // Fetch all stats in parallel
  const statsPromises = bhajanIds.map(id => getBhajanStats(id));
  const stats = await Promise.all(statsPromises);

  return bhajanIds.reduce((acc, id, index) => {
    acc[id] = stats[index].stats;
    return acc;
  }, {} as Record<string, any>);
};

export const getUserBhajanContext = async (userId: string) => {
  // Get all user-specific bhajan data in parallel
  const [favorites, learning, achievements] = await Promise.all([
    getUserFavorites(userId),
    getUserLearningProgress(userId),
    getUserAchievements(userId)
  ]);

  return {
    favorites: favorites.favorites || [],
    learning: learning.learning || [],
    achievements: achievements.achievements || []
  };
};

// =====================================================
// REALTIME SUBSCRIPTIONS (Supabase Realtime)
// =====================================================

export const subscribeToBhajanStats = (
  bhajanId: string,
  callback: (stats: any) => void
) => {
  const channel = supabase
    .channel(`bhajan_stats_${bhajanId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bhajan_plays',
        filter: `bhajan_id=eq.${bhajanId}`
      },
      async () => {
        // Fetch updated stats when plays change
        const stats = await getBhajanStats(bhajanId);
        callback(stats.stats);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToUserFavorites = (
  userId: string,
  callback: (favorites: any[]) => void
) => {
  const channel = supabase
    .channel(`user_favorites_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bhajan_favorites',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        const favorites = await getUserFavorites(userId);
        callback(favorites.favorites);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
