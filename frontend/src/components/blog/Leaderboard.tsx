import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp, Eye, Heart, MessageCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTopContributors, LeaderboardUser } from '@/services/leaderboardService'

interface LeaderboardProps {
  limit?: number
  className?: string
}

export default function Leaderboard({ limit = 10, className = '' }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [limit])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    const result = await getTopContributors(limit)
    if (result.success) {
      setLeaders(result.leaderboard)
    }
    setIsLoading(false)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-500">#{rank}</span>
          </div>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg shadow-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 shadow-lg shadow-amber-200'
      default:
        return 'bg-gradient-to-r from-orange-100 to-orange-200'
    }
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Top Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (leaders.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Top Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No contributors yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to share spiritual wisdom!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} border-orange-100 shadow-md`}>
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
        <CardTitle className="flex items-center space-x-2 text-orange-900">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <span>Top Contributors</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Celebrating those who share spiritual wisdom
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {leaders.map((leader) => (
            <div
              key={leader.user_id}
              className={`
                flex items-center space-x-4 p-4 rounded-lg transition-all hover:scale-105
                ${getRankBadgeColor(leader.rank)}
                ${leader.rank <= 3 ? 'border-2 border-white' : 'border border-orange-200'}
              `}
            >
              {/* Rank Icon */}
              <div className="flex-shrink-0">{getRankIcon(leader.rank)}</div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${
                    leader.rank === 1
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : leader.rank === 2
                      ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                      : leader.rank === 3
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                      : 'bg-gradient-to-br from-orange-400 to-pink-500'
                  }
                  ring-2 ring-white
                `}
                >
                  {leader.avatar_url ? (
                    <img
                      src={leader.avatar_url}
                      alt={leader.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    leader.username.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold truncate ${
                    leader.rank <= 3 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {leader.username}
                </p>
                {leader.full_name && leader.full_name !== leader.username && (
                  <p
                    className={`text-sm truncate ${
                      leader.rank <= 3 ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {leader.full_name}
                  </p>
                )}

                {/* Stats */}
                <div
                  className={`flex items-center space-x-3 mt-1 text-xs ${
                    leader.rank <= 3 ? 'text-white/90' : 'text-gray-600'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{leader.total_posts}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{leader.total_likes_received}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{leader.total_comments_received}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{leader.total_views_received}</span>
                  </span>
                </div>
              </div>

              {/* Badges Count */}
              {leader.total_badges > 0 && (
                <div
                  className={`
                  flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    leader.rank <= 3
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-800'
                  }
                `}
                >
                  🏆 {leader.total_badges}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-orange-100 text-center">
          <p className="text-sm text-gray-600">
            Start sharing your spiritual insights to join the leaderboard!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
