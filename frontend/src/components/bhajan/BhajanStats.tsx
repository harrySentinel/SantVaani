import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Users, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBhajanStats } from '@/services/bhajanEngagementService';
import { cn } from '@/lib/utils';

interface BhajanStatsProps {
  bhajanId: string;
  variant?: 'badge' | 'detailed';
  className?: string;
}

export const BhajanStats: React.FC<BhajanStatsProps> = ({
  bhajanId,
  variant = 'badge',
  className
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getBhajanStats(bhajanId);
        setStats(result.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [bhajanId]);

  if (loading || !stats) return null;

  const isTrending = stats.plays_this_week > 10; // Threshold for trending
  const isPopular = stats.total_plays > 50; // Threshold for popular

  if (variant === 'badge') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {/* Trending Badge */}
        {isTrending && (
          <Badge
            variant="outline"
            className="bg-orange-50 border-orange-200 text-orange-700 flex items-center space-x-1 animate-pulse"
          >
            <Flame className="w-3 h-3" />
            <span className="text-xs font-semibold">Trending</span>
          </Badge>
        )}

        {/* Popular Badge */}
        {isPopular && !isTrending && (
          <Badge
            variant="outline"
            className="bg-purple-50 border-purple-200 text-purple-700 flex items-center space-x-1"
          >
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-semibold">Popular</span>
          </Badge>
        )}

        {/* Play Count */}
        {stats.total_plays > 0 && (
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 flex items-center space-x-1"
          >
            <Play className="w-3 h-3" />
            <span className="text-xs tabular-nums">
              {formatPlayCount(stats.total_plays)}
            </span>
          </Badge>
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-600">
          <Play className="w-4 h-4" />
          <span className="font-medium">{formatPlayCount(stats.total_plays)}</span>
          <span className="text-gray-400">plays</span>
        </div>

        {isTrending && (
          <div className="flex items-center space-x-1 text-orange-600 animate-pulse">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold">Trending</span>
          </div>
        )}
      </div>

      {stats.unique_listeners > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">{stats.unique_listeners}</span>
          <span className="text-gray-400">listeners</span>
        </div>
      )}

      {stats.plays_this_week > 0 && (
        <div className="text-xs text-gray-500">
          {stats.plays_this_week} plays this week
        </div>
      )}
    </div>
  );
};

// Helper function to format play count
const formatPlayCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export default BhajanStats;
