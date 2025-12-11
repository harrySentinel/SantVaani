import { useState, useEffect } from 'react'
import { TrendingUp, Users, Heart, Play, Award, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface BhajanWithStats {
  bhajans: {
    id: string
    title: string
    title_hi: string
    category: string
  }
  total_plays?: number
  unique_listeners?: number
  plays_this_week?: number
}

export default function BhajanAnalytics() {
  const [trendingBhajans, setTrendingBhajans] = useState<BhajanWithStats[]>([])
  const [popularBhajans, setPopularBhajans] = useState<BhajanWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [trendingRes, popularRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/bhajans/trending?limit=10`),
        axios.get(`${API_BASE_URL}/api/bhajans/popular?limit=10`)
      ])

      setTrendingBhajans(trendingRes.data.trending || [])
      setPopularBhajans(popularRes.data.popular || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plays</p>
                <p className="text-2xl font-bold">
                  {popularBhajans.reduce((acc, b) => acc + (b.total_plays || 0), 0)}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trending</p>
                <p className="text-2xl font-bold">{trendingBhajans.length}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular</p>
                <p className="text-2xl font-bold">{popularBhajans.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listeners</p>
                <p className="text-2xl font-bold">
                  {popularBhajans.reduce((acc, b) => acc + (b.unique_listeners || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending & Popular Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Trending This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingBhajans.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No trending bhajans yet
                </p>
              ) : (
                trendingBhajans.map((item, index) => (
                  <div
                    key={item.bhajans.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.bhajans.title}</p>
                        <p className="text-xs text-gray-500">{item.bhajans.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Play className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-600">
                        {item.plays_this_week || 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Popular All-Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span>Most Popular (All-Time)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularBhajans.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No popular bhajans yet
                </p>
              ) : (
                popularBhajans.map((item, index) => (
                  <div
                    key={item.bhajans.id}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{item.bhajans.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.unique_listeners} listeners
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Play className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-600">
                        {item.total_plays || 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-green-50 to-orange-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Engagement Metrics</p>
              <p className="text-sm text-gray-600 mt-1">
                These analytics show real-time engagement data from users interacting with bhajans.
                Use this data to understand which content resonates most with your audience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
